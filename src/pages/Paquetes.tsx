import { Fragment } from "react";
import { Link } from "react-router-dom";

type Cell = true | false | string;
type Row = [string, Cell, Cell, Cell];
type Group = { title: string; rows: Row[] };

const matrixGroups: Group[] = [
  {
    title: "Calidad base",
    rows: [
      ["Diseño profesional + responsive (móvil / tablet)", true, true, true],
      ["Animaciones base (fade, scroll, counter, hover)", true, true, true],
      ["Schema.org JSON-LD (LocalBusiness)", true, true, true],
      ["Meta tags + Open Graph", true, true, true],
      ["Core Web Vitals optimizados", true, true, true],
    ],
  },
  {
    title: "Legal (obligatorio LFPDPPP)",
    rows: [
      ["Aviso de privacidad + Términos y condiciones", true, true, true],
      ["Banner de cookies", true, true, true],
    ],
  },
  {
    title: "Estructura del sitio",
    rows: [
      ["Páginas", "1 (one-pager)", "5 páginas", "Ilimitadas"],
      ["Landings individuales por servicio (SEO)", false, false, "Hasta 13"],
      ["Landing B2B (flotillas / corporativo)", false, false, true],
      ["Sitemap + robots.txt", false, true, true],
    ],
  },
  {
    title: "Contenido y confianza",
    rows: [
      ["FAQ accordion", true, true, true],
      ["Garantía con número específico", true, true, true],
      ["Stats animados", "3 métricas", "4–5 + timeline", "4–5 + timeline + logos"],
      ["Marcas atendidas (marquee de logos)", false, true, true],
      ["Seguros aceptados", false, true, true],
      ["Google Reviews badge estático", false, true, false],
      ["Google Places reviews dinámicas", false, false, true],
      ["Blog", false, "Estructura + 1 post", "3–5 posts SEO"],
    ],
  },
  {
    title: "Funcionalidad",
    rows: [
      ["Formulario → WhatsApp", true, true, true],
      ["Sistema de agendar online + thank-you page", false, false, true],
      ["Panel CMS para editar contenido", false, false, true],
      ["Bot de WhatsApp básico", false, false, true],
    ],
  },
  {
    title: "Diseño premium (factor wow)",
    rows: [
      ["Micro-interacciones premium", false, true, true],
      ["Lottie animations (hero / proceso)", false, false, true],
      ["3D Spline hero / tour virtual", false, false, true],
      ["Scroll storytelling GSAP", false, false, true],
    ],
  },
];

const packages = [
  {
    key: "express",
    name: "Presencia",
    price: "$3,500",
    timeline: "24–48 horas",
    tag: "Express",
    accent: "orange",
    description: "Presencia digital profesional, legal y rápida. Para negocios que necesitan aparecer bien en Google ya.",
  },
  {
    key: "crecimiento",
    name: "Crecimiento",
    price: "$6,500",
    timeline: "3–5 días",
    tag: "Negocio",
    accent: "teal",
    description: "Todo lo de Presencia + más contenido, marcas, seguros y reseñas. Para posicionarte sobre la competencia.",
    featured: true,
  },
  {
    key: "total",
    name: "Total",
    price: "$12,000",
    timeline: "5–7 días",
    tag: "Pro",
    accent: "lime",
    description: "Todo lo de Crecimiento + agendar online, bot WhatsApp, blog SEO y diseño 3D. Para dominar el mercado local.",
  },
];

function Cell({ value, accent }: { value: Cell; accent: string }) {
  if (value === true)
    return <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${accentBg(accent)}`}>✓</span>;
  if (value === false)
    return <span className="text-gray-300 text-lg">—</span>;
  return <span className={`text-xs font-semibold ${accentText(accent)}`}>{value}</span>;
}

function accentBg(accent: string) {
  return {
    orange: "bg-orange-500",
    teal:   "bg-teal-500",
    lime:   "bg-lime-600",
  }[accent] ?? "bg-gray-500";
}

function accentText(accent: string) {
  return {
    orange: "text-orange-600",
    teal:   "text-teal-600",
    lime:   "text-lime-700",
  }[accent] ?? "text-gray-700";
}

function accentBorder(accent: string) {
  return {
    orange: "border-orange-200",
    teal:   "border-teal-200",
    lime:   "border-lime-200",
  }[accent] ?? "border-gray-200";
}

function accentHeaderBg(accent: string) {
  return {
    orange: "bg-orange-50",
    teal:   "bg-teal-50",
    lime:   "bg-lime-50",
  }[accent] ?? "bg-gray-50";
}

export function Paquetes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Matriz de paquetes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Qué incluye cada paquete — referencia interna</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/propuesta_altum_digital.pdf"
            download
            className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
          >
            Descargar PDF
          </a>
          <Link
            to="/"
            className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Package summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {packages.map(p => (
            <div
              key={p.key}
              className={`bg-white border-2 ${accentBorder(p.accent)} rounded-xl p-5 shadow-sm relative`}
            >
              {p.featured && (
                <span className="absolute -top-2.5 left-5 px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Más popular
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${accentHeaderBg(p.accent)} ${accentText(p.accent)}`}>
                  {p.tag}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {p.price} <span className="text-sm font-normal text-gray-500">MXN</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Entrega: {p.timeline}</p>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Matrix */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Comparación detallada</h2>
            <p className="text-xs text-gray-500 mt-0.5">Principio: calidad base y legal en todos los tiers. Diferenciadores: alcance, funcionalidad y factor wow.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-2/5">
                  Feature
                </th>
                {packages.map(p => (
                  <th
                    key={p.key}
                    className={`text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider ${accentText(p.accent)}`}
                  >
                    {p.name}
                    <div className="text-[10px] font-normal text-gray-500 normal-case tracking-normal mt-0.5">
                      {p.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixGroups.map(group => (
                <Fragment key={group.title}>
                  <tr className="bg-gray-50/70">
                    <td colSpan={4} className="px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-t border-gray-200">
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row, i) => (
                    <tr key={`${group.title}-${i}`} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="px-6 py-2.5 text-gray-700">{row[0]}</td>
                      <td className="text-center px-4 py-2.5"><Cell value={row[1]} accent="orange" /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row[2]} accent="teal" /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row[3]} accent="lime" /></td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upsell logic */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600">Presencia</span>
              <span className="text-gray-400">→</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-600">Crecimiento</span>
              <span className="text-xs text-gray-500 ml-auto">+$3,000</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "Ya tienes sitio, pero ¿quieres que genere más confianza? Agregamos marcas atendidas, seguros, Google Reviews y 5 páginas con más contenido para posicionarte."
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-600">Crecimiento</span>
              <span className="text-gray-400">→</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-lime-50 text-lime-700">Total</span>
              <span className="text-xs text-gray-500 ml-auto">+$5,500</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "¿Quieres que trabaje por ti mientras duermes? Sistema de agendar automático, bot de WhatsApp, blog SEO que atrae clientes de Google, y diseño 3D que la competencia no tiene."
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] font-bold">✓</span>
            Incluido
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-gray-300 text-base leading-none">—</span>
            No incluido
          </span>
        </div>
      </div>
    </div>
  );
}
