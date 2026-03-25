import { NextResponse } from "next/server";
import { leadUpdateSchema, serializeLead } from "@/lib/leads";
import { updateLeadRecord } from "@/lib/leads-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
    }
    const body = await request.json();
    const payload = leadUpdateSchema.parse(body);
    const updated = updateLeadRecord(id, payload);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(serializeLead(updated));
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update lead", detail: String(error) },
      { status: 400 }
    );
  }
}
