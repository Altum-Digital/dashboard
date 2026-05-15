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
      ["Páginas", "1 (one-pager)", "Hasta 5", "Ilimitadas"],
      ["Landings individuales por servicio (SEO)", false, "Hasta 13", "Ilimitadas"],
      ["Landing B2B (flotillas / corporativo)", false, true, true],
      ["Sitemap + robots.txt", false, true, true],
    ],
  },
  {
    title: "Contenido y confianza",
    rows: [
      ["FAQ accordion", true, true, true],
      ["Garantía con número específico", true, true, true],
      ["Stats animados", "3 métricas", "4–5 + logos", "Custom"],
      ["Marcas atendidas (marquee de logos)", false, true, true],
      ["Seguros / alianzas", false, true, true],
      ["Google Reviews badge", false, true, true],
    ],
  },
  {
    title: "Funcionalidad",
    rows: [
      ["Formulario → WhatsApp", true, true, true],
    ],
  },
  {
    title: "Diseño",
    rows: [
      ["Micro-interacciones premium", false, true, true],
      ["Diseño 100% a la medida", false, false, true],
    ],
  },
];

const packages = [
  {
    key: "presencia",
    name: "Presencia",
    price: "$9,000",
    timeline: "5–7 días",
    tag: "One-pager",
    accent: "orange",
    description: "Una página lista para recibir clientes. Ideal si nunca has tenido sitio web y necesitas aparecer bien en Google.",
  },
  {
    key: "total",
    name: "Total",
    price: "$12,000",
    timeline: "20–30 días",
    tag: "Pro",
    accent: "lime",
    description: "Hasta 5 páginas + 13 landings SEO por servicio y landing B2B. Para dominar el mercado local por búsqueda.",
    featured: true,
  },
  {
    key: "personalizado",
    name: "Personalizado",
    price: "$20,000+",
    timeline: "A cotizar",
    tag: "A la medida",
    accent: "indigo",
    description: "Proyecto 100% personalizado, páginas ilimitadas y diseño a la medida. Para negocios que necesitan algo único.",
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
    indigo: "bg-indigo-600",
  }[accent] ?? "bg-gray-500";
}

function accentText(accent: string) {
  return {
    orange: "text-orange-600",
    teal:   "text-teal-600",
    lime:   "text-lime-700",
    indigo: "text-indigo-700",
  }[accent] ?? "text-gray-700";
}

function accentBorder(accent: string) {
  return {
    orange: "border-orange-200",
    teal:   "border-teal-200",
    lime:   "border-lime-200",
    indigo: "border-indigo-200",
  }[accent] ?? "border-gray-200";
}

function accentHeaderBg(accent: string) {
  return {
    orange: "bg-orange-50",
    teal:   "bg-teal-50",
    lime:   "bg-lime-50",
    indigo: "bg-indigo-50",
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
            download="propuesta_altum_digital.pdf"
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

      <div className="px-8 py-8 max-w-7xl mx-auto">
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
            <p className="text-xs text-gray-500 mt-0.5">Principio: calidad base y legal en todos los tiers. Diferenciadores: alcance, contenido y personalización.</p>
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
                      <td className="text-center px-4 py-2.5"><Cell value={row[2]} accent="lime" /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row[3]} accent="indigo" /></td>
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
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-lime-50 text-lime-700">Total</span>
              <span className="text-xs text-gray-500 ml-auto">+$6,000</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "¿Quieres dominar Google en tu zona? Pasamos de one-pager a hasta 5 páginas + 13 landings SEO por servicio, landing B2B y marcas atendidas."
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-lime-50 text-lime-700">Total</span>
              <span className="text-gray-400">→</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">Personalizado</span>
              <span className="text-xs text-gray-500 ml-auto">+$5,000</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "¿Quieres un sitio único que nadie más tenga? Diseño 100% a la medida, páginas ilimitadas y desarrollo personalizado. Sin plantilla: todo desde cero para tu marca."
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
