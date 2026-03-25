"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { motion } from "framer-motion";
import {
  CalendarClock,
  ChevronDown,
  ClipboardCheck,
  Pill,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "theme1" | "theme2" | "theme3";

const themeContent: Record<
  Theme,
  {
    emergency: string;
    badges: string[];
    servicesTitle: string;
    services: string[];
    featuresTitle: string;
    features: string[];
    doctorsTitle: string;
    testimonialTitle: string;
    testimonials: string[];
    galleryTitle: string;
    galleryCaptions: string[];
    faq: string[];
    contactTitle: string;
    footerLine: string;
  }
> = {
  theme1: {
    emergency: "Emergency Helpline: +91 98765 43210",
    badges: ["NABH-ready workflow", "Local patient discovery", "Trusted by 500+ hospitals"],
    servicesTitle: "Visibility-first Services",
    services: [
      "Hospital Website Development",
      "Doctor and Service Listing",
      "Google Maps and Call Integration",
      "WhatsApp Lead Capture Flow",
      "Local Search Presence Setup",
      "Trust-building Content Pages",
    ],
    featuresTitle: "Why hospitals choose Theme 1",
    features: [
      "Editorial look that builds patient trust quickly",
      "Fast mobile loading for local discovery",
      "Clear call and booking conversion path",
      "Minimal layout for professional credibility",
    ],
    doctorsTitle: "Doctor Highlights",
    testimonialTitle: "What hospitals report",
    testimonials: [
      "We started receiving direct calls within days of launch.",
      "Patients now find our departments and doctors more easily.",
      "Our brand looks modern and trustworthy on mobile.",
    ],
    galleryTitle: "Facility Glimpses",
    galleryCaptions: ["Reception", "OPD", "Diagnostics", "Patient Support"],
    faq: [
      "Do we need technical knowledge? No, the interface is simple for staff.",
      "Can patients contact directly? Yes, through call and WhatsApp actions.",
      "Is this mobile-optimized? Yes, fully mobile-first.",
      "Can we upgrade to appointment flow later? Yes, without rebuilding.",
      "Does this help local discovery? Yes, that is the core focus of Theme 1.",
    ],
    contactTitle: "Get your hospital visible online",
    footerLine: "Smart Hospitals - Your hospital, now visible to every patient nearby.",
  },
  theme2: {
    emergency: "Critical Care Line: +91 98765 43210",
    badges: ["Multi-department ready", "Structured admin control", "Patients served at scale"],
    servicesTitle: "Operations-focused Services",
    services: [
      "Appointment Workflow Management",
      "Admin and Front-desk Dashboard",
      "Doctor Availability Control",
      "Department-wise Scheduling",
      "Lead to Appointment Tracking",
      "Daily Flow Monitoring",
    ],
    featuresTitle: "Why hospitals choose Theme 2",
    features: [
      "Enterprise layout for organized decision-making",
      "Slot limits, approvals, and rescheduling control",
      "Clear operational visibility for staff",
      "Scales well for multi-specialty environments",
    ],
    doctorsTitle: "Consultant Team Snapshot",
    testimonialTitle: "Operational outcomes",
    testimonials: [
      "Waiting times dropped after slot and approval controls.",
      "Our front desk now tracks every booking with clarity.",
      "Department-level flow became predictable and manageable.",
    ],
    galleryTitle: "Operational Gallery",
    galleryCaptions: ["Front Desk", "Scheduling", "Nursing Station", "Care Coordination"],
    faq: [
      "Can we control appointment timings? Yes, with slot and availability controls.",
      "Can admins reschedule quickly? Yes, directly from the dashboard.",
      "Can multiple departments use it? Yes, this theme is built for that.",
      "Can we monitor daily booking load? Yes, in one interface.",
      "Is this suitable for growing hospitals? Yes, especially Plan II and above.",
    ],
    contactTitle: "Streamline patient flow with one system",
    footerLine: "Smart Hospitals - From reception chaos to operational control.",
  },
  theme3: {
    emergency: "24x7 Care Support: +91 98765 43210",
    badges: ["Full hospital OS mindset", "Modern premium experience", "Plan III ready"],
    servicesTitle: "Complete System Services",
    services: [
      "Unified Admin for Hospital Operations",
      "Appointment and Patient Flow",
      "Inventory and Medicine Alerts",
      "India-compliant Prescription Workflow",
      "Print and PDF Prescription Support",
      "Scalable Modular Architecture",
    ],
    featuresTitle: "Why hospitals choose Theme 3",
    features: [
      "Warm premium style for high-trust conversion",
      "End-to-end workflow from lead to prescription",
      "Single system for front office and clinical ops",
      "Ready to expand with future modules",
    ],
    doctorsTitle: "Clinical Leadership Preview",
    testimonialTitle: "Full-system impact",
    testimonials: [
      "We reduced paperwork and improved care coordination.",
      "Prescription and inventory workflows now feel connected.",
      "Teams adopted the system faster than expected.",
    ],
    galleryTitle: "Smart Hospital Experience",
    galleryCaptions: ["Patient Journey", "Consultation", "Pharmacy", "Digital Operations"],
    faq: [
      "Can this replace manual registers? Yes, that is the objective.",
      "Is prescription output compliant for India? Yes, with required doctor details.",
      "Can we track low stock and expiry? Yes, in the inventory module.",
      "Can we print A4/A5 and export PDF? Yes, both are supported.",
      "Is this future-expandable? Yes, modules are feature-flag based.",
    ],
    contactTitle: "Start your complete hospital digital setup",
    footerLine: "Smart Hospitals - Not just a website, a complete hospital operating system.",
  },
};

const theme2Streams = [
  "https://stream.mux.com/1RdbcBtpEUK6501pc6yaIvwo9UfSnOg02k1uHxat00xR3w.m3u8",
  "https://stream.mux.com/t1TbTB8M1VYHkhxBuap4A8Vm1x015HTHyuQxqchDBago.m3u8",
  "https://stream.mux.com/6yvj9SR5bjmXq9N3ak7gy427RwUs8R2ZoH4ndA7Q1018.m3u8",
];

export default function Home() {
  const [theme, setTheme] = useState<Theme>("theme1");
  const [formStatus, setFormStatus] = useState("");
  const patientCount = useMemo(() => 34000 + new Date().getDate() * 27, []);
  const content = themeContent[theme];
  const sectionTone =
    theme === "theme1"
      ? "bg-white border-zinc-200"
      : theme === "theme2"
        ? "bg-zinc-50 border-zinc-300"
        : "bg-[rgb(var(--background))] border-zinc-300";
  const cardTone =
    theme === "theme1"
      ? "bg-white"
      : theme === "theme2"
        ? "bg-white shadow-sm"
        : "bg-gradient-to-b from-white to-orange-50";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("theme") as Theme | null;
    const fromStorage = localStorage.getItem("hospital_theme") as Theme | null;
    const nextTheme = fromQuery || fromStorage || "theme1";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const onThemeChange = (next: Theme) => {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hospital_theme", next);
  };

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setFormStatus("Submitting...");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "website_home", theme }),
    });
    setFormStatus(res.ok ? "Submitted successfully." : "Unable to submit.");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <div className="bg-white text-zinc-900">
      {theme !== "theme3" ? (
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/95 backdrop-blur">
        <div className="container-xl flex h-16 items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Smart Hospitals</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#services">Services</a>
            <a href="#features">Features</a>
            <a href="#doctors">Doctors</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex gap-2">
            <Button onClick={() => onThemeChange("theme1")} size="sm" variant="outline">T1</Button>
            <Button onClick={() => onThemeChange("theme2")} size="sm" variant="outline">T2</Button>
            <Button onClick={() => onThemeChange("theme3")} size="sm" variant="outline">T3</Button>
            <Link
              href="#contact"
              className={cn(buttonVariants({ variant: "default", size: "default" }))}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </header>
      ) : null}

      {theme === "theme1" && <ThemeOneHero />}
      {theme === "theme2" && <ThemeTwoHero patientCount={patientCount} />}
      {theme === "theme3" && (
        <ThemeThreeHero active={theme} onThemeChange={onThemeChange} />
      )}

      <section className={`container-xl py-10`}>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {content.emergency}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {content.badges.map((badge) => (
            <span key={badge} className="rounded-full border px-3 py-1">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section
        className={`container-xl py-12 ${
          theme === "theme1"
            ? "max-w-[920px]"
            : theme === "theme2"
              ? ""
              : "max-w-7xl"
        }`}
        id="services"
      >
        <h2
          className={`font-semibold ${
            theme === "theme1"
              ? "text-4xl tracking-tight"
              : theme === "theme2"
                ? "text-3xl font-[var(--font-poppins)]"
                : "text-4xl"
          }`}
        >
          {content.servicesTitle}
        </h2>
        <div className="mt-2 text-sm text-zinc-600">
          {theme === "theme1"
            ? "Built for visibility, patient trust, and local call conversions."
            : theme === "theme2"
              ? "Built for flow control across departments and front-desk teams."
              : "Built as a complete operations layer for modern hospitals."}
        </div>
        <div
          className={
            theme === "theme1"
              ? "mt-8 space-y-4"
              : "mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {content.services.map((item, i) => (
            <article
              key={item}
              className={`rounded-xl border p-5 ${sectionTone} ${cardTone} ${
                theme === "theme1" ? "border-l-4 border-l-zinc-900 pl-6" : ""
              } ${theme === "theme2" ? "relative overflow-hidden" : ""} ${
                theme === "theme3"
                  ? "shadow-[0_12px_40px_-18px_rgba(249,115,22,0.35)]"
                  : ""
              }`}
            >
              {theme === "theme2" ? (
                <span className="absolute right-3 top-3 text-xs font-semibold text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <p className="font-medium">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-xl py-12" id="features">
        <h2
          className={`font-semibold ${
            theme === "theme1"
              ? "text-4xl tracking-tight"
              : theme === "theme2"
                ? "text-3xl font-[var(--font-poppins)]"
                : "text-4xl"
          }`}
        >
          {content.featuresTitle}
        </h2>
        {theme === "theme2" ? (
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            A structured module map for hospital teams: booking control, pharmacy safety,
            compliant documentation, and modular upgrades without rework.
          </p>
        ) : null}
        <div
          className={
            theme === "theme3"
              ? "mt-8 rounded-3xl border border-orange-200/80 bg-gradient-to-br from-white via-white to-orange-50/60 p-6 md:p-10"
              : ""
          }
        >
          <div
            className={`grid gap-4 ${
              theme === "theme2"
                ? "md:grid-cols-2 md:gap-x-10 md:gap-y-6"
                : "md:grid-cols-2"
            }`}
          >
            {[
              {
                icon: CalendarClock,
                title: "Appointment Intelligence",
                body: "Slot-based booking with approvals, rescheduling, and doctor availability control.",
              },
              {
                icon: Pill,
                title: "Inventory and Medicine Alerts",
                body: "Low-stock and expiry warnings help pharmacy teams avoid critical gaps.",
              },
              {
                icon: ClipboardCheck,
                title: "India-compliant Prescriptions",
                body: "Doctor registration, patient details, print preview, and PDF export included.",
              },
              {
                icon: ShieldCheck,
                title: "Modular Growth by Plan",
                body: "Start from website-only and unlock appointments, inventory, and prescriptions as you scale.",
              },
            ].map(({ icon: Icon, title, body }, idx) => (
              <article
                key={title}
                className={`rounded-2xl border p-5 ${cardTone} ${
                  theme === "theme2"
                    ? "md:border-l-4 md:border-l-zinc-900 md:pl-6"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {theme === "theme2" ? (
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      {idx + 1}
                    </span>
                  ) : (
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <div className="font-medium">{title}</div>
                    <p className="mt-2 text-sm text-zinc-600">{body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <ul
          className={`mt-6 grid gap-3 ${
            theme === "theme1" ? "md:grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {content.features.map((feature) => (
            <li key={feature} className={`rounded-xl border p-4 ${sectionTone}`}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-xl py-12" id="doctors">
        <h2 className="text-3xl font-semibold">{content.doctorsTitle}</h2>
        <div
          className={`mt-6 grid gap-4 ${
            theme === "theme3" ? "md:grid-cols-3" : "md:grid-cols-3"
          }`}
        >
          {["Dr. Ananya Rao - Cardiology","Dr. Vikram Saini - Orthopedics","Dr. Neha Kulkarni - Pediatrics"].map((doc) => (
            <article
              key={doc}
              className={`rounded-xl border p-5 ${cardTone} ${
                theme === "theme3" ? "text-center md:text-left" : ""
              }`}
            >
              {doc}
            </article>
          ))}
        </div>
      </section>

      <section className="container-xl py-12">
        <h2 className="text-3xl font-semibold">{content.testimonialTitle}</h2>
        <div
          className={`mt-6 grid gap-4 ${
            theme === "theme1"
              ? "md:grid-cols-1"
              : theme === "theme2"
                ? "md:grid-cols-3"
                : "md:grid-cols-3"
          }`}
        >
          {content.testimonials.map((t) => (
            <blockquote
              key={t}
              className={`rounded-xl border p-5 text-zinc-700 ${cardTone} ${
                theme === "theme1" ? "text-lg leading-relaxed" : ""
              }`}
            >
              {t}
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container-xl py-12">
        <h2 className="text-3xl font-semibold">{content.galleryTitle}</h2>
        <div
          className={`mt-6 grid gap-4 ${
            theme === "theme1"
              ? "grid-cols-2 md:grid-cols-4"
              : theme === "theme2"
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {content.galleryCaptions.map((g) => (
            <div
              key={g}
              className={`h-32 rounded-xl border p-3 text-sm text-zinc-600 flex items-end ${cardTone} ${
                theme === "theme2" ? "rounded-[1.25rem] md:rounded-[1.5rem]" : ""
              } ${theme === "theme3" ? "font-medium" : ""}`}
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      <section className="container-xl py-12" id="faq">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div
          className={`mt-6 ${
            theme === "theme2"
              ? "space-y-3 md:columns-2 md:gap-6"
              : "space-y-3"
          }`}
        >
          {content.faq.map((f) => (
            <div key={f} className={`rounded-xl border p-4 ${sectionTone} break-inside-avoid`}>
              {f}
            </div>
          ))}
        </div>
      </section>

      <section className="container-xl py-12" id="contact">
        <h2 className="text-3xl font-semibold">{content.contactTitle}</h2>
        <form className="mt-6 grid gap-3 md:max-w-xl" onSubmit={submitLead}>
          <input className="rounded-lg border p-3" name="name" placeholder="Hospital contact person" required />
          <input className="rounded-lg border p-3" name="phone" placeholder="Phone number" required />
          <input className="rounded-lg border p-3" name="email" placeholder="Email (optional)" />
          <textarea className="rounded-lg border p-3" name="notes" placeholder="Tell us your requirement" />
          <Button type="submit">Book Appointment</Button>
          <p className="text-sm text-zinc-600">{formStatus}</p>
        </form>
      </section>

      <footer className="mt-12 border-t py-10">
        <div className="container-xl flex flex-col gap-2 text-sm text-zinc-600">
          <p>{content.footerLine}</p>
          <div className="flex gap-4">
            <Link href="/quotation">Quotation</Link>
            <Link href="/crm">CRM</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ThemeOneHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover [transform:scaleY(-1)] absolute inset-0">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      <div className="relative container-xl pt-[290px] pb-24 flex flex-col gap-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[48px] md:text-[80px] leading-[1.05] tracking-[-0.04em] font-medium max-w-4xl">
          Simple patient <span className="font-serif italic text-[64px] md:text-[100px]">management</span> for modern hospitals
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-[554px] text-[18px] text-[#373a46]/80">
          Build trust, capture leads, and organize daily care operations from one premium hospital platform.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl">
          <div className="rounded-[40px] bg-[#fcfcfc] p-2 pl-4 border shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)] flex items-center gap-2">
            <input className="flex-1 outline-none bg-transparent" placeholder="Enter phone number" />
            <button className="rounded-[30px] px-6 py-3 text-white bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]">Start Digital Setup</button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span>500+ Hospitals Trust Our System</span>
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ThemeTwoHero({ patientCount }: { patientCount: number }) {
  const ref0 = useRef<HTMLVideoElement>(null);
  const ref1 = useRef<HTMLVideoElement>(null);
  const ref2 = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const refs = [ref0, ref1, ref2];
    refs.forEach((ref, i) => {
      const video = ref.current;
      if (!video) return;
      const src = theme2Streams[i];
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    });
  }, []);
  return (
    <section className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden bg-white">
      <div className="px-5 lg:px-16 pb-8 lg:pb-[82px] flex-1">
        <div className="grid lg:grid-cols-2 items-stretch gap-8 h-full pt-8">
          <div className="flex flex-col justify-between fade-up">
            <div>
              <h1 className="font-[var(--font-poppins)] text-[2rem] sm:text-5xl lg:text-[3.5rem] xl:text-7xl leading-[1.08] tracking-tight">
                Advanced care systems that empower hospitals
              </h1>
              <div className="pt-6 flex items-center gap-4">
                <Button>Book Appointment</Button>
                <a className="underline" href="#contact">Call Now</a>
              </div>
            </div>
            <div className="hidden lg:block text-sm max-w-md text-zinc-700">
              Structured workflows for multi-department care with appointment and admin clarity.
            </div>
          </div>
          <div className="flex flex-col gap-4 fade-up [animation-delay:150ms]">
            <article className="rounded-[1.5rem] lg:rounded-[2.5rem] bg-black p-6 text-white relative overflow-hidden flex-1 min-h-[200px]">
              <video ref={ref0} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl">Ready to digitize your hospital operations?</h3>
                <p className="mt-3 text-white/85">Move from manual coordination to real-time operational control.</p>
              </div>
            </article>
            <div className="grid grid-cols-2 gap-3 lg:gap-4 flex-1">
              <article className="rounded-[1.5rem] lg:rounded-[2.5rem] bg-black p-5 lg:p-8 min-h-[180px] text-white relative overflow-hidden">
                <video ref={ref1} autoPlay muted loop playsInline preload="auto" className="absolute top-1/2 left-1/2 w-[150%] h-[150%] object-cover -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="relative z-10">
                  <p className="text-sm">multi-department care</p>
                </div>
              </article>
              <article className="rounded-[1.5rem] lg:rounded-[2.5rem] bg-black p-5 lg:p-8 min-h-[180px] text-white relative overflow-hidden">
                <video ref={ref2} autoPlay muted loop playsInline preload="auto" className="absolute top-1/2 left-1/2 w-[280%] h-[280%] object-cover -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="relative z-10">
                  <p className="text-5xl font-semibold">{patientCount.toLocaleString()}</p>
                  <p className="text-sm">patients served</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThemeThreeHero({
  active,
  onThemeChange,
}: {
  active: Theme;
  onThemeChange: (next: Theme) => void;
}) {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <div className="px-6 lg:px-8 pt-4">
        <nav className="max-w-7xl mx-auto bg-[rgb(var(--nav))] rounded-xl shadow-sm px-4 py-4 sm:px-8 sm:py-5 flex flex-wrap items-center justify-between gap-3">
          <a className="text-2xl font-bold tracking-tight flex items-center gap-3" href="#">
            <span className="w-7 h-7 rounded-full bg-foreground inline-flex items-center justify-center">
              <span className="w-3 h-3 bg-white rounded-sm" />
            </span>
            Smart Hospitals
          </a>
          <div className="hidden md:flex gap-6 text-base font-medium text-zinc-800/80">
            <a className="inline-flex items-center gap-1 hover:text-foreground" href="#services">
              Services <ChevronDown className="h-3.5 w-3.5" />
            </a>
            <a className="inline-flex items-center gap-1 hover:text-foreground" href="#features">
              About <ChevronDown className="h-3.5 w-3.5" />
            </a>
            <Link className="hover:text-foreground" href="/quotation">
              Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/80 p-1">
              {(["theme1", "theme2", "theme3"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={active === t ? "default" : "outline"}
                  className={cn(
                    "min-w-9 px-2",
                    active === t ? "bg-foreground text-background" : ""
                  )}
                  onClick={() => onThemeChange(t)}
                >
                  {t === "theme1" ? "T1" : t === "theme2" ? "T2" : "T3"}
                </Button>
              ))}
            </div>
            <a className="hidden sm:inline text-zinc-800/80 hover:text-foreground" href="tel:+919876543210">
              Call Now
            </a>
            <Link href="#contact">
              <Button variant="hero" size="default" type="button">
                Book Appointment
              </Button>
            </Link>
          </div>
        </nav>
      </div>
      <section className="bg-[rgb(var(--background))] min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center w-full relative z-10">
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]">
              Simplify hospital operations and patient care
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[rgb(var(--muted-foreground))] max-w-xl leading-relaxed">
              Manage appointments, departments, inventory, and prescriptions with one connected hospital system.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="#contact">
                <Button variant="hero" size="xl" type="button">
                  Book Appointment
                </Button>
              </Link>
              <Link
                href="#contact"
                className={cn(buttonVariants({ variant: "hero-outline", size: "xl" }))}
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <video className="w-full h-full object-cover rounded-bl-2xl" autoPlay loop muted playsInline>
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_192508_4eecde4c-f835-4f4b-b255-eafd1156da99.mp4" />
          </video>
        </div>
      </section>
    </div>
  );
}
