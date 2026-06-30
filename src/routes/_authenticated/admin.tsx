import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  notFoundComponent: AdminNotFound,
});

function AdminNotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-10">
      <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Admin</div>
        <h2 className="font-display font-black text-2xl mt-1">Página não encontrada</h2>
        <p className="text-sm text-foreground/70 mt-2">A rota administrativa solicitada não existe.</p>
        <Link to="/admin" className="inline-flex mt-5 gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold">
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen surface-deeper text-foreground flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}

