import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; title: string; category: string | null; city: string | null;
  image_before: string | null; image_after: string | null; video_url: string | null;
  description: string | null; featured: boolean; sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "transformations",
  eyebrow: "Conteúdo",
  title: "Transformações",
  description: "Antes e depois reais. Use para alimentar a galeria e o slider da home.",
  defaultValues: { featured: false, sort_order: 0, status: "active" } as Partial<Row>,
  fields: [
    { key: "title", label: "Título", type: "text", required: true, span: 2 },
    { key: "category", label: "Categoria", type: "select", options: [
      { value: "sofa", label: "Sofá" }, { value: "colchao", label: "Colchão" },
      { value: "cadeira", label: "Cadeira" }, { value: "tapete", label: "Tapete" },
      { value: "automotivo", label: "Automotivo" }, { value: "outro", label: "Outro" },
    ]},
    { key: "city", label: "Cidade", type: "text" },
    { key: "image_before", label: "Imagem ANTES", type: "image", span: 2 },
    { key: "image_after", label: "Imagem DEPOIS", type: "image", span: 2 },
    { key: "video_url", label: "Vídeo (opcional)", type: "video", span: 2 },
    { key: "description", label: "Descrição", type: "textarea", span: 2 },
    { key: "featured", label: "Destaque", type: "switch" },
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "title", label: "Título" },
    { key: "category", label: "Categoria" },
    { key: "city", label: "Cidade" },
    { key: "featured", label: "Destaque", render: (r) => r.featured ? "★" : "—" },
    { key: "sort_order", label: "Ordem" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/transformations")({
  component: () => <CrudPage config={config} />,
});
