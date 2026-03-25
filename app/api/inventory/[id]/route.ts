import { NextResponse } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/demo-store";

const inventoryPatchSchema = z.object({
  quantity: z.number().int().min(0).optional(),
  lowStockAt: z.number().int().min(1).optional(),
  expiryDate: z.string().optional(),
  supplierName: z.string().optional(),
  supplierPhone: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = inventoryPatchSchema.parse(body);
    const item = demoStore.inventory.find((m) => m.id === id);
    if (!item) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }
    Object.assign(item, payload);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update inventory item", detail: String(error) },
      { status: 400 }
    );
  }
}
