import type { Client } from "./types";
import { INITIAL_CLIENTS } from "./clients";

export async function loadClients(): Promise<Client[]> {
  const res = await fetch("/api/clients");
  if (!res.ok) {
    console.error("Failed to load clients from server, using defaults");
    return INITIAL_CLIENTS;
  }
  return res.json() as Promise<Client[]>;
}

export async function saveClients(clients: Client[]): Promise<void> {
  const res = await fetch("/api/clients", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clients),
  });
  if (!res.ok) {
    console.error("Failed to save clients to server");
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
