// Cliente del lado del servidor. El navegador NUNCA llama al ALB (HTTP) directamente:
// estas funciones corren en el servidor de Next.js (Vercel), evitando el bloqueo de mixed content.

export const API_BASE =
  process.env.API_BASE_URL ||
  "http://gestor-rsl-alb-1108613925.us-east-1.elb.amazonaws.com";

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type Dashboard = {
  total_articulos: number;
  por_cadena_y_estado: Record<string, Record<string, number>>;
  porcentaje_completado: Record<string, number>;
};
export type Frecuencias = Record<string, number>;
export type Matriz = Record<string, Record<string, number>>;
export type Articulo = {
  id: number; codigo: string; doi?: string; titulo?: string;
  autores?: string; anio?: number; revista?: string;
  cadena?: string; prioridad?: string; estado?: string; accesoPdf?: string;
};

export const getDashboard = () => get<Dashboard>("/api/dashboard");
export const getFrecuencias = (campo: string) =>
  get<Frecuencias>(`/api/reportes/frecuencias?campo=${campo}`);
export const getLags = () => get<Frecuencias>("/api/reportes/lags");
export const getMatriz = () => get<Matriz>("/api/reportes/matriz");
export const getArticulos = () => get<Articulo[]>("/api/articulos");
