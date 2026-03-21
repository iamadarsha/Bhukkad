import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// DEMO: This is a simulated payment endpoint. 
// In a real application, you would integrate with a payment gateway (Stripe, Razorpay, etc.)
// and verify the transaction before updating the order status.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { paymentMethod, amountPaid } = await req.json();

    const [updatedOrder] = await db.update(orders)
      .set({ 
        status: 'paid',
        paidAt: new Date().toISOString(),
      })
      .where(eq(orders.id, id))
      .returning();

    // Free up the table if it was a dine-in order
    if (updatedOrder.tableId) {
      await db.update(tables)
        .set({ status: 'available' })
        .where(eq(tables.id, updatedOrder.tableId));
        
      if ((global as any).io) {
        (global as any).io.to(`outlet:${session.user.outletId}`).emit('table:updated', { 
          tableId: updatedOrder.tableId, 
          status: 'available', 
          currentOrderId: null 
        });
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('[ORDER_PAY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
