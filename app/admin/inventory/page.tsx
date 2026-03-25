"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { hasFeature } from "@/lib/feature-flags";
import { parsePlan } from "@/lib/plan";

type Item = {
  id: string;
  medicineName: string;
  genericName: string;
  quantity: number;
  lowStockAt: number;
  expiryDate: string;
  supplierName: string;
  supplierPhone?: string;
};

export default function AdminInventoryPage() {
  const [plan, setPlan] = useState(parsePlan(undefined));
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get("plan") || undefined;
    setPlan(parsePlan(qp));
  }, []);
  const enabled = hasFeature(plan, "inventory");
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({
    medicineName: "",
    genericName: "",
    quantity: 0,
    lowStockAt: 10,
    expiryDate: "",
    supplierName: "",
    supplierPhone: "",
  });

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/inventory", { cache: "no-store" });
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const alerts = useMemo(() => {
    const now = Date.now();
    return items.map((item) => {
      const low = item.quantity <= item.lowStockAt;
      const expirySoon =
        new Date(item.expiryDate).getTime() - now < 1000 * 60 * 60 * 24 * 45;
      return { id: item.id, low, expirySoon };
    });
  }, [items]);

  async function updateItem(id: string, patch: Partial<Item>) {
    await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    loadItems();
  }

  return (
    <main className="container-xl py-10">
      <h1 className="text-3xl font-semibold">Inventory System (Plan III)</h1>
      <p className="mt-2 text-zinc-600">Medicine tracking with low stock and expiry alerts.</p>
      {!enabled ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
          Inventory module is available in Plan III.
        </p>
      ) : null}
      {!enabled ? null : (
        <>
      <form
        className="mt-4 grid gap-2 rounded-xl border p-4 md:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          setForm({
            medicineName: "",
            genericName: "",
            quantity: 0,
            lowStockAt: 10,
            expiryDate: "",
            supplierName: "",
            supplierPhone: "",
          });
          loadItems();
        }}
      >
        <input className="rounded border p-2" placeholder="Medicine name" value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} required />
        <input className="rounded border p-2" placeholder="Generic name" value={form.genericName} onChange={(e) => setForm({ ...form, genericName: e.target.value.toUpperCase() })} required />
        <input className="rounded border p-2" type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
        <input className="rounded border p-2" type="number" placeholder="Low stock threshold" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: Number(e.target.value) })} required />
        <input className="rounded border p-2" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
        <input className="rounded border p-2" placeholder="Supplier name" value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} required />
        <input className="rounded border p-2" placeholder="Supplier phone" value={form.supplierPhone} onChange={(e) => setForm({ ...form, supplierPhone: e.target.value })} />
        <button className="rounded bg-zinc-900 px-3 py-2 text-white">Add Item</button>
      </form>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Medicine</th><th>Generic</th><th>Qty</th><th>Expiry</th><th>Supplier</th><th>Alerts</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const alert = alerts.find((a) => a.id === item.id)!;
              return (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.medicineName}</td>
                  <td>{item.genericName}</td>
                  <td>
                    <input
                      className="w-20 rounded border p-1"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td>{item.expiryDate}</td>
                  <td>{item.supplierName}</td>
                  <td>{alert.low ? "Low stock" : ""} {alert.expirySoon ? "Expiry soon" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        </>
      )}
    </main>
  );
}
