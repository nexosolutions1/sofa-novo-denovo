import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Images, Film, Sparkles, MapPin, MessageCircle, Activity,
  TrendingUp, Upload, ArrowUpRight,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin-stats.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
const { data, isLoading } = useQuery({
  queryKey: ["admin-dashboard-stats"],
  queryFn: () => getDashboardStats(),
});

  const cards = [
    { label: "Transformações", value: data?.transformations ?? 0, icon: Images, to: "/admin/transformations" },
    { label: "Vídeos", value: data?.videos ?? 0, icon: Film, to: "/admin/videos" },
    { label: "Serviços", value: data?.services ?? 0, icon: Sparkles, to: "/admin/services" },
    { label: "Locais atendidos", value: data?.locations ?? 0, icon: MapPin, to: "/admin/locations" },
    { label: "Acessos (em breve)", value: 0, icon: TrendingUp, to: "/admin" },
    { label: "Cliques WhatsApp", value: 0, icon: MessageCircle, to: "/admin" },
  ];

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Visão geral</div>
          <h1 className="font-display font-black text-3xl sm:text-4xl mt-1">Dashboard</h1>
          <p className="text-foreground/65 mt-1 text-sm">
            Pulse do CMS — conteúdo, mídia e atividade da equipe.
          </p>
        </div>
        <Link to="/" className="hidden sm:inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:glass-strong transition">
          Ver site <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}
                className="relative glass rounded-2xl p-5 hover:glass-strong transition group overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-0 group-hover:opacity-30 transition"
                 style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/55 font-bold">{c.label}</div>
                <div className="mt-2 font-display font-black text-3xl sm:text-4xl text-gradient">
                  {isLoading ? "—" : c.value}
                </div>
              </div>
              <div className="size-10 rounded-xl glass grid place-items-center">
                <c.icon className="size-5 text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column */}
      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Últimas atividades
            </h3>
          </div>
          <div className="space-y-2">
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <p className="text-sm text-foreground/55">Nenhuma atividade registrada ainda.</p>
            )}
            {data?.recentActivity?.map((a: { id: string; action: string; entity: string | null; created_at: string }) => (
              <div key={a.id} className="glass rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{a.action}</div>
                  <div className="text-xs text-foreground/55">{a.entity}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-foreground/50">
                  {new Date(a.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Upload className="size-4 text-primary" /> Últimos uploads
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(!data?.recentUploads || data.recentUploads.length === 0) && (
              <p className="col-span-3 text-sm text-foreground/55">Nenhuma mídia enviada ainda.</p>
            )}
            {data?.recentUploads?.map((m: { id: string; filename: string | null; url: string; category: string | null; created_at: string }) => (
              <div key={m.id} className="aspect-square glass rounded-xl overflow-hidden relative">
                {m.category === "image" || m.category === "logo" ? (
                  <img src={m.url} alt={m.filename ?? ""} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-widest text-foreground/60">
                    {m.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Build status banner */}
      <div className="mt-8 glass-strong rounded-2xl p-6 flex items-start gap-4">
        <div className="size-10 rounded-xl gradient-teal grid place-items-center text-primary-foreground shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div>
          <div className="font-display font-bold">Fase 1 concluída</div>
          <p className="text-sm text-foreground/70 mt-1">
            Mapa real do Brasil, seção Dr. Bactéria expandida, autenticação,
            schema completo (12 tabelas com RLS) e dashboard prontos.
            Os CRUDs por módulo serão entregues nas próximas iterações.
          </p>
        </div>
      </div>
    </div>
  );
}
