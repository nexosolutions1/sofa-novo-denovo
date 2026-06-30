import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Upload, Trash2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Media = {
  id: string; url: string; filename: string | null; category: string | null;
  size_bytes: number | null; mime_type: string | null; created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const listQ = useQuery({
    queryKey: ["media-library"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Media[];
    },
  });

  async function handleUpload(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, file);
        if (error) throw error;
        const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
        if (!data) throw new Error("Falha ao gerar URL");
        await supabase.from("media_library").insert({
          url: data.signedUrl, filename: file.name,
          category: file.type.startsWith("video") ? "video" : "image",
          size_bytes: file.size, mime_type: file.type,
        });
      }
      toast.success("Upload concluído");
      qc.invalidateQueries({ queryKey: ["media-library"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally { setUploading(false); }
  }

  const remove = useMutation({
    mutationFn: async (m: Media) => {
      const { error } = await supabase.from("media_library").delete().eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Removido"); qc.invalidateQueries({ queryKey: ["media-library"] }); },
  });

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl">
      <AdminPageHeader eyebrow="Arquivos" title="Biblioteca de mídia"
        description="Imagens e vídeos disponíveis para uso em qualquer módulo."
        action={
          <label className="inline-flex items-center gap-2 gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer glow-teal">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
            <input type="file" multiple accept="image/*,video/*" className="hidden" disabled={uploading}
                   onChange={(e) => handleUpload(e.target.files)} />
          </label>
        } />

      {listQ.isLoading ? (
        <div className="glass rounded-2xl p-10 text-center"><Loader2 className="size-5 animate-spin inline mr-2" />Carregando…</div>
      ) : !listQ.data?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-foreground/70">Nenhum arquivo enviado ainda.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listQ.data.map((m) => (
            <div key={m.id} className="glass rounded-2xl overflow-hidden group">
              <div className="aspect-square bg-black/40 grid place-items-center overflow-hidden">
                {m.category === "video" || m.mime_type?.startsWith("video") ? (
                  <video src={m.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <div className="text-xs truncate text-foreground/70" title={m.filename ?? ""}>{m.filename ?? "—"}</div>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copiada"); }}
                          className="flex-1 glass rounded-lg p-2 text-xs hover:glass-strong inline-flex items-center justify-center gap-1">
                    <Copy className="size-3" /> Copiar
                  </button>
                  <button onClick={() => confirm("Excluir este arquivo?") && remove.mutate(m)}
                          className="glass rounded-lg p-2 hover:bg-red-500/10 text-red-400">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
