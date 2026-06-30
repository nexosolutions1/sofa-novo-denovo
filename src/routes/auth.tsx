import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Lock, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito | Sofá Novo de Novo" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setInfo("Conta criada. Você já pode entrar.");
        setMode("signin");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen surface-deeper grid place-items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-60"
           style={{ background: "radial-gradient(ellipse at 50% 10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%)" }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Sofá Novo de Novo" className="h-14 mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="size-4 text-primary" />
            <span className="uppercase tracking-widest">Painel administrativo</span>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full opacity-40"
               style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />

          <h1 className="relative font-display font-black text-3xl">
            {mode === "signin" ? "Entrar" : "Criar acesso"}
          </h1>
          <p className="relative text-sm text-foreground/65 mt-1">
            {mode === "signin" ? "Acesse o CMS da Sofá Novo de Novo." : "O primeiro cadastro do e-mail de administrador é promovido automaticamente."}
          </p>

          <form onSubmit={submit} className="relative mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Nome</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                       className="mt-1 w-full glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                       placeholder="Seu nome" required />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest text-foreground/60 font-bold">E-mail</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="w-full glass rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                       placeholder="voce@email.com" required />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-foreground/60 font-bold">Senha</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                       className="w-full glass rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                       placeholder="••••••••" required minLength={8} />
              </div>
            </div>

            {error && <div className="text-sm text-red-400 glass rounded-xl px-3 py-2">{error}</div>}
            {info && <div className="text-sm text-primary glass rounded-xl px-3 py-2">{info}</div>}

            <button type="submit" disabled={loading}
                    className="w-full gradient-teal text-primary-foreground font-bold py-3 rounded-xl glow-teal flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? "Aguarde…" : (mode === "signin" ? "Entrar" : "Criar conta")}
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="relative mt-6 text-center text-sm">
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
                    className="text-primary hover:underline">
              {mode === "signin" ? "Criar primeiro acesso de administrador" : "Já tenho conta — entrar"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-foreground/50 mt-6">
          Conteúdo protegido. Acesso somente para equipe autorizada.
        </p>
      </div>
    </div>
  );
}
