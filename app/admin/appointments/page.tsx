"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { hasFeature } from "@/lib/feature-flags";
import { parsePlan } from "@/lib/plan";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  isAvailable: boolean;
  slotLimit: number;
};

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  date: string;
  slot: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED";
  notes?: string;
};

export default function AdminAppointmentsPage() {
  const [plan, setPlan] = useState(parsePlan(undefined));
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get("plan") || undefined;
    setPlan(parsePlan(qp));
  }, []);
  const enabled = hasFeature(plan, "appointments");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    slot: "",
  });

  const loadData = useCallback(async () => {
    const [doctorRes, appointmentRes] = await Promise.all([
      fetch("/api/doctors", { cache: "no-store" }),
      fetch("/api/appointments", { cache: "no-store" }),
    ]);
    if (doctorRes.ok) {
      const d = await doctorRes.json();
      setDoctors(d);
      setForm((prev) => ({ ...prev, doctorId: prev.doctorId || d[0]?.id || "" }));
    }
    if (appointmentRes.ok) {
      setAppointments(await appointmentRes.json());
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((d) => [d.id, d])),
    [doctors]
  );

  async function updateDoctor(id: string, patch: Partial<Doctor>) {
    await fetch("/api/doctors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    loadData();
  }

  async function updateAppointment(id: string, patch: Partial<Appointment>) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    loadData();
  }

  return (
    <main className="container-xl py-10">
      <h1 className="text-3xl font-semibold">Appointment System (Plan II+)</h1>
      <p className="mt-2 text-zinc-600">
        Patient flow: select doctor, date, slot, then submit. Admin controls approvals, rescheduling, slot limits, and availability.
      </p>
      {!enabled ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
          Appointment module is available in Plan II and Plan III.
        </p>
      ) : null}
      {!enabled ? null : (
        <>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Doctor Availability and Slot Limits</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-lg border p-3">
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm text-zinc-600">{doc.specialization}</p>
              <div className="mt-2 flex items-center gap-3">
                <label className="text-sm">Available</label>
                <input
                  type="checkbox"
                  checked={doc.isAvailable}
                  onChange={(e) =>
                    updateDoctor(doc.id, { isAvailable: e.target.checked })
                  }
                />
                <label className="text-sm">Slot limit</label>
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded border p-1"
                  value={doc.slotLimit}
                  onChange={(e) =>
                    updateDoctor(doc.id, { slotLimit: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <form
        className="mt-6 grid gap-3 md:max-w-2xl md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setStatusMsg("Submitting...");
          const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (res.ok) {
            setStatusMsg("Appointment created.");
            setForm((f) => ({
              ...f,
              patientName: "",
              patientPhone: "",
              date: "",
              slot: "",
            }));
            loadData();
          } else {
            const err = await res.json();
            setStatusMsg(err.error || "Unable to create appointment.");
          }
        }}
      >
        <input
          className="rounded-md border p-2"
          placeholder="Patient name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          required
        />
        <input
          className="rounded-md border p-2"
          placeholder="Patient phone"
          value={form.patientPhone}
          onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
          required
        />
        <select
          className="rounded-md border p-2"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        >
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="rounded-md border p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          className="rounded-md border p-2"
          placeholder="Slot e.g. 11:30 AM"
          value={form.slot}
          onChange={(e) => setForm({ ...form, slot: e.target.value })}
          required
        />
        <button className="rounded-md bg-zinc-900 px-4 py-2 text-white md:col-span-2">
          Submit Appointment
        </button>
        <p className="text-sm text-zinc-600 md:col-span-2">{statusMsg}</p>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Patient</th><th>Doctor</th><th>Date</th><th>Slot</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="py-2">{a.patientName}</td>
                <td>{doctorMap[a.doctorId]?.name || "Unknown Doctor"}</td>
                <td>{a.date}</td>
                <td>{a.slot}</td>
                <td>{a.status}</td>
                <td>
                  <select
                    className="rounded border p-1"
                    value={a.status}
                    onChange={(e) => updateAppointment(a.id, { status: e.target.value as Appointment["status"] })}
                  >
                    {["PENDING", "CONFIRMED", "REJECTED", "COMPLETED"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button
                    className="ml-2 rounded border px-2 py-1"
                    onClick={() => {
                      const date = window.prompt("New date (YYYY-MM-DD)", a.date);
                      const slot = window.prompt("New slot", a.slot);
                      if (date && slot) updateAppointment(a.id, { date, slot });
                    }}
                  >
                    Reschedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </main>
  );
}
