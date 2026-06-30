import { useEffect, useMemo, useState } from "react";
import { BR_STATES, BR_BOUNDS, BR_VIEWBOX } from "@/lib/br-paths";

type LocationRow = {
  id: string;
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  units_count: number;
  services_count: number;
};

const LOCATIONS: LocationRow[] = [
  { id: "sp", city: "São Paulo", state: "SP", region: "Sudeste", latitude: -23.5505, longitude: -46.6333, units_count: 28, services_count: 1820 },
  { id: "rj", city: "Rio de Janeiro", state: "RJ", region: "Sudeste", latitude: -22.9068, longitude: -43.1729, units_count: 18, services_count: 1240 },
  { id: "df", city: "Brasília", state: "DF", region: "Centro-Oeste", latitude: -15.7939, longitude: -47.8828, units_count: 9, services_count: 540 },
  { id: "bh", city: "Belo Horizonte", state: "MG", region: "Sudeste", latitude: -19.9167, longitude: -43.9345, units_count: 12, services_count: 760 },
  { id: "curitiba", city: "Curitiba", state: "PR", region: "Sul", latitude: -25.4284, longitude: -49.2733, units_count: 10, services_count: 690 },
  { id: "porto-alegre", city: "Porto Alegre", state: "RS", region: "Sul", latitude: -30.0346, longitude: -51.2177, units_count: 8, services_count: 480 },
  { id: "florianopolis", city: "Florianópolis", state: "SC", region: "Sul", latitude: -27.5949, longitude: -48.5482, units_count: 6, services_count: 360 },
  { id: "salvador", city: "Salvador", state: "BA", region: "Nordeste", latitude: -12.9777, longitude: -38.5016, units_count: 7, services_count: 420 },
  { id: "recife", city: "Recife", state: "PE", region: "Nordeste", latitude: -8.0476, longitude: -34.877, units_count: 6, services_count: 380 },
  { id: "fortaleza", city: "Fortaleza", state: "CE", region: "Nordeste", latitude: -3.7319, longitude: -38.5267, units_count: 6, services_count: 410 },
  { id: "goiania", city: "Goiânia", state: "GO", region: "Centro-Oeste", latitude: -16.6869, longitude: -49.2648, units_count: 7, services_count: 450 },
  { id: "cuiaba", city: "Cuiabá", state: "MT", region: "Centro-Oeste", latitude: -15.601, longitude: -56.0974, units_count: 5, services_count: 280 },
  { id: "campo-grande", city: "Campo Grande", state: "MS", region: "Centro-Oeste", latitude: -20.4697, longitude: -54.6201, units_count: 5, services_count: 300 },
  { id: "manaus", city: "Manaus", state: "AM", region: "Norte", latitude: -3.119, longitude: -60.0217, units_count: 4, services_count: 220 },
  { id: "belem", city: "Belém", state: "PA", region: "Norte", latitude: -1.4558, longitude: -48.5044, units_count: 4, services_count: 240 },
];

function project(lon: number, lat: number, w = 1000, h = 1000) {
  const x = ((lon - BR_BOUNDS.minLon) / (BR_BOUNDS.maxLon - BR_BOUNDS.minLon)) * w;
  const y = ((BR_BOUNDS.maxLat - lat) / (BR_BOUNDS.maxLat - BR_BOUNDS.minLat)) * h;
  return { x, y };
}

function useCounter(target: number, duration = 1400) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return v;
}

function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const v = useCounter(value);

  return (
    <div className="glass rounded-2xl py-4 px-3 text-center">
      <div className="font-display font-black text-2xl sm:text-3xl text-gradient leading-none">
        {value > 0 ? `+${v}` : v}
        {suffix}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-widest text-foreground/60">
        {label}
      </div>
    </div>
  );
}

