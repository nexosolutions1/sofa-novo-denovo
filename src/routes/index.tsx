import { createFileRoute } from "@tanstack/react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  Shield,
  Droplets,
  ChevronDown,
  Check,
  MessageCircle,
  Award,
  ShieldCheck,
  FlaskConical,
  Wind,
  BadgeCheck,
  Phone,
  Instagram,
  MapPin,
  ArrowRight,
  Play,
  Building2,
  Bug,
  Skull,
  Trash2,
  Activity,
  Zap,
  Star,
} from "lucide-react";

import logo from "@/assets/logo.png";
import sofaAzulAntes from "@/assets/sofa azul antes.jpeg";
import sofaAzulDepois from "@/assets/sofa azul depois.jpeg";
import sofaBegeAntes from "@/assets/sofa bege antes.jpeg";
import sofaBegeDepois from "@/assets/sofa bege depois.jpeg";
import sofaBege2Antes from "@/assets/sofa bege2 antes.jpeg";
import sofaBege2Depois from "@/assets/sofa bege2 depois.jpeg";
import cadeiraAntes from "@/assets/cadeira antes.jpg";
import cadeiraDepois from "@/assets/cadeira depois.jpg";
import colchaoAntes from "@/assets/colchao antes.jpg";
import colchaoDepois from "@/assets/colchao depois.jpg";
import { BrazilMap } from "@/components/site/BrazilMap";
import { DrBacteriaSection } from "@/components/site/DrBacteriaSection";
import { NovaNexoBadge } from "@/components/NovaNexoBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
  title: "Sofá Novo de Novo | Higienização e Blindagem Premium de Estofados",
},
{
  name: "description",
  content:
    "Líder nacional em higienização profunda e blindagem impermeabilizante de estofados. +300 unidades, +15 anos, garantia total.",
},
{
  property: "og:title",
  content: "Sofá Novo de Novo — Referência Nacional em Higienização",
},
{
  property: "og:description",
  content:
    "Tecnologia hospitalar, produtos aprovados pelo Dr. Bactéria, garantia de resultado imediato.",
},

// TROQUE ESSE

{
  property: "og:image",
  content: "https://sofa-novo-denovo.netlify.app/og-image.png",
},
{
  property: "og:image:width",
  content: "1200",
},
{
  property: "og:image:height",
  content: "630",
},
{
  property: "og:type",
  content: "website",
},
{
  property: "og:site_name",
  content: "Sofá Novo de Novo",
},
{
  property: "og:locale",
  content: "pt_BR",
},
{
  name: "twitter:card",
  content: "summary_large_image",
},
{
  name: "twitter:image",
  content: "https://sofa-novo-denovo.netlify.app/og-image.png",
},

// TROQUE ESSE
{
  property: "og:url",
  content: "https://sofa-novo-denovo.netlify.app",
},
    ],
links: [
  {
    rel: "canonical",
    href: "https://sofa-novo-denovo.netlify.app",
  },
],



  }),
  component: Home,
});

const BEFORE_AFTER = [
  {
    title: "Sofá Bege",
    before: sofaBegeAntes,
    after: sofaBegeDepois,
  },
];

const WHATSAPP = "553597291894";

const MSG_ORCAMENTO =
  "Olá!\n\nVi as transformações no site da Sofá Novo de Novo e quero saber quanto custa para deixar meu estofado com aparência de novo.\n\nPode me passar um orçamento?";

const MSG_BLINDAGEM =
  "Olá!\n\nQuero proteger meu sofá contra líquidos, manchas e sujeira com a blindagem impermeabilizante.\n\nPode me passar um orçamento?";


const MSG_GARANTIA =
  "Olá!\n\nGostaria de agendar uma higienização com garantia de resultado.\n\nComo funciona?";

const MSG_FLUTUANTE =
  "Olá!\n\nGostaria de falar com um especialista da Sofá Novo de Novo.\n\nPode me ajudar?";

const heroVideo = "/videos/higienizacao-1.mp4";
const videoHigienizacao = "/videos/higienizacao-1.mp4";
const videoBlindagem1 = "/videos/blindagem-1.mp4";
const videoBlindagem2 = "/videos/blindagem-2.mp4";
const videoAntesDepois = "/videos/antes-depois.mp4";

