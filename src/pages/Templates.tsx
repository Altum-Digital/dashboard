import { Link } from "react-router-dom";

type Status = "ready" | "wip" | "roadmap";

type Template = {
  tier: "Presencia" | "Total" | "Personalizado";
  price: string;
  timeline: string;
  status: Status;
  localUrl?: string;
  path?: string;
  highlights: string[];
};

type Industry = {
  slug: string;
  name: string;
  icon: string;
  templates: Template[];
};

const industries: Industry[] = [
  {
    slug: "taller",
    name: "Talleres mecánicos",
    icon: "🔧",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5212",
        path: "templates/taller-basico",
        highlights: [
          "One-pager con animaciones base",
          "FAQ + Stats + Schema.org",
          "Legal completo (LFPDPPP)",
          "Form → WhatsApp",
        ],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5214",
        path: "templates/taller-pro",
        highlights: [
          "13 landings SEO por servicio",
          "Landing B2B flotillas",
          "Bot WhatsApp interactivo",
          "GSAP + Lottie listos",
          "Sitemap de 20 URLs",
        ],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
  {
    slug: "restaurante",
    name: "Restaurantes",
    icon: "🍽",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5203",
        path: "templates/restaurante-basico",
        highlights: ["Menú + reservas + ubicación", "Galería de platillos"],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5205",
        path: "templates/restaurante-pro",
        highlights: ["Reservas online con calendario", "Menú CMS editable", "Landing catering"],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
  {
    slug: "salon",
    name: "Salón de belleza",
    icon: "💇",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5206",
        path: "templates/salon-basico",
        highlights: ["Servicios + precios", "Galería de trabajos", "WhatsApp + Fresha hook", "Schema BeautySalon"],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5208",
        path: "templates/salon-pro",
        highlights: ["Booking por estilista", "Membresías", "Tienda de productos", "GSAP + Lottie"],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
  {
    slug: "barberia",
    name: "Barbería",
    icon: "💈",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5200",
        path: "templates/barberia-basico",
        highlights: ["Servicios + cortes", "Galería antes/después", "Booking Booksy hook", "Schema HairSalon"],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5202",
        path: "templates/barberia-pro",
        highlights: ["Booking por barbero", "Paquetes + membresías", "Tienda productos barba"],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
  {
    slug: "spa",
    name: "Spa / Bienestar",
    icon: "🧖",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5209",
        path: "templates/spa-basico",
        highlights: ["Rituales + precios", "Galería ambientes", "Booking Mindbody hook", "Schema DaySpa"],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5211",
        path: "templates/spa-pro",
        highlights: ["Booking por terapeuta", "Paquetes + gift cards", "Tienda wellness"],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
  {
    slug: "decoracion",
    name: "Decoraciones",
    icon: "🛋",
    templates: [
      {
        tier: "Presencia",
        price: "$9,000",
        timeline: "5-7 días",
        status: "ready",
        localUrl: "http://localhost:5215",
        path: "templates/decoracion-presencia",
        highlights: [
          "Servicios configurables (tapicería, cortinas, muebles, diseño)",
          "Galería de proyectos",
          "Cotizador → WhatsApp",
          "Schema HomeAndConstructionBusiness",
        ],
      },
      {
        tier: "Total",
        price: "$12,000",
        timeline: "20-30 días",
        status: "ready",
        localUrl: "http://localhost:5216",
        path: "templates/decoracion-total",
        highlights: [
          "Portafolio filtrable por categoría",
          "Antes/después slider",
          "Showroom de materiales",
          "Blog CMS + cotizador avanzado",
        ],
      },
      {
        tier: "Personalizado",
        price: "$20,000+",
        timeline: "A cotizar",
        status: "roadmap",
        highlights: [
          "Diseño 100% a la medida",
          "Páginas ilimitadas",
          "Integraciones custom",
          "Animaciones GSAP avanzadas",
        ],
      },
    ],
  },
];

const statusStyle: Record<Status, { bg: string; text: string; label: string }> = {
  ready: { bg: "bg-green-100", text: "text-green-700", label: "Listo" },
  wip: { bg: "bg-amber-100", text: "text-amber-700", label: "En progreso" },
  roadmap: { bg: "bg-gray-100", text: "text-gray-500", label: "Roadmap" },
};

const tierAccent: Record<Template["tier"], string> = {
  Presencia: "border-orange-200 bg-orange-50/40",
  Total: "border-lime-200 bg-lime-50/40",
  Personalizado: "border-indigo-200 bg-indigo-50/40",
};

export function Templates() {
  const readyCount = industries.flatMap(i => i.templates).filter(t => t.status === "ready").length;
  const totalCount = industries.flatMap(i => i.templates).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {readyCount} de {totalCount} templates listos · 5 industrias · 3 tiers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/paquetes" className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            Paquetes
          </Link>
          <Link to="/" className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-900">
            <strong>Cómo correr los templates:</strong> cada uno tiene su propio dev server en un puerto fijo del rango <code className="bg-white px-1 rounded text-[11px]">5200–5214</code>. Lanza todos con <code className="bg-white px-1.5 py-0.5 rounded text-xs">bash scripts/start-all-templates.sh</code> o cada uno individualmente desde su directorio con <code className="bg-white px-1.5 py-0.5 rounded text-xs">npm run dev -- --port &lt;N&gt; --strictPort</code>.
          </p>
        </div>

        {industries.map((industry) => (
          <section key={industry.slug} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl">{industry.icon}</span>
              <h2 className="text-lg font-bold text-gray-900">{industry.name}</h2>
              <span className="text-xs text-gray-400">
                {industry.templates.filter(t => t.status === "ready").length} / {industry.templates.length} listos
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {industry.templates.map((tpl) => {
                const st = statusStyle[tpl.status];
                return (
                  <div
                    key={`${industry.slug}-${tpl.tier}`}
                    className={`border rounded-xl p-5 ${tierAccent[tpl.tier]} flex flex-col`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{tpl.tier}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-extrabold text-gray-900">{tpl.price}</p>
                      <p className="text-xs text-gray-500">Entrega {tpl.timeline}</p>
                    </div>

                    <ul className="space-y-1.5 mb-5 flex-1">
                      {tpl.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {tpl.status === "ready" ? (
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <a
                          href={tpl.localUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Abrir demo →
                        </a>
                        {tpl.path && (
                          <p className="text-[10px] text-gray-400 text-center font-mono truncate" title={tpl.path}>
                            {tpl.path}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-[11px] text-gray-400 text-center italic">
                          Pendiente de construir
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="mt-10 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">Directorio base</h3>
          <p className="text-sm text-gray-600 mb-3">
            Todos los templates viven en <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/Users/air/altum_digital/templates/</code>
          </p>
          <p className="text-sm text-gray-600">
            Para clonar uno a un cliente nuevo, próximamente: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">scripts/new-site.mjs</code>
          </p>
        </div>
      </div>
    </div>
  );
}
