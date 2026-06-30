import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; name: string; description: string | null; image_url: string | null;
  sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "fabrics",
  eyebrow: "Catálogo",
  title: "Tecidos atendidos",
  defaultValues: { sort_order: 0, status: "active" } as Partial<Row>,
  fields: [
    { key: "name", label: "Nome", type: "text", required: true, span: 2 },
    { key: "image_url", label: "Imagem", type: "image", span: 2 },
    { key: "description", label: "Descrição", type: "textarea", span: 2 },
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "name", label: "Nome" },
    { key: "sort_order", label: "Ordem" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/fabrics")({
  component: () => <CrudPage config={config} />,
});
