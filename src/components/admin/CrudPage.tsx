import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, NewButton } from "./AdminPageHeader";
import { ImageField } from "./ImageField";
import { Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "image" | "video" | "select" | "switch" | "status";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  span?: 1 | 2;
};

export type CrudConfig<T extends { id: string }> = {
  table: string;
  eyebrow: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  listColumns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode }[];
  orderBy?: { column: string; ascending?: boolean };
  defaultValues?: Partial<T>;
  singleton?: boolean;
};

export function CrudPage<T extends { id: string; status?: string }>({ config }: { config: CrudConfig<T> }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [confirmDel, setConfirmDel] = useState<T | null>(null);

  const listQuery = useQuery({
    queryKey: ["crud", config.table],
    queryFn: async () => {
      const ob = config.orderBy ?? { column: "sort_order", ascending: true };
      const { data, error } = await supabase.from(config.table as never)
        .select("*").order(ob.column, { ascending: ob.ascending ?? true });
      if (error) throw error;
      return data as T[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Partial<T>) => {
      const payload = { ...row };
      delete (payload as Record<string, unknown>).created_at;
      delete (payload as Record<string, unknown>).updated_at;
      if (row.id) {
        const { error } = await supabase.from(config.table as never).update(payload as never).eq("id", row.id);
        if (error) throw error;
      } else {
        delete (payload as Record<string, unknown>).id;
        const { error } = await supabase.from(config.table as never).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso");
      qc.invalidateQueries({ queryKey: ["crud", config.table] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Excluído");
      qc.invalidateQueries({ queryKey: ["crud", config.table] });
      setConfirmDel(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir"),
  });

  const toggle = useMutation({
    mutationFn: async (row: T) => {
      const next = row.status === "active" ? "inactive" : "active";
      const { error } = await supabase.from(config.table as never).update({ status: next } as never).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crud", config.table] }),
  });

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl">
      <AdminPageHeader
        eyebrow={config.eyebrow} title={config.title} description={config.description}
        action={!config.singleton && <NewButton onClick={() => setEditing(config.defaultValues ?? {})} />}
      />

      {listQuery.isLoading ? (
        <div className="glass rounded-2xl p-10 text-center text-foreground/60"><Loader2 className="size-5 animate-spin inline mr-2" />Carregando…</div>
      ) : !listQuery.data?.length ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="text-foreground/70">Nenhum registro cadastrado ainda.</div>
          {!config.singleton && (
            <button onClick={() => setEditing(config.defaultValues ?? {})}
                    className="mt-4 inline-flex gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold">
              Criar o primeiro
            </button>
          )}
        </div>
      ) : (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  {config.listColumns.map((c) => (
                    <th key={String(c.key)} className="px-4 py-3 text-xs uppercase tracking-widest text-foreground/60 font-bold">{c.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-widest text-foreground/60 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {listQuery.data.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02]">
                    {config.listColumns.map((c) => (
                      <td key={String(c.key)} className="px-4 py-3">
                        {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {row.status !== undefined && (
                          <button onClick={() => toggle.mutate(row)} title="Ativar/desativar"
                                  className="p-2 rounded-lg hover:glass">
                            {row.status === "active" ? <Eye className="size-4 text-primary" /> : <EyeOff className="size-4 text-foreground/40" />}
                          </button>
                        )}
                        <button onClick={() => setEditing(row)} className="p-2 rounded-lg hover:glass">
                          <Pencil className="size-4" />
                        </button>
                        <button onClick={() => setConfirmDel(row)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Singleton edit shortcut */}
      {config.singleton && listQuery.data?.[0] && !editing && (
        <button onClick={() => setEditing(listQuery.data[0])}
                className="mt-4 gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold">
          Editar conteúdo
        </button>
      )}

      {editing && (
        <FormModal fields={config.fields} value={editing} onClose={() => setEditing(null)}
                   onSave={(v) => save.mutate(v as Partial<T>)} saving={save.isPending} />
      )}

      {confirmDel && (
        <Confirm onCancel={() => setConfirmDel(null)} onConfirm={() => remove.mutate(confirmDel.id)} pending={remove.isPending} />
      )}
    </div>
  );
}

function FormModal({
  fields, value, onClose, onSave, saving,
}: {
  fields: FieldDef[];
  value: Record<string, unknown>;
  onClose: () => void;
  onSave: (v: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(value);
  function set(k: string, v: unknown) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="glass-strong rounded-3xl w-full max-w-2xl my-8 relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="font-display font-bold text-lg">{form.id ? "Editar registro" : "Novo registro"}</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:glass"><X className="size-4" /></button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {fields.map((f) => (
            <div key={f.key} className={f.span === 2 ? "sm:col-span-2" : ""}>
              {f.type === "textarea" ? (
                <Field label={f.label} hint={f.hint}>
                  <textarea value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}
                            rows={3} placeholder={f.placeholder}
                            className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
                </Field>
              ) : f.type === "number" ? (
                <Field label={f.label} hint={f.hint}>
                  <input type="number" step="any" value={String(form[f.key] ?? "")}
                         onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))}
                         placeholder={f.placeholder}
                         className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
                </Field>
              ) : f.type === "select" || f.type === "status" ? (
                <Field label={f.label} hint={f.hint}>
                  <select value={String(form[f.key] ?? (f.type === "status" ? "active" : ""))}
                          onChange={(e) => set(f.key, e.target.value)}
                          className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                    {(f.type === "status" ? [{ value: "active", label: "Ativo" }, { value: "inactive", label: "Inativo" }] : f.options ?? [])
                      .map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              ) : f.type === "switch" ? (
                <Field label={f.label} hint={f.hint}>
                  <label className="inline-flex items-center gap-2 mt-1">
                    <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)}
                           className="size-5 rounded accent-primary" />
                    <span className="text-sm text-foreground/70">{form[f.key] ? "Sim" : "Não"}</span>
                  </label>
                </Field>
              ) : f.type === "image" || f.type === "video" ? (
                <ImageField label={f.label} value={form[f.key] as string} onChange={(v) => set(f.key, v)}
                            accept={f.type === "video" ? "video/*" : "image/*"} />
              ) : (
                <Field label={f.label} hint={f.hint}>
                  <input type="text" value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}
                         placeholder={f.placeholder} required={f.required}
                         className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
                </Field>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="glass rounded-xl px-4 py-2.5 text-sm">Cancelar</button>
          <button disabled={saving} onClick={() => onSave(form)}
                  className="gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold glow-teal disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin inline" /> : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-foreground/60 font-bold">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <div className="text-xs text-foreground/40 mt-1">{hint}</div>}
    </div>
  );
}

function Confirm({ onCancel, onConfirm, pending }: { onCancel: () => void; onConfirm: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
      <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
        <div className="font-display font-bold text-lg">Confirmar exclusão</div>
        <p className="text-sm text-foreground/70 mt-1">Essa ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="glass rounded-xl px-4 py-2.5 text-sm">Cancelar</button>
          <button disabled={pending} onClick={onConfirm}
                  className="bg-red-500/90 hover:bg-red-500 text-white rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-60">
            {pending ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
