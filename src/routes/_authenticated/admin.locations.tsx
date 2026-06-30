import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type CrudConfig } from "@/components/admin/CrudPage";

type Row = {
  id: string; city: string; state: string; region: string | null;
  latitude: number | null; longitude: number | null;
  units_count: number | null; services_count: number | null;
  sort_order: number; status: string;
};

const config: CrudConfig<Row> = {
  table: "locations",
  eyebrow: "Cobertura",
  title: "Locais / Mapa",
  description: "Cidades atendidas exibidas no mapa institucional do Brasil.",
  defaultValues: { status: "active", sort_order: 0, units_count: 1, services_count: 1, region: "Sudeste" } as Partial<Row>,
  fields: [
    { key: "city", label: "Cidade", type: "text", required: true },
    { key: "state", label: "UF", type: "text", required: true, placeholder: "SP" },
    { key: "region", label: "Região", type: "select", options: [
      { value: "Norte", label: "Norte" }, { value: "Nordeste", label: "Nordeste" },
      { value: "Centro-Oeste", label: "Centro-Oeste" }, { value: "Sudeste", label: "Sudeste" },
      { value: "Sul", label: "Sul" },
    ]},
    { key: "latitude", label: "Latitude", type: "number" },
    { key: "longitude", label: "Longitude", type: "number" },
    { key: "units_count", label: "Unidades", type: "number" },
    { key: "services_count", label: "Serviços / mês", type: "number" },
    { key: "sort_order", label: "Ordem", type: "number" },
    { key: "status", label: "Status", type: "status" },
  ],
  listColumns: [
    { key: "city", label: "Cidade" },
    { key: "state", label: "UF" },
    { key: "region", label: "Região" },
    { key: "units_count", label: "Unidades" },
    { key: "status", label: "Status" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/locations")({
  component: () => <CrudPage config={config} />,
});
