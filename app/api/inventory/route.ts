import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const inventoryCreateSchema = z.object({
  medicineName: z.string().min(2),
  genericName: z.string().min(2),
  quantity: z.number().int().min(0),
  lowStockAt: z.number().int().min(1),
  expiryDate: z.string(),
  supplierName: z.string().min(2),
  supplierPhone: z.string().optional(),
});

export async function GET() {
  return NextResponse.json(demoStore.inventory);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = inventoryCreateSchema.parse(body);
    const item = { id: randomUUID(), ...payload, genericName: payload.genericName.toUpperCase() };
    demoStore.inventory.unshift(item);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create inventory item", detail: String(error) },
      { status: 400 }
    );
  }
}
