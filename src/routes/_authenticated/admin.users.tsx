import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

type UserRow = {
  id: string; email: string | null; full_name: string | null;
  created_at: string; role: "admin" | "editor" | "viewer" | null;
};

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const usersQ = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles")
        .select("id,email,full_name,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id,role");
      const map = new Map((roles ?? []).map((r) => [r.user_id, r.role as UserRow["role"]]));
      return (profiles ?? []).map((p) => ({ ...p, role: map.get(p.id) ?? null })) as UserRow[];
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRow["role"] }) => {
      const { error: del } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (del) throw del;
      if (role) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Permissão atualizada");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl">
      <AdminPageHeader eyebrow="Equipe" title="Usuários"
        description="Gerencie quem acessa o painel. Apenas administradores podem alterar permissões." />

      {usersQ.isLoading ? (
        <div className="glass rounded-2xl p-10 text-center"><Loader2 className="size-5 animate-spin inline mr-2" />Carregando…</div>
      ) : !usersQ.data?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-foreground/70">Nenhum usuário cadastrado.</div>
      ) : (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-foreground/60 font-bold">Usuário</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-foreground/60 font-bold">E-mail</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-foreground/60 font-bold">Permissão</th>
                <th className="px-4 py-3 text-right text-xs uppercase tracking-widest text-foreground/60 font-bold">Alterar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersQ.data.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground/70">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 glass rounded-full px-2.5 py-1 text-xs">
                      {u.role === "admin" && <Shield className="size-3 text-primary" />}
                      {u.role ?? "sem acesso"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select value={u.role ?? ""} onChange={(e) => setRole.mutate({ userId: u.id, role: (e.target.value || null) as UserRow["role"] })}
                            className="glass rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Sem acesso</option>
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
