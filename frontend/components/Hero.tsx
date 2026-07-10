export default function Hero({ total, paises }: { total: number; paises: number }) {
  return (
    <header className="relative overflow-hidden border-b hairline">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ember/20 to-transparent scanline" />
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12">
        <p className="font-mono text-xs tracking-[0.25em] text-ember uppercase">
          Revisión sistemática de literatura · PROCIENCIA E041-2026-02
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
          Incendios, aire e IRA
          <span className="block text-muted font-medium text-2xl sm:text-3xl mt-2">
            en el callejón interandino del Perú
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-6">
          <Stat n={total} label="artículos en el corpus" />
          <Stat n={3} label="cadenas de búsqueda · P1 · P2 · P3" />
          <Stat n={paises} label="países / regiones estudiados" />
        </div>

        <p className="mt-9 max-w-2xl text-sm leading-relaxed text-muted">
          El corpus converge en tres vacíos que sostienen la tesis:{" "}
          <span className="text-ink">geográfico</span> —ausencia del corredor andino peruano—,{" "}
          <span className="text-ink">metodológico</span> —la topografía no se modela como predictor— y{" "}
          <span className="text-ink">de desenlace</span> —la IRA con códigos CIE explícitos es rara—.
        </p>
      </div>
    </header>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-display text-5xl font-bold tabular-nums text-ink">{n}</div>
      <div className="mt-1 max-w-[16ch] text-xs leading-snug text-faint">{label}</div>
    </div>
  );
}