const wa = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Transformações", href: "#transformacoes" },
  { label: "Processo", href: "#processo" },
  { label: "Dr. Bactéria", href: "#dr-bacteria" },
  { label: "Contato", href: "#contato" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <ItemAfter />
      <Transformations />
      <Processo />
      <Impact />
      <Blindagem />
      <DrBacteriaSection />
      <Referencia />
      <BrazilMap />
      <Garantia />
      <Footer />
      <FloatingWA />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-500 ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
<a href="#inicio" className="flex items-center gap-3 min-w-0">
            <img
              src={logo}
              alt="Sofá Novo de Novo"
             className="h-11 sm:h-12 w-auto object-contain shrink-0 rounded-md"
            />  
          </a>

          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 text-sm text-foreground/75 hover:text-primary transition rounded-lg hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-end">
            <a
              href={wa(MSG_ORCAMENTO)}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 gradient-teal text-primary-foreground font-semibold text-sm px-4 py-2 rounded-xl glow-teal hover:scale-[1.03] transition"
            >
              <MessageCircle className="size-4" />
              Solicitar orçamento
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg glass"
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 animate-fade-in">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm hover:text-primary border-b border-white/5 last:border-none"
              >
                {n.label}
              </a>
            ))}

            <a
              href={wa(MSG_FLUTUANTE)}
              className="mt-2 block text-center gradient-teal text-primary-foreground font-semibold px-4 py-3 rounded-xl"
            >
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="inicio"
      className="relative surface-deeper pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 60%)",
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 30%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs sm:text-sm mb-6">
            <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-foreground/80">
              Líder Nacional · Mais de 300 unidades
            </span>
          </div>

          <h1 className="font-display font-black leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
            SEU SOFÁ
            <br />
            <span className="text-gradient">NOVO DE NOVO</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-foreground/70 max-w-xl leading-relaxed">
            Higienização hospitalar e blindagem impermeabilizante validadas por
            Dr. Bactéria. Resultado imediato, sem cheiro, sem manchas — ou você{" "}
            <span className="text-primary font-semibold">não paga</span>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={wa(MSG_ORCAMENTO)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 gradient-teal text-primary-foreground font-bold px-6 py-3.5 rounded-2xl glow-teal hover:scale-[1.03] transition"
            >
              <MessageCircle className="size-5" />
              Orçamento no WhatsApp
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </a>

            <a
              href="#transformacoes"
              className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-2xl font-semibold hover:bg-white/10 transition"
            >
              <Play className="size-4" />
              Ver transformações
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-xl">
            {[
              { k: "+15", v: "Anos" },
              { k: "+300", v: "Unidades" },
              { k: "+70", v: "Serviços" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-gradient">
                  {s.k}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-foreground/60 mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] glow-soft opacity-70" />

          <div className="relative rounded-[2rem] overflow-hidden glass-strong aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
          <video
           src={heroVideo}
           autoPlay
           muted
           loop
           playsInline
           preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary-glow">
                  Ao vivo no estúdio
                </div>
                <div className="font-display font-bold text-lg">
                  Higienização profissional
                </div>
              </div>

              <span className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ItemAfter() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);

  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const current = BEFORE_AFTER[active];

  // sempre volta o slider pro meio quando troca a foto
  useEffect(() => {
    setPos(50);
  }, [active]);

  useEffect(() => {
    const move = (clientX: number) => {
      if (!dragging.current || !ref.current) return;

      const r = ref.current.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width) * 100;

      setPos(Math.max(0, Math.min(100, x)));
    };
    
    const onMove = (e: MouseEvent) => move(e.clientX);
    const onTouch = (e: TouchEvent) => move(e.touches[0].clientX);
    const stop = () => (dragging.current = false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  return (
    <section className="relative surface-dark py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Antes & Depois
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            Veja a transformação <span className="text-gradient">acontecer</span>.
          </h2>

          <p className="mt-4 text-foreground/65 text-lg">
            Arraste e compare resultados reais de higienização.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {BEFORE_AFTER.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                setActive(index);
                setPos(50);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === index
                  ? "gradient-teal text-primary-foreground glow-teal"
                  : "glass text-foreground/80 hover:text-foreground"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-4 rounded-[2rem] glow-soft" />

          <div
            ref={ref}
            className="relative rounded-3xl overflow-hidden glass-strong select-none cursor-ew-resize aspect-[16/10]"
            onMouseDown={() => (dragging.current = true)}
            onTouchStart={() => (dragging.current = true)}
          >
            <img
              src={current.after}
              alt={`${current.title} depois da limpeza`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs font-semibold">
              DEPOIS
            </div>

            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <img
                src={current.before}
                alt={`${current.title} antes da limpeza`}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />

              <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-semibold">
                ANTES
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 w-[3px] gradient-teal glow-teal pointer-events-none"
              style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
            />

            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 size-14 rounded-full gradient-teal glow-teal grid place-items-center text-primary-foreground"
              style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
              aria-label="Arrastar comparação"
            >
              <div className="flex items-center -mx-1">
                <ChevronDown className="size-5 rotate-90" />
                <ChevronDown className="size-5 -rotate-90 -ml-2" />
              </div>
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="mt-6 w-full accent-primary"
            aria-label="Comparar antes e depois"
          />
        </div>
      </div>
    </section>
  );
}

const CATS = ["Sofás", "Colchões", "Cadeiras"] as const;

type Cat = (typeof CATS)[number];

const TRANSFORMS: { cat: Cat; title: string; before: string; after: string }[] = [
  {
    cat: "Sofás",
    title: "Sofá azul restaurado",
    before: sofaAzulAntes,
    after: sofaAzulDepois,
  },
  {
    cat: "Cadeiras",
    title: "Cadeira estofada higienizada",
    before: cadeiraAntes,
    after: cadeiraDepois,
  },
  {
    cat: "Colchões",
    title: "Colchão limpo e livre de manchas",
    before: colchaoAntes,
    after: colchaoDepois,
  },
];

function Transformations() {
  const [cat, setCat] = useState<Cat>("Sofás");
  const items = TRANSFORMS.filter((t) => t.cat === cat);

  return (
    <section id="transformacoes" className="relative surface-deeper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
              Centro de Transformação
            </span>

            <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
              Transformações <span className="text-gradient">Reais</span>
            </h2>

            <p className="mt-4 text-foreground/65 text-lg">
              Resultados reais em estofados que pareciam perdidos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  cat === c
                    ? "gradient-teal text-primary-foreground glow-teal"
                    : "glass text-foreground/80 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div
              key={i}
className="group
relative
aspect-[4/5]
overflow-hidden
rounded-3xl
glass
border
border-white/10
cursor-pointer
transition-all
duration-500
hover:-translate-y-2
hover:border-primary/40
hover:shadow-[0_20px_60px_rgba(0,255,220,.18)]"
            >
              <div className="absolute inset-0 grid grid-cols-2">
                <div className="relative overflow-hidden">
                  <img
                    src={t.before}
                    alt={`${t.title} antes`}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[10px] font-bold">
                    ANTES
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <img
                    src={t.after}
                    alt={`${t.title} depois`}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-[10px] font-bold">
                    DEPOIS
                  </div>
                </div>
              </div>

<div
className="
absolute
inset-0
rounded-3xl
border
border-white/5
group-hover:border-primary/60
group-hover:shadow-[0_0_60px_rgba(40,220,215,.35)]
transition-all
duration-500
"
/>
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] gradient-teal glow-teal" />

<div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
               <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 backdrop-blur-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
  <span className="size-2 rounded-full bg-primary animate-pulse" />
  Caso real
</div>
<div className="font-display font-black text-2xl leading-tight mt-2 group-hover:text-primary transition-colors">
                  {t.title}
                </div>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-2 text-sm text-primary">
                  Ver antes e depois <ArrowRight className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Processo() {
  const [open, setOpen] = useState<string | null>(null);

  const videos = [
    {
      src: videoHigienizacao,
      title: "Extração profunda",
      tag: "Higienização",
      aspect: "aspect-[9/16]",
    },
    {
      src: videoBlindagem1,
      title: "Aplicação de produtos",
      tag: "Blindagem",
      aspect: "aspect-[9/16]",
    },
    {
      src: videoBlindagem2,
      title: "Proteção impermeável",
      tag: "Nano blindagem",
      aspect: "aspect-[9/16]",
    },
    {
      src: videoAntesDepois,
      title: "Resultado final",
      tag: "Antes/Depois",
      aspect: "aspect-[9/16]",
    },
  ];

  return (
    <section id="processo" className="relative surface-dark py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Veja o processo
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            O processo em <span className="text-gradient">ação</span>
          </h2>

          <p className="mt-4 text-foreground/65 text-lg">
            Cada etapa filmada. Cada detalhe documentado.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((v, i) => (
            <button
              key={i}
              onClick={() => setOpen(v.src)}
              className={`group relative ${v.aspect} rounded-3xl overflow-hidden glass-strong text-left`}
            >
<video
  src={v.src}
  muted
  loop
  playsInline
  preload="metadata"
  poster=""
  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
/>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 grid place-items-center">
                <div className="size-16 rounded-full gradient-teal glow-teal grid place-items-center scale-90 group-hover:scale-100 transition">
                  <Play className="size-7 text-primary-foreground translate-x-0.5" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] uppercase tracking-widest text-primary-glow">
                  {v.tag}
                </div>
                <div className="font-display font-bold text-base mt-1">
                  {v.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-xl p-4 animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-w-md w-full aspect-[9/16] rounded-3xl overflow-hidden glass-strong glow-teal"
            onClick={(e) => e.stopPropagation()}
          >
<video
  src={open}
  autoPlay
  controls
  playsInline
  preload="auto"
  className="w-full h-full object-cover"
/>

            <button
              onClick={() => setOpen(null)}
              className="absolute top-3 right-3 size-10 rounded-full glass-strong grid place-items-center"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Impact() {
  const items = [
    { icon: Bug, name: "Ácaros", desc: "Causadores de alergia e rinite" },
    { icon: FlaskConical, name: "Fungos", desc: "Proliferam em ambientes úmidos" },
    { icon: Skull, name: "Bactérias", desc: "Eliminadas com produto hospitalar" },
    { icon: Wind, name: "Poeira fina", desc: "Sugada das fibras profundas" },
    { icon: Sparkles, name: "Odores", desc: "Suor, urina, pet e cigarro" },
    { icon: Trash2, name: "Sujeira invisível", desc: "Acúmulo de meses ou anos" },
  ];

  return (
    <section className="relative surface-deeper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Impacto Invisível
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            O que <span className="text-gradient">removemos</span> do seu estofado?
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((it, i) => (
            <div key={i} className="group glass rounded-2xl p-6 hover:glass-strong transition">
              <div className="size-12 rounded-xl gradient-teal grid place-items-center text-primary-foreground glow-soft group-hover:scale-110 transition">
                <it.icon className="size-6" />
              </div>

              <div className="mt-4 font-display font-bold text-xl">{it.name}</div>

              <div className="mt-1 text-sm text-foreground/65">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blindagem() {
  return (
    <section className="relative surface-dark py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Blindagem Impermeabilizante
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            Líquido escorre.
            <br />
            <span className="text-gradient">Mancha não entra.</span>
          </h2>

          <p className="mt-5 text-foreground/70 text-lg max-w-lg">
            Tecnologia nano-protetora que cria uma camada invisível repelindo
            café, vinho, refrigerante, urina de pet e gordura. Aprovado em
            laboratório.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-lg">
            {[
              "Não muda a cor",
              "Não muda o cheiro",
              "Não muda a textura",
              "Atóxico — seguro para bebês",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 glass rounded-xl p-3">
                <Check className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>

          <a
            href={wa(MSG_BLINDAGEM)}
            className="mt-8 inline-flex items-center gap-2 gradient-teal text-primary-foreground font-bold px-6 py-3.5 rounded-2xl glow-teal hover:scale-[1.03] transition"
          >
            <Shield className="size-5" />
            Quero blindar agora
          </a>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] glow-soft" />

          <div className="relative rounded-[2rem] overflow-hidden glass-strong aspect-square">
            <video
              src={videoBlindagem1}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
              <Droplets className="size-3 text-primary" />
              NANO BLINDAGEM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Referencia() {
  const stats = [
    { k: "+15", v: "Anos de experiência", icon: Award },
    { k: "#1", v: "Maior do Brasil", icon: Star },
    { k: "+300", v: "Unidades nacionais", icon: Building2 },
    { k: "+70", v: "Serviços especializados", icon: Sparkles },
    { k: "100%", v: "Seguro residencial", icon: ShieldCheck },
    { k: "Aprov.", v: "Produtos certificados", icon: BadgeCheck },
  ];

  return (
    <section className="relative surface-deeper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Autoridade
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            Por que somos <span className="text-gradient">referência nacional?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative glass rounded-3xl p-6 sm:p-7 overflow-hidden group hover:glass-strong transition"
            >
              <div
                className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-0 group-hover:opacity-40 transition"
                style={{
                  background: "radial-gradient(circle, var(--primary), transparent 70%)",
                }}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="font-display font-black text-4xl sm:text-5xl text-gradient leading-none">
                    {s.k}
                  </div>

                  <div className="mt-2 text-sm text-foreground/70">{s.v}</div>
                </div>

                <div className="size-10 rounded-xl glass grid place-items-center shrink-0">
                  <s.icon className="size-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Garantia() {
  return (
    <section className="relative surface-deeper py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden glass-strong p-8 sm:p-14 lg:p-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 60%)",
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <ShieldCheck className="size-4 text-primary" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Garantia Total
              </span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl">
              Garantimos o resultado
              <br />
              <span className="text-gradient">imediato.</span>
            </h2>

            <p className="mt-6 text-foreground/75 text-lg sm:text-xl max-w-2xl mx-auto">
              Se você não gostar,{" "}
              <span className="text-primary font-bold">não paga</span>. É essa a
              confiança que temos no nosso serviço.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={wa(MSG_GARANTIA)}
                className="inline-flex items-center gap-2 gradient-teal text-primary-foreground font-bold px-7 py-4 rounded-2xl glow-teal hover:scale-[1.03] transition"
              >
                <Zap className="size-5" />
                Agendar com garantia
              </a>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="relative">
                <div className="size-32 rounded-full gradient-teal grid place-items-center glow-teal animate-float">
                  <div className="size-28 rounded-full bg-background grid place-items-center">
                    <div className="text-center leading-tight">
                      <div className="text-[10px] uppercase tracking-widest text-primary">
                        Garantia
                      </div>
                      <div className="font-display font-black text-2xl text-gradient">
                        100%
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-foreground/60">
                        ou não paga
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="relative surface-dark pt-20 pb-10 hairline-top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="size-12 object-contain" />

              <div className="font-display font-bold leading-tight">
                SOFÁ NOVO
                <br />
                <span className="text-gradient">DE NOVO</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-foreground/65 max-w-sm">
              Referência nacional em higienização e blindagem de estofados.
              Tecnologia hospitalar, garantia total.
            </p>

            <div className="mt-5 flex gap-2">
              <a
                href={wa(MSG_FLUTUANTE)}
                className="size-10 rounded-xl glass grid place-items-center hover:gradient-teal hover:text-primary-foreground transition"
              >
                <MessageCircle className="size-5" />
              </a>

              <a
                href="#"
                className="size-10 rounded-xl glass grid place-items-center hover:gradient-teal hover:text-primary-foreground transition"
              >
                <Instagram className="size-5" />
              </a>

              <a
                href="tel:+55 35 9729-1894"
                className="size-10 rounded-xl glass grid place-items-center hover:gradient-teal hover:text-primary-foreground transition"
              >
                <Phone className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/55 mb-4">
              Serviços
            </div>

            <ul className="space-y-2 text-sm">
              {["Higienização", "Blindagem", "Colchões", "Tapetes", "Automotivo", "Empresas"].map(
                (s) => (
                  <li key={s}>
                    <a href="#" className="text-foreground/80 hover:text-primary transition">
                      {s}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/55 mb-4">
              Empresa
            </div>

            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-foreground/80 hover:text-primary transition">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/55 mb-4">
              Contato
            </div>

            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <Phone className="size-4 text-primary mt-0.5" />
                (35) 9729-1894
              </li>

              <li className="flex items-start gap-2">
                <MessageCircle className="size-4 text-primary mt-0.5" />
                WhatsApp 24h
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-primary mt-0.5" />
                Atendimento Nacional
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-foreground/55">
          <div>© {new Date().getFullYear()} Sofá Novo de Novo. Todos os direitos reservados.</div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="hidden sm:inline-flex items-center gap-2">
              <Activity className="size-3 text-primary" />
              Tecnologia validada por Dr. Bactéria
            </span>

            <NovaNexoBadge variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a
      href={wa(MSG_FLUTUANTE)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 group"
    >
      <span className="absolute inset-0 rounded-full gradient-teal animate-ping-slow opacity-60" />

      <span className="relative grid place-items-center size-14 sm:size-16 rounded-full gradient-teal text-primary-foreground glow-teal hover:scale-110 transition">
        <MessageCircle className="size-7" />
      </span>
    </a>
  );
}