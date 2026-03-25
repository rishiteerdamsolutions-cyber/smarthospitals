import Link from "next/link";
import { hasFeature } from "@/lib/feature-flags";
import { parsePlan } from "@/lib/plan";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planParam } = await searchParams;
  const plan = parsePlan(planParam);
  return (
    <main className="container-xl py-10">
      <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
      <p className="mt-3 text-zinc-600">
        Centralized control for appointments, inventory, and prescriptions.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Active plan: <span className="font-medium uppercase">{plan}</span>
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link className="rounded-xl border p-5 hover:bg-zinc-50" href={`/admin/appointments?plan=${plan}`}>
          Appointments
        </Link>
        <Link
          className={`rounded-xl border p-5 ${
            hasFeature(plan, "inventory")
              ? "hover:bg-zinc-50"
              : "pointer-events-none opacity-40"
          }`}
          href={`/admin/inventory?plan=${plan}`}
        >
          Inventory
        </Link>
        <Link
          className={`rounded-xl border p-5 ${
            hasFeature(plan, "prescriptions")
              ? "hover:bg-zinc-50"
              : "pointer-events-none opacity-40"
          }`}
          href={`/admin/prescriptions?plan=${plan}`}
        >
          Prescriptions
        </Link>
      </div>
    </main>
  );
}
