import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { Client, ClientStatus, Package } from "@/data/types";
import { uid } from "@/data/store";

export function NewClient() {
  const navigate = useNavigate();
  const { addClient } = useApp();

  const [form, setForm] = useState({
    name: "", industry: "", contactName: "", contactEmail: "",
    contactWhatsApp: "", domain: "", status: "pending" as ClientStatus,
    package: "basic" as Package, monthlyFee: "0",
    github: "", vercel: "", figma: "", notion: "", analytics: "", drive: "", whatsapp: "", website: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const client: Client = {
      id: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + uid().slice(0, 4),
      name: form.name.trim(),
      industry: form.industry.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactWhatsApp: form.contactWhatsApp.trim(),
      status: form.status,
      package: form.package,
      monthlyFee: parseInt(form.monthlyFee) || 0,
      startDate: new Date().toISOString().slice(0, 10),
      domain: form.domain.trim(),
      links: {
        github:    form.github.trim()    || undefined,
        vercel:    form.vercel.trim()    || undefined,
        figma:     form.figma.trim()     || undefined,
        notion:    form.notion.trim()    || undefined,
        analytics: form.analytics.trim() || undefined,
        drive:     form.drive.trim()     || undefined,
        whatsapp:  form.whatsapp.trim()  || undefined,
        website:   form.website.trim()   || undefined,
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

  const field = (label: string, k: keyof typeof form, placeholder = "", type = "text") => (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type={type} value={form[k]} onChange={set(k)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <header className="border-b border-white/8 px-8 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-300">Nuevo cliente</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-white mb-6">Nuevo cliente</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/4 border border-white/8 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Datos generales</h2>
            <div className="grid grid-cols-2 gap-4">
              {field("Nombre del cliente *", "name", "Cretum Partners")}
              {field("Industria", "industry", "Asset Management")}
              {field("Nombre del contacto", "contactName", "Juan García")}
              {field("Email del contacto", "contactEmail", "juan@empresa.com", "email")}
              {field("WhatsApp", "contactWhatsApp", "+52 55 1234 5678")}
              {field("Dominio", "domain", "empresa.com")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Estado</label>
                <select value={form.status} onChange={set("status")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="pending">Pendiente</option>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="churned">Inactivo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Paquete</label>
                <select value={form.package} onChange={set("package")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {field("Mensualidad (USD)", "monthlyFee", "0", "number")}
            </div>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Links del proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
              {field("GitHub", "github", "https://github.com/...")}
              {field("Vercel", "vercel", "https://vercel.com/...")}
              {field("Sitio web", "website", "https://empresa.com")}
              {field("Figma", "figma", "https://figma.com/...")}
              {field("Notion", "notion", "https://notion.so/...")}
              {field("Google Drive", "drive", "https://drive.google.com/...")}
              {field("Analytics", "analytics", "https://vercel.com/analytics/...")}
              {field("WhatsApp (link)", "whatsapp", "https://wa.me/...")}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/" className="px-5 py-2.5 text-sm text-slate-400 hover:text-white transition-colors">
              Cancelar
            </Link>
            <button type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Crear cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
