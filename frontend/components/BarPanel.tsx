"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";

// Escala AQI: los valores más altos se pintan más "peligrosos" (rojo), los bajos más "limpios" (cian).
const AQI = ["#38bdf8", "#2dd4bf", "#facc15", "#fb923c", "#ef4444", "#9f1239"];

function colorFor(i: number, n: number) {
  const idx = Math.min(AQI.length - 1, Math.floor((i / Math.max(1, n - 1)) * (AQI.length - 1)));
  return AQI[idx];
}

export default function BarPanel({
  data, top = 10, unit = "artículos",
}: { data: Record<string, number>; top?: number; unit?: string }) {
  const rows = Object.entries(data || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([name, value]) => ({ name, value }));

  if (rows.length === 0)
    return <div className="panel flex h-64 items-center justify-center text-sm text-faint">Sin datos disponibles</div>;

  return (
    <div className="panel p-4">
      <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 34)}>
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category" dataKey="name" width={168}
            tick={{ fill: "#c3cbdd", fontSize: 12 }} tickLine={false} axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{ background: "#0f1826", border: "1px solid #22304a", borderRadius: 10, color: "#eef1f7", fontSize: 12 }}
            formatter={(v: number) => [`${v} ${unit}`, ""]}
            labelStyle={{ color: "#8a97b1" }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={16}>
            {rows.map((_, i) => (
              <Cell key={i} fill={colorFor(rows.length - 1 - i, rows.length)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
