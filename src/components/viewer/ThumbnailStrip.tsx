export const ThumbnailStrip = () => (
  <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
    {[0, 1, 2, 3, 4].map((i) => (
      <button
        key={i}
        className={`shrink-0 h-20 w-20 rounded-xl border-2 transition-all ${
          i === 0
            ? "border-primary shadow-glow"
            : "border-border hover:border-primary-glow"
        } bg-foreground overflow-hidden`}
        aria-label={`Image ${i + 1}`}
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,hsl(213_30%_25%)_0%,hsl(215_47%_8%)_80%)] flex items-center justify-center text-[10px] font-mono text-primary-foreground/50">
          IM {i + 1}
        </div>
      </button>
    ))}
  </div>
);
