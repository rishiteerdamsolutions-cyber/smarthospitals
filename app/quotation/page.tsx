import { Suspense } from "react";
import { QuotationClient } from "./quotation-client";

export default function QuotationPage() {
  return (
    <Suspense
      fallback={
        <main className="container-xl py-10 text-sm text-zinc-600">Loading quotation…</main>
      }
    >
      <QuotationClient />
    </Suspense>
  );
}
