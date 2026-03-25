"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  notes?: string;
  source?: string;
  theme?: string;
  createdAt: string;
};

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = useCallback(async () => {
    const query = statusFilter === "ALL" ? "" : `?status=${statusFilter}`;
    const res = await fetch(`/api/leads${query}`, { cache: "no-store" });
    if (res.ok) setLeads(await res.json());
  }, [statusFilter]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = useMemo(() => leads, [leads]);

  async function updateLead(id: string, patch: Partial<Lead>) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  return (
    <main className="container-xl py-10">
      <h1 className="text-4xl font-semibold">CRM Dashboard</h1>
      <div className="mt-4 flex items-center gap-3">
        <label>Status Filter</label>
        <select className="rounded-md border p-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["ALL", "NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Name</th>
              <th>Phone / Email</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Source / Theme</th>
              <th>Created Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b align-top">
                <td className="py-2">{lead.name}</td>
                <td>{lead.phone || lead.email}</td>
                <td>
                  <select
                    className="rounded-md border p-1"
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value as Lead["status"] })}
                  >
                    {["NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="w-full rounded-md border p-1"
                    defaultValue={lead.notes}
                    onBlur={(e) => updateLead(lead.id, { notes: e.target.value })}
                  />
                </td>
                <td>{lead.source} / {lead.theme}</td>
                <td>{new Date(lead.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
