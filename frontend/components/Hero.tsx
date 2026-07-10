export default function Hero({ total, paises }: { total: number; paises: number }) {
  return (
    <header className="relative overflow-hidden border-b hairline">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ember/20 to-transparent scanline" />
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12">
        <p className="font-mono text-xs tracking-[0.25em] text-ember uppercase">
          Insumo de tesis · PROCIENCIA E041-2026-02
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
          Gestor de la revisión sistemática
        </h1>
        <p className="mt-3 font-display text-2xl sm:text-3xl font-medium text-muted">
          sobre calidad del aire, incendios forestales e IRA
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6 sm:max-w-2xl">
          <Stat n={total} label="artículos científicos gestionados" />
          <Stat n={3} label="cadenas de búsqueda · P1 · P2 · P3" />
          <Stat n={paises} label="países / regiones cubiertos" />
        </div>

        <p className="mt-9 max-w-2xl text-sm leading-relaxed text-muted">
          Convierte la extracción sistemática de {total} artículos{" "}
          <span className="text-ink">(protocolo de 32 campos, Kitchenham)</span> en datos consultables.
          Permite preguntarle al corpus como conjunto —qué contaminantes, qué métodos, qué rezagos
          y dónde—: la fase de síntesis de la revisión, hecha API.
        </p>
      </div>
    </header>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-display text-5xl font-bold leading-none tabular-nums text-ink">{n}</div>
      <div className="mt-2 text-xs leading-snug text-faint">{label}</div>
    </div>
  );
}
