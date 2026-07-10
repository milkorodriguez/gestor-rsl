import { Matriz } from "@/lib/api";

// Heatmap país × topografía — la pieza firma: muestra de un vistazo el vacío geográfico.
const RAMP = ["#132132", "#1f4152", "#2dd4bf", "#facc15", "#fb923c", "#ef4444"];

function shade(v: number, max: number) {
  if (v <= 0) return "#0f1826";
  const t = Math.log(1 + v) / Math.log(1 + Math.max(1, max));
  const idx = Math.min(RAMP.length - 1, 1 + Math.floor(t * (RAMP.length - 2)));
  return RAMP[idx];
}

export default function MatrixHeatmap({ matriz }: { matriz: Matriz }) {
  const paises = Object.keys(matriz);
  const cols = Array.from(new Set(paises.flatMap((p) => Object.keys(matriz[p])))).sort();
  let max = 0;
  paises.forEach((p) => cols.forEach((c) => (max = Math.max(max, matriz[p]?.[c] ?? 0))));

  if (paises.length === 0)
    return <div className="panel flex h-48 items-center justify-center text-sm text-faint">Sin datos de matriz</div>;

  return (
    <div className="panel overflow-x-auto p-4">
      <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="sticky left-0 bg-panel text-left" />
            {cols.map((c) => (
              <th key={c} className="px-1 pb-2 text-center align-bottom">
                <span className="inline-block max-w-[80px] font-mono text-[10px] leading-tight text-faint">{c}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paises.map((p) => (
            <tr key={p}>
              <td className="sticky left-0 z-10 bg-panel pr-3 text-right text-xs font-medium text-muted whitespace-nowrap">{p}</td>
              {cols.map((c) => {
                const v = matriz[p]?.[c] ?? 0;
                return (
                  <td key={c}>
                    <div
                      title={`${p} · ${c}: ${v}`}
                      className="flex h-9 w-full min-w-[40px] items-center justify-center rounded font-mono text-[11px]"
                      style={{ background: shade(v, max), color: v > 0 ? "#0c1119" : "transparent" }}
                    >
                      {v > 0 ? v : ""}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
