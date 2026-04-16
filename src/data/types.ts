export type ClientStatus = "active" | "pending" | "paused" | "churned";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type Package = "basic" | "standard" | "premium" | "custom";

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

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactWhatsApp?: string;
  status: ClientStatus;
  package: Package;
  monthlyFee: number; // 0 = pro bono / internal
  startDate: string;
  domain?: string;
  links: {
    github?: string;
    vercel?: string;
    figma?: string;
    notion?: string;
    analytics?: string;
    drive?: string;
    whatsapp?: string;
    website?: string;
  };
  tasks: Task[];
  monthlyChecks: MonthlyCheck[];
  logs: Log[];
  notes: string;
}