export function BrazilMap() {
  const [hover, setHover] = useState<{ city: LocationRow; x: number; y: number } | null>(null);

  const markers = useMemo(
    () =>
      LOCATIONS.map((location) => ({
        ...location,
        ...project(location.longitude, location.latitude),
      })),
    [],
  );

  return (
    <section className="relative surface-dark py-20 lg:py-28 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Presença Nacional
          </span>

          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl lg:text-6xl">
            Rede presente em{" "}
            <span className="text-gradient">todas as regiões</span> do Brasil
          </h2>

          <p className="mt-4 text-foreground/65 text-base sm:text-lg">
            +{markers.length} cidades atendidas. Uma marca consolidada de norte a sul.
          </p>
        </div>

        <div className="relative glass-strong rounded-[2rem] p-4 sm:p-8 lg:p-10 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
            }}
          />

          <div className="relative aspect-[1/1] max-w-3xl mx-auto">
            <svg viewBox={BR_VIEWBOX} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="stateFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.80 0.14 188)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="oklch(0.55 0.12 200)" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="stateHover" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.86 0.14 185)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="oklch(0.80 0.14 188)" stopOpacity="0.30" />
                </linearGradient>

                <filter id="brGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="brSoft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" />
                </filter>
              </defs>

              <g opacity="0.5" filter="url(#brSoft)">
                {BR_STATES.map((s) => (
                  <path key={`a-${s.name}`} d={s.d} fill="oklch(0.80 0.14 188)" opacity="0.10" />
                ))}
              </g>

              <g>
                {BR_STATES.map((s) => (
                  <path
                    key={s.name}
                    d={s.d}
                    fill="url(#stateFill)"
                    stroke="oklch(0.80 0.14 188)"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                    className="transition-[fill,stroke-opacity] duration-300 hover:[fill:url(#stateHover)] hover:stroke-[0.9] [stroke:oklch(0.86_0.14_185)]"
                  >
                    <title>{s.name}</title>
                  </path>
                ))}
              </g>

              <g>
                {markers.map((m) => (
                  <g
                    key={m.id}
                    onMouseEnter={() => setHover({ city: m, x: m.x, y: m.y })}
                    onMouseLeave={() => setHover(null)}
                    onTouchStart={() => setHover({ city: m, x: m.x, y: m.y })}
                    className="cursor-pointer"
                  >
                    <circle cx={m.x} cy={m.y} r="8" fill="oklch(0.80 0.14 188)" opacity="0.22" />
                    <circle cx={m.x} cy={m.y} r="4.5" fill="oklch(0.95 0.10 185)" filter="url(#brGlow)" />
                    <circle cx={m.x} cy={m.y} r="2" fill="white" opacity="0.85" />
                  </g>
                ))}
              </g>

              {hover && (
                <g
                  transform={`translate(${Math.min(hover.x + 18, 740)},${Math.max(hover.y - 60, 10)})`}
                  style={{ pointerEvents: "none" }}
                >
                  <rect
                    width="240"
                    height="74"
                    rx="12"
                    fill="oklch(0.10 0.012 220)"
                    opacity="0.92"
                    stroke="oklch(0.80 0.14 188)"
                    strokeOpacity="0.45"
                  />
                  <text
                    x="14"
                    y="26"
                    fontSize="18"
                    fontWeight="700"
                    fill="oklch(0.97 0.005 200)"
                    fontFamily="Sora,Inter,sans-serif"
                  >
                    {hover.city.city}/{hover.city.state}
                  </text>
                  <text
                    x="14"
                    y="46"
                    fontSize="12"
                    fill="oklch(0.86 0.14 185)"
                    fontFamily="Inter,sans-serif"
                  >
                    Sofá Novo de Novo
                  </text>
                  <text
                    x="14"
                    y="62"
                    fontSize="11"
                    fill="oklch(0.85 0.005 200)"
                    opacity="0.7"
                    fontFamily="Inter,sans-serif"
                  >
                    {hover.city.units_count} unidade{hover.city.units_count > 1 ? "s" : ""} •{" "}
                    {hover.city.services_count} serviços
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCounter value={200} label="Unidades" />
            <StatCounter value={70} label="Serviços" />
            <StatCounter value={15} label="Anos de experiência" />

            <div className="glass rounded-2xl py-4 px-3 text-center">
              <div className="font-display font-black text-2xl sm:text-3xl text-gradient leading-none">
                BR
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-foreground/60">
                Cobertura nacional
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Passe o mouse ou toque sobre os pontos luminosos para ver a cidade atendida.
          </p>
        </div>
      </div>
    </section>
  );
}