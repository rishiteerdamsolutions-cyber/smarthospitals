import { randomUUID } from "crypto";
import type { LeadDocument, LeadRecord, LeadStatus } from "@/lib/leads";

const leads: LeadRecord[] = [];

/**
 * Demo-only: in-memory storage. Data resets when the server process restarts
 * (including cold starts on Vercel). No database required.
 */
export function createLeadRecord(
  input: Omit<LeadDocument, "status" | "createdAt" | "updatedAt">
): LeadRecord {
  const now = new Date();
  const record: LeadRecord = {
    id: randomUUID(),
    ...input,
    status: "NEW",
    createdAt: now,
    updatedAt: now,
  };
  leads.push(record);
  return record;
}

export function listLeadRecords(filter?: { status?: LeadStatus }): LeadRecord[] {
  return leads
    .filter((l) => !filter?.status || l.status === filter.status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function updateLeadRecord(
  id: string,
  patch: Partial<Omit<LeadDocument, "createdAt" | "updatedAt">>
): LeadRecord | null {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  const next: LeadRecord = {
    ...leads[idx],
    ...patch,
    updatedAt: new Date(),
  };
  leads[idx] = next;
  return next;
}
