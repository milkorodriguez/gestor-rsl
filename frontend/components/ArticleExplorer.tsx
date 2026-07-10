"use client";
import { useEffect, useState, useCallback } from "react";
import { Articulo } from "@/lib/api";

const CADENAS = ["", "P1", "P2", "P3"];
const DOT: Record<string, string> = { P1: "#38bdf8", P2: "#facc15", P3: "#ef4444" };

export default function ArticleExplorer({ initial }: { initial: Articulo[] }) {
  const [rows, setRows] = useState<Articulo[]>(initial);
  const [q, setQ] = useState("");
  const [cadena, setCadena] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    else if (cadena) params.set("cadena", cadena);
    try {
      const res = await fetch(`/api/backend/articulos?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
    setLoading(false);
  }, [q, cadena]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b hairline p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o resumen…"
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-faint outline-none focus:border-ember"
        />
        <div className="flex gap-1">
          {CADENAS.map((c) => (
            <button
              key={c || "all"}
              onClick={() => { setQ(""); setCadena(c); }}
              className={`rounded-lg px-3 py-2 font-mono text-xs transition ${
                cadena === c && !q ? "bg-ember text-bg" : "border border-border text-muted hover:text-ink"
              }`}
            >
              {c || "Todas"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-panel-2 text-left">
            <tr className="text-faint">
              <th className="px-4 py-2 font-medium">Código</th>
              <th className="px-4 py-2 font-medium">Título</th>
              <th className="px-4 py-2 font-medium">Año</th>
              <th className="hidden px-4 py-2 font-medium md:table-cell">Revista</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t hairline align-top hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: DOT[a.cadena ?? ""] ?? "#5a6884" }} />
                  {a.codigo}
                </td>
                <td className="px-4 py-3 text-ink">
                  <div className="line-clamp-2 max-w-xl">{a.titulo ?? "—"}</div>
                  <div className="mt-0.5 text-xs text-faint">{a.autores ?? ""}</div>
                </td>
                <td className="px-4 py-3 tabular-nums text-muted">{a.anio ?? "—"}</td>
                <td className="hidden max-w-[220px] px-4 py-3 text-xs text-muted md:table-cell">{a.revista ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-faint">
                {loading ? "Cargando…" : "Ningún artículo coincide con el filtro."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t hairline px-4 py-2 text-right font-mono text-xs text-faint">
        {loading ? "…" : `${rows.length} artículos`}
      </div>
    </div>
  );
}
