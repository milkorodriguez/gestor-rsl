import { Frecuencias } from "./api";

type Rule = { label: string; patterns: RegExp[] };

// Suma los conteos de todos los tokens que hacen match con cada regla canónica.
// Los tokens que no matchean con ninguna regla se descartan (ruido de texto libre).
function cleanByDict(raw: Frecuencias | null, rules: Rule[]): Frecuencias {
  const out: Record<string, number> = {};
  if (!raw) return out;
  for (const [token, count] of Object.entries(raw)) {
    for (const rule of rules) {
      if (rule.patterns.some((p) => p.test(token))) {
        out[rule.label] = (out[rule.label] || 0) + count;
        break;
      }
    }
  }
  return out;
}

export const CONTAMINANTES: Rule[] = [
  { label: "PM2.5", patterns: [/pm\s*2[.,]?5/i] },
  { label: "PM10", patterns: [/pm\s*10/i] },
  { label: "PM1", patterns: [/pm\s*1\b/i] },
  { label: "NO₂", patterns: [/no\s*2|no₂/i] },
  { label: "NOx", patterns: [/nox/i] },
  { label: "O₃", patterns: [/\bo\s*3\b|o₃|ozon/i] },
  { label: "SO₂", patterns: [/so\s*2|so₂/i] },
  { label: "CO₂", patterns: [/co\s*2|co₂/i] },
  { label: "CO", patterns: [/\bco\b/i] },
  { label: "Carbono negro (BC)", patterns: [/black carbon|carbono negro|\bbc\b/i] },
  { label: "AOD (aerosoles)", patterns: [/\baod\b|profundidad óptica|aerosol/i] },
];

export const PAISES: Rule[] = [
  { label: "EE.UU.", patterns: [/ee\.?\s*uu|estados unidos|\busa\b|u\.s|united states|california|colorado|\butah\b|oregon|washington|nueva york|new york|carolina|nevada|arizona|montana/i] },
  { label: "Canadá", patterns: [/canad|british columbia|columbia brit|quebec|ontario|alberta/i] },
  { label: "Australia", patterns: [/australia|hazelwood|victoria|sydney|new south|nueva gales/i] },
  { label: "Brasil", patterns: [/brasil|brazil|pantanal|amazon|corumb|maranh|mato grosso|são paulo|sao paulo/i] },
  { label: "China", patterns: [/\bchina\b|chino|beijing|pekín|shanghai/i] },
  { label: "Colombia", patterns: [/colombia|bogot|medell|aburr|magdalena/i] },
  { label: "Perú", patterns: [/per[úu]\b|áncash|ancash|huaraz|lima/i] },
  { label: "España", patterns: [/españa|spain|madrid|barcelona|catalu/i] },
  { label: "Italia", patterns: [/italia|italy|roma\b|milán/i] },
  { label: "Grecia", patterns: [/grecia|greece|atenas/i] },
  { label: "India", patterns: [/\bindia\b|delhi|mumbai/i] },
  { label: "Corea del Sur", patterns: [/corea|korea|seúl|seoul/i] },
  { label: "Chile", patterns: [/\bchile\b|santiago/i] },
  { label: "Portugal", patterns: [/portugal|lisboa/i] },
  { label: "Europa (multi)", patterns: [/europa|europe|europeo/i] },
];

export const METODOS: Rule[] = [
  { label: "DLNM (lag no lineal)", patterns: [/dlnm|distributed lag|lag no lineal|gasparrini/i] },
  { label: "Cuasi-Poisson", patterns: [/poisson/i] },
  { label: "Caso-cruzado", patterns: [/caso.?cruzado|case.?crossover|cruzado/i] },
  { label: "Random Forest", patterns: [/random forest|bosque aleatorio|\brf\b/i] },
  { label: "Boosting (XGBoost/NGBoost)", patterns: [/xgboost|ngboost|gradient boost|boosting/i] },
  { label: "Machine learning / ensamble", patterns: [/machine learning|aprendizaje autom|ensamble|deep learning|red neuronal|neural/i] },
  { label: "GEE", patterns: [/\bgee\b|ecuaciones de estimaci|generalized estimating/i] },
  { label: "GAM / aditivo", patterns: [/\bgam\b|aditivo generalizado|mgcv|spline/i] },
  { label: "Meta-análisis", patterns: [/meta.?anál|meta.?analysis|mixmeta|mvmeta|efectos aleatorios/i] },
  { label: "Regresión (OLS/efectos fijos)", patterns: [/\bols\b|efectos fijos|mínimos cuadrados|regresión lineal/i] },
  { label: "Regresión logística", patterns: [/logístic|logistic/i] },
  { label: "Series de tiempo", patterns: [/series? de tiempo|time series|arima/i] },
  { label: "Análisis espacial (Moran/kriging)", patterns: [/kriging|moran|lisa|autocorrelaci|\bsar\b/i] },
];

export const SOFTWARE: Rule[] = [
  { label: "R", patterns: [/\br\b|paquete|dlnm|mgcv|mixmeta|survival|\bmsm\b|package|cran/i] },
  { label: "Python", patterns: [/python|pandas|scikit|geopandas|numpy/i] },
  { label: "SIG (ArcGIS/QGIS)", patterns: [/\bsig\b|\bgis\b|arcgis|qgis|geográfica/i] },
  { label: "GEOS-Chem", patterns: [/geos.?chem/i] },
  { label: "CMAQ", patterns: [/cmaq/i] },
  { label: "HYSPLIT", patterns: [/hysplit/i] },
  { label: "Stata", patterns: [/stata/i] },
  { label: "SAS", patterns: [/\bsas\b/i] },
  { label: "MATLAB", patterns: [/matlab/i] },
  { label: "Google Earth Engine", patterns: [/earth engine|\bgee\b.*google|google.*earth/i] },
];

export function cleanContaminantes(raw: Frecuencias | null) { return cleanByDict(raw, CONTAMINANTES); }
export function cleanPaises(raw: Frecuencias | null) { return cleanByDict(raw, PAISES); }
export function cleanMetodos(raw: Frecuencias | null) { return cleanByDict(raw, METODOS); }
export function cleanSoftware(raw: Frecuencias | null) { return cleanByDict(raw, SOFTWARE); }

// Lags: conserva solo tokens con forma de ventana (dígito–dígito) y los normaliza.
export function cleanLags(raw: Frecuencias | null): Frecuencias {
  const out: Record<string, number> = {};
  if (!raw) return out;
  for (const [token, count] of Object.entries(raw)) {
    const m = token.match(/(\d+)\s*[-–—]\s*(\d+)/);
    if (m) {
      const label = `${m[1]}–${m[2]} días`;
      out[label] = (out[label] || 0) + count;
    }
  }
  return out;
}
