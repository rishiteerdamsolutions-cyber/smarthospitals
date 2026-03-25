"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const plans = [
  {
    key: "plan1",
    name: "Plan I - Website Presence Suite",
    price: "₹14,999",
    position: "Visibility",
    features: [
      "Hospital website",
      "Doctor & services listing",
      "Call and WhatsApp integration",
      "Lead capture form",
    ],
  },
  {
    key: "plan2",
    name: "Plan II - Patient Flow Suite",
    price: "₹39,999",
    position: "Control",
    popular: true,
    features: [
      "Everything in Plan I",
      "Admin dashboard",
      "Appointment booking (doctor/date/slot)",
      "Approve, reject, reschedule appointments",
    ],
  },
  {
    key: "plan3",
    name: "Plan III - Hospital Operations Suite",
    price: "₹79,999",
    position: "Full System",
    features: [
      "Everything in Plan II",
      "Inventory and expiry alerts",
      "Prescription workflow (India compliant)",
      "PDF export and print formats",
    ],
  },
];

export function QuotationClient() {
  const params = useSearchParams();
  const theme = params.get("theme");
  const recommended =
    theme === "theme1"
      ? "plan1"
      : theme === "theme2"
        ? "plan2"
        : theme === "theme3"
          ? "plan3"
          : "plan2";

  return (
    <main className="container-xl py-10">
      <h1 className="text-4xl font-semibold">Quotation</h1>
      <p className="mt-3 text-zinc-600">
        Affordable for Tier 2 and Tier 3 hospitals, with Plan II positioned as the most popular choice.
      </p>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.key}
            className={`rounded-2xl border p-6 ${
              plan.popular ? "border-blue-500 shadow-lg" : ""
            } ${recommended === plan.key ? "ring-2 ring-emerald-500" : ""}`}
          >
            <p className="text-sm text-zinc-500">{plan.position}</p>
            <h2 className="mt-1 text-xl font-semibold">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold">{plan.price}</p>
            <p className="text-sm text-zinc-500">One-time</p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f}>- {f}</li>
              ))}
            </ul>
            {plan.popular ? (
              <div className="mt-4 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                Most Popular
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border p-6">
        <h3 className="text-2xl font-semibold">Feature Comparison</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Capability</th>
                <th>Plan I</th>
                <th>Plan II</th>
                <th>Plan III</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Website + doctor listing", "Yes", "Yes", "Yes"],
                ["Admin dashboard", "-", "Yes", "Yes"],
                ["Appointment workflow", "-", "Yes", "Yes"],
                ["Inventory alerts", "-", "-", "Yes"],
                ["Prescription + PDF + print", "-", "-", "Yes"],
              ].map((row) => (
                <tr key={row[0]} className="border-b">
                  <td className="py-2">{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border p-6">
        <h3 className="text-2xl font-semibold">Digital Marketing Add-on</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Basic - ₹9,999/month</h4>
            <p className="mt-2 text-sm">
              Google Business optimization, basic SEO, 4 social posts.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Growth - ₹19,999/month</h4>
            <p className="mt-2 text-sm">
              SEO, Google Ads setup, 8 social posts, lead tracking.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Pro - ₹34,999/month</h4>
            <p className="mt-2 text-sm">
              Full ads management, advanced SEO, landing optimization.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border p-6">
        <h3 className="text-2xl font-semibold">Commercial Terms</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>- 1 year free hosting included</li>
          <li>- Domain billed separately (₹800-₹1500/year)</li>
          <li>- Free updates only for existing features</li>
          <li>- New features are billed separately</li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border p-6">
        <h3 className="text-2xl font-semibold">Choose Presentation Theme</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Theme 1 - Clean Medical</h4>
            <p className="mt-2 text-sm">Trust-first editorial look.</p>
            <Link className="mt-2 inline-block underline" href="/?theme=theme1">
              Preview Theme
            </Link>
          </div>
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Theme 2 - Modern Healthcare</h4>
            <p className="mt-2 text-sm">Structured enterprise operations.</p>
            <Link className="mt-2 inline-block underline" href="/?theme=theme2">
              Preview Theme
            </Link>
          </div>
          <div className="rounded-xl border p-4">
            <h4 className="font-semibold">Theme 3 - Premium Hospital</h4>
            <p className="mt-2 text-sm">Warm modern SaaS style for conversion.</p>
            <Link className="mt-2 inline-block underline" href="/?theme=theme3">
              Preview Theme
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
