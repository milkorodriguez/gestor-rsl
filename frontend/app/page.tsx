import {
  getDashboard, getFrecuencias, getLags, getMatriz, getArticulos,
} from "@/lib/api";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import StatCards from "@/components/StatCards";
import BarPanel from "@/components/BarPanel";
import MatrixHeatmap from "@/components/MatrixHeatmap";
import ArticleExplorer from "@/components/ArticleExplorer";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [dash, contaminantes, metodos, software, lags, paises, matriz, articulos] =
    await Promise.all([
      getDashboard(), getFrecuencias("contaminantes"), getFrecuencias("metodos"),
      getFrecuencias("software"), getLags(), getFrecuencias("paises"),
      getMatriz(), getArticulos(),
    ]);

  if (!dash) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-ember uppercase">Sin conexión con la API</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">El panel no pudo cargar los datos</h1>
        <p className="mt-3 text-sm text-muted">
          Revisa que la variable <span className="font-mono text-ink">API_BASE_URL</span> apunte al ALB
          vigente y que el despliegue en AWS esté activo.
        </p>
      </main>
    );
  }

  const nPaises = paises ? Object.keys(paises).length : Object.keys(matriz ?? {}).length;

  return (
    <main>
      <Hero total={dash.total_articulos} paises={nPaises} />

      <Section eyebrow="Panorama" title="Avance por cadena de búsqueda"
        note="Cada cadena responde una pregunta de revisión distinta (P1/P2/P3).">
        <StatCards dash={dash} />
      </Section>

      <Section eyebrow="Exposición" title="Contaminantes y métodos de modelamiento"
        note="Frecuencia con que cada término aparece en el corpus, coloreado según intensidad.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">Contaminantes</p>
            <BarPanel data={contaminantes ?? {}} />
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">Métodos de modelamiento</p>
            <BarPanel data={metodos ?? {}} />
          </div>
        </div>
      </Section>

      <Section eyebrow="Herramientas y tiempo" title="Software y estructura de rezagos"
        note="El rezago exposición→efecto es el corazón metodológico de OE2.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">Software</p>
            <BarPanel data={software ?? {}} unit="artículos" />
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-faint uppercase tracking-wider">Ventanas de rezago (lag)</p>
            <BarPanel data={lags ?? {}} unit="artículos" />
          </div>
        </div>
      </Section>

      <Section eyebrow="El vacío geográfico" title="Matriz país × topografía"
        note="Cada celda cuenta artículos. El corredor andino peruano aparece vacío: ese es el aporte.">
        <MatrixHeatmap matriz={matriz ?? {}} />
      </Section>

      <Section eyebrow="Corpus" title="Explorar los artículos"
        note="Búsqueda libre o filtro por cadena, en vivo contra la API.">
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
