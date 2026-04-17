import { Suspense, lazy, useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Stethoscope, ShieldCheck, Wrench } from "lucide-react";

const Spline = lazy(() => import("@splinetool/react-spline"));

type Role = "Radiologist" | "Admin" | "Technician";

const SCENE_URL = "https://prod.spline.design/Y0ZYPrBhbjSHbqSk/scene.splinecode";

const roleConfig: Record<Role, { route: string; icon: typeof Stethoscope }> = {
  Radiologist: { route: "/radiologist/worklist", icon: Stethoscope },
  Admin: { route: "/admin/dashboard", icon: ShieldCheck },
  Technician: { route: "/technician/upload", icon: Wrench },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("Radiologist");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (field: "username" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((c) => ({ ...c, [field]: e.target.value }));
    if (error) setError(null);
  };

  const handleRole = (r: Role) => {
    setSelectedRole(r);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError("Please enter your credentials.");
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: replace with real backend authentication (Keycloak / API)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate(roleConfig[selectedRole].route);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[hsl(var(--login-bg))]">
      {/* Spline scene */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
          sceneReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-login" />}>
          <Spline scene={SCENE_URL} />
        </Suspense>
      </div>

      {/* Soft vignette overlay for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--login-bg))]/40" />

      {/* JANUS CXR transparent overlay — click to reveal login */}
      {!showLogin && (
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          aria-label="Reveal login"
          className="group absolute inset-0 z-10 flex flex-col items-center justify-center text-center animate-fade-in-cinematic"
        >
          <h1 className="font-display text-[10vw] md:text-[7vw] leading-none tracking-tight text-white drop-shadow-[0_8px_30px_rgba(20,40,80,0.35)] select-none">
            JANUS CXR
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Click to enter
          </p>
        </button>
      )}

      {/* Login interface */}
      {showLogin && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 animate-slide-up-fade">
          <div className="glass w-full max-w-md rounded-3xl p-7 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <span className="font-display text-xl text-white tracking-wide">JANUS CXR</span>
            </div>

            <h2 className="text-2xl font-semibold text-white">Sign in</h2>
            <p className="mt-1 text-sm text-white/70">Choose your role and enter your credentials.</p>

            {/* Role buttons */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const Icon = roleConfig[r].icon;
                const active = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRole(r)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-xs font-medium transition-all ${
                      active
                        ? "bg-[hsl(var(--login-bg))] text-foreground shadow-glow"
                        : "bg-white/10 text-white/85 hover:bg-white/20 hover:-translate-y-0.5"
                    }`}
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" />
                    {r}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-medium text-white/80">
                  Username or Email
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={credentials.username}
                  onChange={handleChange("username")}
                  className="glass-input w-full h-11 rounded-xl px-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--login-bg))]"
                  placeholder="dr.smith@janus.med"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-white/80">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange("password")}
                  className="glass-input w-full h-11 rounded-xl px-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--login-bg))]"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-danger/20 border border-danger/40 px-3 py-2 text-xs text-white animate-fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[hsl(var(--login-bg))] text-foreground font-semibold shadow-soft hover:scale-[1.01] transition-transform disabled:opacity-70 disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
                  </>
                ) : (
                  <>Login as {selectedRole}</>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] text-white/60">
              © {new Date().getFullYear()} JANUS CXR · Secure teleradiology
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
