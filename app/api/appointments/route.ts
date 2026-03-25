import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const createAppointmentSchema = z.object({
  patientName: z.string().min(2),
  patientPhone: z.string().min(7),
  patientEmail: z.string().email().optional().or(z.literal("")),
  doctorId: z.string(),
  date: z.string(),
  slot: z.string().min(2),
});

export async function GET() {
  return NextResponse.json(demoStore.appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createAppointmentSchema.parse(body);
    const doctor = demoStore.doctors.find((d) => d.id === payload.doctorId);
    if (!doctor || !doctor.isAvailable) {
      return NextResponse.json(
        { error: "Doctor unavailable for booking" },
        { status: 400 }
      );
    }
    const bookedCount = demoStore.appointments.filter(
      (a) =>
        a.doctorId === payload.doctorId &&
        a.date === payload.date &&
        a.status !== "REJECTED"
    ).length;
    if (bookedCount >= doctor.slotLimit) {
      return NextResponse.json(
        { error: "Slot limit reached for selected doctor/date" },
        { status: 400 }
      );
    }
    const record = {
      id: randomUUID(),
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      patientEmail: payload.patientEmail || undefined,
      doctorId: payload.doctorId,
      date: payload.date,
      slot: payload.slot,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
    };
    demoStore.appointments.unshift(record);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create appointment", detail: String(error) },
      { status: 400 }
    );
  }
}
