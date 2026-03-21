import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, tables, kots, kotItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const activeOrders = await db.query.orders.findMany({
      where: eq(orders.outletId, session.user.outletId),
      with: {
        items: true,
      },
    });

    return NextResponse.json(activeOrders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { tableId, orderType, paxCount, items, specialInstructions, subtotal, taxAmount, totalAmount } = body;

    const orderId = `order-${Date.now()}`;
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const [order] = await db.insert(orders).values({
      id: orderId,
      outletId: session.user.outletId,
      tableId,
      waiterId: session.user.id,
      orderNumber,
      orderType,
      paxCount,
      subtotal,
      taxAmount,
      totalAmount,
      specialInstructions,
      status: 'active',
    }).returning();

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemTotal: item.itemTotal,
        modifierSummary: item.modifiers,
      }));
      await db.insert(orderItems).values(itemsToInsert);

      // Create KOT
      const kotId = `kot-${Date.now()}`;
      const kotNumber = `KOT-${Math.floor(100 + Math.random() * 900)}`;
      await db.insert(kots).values({
        id: kotId,
        orderId,
        kotNumber,
        status: 'pending',
      });

      const kotItemsToInsert = itemsToInsert.map((item: any) => ({
        id: `ki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        kotId,
        orderItemId: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        modifiers: item.modifierSummary,
        status: 'pending',
      }));
      await db.insert(kotItems).values(kotItemsToInsert);

      // Emit socket event for new KOT
      if ((global as any).io) {
        (global as any).io.to(`kitchen:${session.user.outletId}`).emit('kot:new', {
          id: kotId,
          orderId,
          kotNumber,
          status: 'pending',
          items: kotItemsToInsert,
          table: tableId ? { name: `Table ${tableId}` } : null,
          orderType,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (tableId) {
      await db.update(tables).set({ status: 'occupied' }).where(eq(tables.id, tableId));
      
      // Emit socket event if io is available
      if ((global as any).io) {
        (global as any).io.to(`outlet:${session.user.outletId}`).emit('table:updated', { tableId, status: 'occupied', currentOrderId: orderId });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
