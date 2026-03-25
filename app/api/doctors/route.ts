import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const doctorPatchSchema = z.object({
  id: z.string(),
  isAvailable: z.boolean().optional(),
  slotLimit: z.number().int().min(1).max(100).optional(),
});

export async function GET() {
  return NextResponse.json(demoStore.doctors);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const payload = doctorPatchSchema.parse(body);
    const doctor = demoStore.doctors.find((d) => d.id === payload.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    if (typeof payload.isAvailable === "boolean") {
      doctor.isAvailable = payload.isAvailable;
    }
    if (typeof payload.slotLimit === "number") {
      doctor.slotLimit = payload.slotLimit;
    }
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update doctor", detail: String(error) },
      { status: 400 }
    );
  }
}
