import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; page: string; title: string | null; description: string | null;
  keywords: string | null; og_image: string | null; canonical_url: string | null;
};

const config: CrudConfig<Row> = {
  table: "seo_settings",
  eyebrow: "Otimização",
  title: "SEO por página",
  description: "Title, description, keywords, OG image e canonical de cada página.",
  orderBy: { column: "page", ascending: true },
  defaultValues: { page: "/" } as Partial<Row>,
  fields: [
    { key: "page", label: "Página (slug)", type: "text", required: true, placeholder: "/" },
    { key: "canonical_url", label: "Canonical URL", type: "text", placeholder: "https://..." },
    { key: "title", label: "Title", type: "text", span: 2 },
    { key: "description", label: "Description", type: "textarea", span: 2 },
    { key: "keywords", label: "Keywords (separadas por vírgula)", type: "text", span: 2 },
    { key: "og_image", label: "OG Image", type: "image", span: 2 },
  ],
  listColumns: [
    { key: "page", label: "Página" },
    { key: "title", label: "Title" },
    { key: "canonical_url", label: "Canonical" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: () => <CrudPage config={config} />,
});
