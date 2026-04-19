import { useState, useRef } from "react";

type UploadFile = { file: File; preview: string };

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadFile(file: File): Promise<string> {
  const base64 = await fileToBase64(file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, base64 }),
  });
  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
}

function DropZone({ label, hint, multiple = false, files, onAdd, onRemove }: {
  label: string; hint: string; multiple?: boolean;
  files: UploadFile[]; onAdd: (f: File[]) => void; onRemove: (i: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (incoming: File[]) => {
    const imgs = incoming.filter(f => f.type.startsWith("image/"));
    if (imgs.length) onAdd(multiple ? imgs : [imgs[0]]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(Array.from(e.dataTransfer.files)); }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
        ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"}`}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden"
        onChange={(e) => { if (e.target.files?.length) handle(Array.from(e.target.files)); e.target.value = ""; }} />

      {files.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-7 px-4 text-center">
          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-xs text-gray-400">{hint}</p>
        </div>
      ) : (
        <div className="p-4 flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <img src={f.preview} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              <button type="button" onClick={() => onRemove(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full text-white text-xs items-center justify-center hidden group-hover:flex">
                ×
              </button>
              <p className="text-xs text-gray-400 mt-1 max-w-[80px] truncate">{f.file.name}</p>
            </div>
          ))}
          {multiple && (
            <div onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="w-20 h-20 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Onboarding() {
  const [form, setForm] = useState({
    businessName: "", industry: "", phone: "", address: "",
    description: "", slogan: "", services: "", schedule: "",
    contactName: "", contactEmail: "", contactWhatsApp: "", domain: "",
    package: "",
    socials: "", googleBusiness: "", extras: "",
  });
  const [logoFiles, setLogoFiles] = useState<UploadFile[]>([]);
  const [photoFiles, setPhotoFiles] = useState<UploadFile[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const addFiles = (existing: UploadFile[], incoming: File[], multi: boolean): UploadFile[] => {
    const mapped = incoming.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    return multi ? [...existing, ...mapped] : mapped;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName.trim() || !form.contactName.trim() || !form.contactEmail.trim()) return;
    setStatus("sending");

    try {
      let logoUrl = "";
      const photoUrls: string[] = [];

      if (logoFiles.length > 0) {
        setStatusMsg("Subiendo logo...");
        logoUrl = await uploadFile(logoFiles[0].file);
      }

      for (let i = 0; i < photoFiles.length; i++) {
        setStatusMsg(`Subiendo fotos (${i + 1}/${photoFiles.length})...`);
        photoUrls.push(await uploadFile(photoFiles[i].file));
      }

      setStatusMsg("Guardando...");
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logoUrl, photoUrls }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setStatus("sent");
    } catch {
      setStatus("error");
      setStatusMsg("");
    }
  }

  const inputCls = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide";

  if (status === "sent") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Formulario recibido</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Gracias, <span className="text-gray-900 font-medium">{form.contactName}</span>. Revisaremos tu información y nos comunicaremos contigo pronto para iniciar tu proyecto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">Onboarding</p>
            <p className="text-gray-500 text-xs">Formulario de inicio de proyecto</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuéntanos sobre tu negocio</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Este formulario es todo lo que necesitamos para construir tu sitio web. Solo toma unos minutos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Tu negocio */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tu negocio</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Nombre del negocio *</label>
                <input value={form.businessName} onChange={set("businessName")} required
                  placeholder="Ej. Pastelería Dulce" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Giro / Industria</label>
                <input value={form.industry} onChange={set("industry")}
                  placeholder="Ej. Alimentos, Salud, Moda..." className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Teléfono del negocio</label>
                <input value={form.phone} onChange={set("phone")}
                  placeholder="Ej. 999 123 4567" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Dominio deseado</label>
                <input value={form.domain} onChange={set("domain")}
                  placeholder="Ej. minegocio.com.mx" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Dirección</label>
                <input value={form.address} onChange={set("address")}
                  placeholder="Calle, colonia, ciudad" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Descripción del negocio</label>
                <textarea value={form.description} onChange={set("description")} rows={3}
                  placeholder="Describe tu negocio en 2–3 oraciones. Esto irá en la sección 'Quiénes somos' de tu sitio."
                  className={inputCls + " resize-none"} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Slogan o frase principal</label>
                <input value={form.slogan} onChange={set("slogan")}
                  placeholder='Ej. "La mejor pastelería de Mérida"' className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Servicios o productos que ofreces</label>
                <textarea value={form.services} onChange={set("services")} rows={3}
                  placeholder="Lista tus servicios o productos principales..."
                  className={inputCls + " resize-none"} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Horarios de atención</label>
                <input value={form.schedule} onChange={set("schedule")}
                  placeholder="Ej. Lun–Vie 9am–6pm, Sáb 10am–2pm" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos de contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Nombre completo *</label>
                <input value={form.contactName} onChange={set("contactName")} required
                  placeholder="Tu nombre" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.contactEmail} onChange={set("contactEmail")} required
                  placeholder="tu@correo.com" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>WhatsApp</label>
                <input value={form.contactWhatsApp} onChange={set("contactWhatsApp")}
                  placeholder="+52 55 1234 5678" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Paquete */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paquete de interés</h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "Express", price: "$3,500", desc: "1 página · 24–48 hrs" },
                { value: "Negocio", price: "$6,500", desc: "Hasta 5 páginas · 3–5 días" },
                { value: "Pro",     price: "$12,000", desc: "Completo · 5–7 días" },
              ] as const).map(p => (
                <button key={p.value} type="button"
                  onClick={() => setForm(f => ({ ...f, package: p.value }))}
                  className={`rounded-xl p-4 text-left border transition-all ${
                    form.package === p.value
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                  <p className="text-sm font-semibold mb-0.5">{p.value}</p>
                  <p className="text-xs font-bold text-blue-600">{p.price}</p>
                  <p className="text-xs mt-1 opacity-70">{p.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Puedes cambiarlo más adelante, es solo una referencia.</p>
          </div>

          {/* Identidad visual */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identidad visual</h2>

            <div>
              <label className={labelCls}>Logo</label>
              <DropZone
                label="Arrastra tu logo aquí o haz click para seleccionar"
                hint="PNG, JPG o SVG · Máx. 5MB"
                files={logoFiles}
                onAdd={(files) => setLogoFiles(addFiles(logoFiles, files, false))}
                onRemove={(i) => setLogoFiles(f => f.filter((_, j) => j !== i))}
              />
            </div>

          </div>

          {/* Fotos */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fotos del negocio</h2>
            <p className="text-xs text-gray-500">Fotos de tu local, productos, equipo, o lo que quieras mostrar en el sitio.</p>
            <DropZone
              label="Arrastra tus fotos aquí o haz click para seleccionar"
              hint="PNG o JPG · Varias a la vez · Máx. 10MB por foto"
              multiple
              files={photoFiles}
              onAdd={(files) => setPhotoFiles(f => addFiles(f, files, true))}
              onRemove={(i) => setPhotoFiles(f => f.filter((_, j) => j !== i))}
            />
          </div>

          {/* Presencia online */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Presencia online</h2>
            <div>
              <label className={labelCls}>Google My Business (si tienes)</label>
              <input value={form.googleBusiness} onChange={set("googleBusiness")}
                placeholder="https://g.page/tunegocio" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Redes sociales</label>
              <textarea value={form.socials} onChange={set("socials")} rows={3}
                placeholder={"Instagram: @tunegocio\nFacebook: facebook.com/tunegocio\nTikTok: @tunegocio"}
                className={inputCls + " resize-none"} />
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <label className={labelCls}>Algo más que debamos saber?</label>
            <textarea value={form.extras} onChange={set("extras")} rows={3}
              placeholder="Ideas de diseño, referencias de sitios que te gustan, expectativas, preguntas..."
              className={inputCls + " resize-none"} />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500 text-center">Hubo un error al enviar. Intenta de nuevo.</p>
          )}

          <button type="submit" disabled={status === "sending"}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
            {status === "sending" ? (statusMsg || "Enviando...") : "Enviar formulario"}
          </button>

        </form>
      </div>
    </div>
  );
}
