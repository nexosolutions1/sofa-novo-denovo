import novaNexoLogo from "@/assets/nova-nexo-logo.png";

type Props = {
  variant?: "footer" | "sidebar";
  className?: string;
};

export function NovaNexoBadge({ variant = "footer", className = "" }: Props) {
  const isSidebar = variant === "sidebar";

  return (
    <a
      href="https://www.instagram.com/novanexoofc"
      target="_blank"
      rel="noopener noreferrer"
      title="Desenvolvido por Nova Nexo — Abrir Instagram"
      className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
        isSidebar
          ? "glass hover:glass-strong text-foreground/70 hover:text-foreground w-full justify-center"
          : "glass hover:glass-strong text-foreground/55 hover:text-foreground/90"
      } ${className}`}
    >
      <img
        src={novaNexoLogo}
        alt="Nova Nexo"
        className={`${
          isSidebar ? "h-6 w-auto" : "h-5 w-auto"
        } shrink-0 object-contain drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]`}
      />

      <span className="text-[10px] uppercase tracking-[0.28em] font-bold">
        by{" "}
        <span className="text-primary group-hover:text-gradient">
          Nova Nexo
        </span>
      </span>
    </a>
  );
}