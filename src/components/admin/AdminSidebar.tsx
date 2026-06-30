import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Images, Film, Sparkles, Calculator, MapPin,
  Layers, FlaskConical, Settings, Users, Search, FolderOpen, LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { NovaNexoBadge } from "@/components/NovaNexoBadge";

const NAV: { label: string; to: string; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Transformações", to: "/admin/transformations", icon: Images },
  { label: "Vídeos", to: "/admin/videos", icon: Film },
  { label: "Serviços", to: "/admin/services", icon: Sparkles },
  { label: "Calculadora", to: "/admin/calculator", icon: Calculator },
  { label: "Dr. Bactéria", to: "/admin/dr-bacteria", icon: FlaskConical },
  { label: "Locais", to: "/admin/locations", icon: MapPin },
  { label: "Tecidos", to: "/admin/fabrics", icon: Layers },
  { label: "Mídia", to: "/admin/media", icon: FolderOpen },
  { label: "SEO", to: "/admin/seo", icon: Search },
  { label: "Configurações", to: "/admin/settings", icon: Settings },
  { label: "Usuários", to: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 glass-strong sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
        <img src={logo} alt="" className="h-9" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold">CMS Premium</div>
          <div className="text-xs text-foreground/70">Sofá Novo de Novo</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = path === item.to || (item.to !== "/admin" && path.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition relative overflow-hidden ${
                active ? "glass text-foreground glow-soft" : "text-foreground/65 hover:glass hover:text-foreground"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full gradient-teal" />
              )}
              <item.icon className={`size-4 shrink-0 ${active ? "text-primary" : ""}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3 space-y-2">
        <button onClick={signOut}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:glass hover:text-foreground transition">
          <LogOut className="size-4" />
          Sair
        </button>
        <NovaNexoBadge variant="sidebar" />
      </div>
    </aside>
  );
}
