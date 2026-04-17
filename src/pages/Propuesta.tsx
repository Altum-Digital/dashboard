export function Propuesta() {
  return (
    <div className="min-h-screen bg-[#0a0c12] print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @page { margin: 0; size: A4; }
      `}</style>

      {/* Print button */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg transition-colors"
        >
          Imprimir / Guardar PDF
        </button>
        <a href="/" className="px-4 py-2 bg-white/8 hover:bg-white/12 border border-white/12 text-slate-300 text-sm rounded-lg transition-colors">
          Dashboard
        </a>
      </div>

      {/* Page */}
      <div className="max-w-[780px] mx-auto px-10 py-14 print:px-12 print:py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-14">
          <div>
            <h1 className="text-3xl font-bold text-white print:text-black tracking-tight mb-1">
              Propuesta de Sitio Web
            </h1>
            <p className="text-slate-400 print:text-slate-600 text-sm">
              Diseño y desarrollo profesional para tu negocio
            </p>
          </div>
          <div className="text-right">
            <p className="text-white print:text-black font-semibold text-sm">Eugenio Creixell</p>
            <p className="text-slate-400 print:text-slate-600 text-xs mt-0.5">ecreixell@cretumpartners.com</p>
            <p className="text-slate-400 print:text-slate-600 text-xs">+52 55 · · · · · · · ·</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-12">
          <p className="text-slate-300 print:text-slate-700 text-sm leading-relaxed max-w-2xl">
            A continuacion presentamos los paquetes disponibles para el desarrollo de tu sitio web.
            Cada paquete incluye diseno personalizado, desarrollo en React, dominio de primer ano y deploy en produccion.
            El tiempo de entrega y las funcionalidades varian segun el plan seleccionado.
          </p>
        </div>

        {/* Packages */}
        <div className="space-y-5 mb-14">

          {/* Express */}
          <PackageCard
            name="Express"
            price="$3,500"
            timeline="24–48 horas"
            color="slate"
            description="Sitio web de una pagina (landing page) ideal para negocios que necesitan presencia en linea rapida y profesional."
            features={[
              "Diseno landing page (1 pagina)",
              "Secciones: inicio, servicios, contacto",
              "Formulario de contacto",
              "Version movil incluida",
              "Deploy en produccion (Vercel)",
              "Dominio de primer ano incluido",
              "1 ronda de revisiones",
            ]}
          />

          {/* Negocio */}
          <PackageCard
            name="Negocio"
            price="$6,500"
            timeline="3–5 dias"
            color="blue"
            description="Sitio web de multiples paginas con identidad visual solida. Recomendado para negocios establecidos que buscan transmitir confianza."
            featured
            features={[
              "Hasta 5 paginas (inicio, nosotros, servicios, galeria, contacto)",
              "Diseno con identidad de marca",
              "Formulario de contacto avanzado",
              "Integracion con redes sociales",
              "Version movil y tablet",
              "Deploy en produccion (Vercel)",
              "Dominio de primer ano incluido",
              "2 rondas de revisiones",
              "Soporte 30 dias post-entrega",
            ]}
          />

          {/* Pro */}
          <PackageCard
            name="Pro"
            price="$12,000"
            timeline="5–7 dias"
            color="purple"
            description="Sitio web completo con funcionalidades avanzadas. Para negocios que requieren una solucion digital robusta y a medida."
            features={[
              "Paginas ilimitadas",
              "Diseno 100% personalizado",
              "Blog o seccion de noticias",
              "Galeria / portafolio avanzado",
              "Integraciones (WhatsApp, Maps, Analytics)",
              "Panel de administracion basico",
              "Optimizacion SEO completa",
              "Version movil y tablet",
              "Deploy en produccion (Vercel)",
              "Dominio de primer ano incluido",
              "Revisiones ilimitadas",
              "Soporte 60 dias post-entrega",
            ]}
          />
        </div>

        {/* Payments */}
        <div className="bg-white/4 print:bg-gray-50 border border-white/8 print:border-gray-200 rounded-2xl p-6 mb-10">
          <h3 className="text-sm font-semibold text-white print:text-black uppercase tracking-wider mb-4">Esquema de pago</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/15 print:bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-400 print:text-blue-600 text-xs font-bold">50%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white print:text-black">Anticipo al iniciar</p>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">Se paga antes de comenzar el proyecto. Asegura tu lugar en agenda.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/15 print:bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-400 print:text-green-600 text-xs font-bold">50%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white print:text-black">Pago final al entregar</p>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">Se liquida al aprobar el sitio terminado, antes del deploy definitivo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensualidad */}
        <div className="bg-white/4 print:bg-gray-50 border border-white/8 print:border-gray-200 rounded-2xl p-6 mb-14">
          <h3 className="text-sm font-semibold text-white print:text-black uppercase tracking-wider mb-3">Mantenimiento mensual (opcional)</h3>
          <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed mb-4">
            Servicio mensual para mantener tu sitio actualizado, seguro y funcionando correctamente.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { plan: "Basico",   fee: "$399 MXN/mes",   items: ["Actualizaciones de contenido", "Monitoreo de errores", "Backup mensual", "Soporte WhatsApp"] },
              { plan: "Estandar", fee: "$699 MXN/mes",   items: ["Todo lo anterior", "Hasta 3 cambios/mes", "Reporte mensual de visitas"] },
              { plan: "Premium",  fee: "$999 MXN/mes",   items: ["Todo lo anterior", "Cambios ilimitados", "SEO mensual", "Soporte prioritario"] },
            ].map(m => (
              <div key={m.plan} className="bg-white/3 print:bg-white border border-white/8 print:border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 print:text-slate-600 mb-1">{m.plan}</p>
                <p className="text-base font-bold text-white print:text-black mb-3">{m.fee}</p>
                <ul className="space-y-1">
                  {m.items.map(i => (
                    <li key={i} className="text-xs text-slate-400 print:text-slate-600 flex items-start gap-1.5">
                      <span className="text-slate-600 print:text-slate-400 mt-0.5">—</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 print:border-gray-200 pt-6 flex items-center justify-between">
          <p className="text-xs text-slate-600 print:text-slate-400">
            Precios en MXN. Propuesta valida por 30 dias.
          </p>
          <p className="text-xs text-slate-600 print:text-slate-400">
            ecreixell@cretumpartners.com
          </p>
        </div>

      </div>
    </div>
  );
}

function PackageCard({
  name, price, timeline, description, features, color, featured,
}: {
  name: string; price: string; timeline: string; description: string;
  features: string[]; color: "slate" | "blue" | "purple"; featured?: boolean;
}) {
  const accent = {
    slate:  { badge: "bg-slate-500/15 text-slate-400 print:bg-slate-100 print:text-slate-600", border: "border-white/8 print:border-gray-200", dot: "bg-slate-500" },
    blue:   { badge: "bg-blue-500/15 text-blue-400 print:bg-blue-100 print:text-blue-600", border: "border-blue-500/30 print:border-blue-300", dot: "bg-blue-400" },
    purple: { badge: "bg-purple-500/15 text-purple-400 print:bg-purple-100 print:text-purple-600", border: "border-white/8 print:border-gray-200", dot: "bg-purple-400" },
  }[color];

  return (
    <div className={`bg-white/4 print:bg-gray-50 border ${accent.border} rounded-2xl p-6 relative`}>
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">Mas popular</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${accent.badge}`}>{name}</span>
          </div>
          <p className="text-2xl font-bold text-white print:text-black">{price} <span className="text-sm font-normal text-slate-400 print:text-slate-600">MXN</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 print:text-slate-500">Tiempo de entrega</p>
          <p className="text-sm font-medium text-slate-300 print:text-slate-700">{timeline}</p>
        </div>
      </div>
      <p className="text-sm text-slate-400 print:text-slate-600 leading-relaxed mb-4">{description}</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-xs text-slate-300 print:text-slate-700">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} mt-1.5 shrink-0`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
