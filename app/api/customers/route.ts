import { NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const allCustomers = await db.query.customers.findMany({
      where: eq(customers.outletId, session.user.outletId),
    });

    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('[CUSTOMERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, phone, email, gstin, notes } = body;

    const [customer] = await db.insert(customers).values({
      id: `cust-${Date.now()}`,
      outletId: session.user.outletId,
      name,
      phone,
      email: email || null,
      gstin: gstin || null,
      notes: notes || null,
    }).returning();

    return NextResponse.json(customer);
  } catch (error) {
    console.error('[CUSTOMERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
