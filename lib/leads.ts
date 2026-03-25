import { z } from "zod";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

const optionalEmail = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.string().email().optional()
);

export const leadCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().optional()
  ),
  email: optionalEmail,
  notes: z.string().optional(),
  source: z.string().optional(),
  theme: z.string().optional(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
  theme: z.string().optional(),
});

export type LeadDocument = {
  name: string;
  phone?: string;
  email?: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  theme?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LeadRecord = LeadDocument & { id: string };

export function serializeLead(lead: LeadRecord) {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    status: lead.status,
    notes: lead.notes,
    source: lead.source,
    theme: lead.theme,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}
