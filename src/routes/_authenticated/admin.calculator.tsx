import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; kind: string; name: string; price: number; description: string | null;
  pix_discount_pct: number | null; max_installments: number | null;
  sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "calculator_items",
  eyebrow: "Comercial",
  title: "Calculadora / Valores",
  description: "Itens, preços e regras de pagamento exibidos no configurador público.",
  defaultValues: { kind: "higienizacao", sort_order: 0, status: "active", price: 0, pix_discount_pct: 5, max_installments: 10 } as Partial<Row>,
  fields: [
    { key: "kind", label: "Tipo de serviço", type: "select", required: true, options: [
      { value: "higienizacao", label: "Higienização" }, { value: "blindagem", label: "Blindagem" },
      { value: "combo", label: "Combo" }, { value: "outro", label: "Outro" },
    ]},
    { key: "name", label: "Item / tamanho", type: "text", required: true, placeholder: "Sofá 3 lugares" },
    { key: "price", label: "Valor (R$)", type: "number", required: true },
    { key: "pix_discount_pct", label: "Desconto Pix (%)", type: "number" },
    { key: "max_installments", label: "Parcelas máximas", type: "number" },
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "description", label: "Descrição", type: "textarea", span: 2 },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "name", label: "Item" },
    { key: "kind", label: "Tipo" },
    { key: "price", label: "Valor", render: (r) => `R$ ${Number(r.price).toFixed(2)}` },
    { key: "pix_discount_pct", label: "Pix %" },
    { key: "max_installments", label: "Parcelas" },
    { key: "sort_order", label: "Ordem" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/calculator")({
  component: () => <CrudPage config={config} />,
});
