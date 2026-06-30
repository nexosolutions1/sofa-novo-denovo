import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = { id: string; key: string; value: string | null };

const config: CrudConfig<Row> = {
  table: "site_settings",
  eyebrow: "Configurações",
  title: "Configurações gerais",
  description: "Chave/valor de configurações globais (logo, WhatsApp, e-mail, redes, textos…).",
  orderBy: { column: "key", ascending: true },
  defaultValues: { key: "" } as Partial<Row>,
  fields: [
    { key: "key", label: "Chave", type: "text", required: true,
      hint: "Ex.: whatsapp, instagram, email, phone, logo_url, footer_signature, hero_title" },
    { key: "value", label: "Valor", type: "textarea", span: 2 },
  ],
  listColumns: [
    { key: "key", label: "Chave" },
    { key: "value", label: "Valor", render: (r) => (r.value ?? "").slice(0, 80) },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: () => <CrudPage config={config} />,
});
