import { useEffect, useState } from "react";
import {
  BadgeCheck, FlaskConical, Microscope, ShieldCheck, Award,
  Sparkles, Stethoscope, Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import drBacteria1 from "@/assets/dr-bacteria-1.png";
import drBacteria2 from "@/assets/dr-bacteria-2.png";

type DrBContent = {
  title: string;
  subtitle: string;
  description: string;
  specialist_name: string;
  specialty: string;
  recognition: string;
  institutional_text: string;
  seal_label: string;
  primary_image: string | null;
  secondary_image: string | null;
  cards: { title: string; desc: string }[];
  seals: { label: string }[];
};

const FALLBACK: DrBContent = {
  title: "Serviço Validado pelo Dr. Bactéria",
  subtitle: "Padrão de higienização profissional referência nacional.",
  description: "Produtos, procedimentos e padrões alinhados às melhores práticas de microbiologia.",
  specialist_name: "Roberto Figueiredo",
  specialty: "Microbiologia",
  recognition: "Referência nacional em higiene e microbiologia.",
  institutional_text:
    "A Sofá Novo de Novo utiliza produtos, procedimentos e padrões alinhados às melhores práticas de higienização profissional, levando mais segurança, saúde e qualidade para famílias e empresas.",
  seal_label: "Selo de Aprovação",
  primary_image: null,
  secondary_image: null,
  cards: [
    { title: "Produtos aprovados", desc: "Soluções biodegradáveis testadas em laboratório." },
    { title: "Análise especializada", desc: "Monitoramento técnico-científico contínuo." },
    { title: "Procedimentos profissionais", desc: "Equipes treinadas conforme protocolos premium." },
    { title: "Segurança para famílias", desc: "Ambientes seguros para crianças, pets e idosos." },
  ],
  seals: [{ label: "Selo Dr. Bactéria" }, { label: "Microbiologia" }, { label: "Padrão Premium" }],
};

const CARD_ICONS = [FlaskConical, Microscope, ShieldCheck, Users, Award, Sparkles];

export function DrBacteriaSection() {
  const [c, setC] = useState<DrBContent>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("dr_bacteria").select("*").limit(1).maybeSingle();
      if (!cancelled && data) {
        setC({
          ...FALLBACK,
          ...data,
          cards: Array.isArray(data.cards) && data.cards.length ? (data.cards as DrBContent["cards"]) : FALLBACK.cards,
          seals: Array.isArray(data.seals) && data.seals.length ? (data.seals as DrBContent["seals"]) : FALLBACK.seals,
        } as DrBContent);
      }
    })();
    return () => { cancelled = true; };
  }, []);

const img1 = c.primary_image || drBacteria1;
const img2 = c.secondary_image || drBacteria2;

  return (
    <section id="dr-bacteria" className="relative surface-dark py-20 lg:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60"
           style={{ background: "radial-gradient(ellipse at 85% 20%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 55%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-40"
           style={{ background: "radial-gradient(ellipse at 10% 80%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs mb-5">
            <BadgeCheck className="size-4 text-primary" />
            <span className="uppercase tracking-widest">Autoridade Científica</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            {c.title.split(" ").slice(0, -2).join(" ")} <span className="text-gradient">{c.title.split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mt-5 text-foreground/70 text-lg">{c.subtitle}</p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT — Institutional */}
          <div className="space-y-6">
            {/* Specialist card */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full opacity-40"
                   style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
              <div className="relative flex items-start gap-5">
                <div className="size-16 rounded-2xl gradient-teal grid place-items-center glow-teal shrink-0">
                  <Stethoscope className="size-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Dr. Bactéria</div>
                  <div className="font-display font-black text-2xl sm:text-3xl mt-1">{c.specialist_name}</div>
                  <div className="text-sm text-foreground/65 mt-1">{c.specialty}</div>
                  <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{c.recognition}</p>
                </div>
              </div>
            </div>

            {/* Institutional text */}
            <div className="glass rounded-3xl p-6 sm:p-8 relative">
              <div className="absolute -left-px top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-transparent via-primary to-transparent" />
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed italic">
                "{c.institutional_text}"
              </p>
            </div>

            {/* Pillars */}
            <div className="grid sm:grid-cols-2 gap-3">
              {c.cards.map((card, i) => {
                const Icon = CARD_ICONS[i % CARD_ICONS.length];
                return (
                  <div key={i} className="glass rounded-2xl p-5 hover:glass-strong transition group">
                    <div className="flex items-start gap-4">
                      <div className="size-11 rounded-xl gradient-teal grid place-items-center text-primary-foreground shrink-0 group-hover:scale-110 transition">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{card.title}</div>
                        <div className="text-xs text-foreground/65 mt-1 leading-relaxed">{card.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seal strip */}
            <div className="flex flex-wrap gap-2">
              {c.seals.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs">
                  <BadgeCheck className="size-4 text-primary" />
                  <span className="uppercase tracking-widest font-semibold">{s.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Visuals */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[2.5rem] glow-soft opacity-70 pointer-events-none" />
            <div className="relative grid grid-cols-5 grid-rows-7 gap-3 aspect-[4/5]">
              <div className="col-span-3 row-span-7 relative rounded-3xl overflow-hidden glass-strong">
                <img src={img1} alt={c.specialist_name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-primary-glow">
                    <BadgeCheck className="size-3.5" /> Aprovado
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-[10px] uppercase tracking-widest text-primary-glow">Especialista</div>
                  <div className="font-display font-bold text-xl">{c.specialist_name}</div>
                  <div className="text-xs text-foreground/70">{c.specialty}</div>
                </div>
              </div>

              <div className="col-span-2 row-span-4 relative rounded-3xl overflow-hidden glass-strong">
                <img src={img2} alt="Análise laboratorial" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[9px] uppercase tracking-widest text-primary-glow font-bold">Análise</div>
                  <div className="text-xs font-semibold">Laboratório</div>
                </div>
              </div>

              <div className="col-span-2 row-span-3 rounded-3xl glass-strong p-4 flex flex-col justify-center items-center text-center glow-teal relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-50"
                     style={{ background: "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)" }} />
                <div className="relative">
                  <div className="size-14 rounded-full gradient-teal grid place-items-center mx-auto glow-teal animate-float">
                    <BadgeCheck className="size-7 text-primary-foreground" />
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-widest font-bold">{c.seal_label}</div>
                  <div className="mt-1 font-display font-black text-base text-gradient">Dr. Bactéria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
