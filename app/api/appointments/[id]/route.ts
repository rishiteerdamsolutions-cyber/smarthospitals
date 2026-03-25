import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const appointmentPatchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "COMPLETED"]).optional(),
  date: z.string().optional(),
  slot: z.string().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = appointmentPatchSchema.parse(body);
    const item = demoStore.appointments.find((a) => a.id === id);
    if (!item) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    Object.assign(item, payload);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update appointment", detail: String(error) },
      { status: 400 }
    );
  }
}
