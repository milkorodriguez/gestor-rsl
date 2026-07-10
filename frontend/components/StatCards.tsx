import { Dashboard } from "@/lib/api";

const CAD = { P1: "aqi1", P2: "aqi3", P3: "aqi5" } as const;

const CORTO: Record<string, string> = {
  P1: "Métodos espacio-temporales, herramientas y software",
  P2: "Fuentes satelitales/salud, regiones y contexto físico-geográfico",
  P3: "Modelamiento predictivo, métricas y variables topográficas",
};

const PREGUNTA: Record<string, string> = {
  P1: "¿Qué métodos de análisis espacio-temporal han sido utilizados para estudiar la relación entre incendios forestales, calidad del aire e impacto en la salud respiratoria, y qué herramientas y software se emplean en estos estudios?",
  P2: "¿Qué fuentes de datos satelitales y de salud se han empleado para caracterizar episodios de contaminación por incendios forestales y su efecto en infecciones respiratorias agudas, en qué regiones geográficas y períodos se concentran, y qué características del contexto físico-geográfico (altitud, topografía, cobertura de monitoreo) condicionan la disponibilidad y calidad de los datos?",
  P3: "¿Qué enfoques de modelamiento predictivo y descriptivo han sido aplicados para anticipar o alertar sobre riesgos respiratorios asociados a contaminación por incendios forestales, qué métricas de evaluación y resultados reportan, y en qué medida incorporan variables geográficas y topográficas como altitud, tipo de cuenca o inversiones térmicas?",
};

export default function StatCards({ dash }: { dash: Dashboard }) {
  const cadenas = Object.keys(dash.por_cadena_y_estado);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cadenas.map((c) => {
        const total = Object.values(dash.por_cadena_y_estado[c]).reduce((a, b) => a + b, 0);
        const pct = Math.round(dash.porcentaje_completado[c] ?? 0);
        const color = (CAD as Record<string, string>)[c] ?? "aqi1";
        return (
          <div key={c} className="panel p-5" title={PREGUNTA[c] ?? ""}>
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-medium text-${color}`}>{c}</span>
              <span className="font-mono text-[11px] text-faint">{pct}% extraído</span>
            </div>
            <div className="mt-3 font-display text-4xl font-bold tabular-nums">{total}</div>
            <div className="mt-2 text-xs leading-snug text-muted">{CORTO[c] ?? ""}</div>
            <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-faint">{PREGUNTA[c] ?? ""}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
              <div className={`h-full rounded-full bg-${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
