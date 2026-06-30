import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; title: string; category: string | null; thumbnail_url: string | null;
  video_url: string; description: string | null; featured: boolean; sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "videos",
  eyebrow: "Conteúdo",
  title: "Vídeos",
  description: "Reels institucionais e demonstrações de processo.",
  defaultValues: { featured: false, sort_order: 0, status: "active", video_url: "" } as Partial<Row>,
  fields: [
    { key: "title", label: "Título", type: "text", required: true, span: 2 },
    { key: "category", label: "Categoria", type: "select", options: [
      { value: "processo", label: "Processo" }, { value: "antes-depois", label: "Antes/Depois" },
      { value: "institucional", label: "Institucional" }, { value: "tecnica", label: "Técnica" },
    ]},
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "thumbnail_url", label: "Thumbnail", type: "image", span: 2 },
    { key: "video_url", label: "Vídeo", type: "video", required: true, span: 2 },
    { key: "description", label: "Descrição", type: "textarea", span: 2 },
    { key: "featured", label: "Destaque", type: "switch" },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "title", label: "Título" },
    { key: "category", label: "Categoria" },
    { key: "featured", label: "Destaque", render: (r) => r.featured ? "★" : "—" },
    { key: "sort_order", label: "Ordem" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/videos")({
  component: () => <CrudPage config={config} />,
});
