import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow, title, description, action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">{eyebrow}</div>
        <h1 className="font-display font-black text-3xl sm:text-4xl mt-1">{title}</h1>
        {description && <p className="text-foreground/65 mt-1 text-sm max-w-2xl">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <Link to="/" target="_blank"
              className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:glass-strong transition">
          Ver site <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function NewButton({ onClick, label = "Novo" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
            className="inline-flex items-center gap-2 gradient-teal text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold glow-teal">
      <Plus className="size-4" /> {label}
    </button>
  );
}
