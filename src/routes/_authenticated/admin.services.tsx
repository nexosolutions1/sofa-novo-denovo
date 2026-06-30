import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; name: string; description: string | null; image_url: string | null;
  icon: string | null; category: string | null; sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "services",
  eyebrow: "Conteúdo",
  title: "Serviços",
  description: "Serviços oferecidos exibidos no site público.",
  defaultValues: { sort_order: 0, status: "active" } as Partial<Row>,
  fields: [
    { key: "name", label: "Nome", type: "text", required: true, span: 2 },
    { key: "category", label: "Categoria", type: "text", placeholder: "higienizacao, blindagem, etc" },
    { key: "icon", label: "Ícone (nome lucide)", type: "text", placeholder: "Sparkles, Shield, Droplets..." },
    { key: "image_url", label: "Imagem", type: "image", span: 2 },
    { key: "description", label: "Descrição", type: "textarea", span: 2 },
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "name", label: "Nome" },
    { key: "category", label: "Categoria" },
    { key: "icon", label: "Ícone" },
    { key: "sort_order", label: "Ordem" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => <CrudPage config={config} />,
});
