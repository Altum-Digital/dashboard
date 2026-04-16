import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Client, Task, Log, TaskStatus } from "@/data/types";
import { loadClients, saveClients, uid } from "@/data/store";

interface AppContextValue {
  clients: Client[];
  loading: boolean;
  getClient: (id: string) => Client | undefined;
  addTask: (clientId: string, title: string, priority: Task["priority"]) => void;
  updateTaskStatus: (clientId: string, taskId: string, status: TaskStatus) => void;
  deleteTask: (clientId: string, taskId: string) => void;
  toggleCheck: (clientId: string, checkId: string) => void;
  addCheck: (clientId: string, label: string) => void;
  deleteCheck: (clientId: string, checkId: string) => void;
  resetChecklist: (clientId: string) => void;
  addLog: (clientId: string, note: string) => void;
  deleteLog: (clientId: string, logId: string) => void;
  updateNotes: (clientId: string, notes: string) => void;
  updateClientField: (clientId: string, field: Partial<Client>) => void;
  addClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
}

const Ctx = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients().then(data => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  // Optimistic update: apply immediately to UI, then persist in background
  const update = useCallback((updated: Client[]) => {
    setClients(updated);
    saveClients(updated).catch(console.error);
  }, []);

  const getClient = useCallback((id: string) => clients.find(c => c.id === id), [clients]);

  const addTask = useCallback((clientId: string, title: string, priority: Task["priority"]) => {
    const newTask: Task = { id: uid(), title, status: "todo", priority, createdAt: new Date().toISOString().slice(0, 10) };
    update(clients.map(c => c.id !== clientId ? c : { ...c, tasks: [...c.tasks, newTask] }));
  }, [clients, update]);

  const updateTaskStatus = useCallback((clientId: string, taskId: string, status: TaskStatus) => {
    update(clients.map(c => c.id !== clientId ? c : {
      ...c,
      tasks: c.tasks.map(t => t.id !== taskId ? t : {
        ...t, status,
        completedAt: status === "done" ? new Date().toISOString().slice(0, 10) : undefined,
      }),
    }));
  }, [clients, update]);

  const deleteTask = useCallback((clientId: string, taskId: string) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }));
  }, [clients, update]);

  const toggleCheck = useCallback((clientId: string, checkId: string) => {
    update(clients.map(c => c.id !== clientId ? c : {
      ...c,
      monthlyChecks: c.monthlyChecks.map(ch => ch.id !== checkId ? ch : { ...ch, done: !ch.done }),
    }));
  }, [clients, update]);

  const addLog = useCallback((clientId: string, note: string) => {
    const entry: Log = { id: uid(), date: new Date().toISOString().slice(0, 10), note };
    update(clients.map(c => c.id !== clientId ? c : { ...c, logs: [entry, ...c.logs] }));
  }, [clients, update]);

  const deleteLog = useCallback((clientId: string, logId: string) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, logs: c.logs.filter(l => l.id !== logId) }));
  }, [clients, update]);

  const updateNotes = useCallback((clientId: string, notes: string) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, notes }));
  }, [clients, update]);

  const updateClientField = useCallback((clientId: string, field: Partial<Client>) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, ...field }));
  }, [clients, update]);

  const addCheck = useCallback((clientId: string, label: string) => {
    const entry = { id: uid(), label, done: false };
    update(clients.map(c => c.id !== clientId ? c : { ...c, monthlyChecks: [...c.monthlyChecks, entry] }));
  }, [clients, update]);

  const deleteCheck = useCallback((clientId: string, checkId: string) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, monthlyChecks: c.monthlyChecks.filter(ch => ch.id !== checkId) }));
  }, [clients, update]);

  const resetChecklist = useCallback((clientId: string) => {
    update(clients.map(c => c.id !== clientId ? c : { ...c, monthlyChecks: c.monthlyChecks.map(ch => ({ ...ch, done: false })) }));
  }, [clients, update]);

  const addClient = useCallback((client: Client) => {
    update([...clients, client]);
  }, [clients, update]);

  const deleteClient = useCallback((clientId: string) => {
    update(clients.filter(c => c.id !== clientId));
  }, [clients, update]);

  return (
    <Ctx.Provider value={{ clients, loading, getClient, addTask, updateTaskStatus, deleteTask, toggleCheck, addCheck, deleteCheck, resetChecklist, addLog, deleteLog, updateNotes, updateClientField, addClient, deleteClient }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}
