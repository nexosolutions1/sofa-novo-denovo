import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; title: string | null; subtitle: string | null; description: string | null;
  specialist_name: string | null; specialty: string | null; recognition: string | null;
  institutional_text: string | null; seal_label: string | null;
  primary_image: string | null; secondary_image: string | null;
  cards: unknown; seals: unknown;
};

const config: CrudConfig<Row> = {
  table: "dr_bacteria",
  eyebrow: "Autoridade",
  title: "Dr. Bactéria",
  description: "Bloco institucional do Dr. Bactéria exibido na home.",
  singleton: true,
  orderBy: { column: "updated_at", ascending: false },
  fields: [
    { key: "title", label: "Título", type: "text", span: 2 },
    { key: "subtitle", label: "Subtítulo", type: "text", span: 2 },
    { key: "institutional_text", label: "Texto institucional", type: "textarea", span: 2 },
    { key: "specialist_name", label: "Nome do especialista", type: "text" },
    { key: "specialty", label: "Especialidade", type: "text" },
    { key: "recognition", label: "Reconhecimento", type: "text", span: 2 },
    { key: "seal_label", label: "Texto do selo", type: "text" },
    { key: "primary_image", label: "Imagem principal", type: "image", span: 2 },
    { key: "secondary_image", label: "Imagem secundária", type: "image", span: 2 },
    { key: "cards", label: "Cards (JSON)", type: "textarea", span: 2,
      hint: 'Ex.: [{"title":"Produtos aprovados","desc":"…"}]' },
    { key: "seals", label: "Selos (JSON)", type: "textarea", span: 2,
      hint: 'Ex.: [{"label":"Selo Dr. Bactéria"}]' },
  ],
  listColumns: [
    { key: "title", label: "Título" },
    { key: "specialist_name", label: "Especialista" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/dr-bacteria")({
  component: () => <CrudPage config={config} />,
});
