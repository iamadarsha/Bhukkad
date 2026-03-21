import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventoryItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const items = await db.query.inventoryItems.findMany({
      where: eq(inventoryItems.outletId, session.user.outletId),
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[INVENTORY_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, sku, category, unit, currentStock, minimumStock, costPerUnit } = body;

    const [item] = await db.insert(inventoryItems).values({
      id: `inv-${Date.now()}`,
      outletId: session.user.outletId,
      name,
      sku,
      category,
      unit,
      currentStock: currentStock || 0,
      minimumStock: minimumStock || 0,
      costPerUnit: costPerUnit || 0,
    }).returning();

    return NextResponse.json(item);
  } catch (error) {
    console.error('[INVENTORY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
