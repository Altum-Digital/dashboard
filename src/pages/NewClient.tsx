import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { Client, ClientStatus, Package, ClientPhase, TemplateUsed, Submission } from "@/data/types";
import { uid } from "@/data/store";

const PKG_MAP: Record<string, Package> = { Presencia: "basic", Total: "premium", Personalizado: "premium" };

export function NewClient() {
  const navigate = useNavigate();
  const { addClient } = useApp();
  const location = useLocation();
  const prefill = (location.state as { prefill?: Submission } | null)?.prefill;

  const [form, setForm] = useState({
    name: prefill?.businessName ?? "", industry: prefill?.industry ?? "",
    contactName: prefill?.contactName ?? "", contactEmail: prefill?.contactEmail ?? "",
    contactWhatsApp: prefill?.contactWhatsApp ?? "", domain: prefill?.domain ?? "",
    domainRegistrar: "", domainRenewalDate: "",
    status: "pending" as ClientStatus,
    phase: "recoleccion" as ClientPhase,
    package: (prefill?.package ? (PKG_MAP[prefill.package] ?? "basic") : "basic") as Package,
    templateUsed: "" as TemplateUsed | "",
    monthlyFee: "0",
    mensualidadActive: false,
    anticipoAmount: "", finalPaymentAmount: "",
    deliveryDate: "",
    github: "", vercel: "", figma: "", notion: "",
    analytics: "", drive: "", whatsapp: "", website: "", forms: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const anticipoAmt = parseInt(form.anticipoAmount) || 0;
    const finalAmt    = parseInt(form.finalPaymentAmount) || 0;

    const client: Client = {
      id: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + uid().slice(0, 4),
      name: form.name.trim(),
      industry: form.industry.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactWhatsApp: form.contactWhatsApp.trim(),
      status: form.status,
      phase: form.phase,
      package: form.package,
      templateUsed: (form.templateUsed || undefined) as TemplateUsed | undefined,
      monthlyFee: parseInt(form.monthlyFee) || 0,
      mensualidadActive: form.mensualidadActive,
      startDate: new Date().toISOString().slice(0, 10),
      deliveryDate: form.deliveryDate || undefined,
      domain: form.domain.trim() || undefined,
      domainRegistrar: form.domainRegistrar.trim() || undefined,
      domainRenewalDate: form.domainRenewalDate || undefined,
      anticipo: anticipoAmt > 0 ? { amount: anticipoAmt, received: false } : undefined,
      finalPayment: finalAmt > 0 ? { amount: finalAmt, received: false } : undefined,
      links: {
        github:    form.github.trim()    || undefined,
        vercel:    form.vercel.trim()    || undefined,
        figma:     form.figma.trim()     || undefined,
        notion:    form.notion.trim()    || undefined,
        analytics: form.analytics.trim() || undefined,
        drive:     form.drive.trim()     || undefined,
        whatsapp:  form.whatsapp.trim()  || undefined,
        website:   form.website.trim()   || undefined,
        forms:     form.forms.trim()     || undefined,
      },
      tasks: [],
      monthlyChecks: [
        { id: uid(), label: "Deploy en producción actualizado", done: false },
        { id: uid(), label: "Sin errores en consola", done: false },
        { id: uid(), label: "Formulario de contacto funciona", done: false },
        { id: uid(), label: "Links del navbar correctos", done: false },
        { id: uid(), label: "Versión móvil revisada", done: false },
        { id: uid(), label: "Backup del repo en GitHub", done: false },
      ],
      logs: [],
      notes: "",
    };

    addClient(client);
    navigate(`/client/${client.id}`);
  }

  const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500";
  const labelCls = "block text-xs text-gray-500 mb-1";

  const field = (label: string, k: keyof typeof form, placeholder = "", type = "text") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type={type} value={form[k] as string} onChange={set(k)} placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-700">Nuevo cliente</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Nuevo cliente</h1>
        {prefill && (
          <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-600">
            Datos pre-llenados desde el onboarding de <span className="font-semibold text-blue-800">{prefill.businessName}</span>. Revisa y completa los campos faltantes.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* General */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Datos generales</h2>
            <div className="grid grid-cols-2 gap-4">
              {field("Nombre del cliente *", "name", "Cretum Partners")}
              {field("Industria", "industry", "Asset Management")}
              {field("Nombre del contacto", "contactName", "Juan García")}
              {field("Email del contacto", "contactEmail", "juan@empresa.com", "email")}
              {field("WhatsApp", "contactWhatsApp", "+52 55 1234 5678")}
              {field("Dominio", "domain", "empresa.com")}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Estado</label>
                <select value={form.status} onChange={set("status")} className={inputCls}>
                  <option value="pending">Pendiente</option>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="churned">Inactivo</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Fase del proyecto</label>
                <select value={form.phase} onChange={set("phase")} className={inputCls}>
                  <option value="prospeccion">Prospección</option>
                  <option value="recoleccion">Recolección</option>
                  <option value="propuesta">Propuesta</option>
                  <option value="desarrollo">Desarrollo</option>
                  <option value="revision">Revisión</option>
                  <option value="entrega">Entrega</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Template</label>
                <select value={form.templateUsed} onChange={set("templateUsed")} className={inputCls}>
                  <option value="">— Sin definir —</option>
                  <option value="basico">Presencia ($9,000)</option>
                  <option value="pro">Total ($15,000)</option>
                  <option value="personalizado">Personalizado ($20,000+)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Paquete</label>
                <select value={form.package} onChange={set("package")} className={inputCls}>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {field("Fecha de entrega estimada", "deliveryDate", "", "date")}
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pagos</h2>
            <div className="grid grid-cols-3 gap-4">
              {field("Anticipo (MXN)", "anticipoAmount", "3500", "number")}
              {field("Pago final (MXN)", "finalPaymentAmount", "3500", "number")}
              {field("Mensualidad (MXN/mes)", "monthlyFee", "0", "number")}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, mensualidadActive: !f.mensualidadActive }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.mensualidadActive ? "bg-green-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.mensualidadActive ? "left-5.5" : "left-0.5"}`} />
              </button>
              <span className="text-sm text-gray-500">Mensualidad activa</span>
            </div>
          </div>

          {/* Domain */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dominio</h2>
            <div className="grid grid-cols-3 gap-4">
              {field("Registrar", "domainRegistrar", "Namecheap, GoDaddy...")}
              {field("Fecha renovación", "domainRenewalDate", "", "date")}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Links del proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
              {field("GitHub", "github", "https://github.com/...")}
              {field("Vercel", "vercel", "https://vercel.com/...")}
              {field("Sitio web", "website", "https://empresa.com")}
              {field("Figma", "figma", "https://figma.com/...")}
              {field("Notion", "notion", "https://notion.so/...")}
              {field("Google Drive", "drive", "https://drive.google.com/...")}
              {field("Analytics", "analytics", "https://vercel.com/analytics/...")}
              {field("WhatsApp (link)", "whatsapp", "https://wa.me/...")}
              {field("Google Forms (onboarding)", "forms", "https://forms.gle/...")}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/" className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Cancelar
            </Link>
            <button type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
              Crear cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
