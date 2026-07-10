import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    "text-aqi1","text-aqi3","text-aqi5",
    "bg-aqi1","bg-aqi2","bg-aqi3","bg-aqi4","bg-aqi5","bg-aqi6",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0c1119",
        panel: "#121b2b",
        "panel-2": "#0f1826",
        border: "#22304a",
        ink: "#eef1f7",
        muted: "#8a97b1",
        faint: "#5a6884",
        ember: "#f97a3c",
        // escala AQI (buena -> peligrosa)
        aqi1: "#38bdf8",
        aqi2: "#2dd4bf",
        aqi3: "#facc15",
        aqi4: "#fb923c",
        aqi5: "#ef4444",
        aqi6: "#9f1239",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
