import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventoryItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, unit, currentStock, minThreshold, costPerUnit, supplierId } = body;

    const [updatedItem] = await db.update(inventoryItems)
      .set({ name, unit, currentStock, minThreshold, costPerUnit, supplierId })
      .where(eq(inventoryItems.id, id))
      .returning();

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('[INVENTORY_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[INVENTORY_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
