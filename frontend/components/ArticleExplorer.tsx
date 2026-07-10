"use client";
import { useEffect, useMemo, useState } from "react";
import { Articulo } from "@/lib/api";

const CADENAS = ["", "P1", "P2", "P3"];
const DOT: Record<string, string> = { P1: "#38bdf8", P2: "#facc15", P3: "#ef4444" };

export default function ArticleExplorer({ initial }: { initial: Articulo[] }) {
  const [q, setQ] = useState("");
  const [cadena, setCadena] = useState("");
  const [fetched, setFetched] = useState<Articulo[]>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const needle = q.trim();
    if (!needle && !cadena) { setFetched(initial); return; }

    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (needle) params.set("q", needle);
      else if (cadena) params.set("cadena", cadena);
      try {
        const res = await fetch(`/api/backend/articulos?${params.toString()}`, {
          cache: "no-store", signal: controller.signal,
        });
        const data = await res.json();
        setFetched(Array.isArray(data) ? data : []);
      } catch {
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => { clearTimeout(t); controller.abort(); };
  }, [q, cadena, initial]);

  const rows = useMemo(
    () => (cadena ? fetched.filter((a) => a.cadena === cadena) : fetched),
    [fetched, cadena]
  );

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b hairline p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar en título y resumen…"
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-faint outline-none focus:border-ember"
        />
        <div className="flex gap-1">
          {CADENAS.map((c) => (
            <button
              key={c || "all"}
              onClick={() => setCadena(c)}
              className={`rounded-lg px-3 py-2 font-mono text-xs transition ${
                cadena === c ? "bg-ember text-bg" : "border border-border text-muted hover:text-ink"
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
            {rows.map((a) => {
              const href = a.doi ? `https://doi.org/${a.doi.trim()}` : null;
              return (
                <tr key={a.id} className="group border-t hairline align-top hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: DOT[a.cadena ?? ""] ?? "#5a6884" }} />
                    {a.codigo}
                  </td>
                  <td className="px-4 py-3">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-ink underline-offset-2 hover:text-ember hover:underline">
                        <span className="line-clamp-2 max-w-xl">
                          {a.titulo ?? "—"}
                          <span className="ml-1 text-faint transition group-hover:text-ember">↗</span>
                        </span>
                      </a>
                    ) : (
                      <div className="line-clamp-2 max-w-xl text-ink">{a.titulo ?? "—"}</div>
                    )}
                    <div className="mt-0.5 text-xs text-faint">{a.autores ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted">{a.anio ?? "—"}</td>
                  <td className="hidden max-w-[220px] px-4 py-3 text-xs text-muted md:table-cell">{a.revista ?? "—"}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-faint">
                {loading ? "Buscando…" : "Ningún artículo coincide con la búsqueda."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t hairline px-4 py-2 font-mono text-xs text-faint">
        <span>Clic en el título → abre el artículo (DOI)</span>
        <span>{loading ? "buscando…" : `${rows.length} de ${initial.length} artículos`}</span>
      </div>
    </div>
  );
}
