"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { hasFeature } from "@/lib/feature-flags";
import { parsePlan } from "@/lib/plan";

type Medicine = { generic: string; brand: string; dosage: string };

export default function AdminPrescriptionsPage() {
  const [plan, setPlan] = useState(parsePlan(undefined));
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get("plan") || undefined;
    setPlan(parsePlan(qp));
  }, []);
  const enabled = hasFeature(plan, "prescriptions");
  const [doctor, setDoctor] = useState({
    name: "Dr. Ananya Rao",
    qualification: "MD Medicine",
    registration: "KMC-112233",
  });
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [signature, setSignature] = useState("");
  const [meds, setMeds] = useState<Medicine[]>([{ generic: "", brand: "", dosage: "" }]);
  const [paper, setPaper] = useState<"A4" | "A5" | "CUSTOM">("A4");
  const [template, setTemplate] = useState("General Care");
  const [history, setHistory] = useState<Array<{ id: string; patientName: string; createdAt: string }>>([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetch("/api/prescriptions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) =>
        setHistory(
          data.map((x: { id: string; patientName: string; createdAt: string }) => ({
            id: x.id,
            patientName: x.patientName,
            createdAt: x.createdAt,
          }))
        )
      );
  }, []);

  const preview = useMemo(
    () =>
      meds
        .map((m) => `${m.generic.toUpperCase()} ${m.brand ? `(${m.brand})` : ""} - ${m.dosage}`)
        .join("\n"),
    [meds]
  );

  function exportPdf() {
    const format = paper === "CUSTOM" ? [210, 140] : paper.toLowerCase();
    const pdf = new jsPDF({ format: format as "a4" | "a5" | number[] });
    pdf.setFontSize(14);
    pdf.text(`${doctor.name} | ${doctor.qualification} | ${doctor.registration}`, 10, 15);
    pdf.text(`Patient: ${patient.name} | Age: ${patient.age} | Gender: ${patient.gender}`, 10, 30);
    pdf.text(`Date: ${patient.date}`, 10, 40);
    pdf.text(`Diagnosis: ${diagnosis || "NA"}`, 10, 50);
    pdf.text("Medicines:", 10, 55);
    pdf.text(preview || "No medicines added", 10, 65);
    pdf.save("prescription.pdf");
  }

  async function savePrescription() {
    setStatusMsg("Saving...");
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorName: doctor.name,
        qualification: doctor.qualification,
        registrationNumber: doctor.registration,
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        diagnosis,
        signature,
        printSize: paper,
        medicines: meds,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setHistory((prev) => [{ id: data.id, patientName: data.patientName, createdAt: data.createdAt }, ...prev]);
      setStatusMsg("Saved successfully.");
    } else {
      setStatusMsg("Unable to save prescription.");
    }
  }

  return (
    <main className="container-xl py-10">
      <h1 className="text-3xl font-semibold">Prescription System (Plan III)</h1>
      <p className="mt-2 text-zinc-600">India-compliant details, templates, print preview, and PDF export.</p>
      {!enabled ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
          Prescription module is available in Plan III.
        </p>
      ) : null}
      {!enabled ? null : (
        <>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <input className="rounded border p-2" value={doctor.name} onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} placeholder="Doctor name" />
        <input className="rounded border p-2" value={doctor.qualification} onChange={(e) => setDoctor({ ...doctor, qualification: e.target.value })} placeholder="Qualification" />
        <input className="rounded border p-2" value={doctor.registration} onChange={(e) => setDoctor({ ...doctor, registration: e.target.value })} placeholder="Registration number" />
        <input className="rounded border p-2" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} placeholder="Patient name" />
        <input className="rounded border p-2" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} placeholder="Age" />
        <input className="rounded border p-2" value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} placeholder="Gender" />
        <input className="rounded border p-2 md:col-span-3" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
        <input className="rounded border p-2 md:col-span-3" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Digital signature (name/text)" />
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Medicines</h2>
          <button className="rounded bg-zinc-900 px-3 py-1 text-white" onClick={() => setMeds((p) => [...p, { generic: "", brand: "", dosage: "" }])}>Add</button>
        </div>
        <div className="mt-3 space-y-2">
          {meds.map((med, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-3">
              <input className="rounded border p-2" value={med.generic} onChange={(e) => setMeds((p) => p.map((x, idx) => idx === i ? { ...x, generic: e.target.value.toUpperCase() } : x))} placeholder="Generic name (AUTO UPPERCASE)" />
              <input className="rounded border p-2" value={med.brand} onChange={(e) => setMeds((p) => p.map((x, idx) => idx === i ? { ...x, brand: e.target.value } : x))} placeholder="Brand (optional)" />
              <input className="rounded border p-2" value={med.dosage} onChange={(e) => setMeds((p) => p.map((x, idx) => idx === i ? { ...x, dosage: e.target.value } : x))} placeholder="Dosage" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Print and Export</h2>
        <div className="mt-2 flex items-center gap-3">
          <label>Template:</label>
          <select className="rounded border p-1" value={template} onChange={(e) => setTemplate(e.target.value)}>
            <option>General Care</option>
            <option>Pediatric Follow-up</option>
            <option>Chronic Care</option>
          </select>
          <label>Print size:</label>
          <select className="rounded border p-1" value={paper} onChange={(e) => setPaper(e.target.value as "A4" | "A5" | "CUSTOM")}>
            <option>A4</option>
            <option>A5</option>
            <option value="CUSTOM">Custom</option>
          </select>
          <button className="rounded bg-zinc-900 px-3 py-1 text-white" onClick={savePrescription}>Save</button>
          <button className="rounded bg-zinc-900 px-3 py-1 text-white" onClick={exportPdf}>PDF Export</button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap rounded bg-zinc-50 p-3 text-sm">{preview || "Preview will appear here"}</pre>
        <p className="mt-2 text-xs text-zinc-500">Selected print mode: {paper}</p>
        <p className="mt-1 text-xs text-zinc-500">Selected template: {template}</p>
        <p className="mt-1 text-xs text-zinc-500">{statusMsg}</p>
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Recent Prescriptions</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {history.map((x) => (
            <li key={x.id} className="rounded border p-2">
              {x.patientName} - {new Date(x.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
        </>
      )}
    </main>
  );
}
