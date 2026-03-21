import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { tables: updatedTables } = body;

    // A real bulk upsert would be better, but for simplicity we can loop
    // or use a transaction
    await db.transaction(async (tx) => {
      for (const table of updatedTables) {
        // Check if exists
        const existing = await tx.query.tables.findFirst({
          where: eq(tables.id, table.id)
        });

        if (existing) {
          await tx.update(tables)
            .set({
              name: table.name,
              capacity: table.capacity,
              shape: table.shape,
              positionX: table.positionX,
              positionY: table.positionY,
              width: table.width,
              height: table.height,
              sectionId: table.sectionId,
            })
            .where(eq(tables.id, table.id));
        } else {
          await tx.insert(tables).values({
            id: table.id,
            outletId: session.user.outletId,
            sectionId: table.sectionId,
            name: table.name,
            capacity: table.capacity,
            shape: table.shape,
            positionX: table.positionX,
            positionY: table.positionY,
            width: table.width,
            height: table.height,
            status: 'available',
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TABLES_BULK_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
