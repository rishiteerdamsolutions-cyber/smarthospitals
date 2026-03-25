import { NextResponse } from "next/server";
import {
  LEAD_STATUSES,
  leadCreateSchema,
  serializeLead,
  type LeadStatus,
} from "@/lib/leads";
import { createLeadRecord, listLeadRecords } from "@/lib/leads-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = leadCreateSchema.parse(body);
    const record = createLeadRecord(payload);
    return NextResponse.json(serializeLead(record), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create lead", detail: String(error) },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const filter =
      statusParam && LEAD_STATUSES.includes(statusParam as LeadStatus)
        ? { status: statusParam as LeadStatus }
        : undefined;
    const records = listLeadRecords(filter);
    return NextResponse.json(records.map(serializeLead));
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch leads", detail: String(error) },
      { status: 500 }
    );
  }
}
