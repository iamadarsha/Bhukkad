import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { db } from '@/db';
import { orders, payments, paymentSplits, tables } from '@/db/schema';
import { auth } from '@/lib/auth';

const PAYMENT_METHODS = new Set(['cash', 'card', 'upi', 'wallet', 'complimentary']);

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const normalizeOptionalText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toSafeNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session) return new NextResponse('Unauthorized', { status: 401 });
    if (!session.user.outletId) {
      return new NextResponse('User is not assigned to an outlet', { status: 403 });
    }

    const existingOrder = await db.query.orders.findFirst({
      where: and(eq(orders.id, id), eq(orders.outletId, session.user.outletId)),
    });

    if (!existingOrder) {
      return new NextResponse('Order not found', { status: 404 });
    }

    if (existingOrder.status === 'paid') {
      return NextResponse.json({ error: 'This order has already been paid.' }, { status: 409 });
    }

    if (existingOrder.status === 'cancelled' || existingOrder.status === 'void') {
      return NextResponse.json(
        { error: `Cannot collect payment for a ${existingOrder.status} order.` },
        { status: 409 }
      );
    }

    const body = await req.json();
    const paymentMethod = normalizeOptionalText(body?.paymentMethod) ?? 'cash';

    if (!PAYMENT_METHODS.has(paymentMethod)) {
      return NextResponse.json({ error: 'Unsupported payment method.' }, { status: 400 });
    }

    const amountDue = roundCurrency(Number(existingOrder.totalAmount ?? 0));
    const amountPaid =
      paymentMethod === 'complimentary'
        ? 0
        : roundCurrency(Math.max(0, toSafeNumber(body?.amountPaid, amountDue)));

    if (paymentMethod !== 'complimentary' && amountPaid < amountDue) {
      return NextResponse.json(
        { error: 'Amount paid must cover the full bill in demo mode.' },
        { status: 400 }
      );
    }

    const reference = normalizeOptionalText(body?.reference);
    const transactionId = normalizeOptionalText(body?.transactionId);
    const settledAt = new Date().toISOString();
    const paymentId = randomUUID();
    const splitId = randomUUID();
    const changeAmount =
      paymentMethod === 'complimentary' ? 0 : roundCurrency(Math.max(0, amountPaid - amountDue));

    const result = db.transaction((tx) => {
      tx
        .insert(payments)
        .values({
          id: paymentId,
          orderId: existingOrder.id,
          cashierId: session.user.id,
          totalAmount: amountDue,
          changeAmount,
        })
        .run();

      tx
        .insert(paymentSplits)
        .values({
          id: splitId,
          paymentId,
          method: paymentMethod,
          amount: amountDue,
          reference,
          transactionId,
        })
        .run();

      const paidOrder = tx
        .update(orders)
        .set({
          status: 'paid',
          cashierId: session.user.id,
          billedAt: existingOrder.billedAt ?? settledAt,
          paidAt: settledAt,
        })
        .where(and(eq(orders.id, existingOrder.id), eq(orders.outletId, session.user.outletId!)))
        .returning()
        .get();

      let tableReleased = false;

      if (existingOrder.tableId) {
        const remainingOpenOrder = tx
          .select({ id: orders.id })
          .from(orders)
          .where(
            and(
              eq(orders.tableId, existingOrder.tableId),
              eq(orders.outletId, session.user.outletId!),
              ne(orders.id, existingOrder.id),
              inArray(orders.status, ['active', 'billed'])
            )
          )
          .limit(1)
          .get();

        if (!remainingOpenOrder) {
          tx
            .update(tables)
            .set({ status: 'available' })
            .where(and(eq(tables.id, existingOrder.tableId), eq(tables.outletId, session.user.outletId!)))
            .run();
          tableReleased = true;
        }
      }

      return { paidOrder, tableReleased };
    });

    if ((global as any).io && existingOrder.tableId && result.tableReleased) {
      (global as any).io.to(`outlet:${session.user.outletId}`).emit('table:updated', {
        tableId: existingOrder.tableId,
        status: 'available',
      });
    }

    return NextResponse.json({
      order: result.paidOrder,
      paymentId,
      changeAmount,
    });
  } catch (error) {
    console.error('[ORDERS_PAY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
