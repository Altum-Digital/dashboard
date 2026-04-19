export type ClientStatus   = "active" | "pending" | "paused" | "churned";
export type TaskStatus     = "todo" | "in_progress" | "done";
export type TaskPriority   = "low" | "medium" | "high";
export type Package        = "basic" | "standard" | "premium" | "custom";
export type ClientPhase    = "prospeccion" | "recoleccion" | "propuesta" | "desarrollo" | "revision" | "entrega" | "mantenimiento";
export type TemplateUsed   = "express" | "negocio" | "pro" | "custom";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface MonthlyCheck {
  id: string;
  label: string;
  done: boolean;
}

export interface Log {
  id: string;
  date: string;
  note: string;
}

export interface Payment {
  amount: number;   // MXN
  received: boolean;
  date?: string;    // date received
}

export interface Submission {
  id: string;
  submittedAt: string;
  businessName: string;
  industry: string;
  phone?: string;
  address?: string;
  description?: string;
  slogan?: string;
  services?: string;
  schedule?: string;
  contactName: string;
  contactEmail: string;
  contactWhatsApp?: string;
  domain?: string;
  package?: string;
  logoUrl?: string;
  photoUrls?: string[];
  socials?: string;
  googleBusiness?: string;
  extras?: string;
  reviewed: boolean;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactWhatsApp?: string;
  status: ClientStatus;
  phase: ClientPhase;
  package: Package;
  templateUsed?: TemplateUsed;
  monthlyFee: number;         // MXN/mes, 0 = pro bono
  startDate: string;
  deliveryDate?: string;
  // Domain
  domain?: string;
  domainRegistrar?: string;   // namecheap, cloudflare, etc.
  domainRenewalDate?: string; // YYYY-MM-DD
  // Payments (one-time project)
  anticipo?: Payment;
  finalPayment?: Payment;
  mensualidadActive: boolean;
  // Links
  links: {
    github?: string;
    vercel?: string;
    figma?: string;
    notion?: string;
    analytics?: string;
    drive?: string;
    whatsapp?: string;
    website?: string;
    forms?: string;
  };
  tasks: Task[];
  monthlyChecks: MonthlyCheck[];
  logs: Log[];
  notes: string;
}
