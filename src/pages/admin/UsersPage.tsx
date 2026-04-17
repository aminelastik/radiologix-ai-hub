import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Badge, Button, IconButton, Modal, Input, Select } from "@/ui";
import { users } from "@/lib/mockData";

const UsersPage = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Topbar title="Users" subtitle="Manage accounts, roles and access." />
      <div className="p-6 md:p-10 space-y-5">
        <Card className="p-5 border border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by name or email..."
              aria-label="Search users"
              className="w-full h-10 rounded-xl border border-input bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select aria-label="Filter by role" className="w-44">
              <option>All roles</option>
              <option>Radiologist</option>
              <option>Technician</option>
              <option>Admin</option>
            </Select>
            <Button variant="gradient" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add user
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last login</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                        {u.initials}
                      </span>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <Badge variant={u.role === "Admin" ? "primary" : u.role === "Radiologist" ? "info" : "neutral"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={u.status === "Active" ? "success" : "neutral"} dot>{u.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <IconButton aria-label={`Edit ${u.name}`} variant="ghost" size="sm" onClick={() => setEditing(u.id)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton aria-label={`Delete ${u.name}`} variant="ghost" size="sm" className="hover:text-danger">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-5 border-t border-border/60">
            <p className="text-xs text-muted-foreground">Showing 1–5 of 27</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                    p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add user"
        description="Create a new account and assign a role."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={() => setOpen(false)}>Create user</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Full name" placeholder="Jane Doe" />
          <Input label="Email" type="email" placeholder="jane@janus.med" />
          <Select label="Role">
            <option>Radiologist</option>
            <option>Technician</option>
            <option>Admin</option>
          </Select>
          <Input label="Temporary password" type="password" placeholder="••••••••" />
        </div>
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit user"
        description="Update profile or reset credentials."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setEditing(null)}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Full name" defaultValue="Dr. Olivia Smith" />
          <Input label="Email" defaultValue="olivia.smith@janus.med" />
          <Select label="Role" defaultValue="Radiologist">
            <option>Radiologist</option>
            <option>Technician</option>
            <option>Admin</option>
          </Select>
          <Button variant="outline" className="w-full">Reset password</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
