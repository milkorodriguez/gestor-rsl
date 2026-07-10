import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

// Proxy del lado del servidor para las llamadas interactivas del cliente
// (p.ej. filtros del explorador). Reenvía a la API HTTP sin exponerla al navegador.
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const search = req.nextUrl.search || "";
  try {
    const res = await fetch(`${API_BASE}/api/${path}${search}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "No se pudo contactar la API" }, { status: 502 });
  }
}
