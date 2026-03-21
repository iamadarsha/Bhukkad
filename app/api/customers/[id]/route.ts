import { NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, phone, email, address, gstNumber } = body;

    const [updatedCustomer] = await db.update(customers)
      .set({ name, phone, email, address, gstNumber })
      .where(eq(customers.id, id))
      .returning();

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('[CUSTOMER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    await db.delete(customers).where(eq(customers.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CUSTOMER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
