import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ImageField({
  value, onChange, label, accept = "image/*",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      // signed URL valid for 10 years
      const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (e2 || !data) throw e2 ?? new Error("Falha ao gerar URL");
      onChange(data.signedUrl);
      // also save in media_library
      await supabase.from("media_library").insert({
        url: data.signedUrl, filename: file.name, category: accept.startsWith("video") ? "video" : "image",
        size_bytes: file.size, mime_type: file.type,
      });
      toast.success("Upload concluído");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-foreground/60 font-bold">{label}</label>
      <div className="mt-1 space-y-2">
        <div className="flex gap-2">
          <input
            type="url" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}
            placeholder="Cole uma URL ou faça upload"
            className="flex-1 glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="inline-flex items-center gap-2 glass rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:glass-strong">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload
            <input type="file" accept={accept} className="hidden" disabled={uploading}
                   onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          {value && (
            <button type="button" onClick={() => onChange(null)}
                    className="glass rounded-xl px-3 py-2.5 text-sm hover:bg-red-500/10">
              <X className="size-4" />
            </button>
          )}
        </div>
        {value && (
          accept.startsWith("video") ? (
            <video src={value} className="rounded-xl max-h-40 glass p-1" controls />
          ) : (
            <img src={value} alt="" className="rounded-xl max-h-40 glass p-1 object-cover" />
          )
        )}
      </div>
    </div>
  );
}
