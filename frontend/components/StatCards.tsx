import { Dashboard } from "@/lib/api";

const CAD = { P1: "aqi1", P2: "aqi3", P3: "aqi5" } as const;
const LABEL = {
  P1: "Métodos espacio-temporales",
  P2: "Fuentes y contexto geográfico",
  P3: "Modelamiento y resultados",
} as const;

export default function StatCards({ dash }: { dash: Dashboard }) {
  const cadenas = Object.keys(dash.por_cadena_y_estado);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cadenas.map((c) => {
        const total = Object.values(dash.por_cadena_y_estado[c]).reduce((a, b) => a + b, 0);
        const pct = Math.round(dash.porcentaje_completado[c] ?? 0);
        const color = (CAD as Record<string, string>)[c] ?? "aqi1";
        return (
          <div key={c} className="panel p-5">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-medium text-${color}`}>{c}</span>
              <span className="font-mono text-[11px] text-faint">{pct}% extraído</span>
            </div>
            <div className="mt-3 font-display text-4xl font-bold tabular-nums">{total}</div>
            <div className="mt-1 text-xs text-faint">{(LABEL as Record<string, string>)[c]}</div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
              <div className={`h-full rounded-full bg-${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
