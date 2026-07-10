import {
  getDashboard, getFrecuencias, getLags, getArticulos,
} from "@/lib/api";
import {
  cleanContaminantes, cleanPaises, cleanMetodos, cleanSoftware, cleanLags,
} from "@/lib/clean";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import StatCards from "@/components/StatCards";
import BarPanel from "@/components/BarPanel";
import ArticleExplorer from "@/components/ArticleExplorer";

export const dynamic = "force-dynamic";

function ChartLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">{children}</p>;
}

export default async function Page() {
  const [dash, contamRaw, metodosRaw, softwareRaw, lagsRaw, paisesRaw, articulos] =
    await Promise.all([
      getDashboard(), getFrecuencias("contaminantes"), getFrecuencias("metodos"),
      getFrecuencias("software"), getLags(), getFrecuencias("paises"), getArticulos(),
    ]);

  if (!dash) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-ember uppercase">Sin conexión con la API</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">El panel no pudo cargar los datos</h1>
        <p className="mt-3 text-sm text-muted">
          Revisa que <span className="font-mono text-ink">API_BASE_URL</span> apunte al ALB vigente
          y que el despliegue en AWS esté activo.
        </p>
      </main>
    );
  }

  const contaminantes = cleanContaminantes(contamRaw);
  const metodos = cleanMetodos(metodosRaw);
  const software = cleanSoftware(softwareRaw);
  const lags = cleanLags(lagsRaw);
  const paises = cleanPaises(paisesRaw);
  const nPaises = Object.keys(paises).length;

  return (
    <main>
      <Hero total={dash.total_articulos} paises={nPaises} />

      <Section eyebrow="Panorama" title="Las tres preguntas de la revisión"
        note="Cada cadena de búsqueda (P1/P2/P3) responde una pregunta. Aquí, el avance de extracción de cada una.">
        <StatCards dash={dash} />
      </Section>

      <Section eyebrow="P1 · Cómo se estudia" title="Métodos, herramientas y software"
        note="Diseños de análisis espacio-temporal y el software que los soporta.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <ChartLabel>Software y librerías</ChartLabel>
            <BarPanel data={software} />
          </div>
          <div className="panel flex flex-col justify-center p-6">
            <p className="font-mono text-xs text-aqi1">P1</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Esta cadena indaga <span className="text-ink">cómo se estudia</span> la relación entre incendios,
              calidad del aire y salud respiratoria: los diseños de análisis espacial y temporal, y las
              herramientas de software que los hacen posibles. El gráfico resume el software más frecuente;
              los diseños específicos quedan registrados en la extracción de cada artículo.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="P2 · Con qué datos y dónde" title="Fuentes, contaminantes y cobertura geográfica"
        note="Qué contaminantes se miden y en qué regiones se concentra la evidencia.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <ChartLabel>Contaminantes medidos</ChartLabel>
            <BarPanel data={contaminantes} />
          </div>
          <div>
            <ChartLabel>Distribución por país / región</ChartLabel>
            <BarPanel data={paises} top={15} />
          </div>
        </div>
      </Section>

      <Section eyebrow="P3 · Cómo se modela y predice" title="Modelamiento y estructura de rezagos"
        note="Métodos de modelamiento aplicados y las ventanas de rezago exposición-efecto que reportan.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <ChartLabel>Métodos de modelamiento</ChartLabel>
            <BarPanel data={metodos} />
          </div>
          <div>
            <ChartLabel>Ventanas de rezago (lag)</ChartLabel>
            <BarPanel data={lags} />
          </div>
        </div>
      </Section>

      <Section eyebrow="Gestor" title="Buscar y abrir artículos"
        note="Búsqueda en título y resumen contra la API, con enlace directo al DOI.">
        <ArticleExplorer initial={articulos ?? []} />
      </Section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-faint">
        <div className="border-t hairline pt-6 font-mono">
          gestor-rsl · Spring Boot + ECS Fargate + RDS · datos servidos en vivo desde AWS
        </div>
      </footer>
    </main>
  );
}
