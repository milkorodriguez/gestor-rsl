import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

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
