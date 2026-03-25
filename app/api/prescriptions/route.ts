import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const prescriptionSchema = z.object({
  doctorName: z.string().min(2),
  qualification: z.string().min(2),
  registrationNumber: z.string().min(2),
  patientName: z.string().min(2),
  patientAge: z.string().min(1),
  patientGender: z.string().min(1),
  diagnosis: z.string().optional(),
  signature: z.string().optional(),
  printSize: z.enum(["A4", "A5", "CUSTOM"]),
  medicines: z.array(
    z.object({
      generic: z.string().min(2),
      brand: z.string().optional(),
      dosage: z.string().min(2),
    })
  ),
});

export async function GET() {
  return NextResponse.json(demoStore.prescriptions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = prescriptionSchema.parse(body);
    const record = {
      id: randomUUID(),
      ...payload,
      medicines: payload.medicines.map((m) => ({
        ...m,
        generic: m.generic.toUpperCase(),
      })),
      createdAt: new Date().toISOString(),
    };
    demoStore.prescriptions.unshift(record);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create prescription", detail: String(error) },
      { status: 400 }
    );
  }
}
