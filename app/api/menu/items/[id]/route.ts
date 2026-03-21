import { NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { isActive } = body;

    const [updatedItem] = await db.update(menuItems)
      .set({ isActive: isActive })
      .where(eq(menuItems.id, id))
      .returning();

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('[ITEM_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    await db.delete(menuItems).where(eq(menuItems.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[ITEM_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
