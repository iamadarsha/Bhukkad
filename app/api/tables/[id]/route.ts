import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, capacity, shape, positionX, positionY, width, height, status } = body;

    const [updatedTable] = await db.update(tables)
      .set({ name, capacity, shape, positionX, positionY, width, height, status })
      .where(eq(tables.id, id))
      .returning();

    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error('[TABLE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    await db.delete(tables).where(eq(tables.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TABLE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
