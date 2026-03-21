import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tables, tableSections } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const allTables = await db.query.tables.findMany({
      where: eq(tables.outletId, session.user.outletId),
    });

    const sections = await db.query.tableSections.findMany({
      where: eq(tableSections.outletId, session.user.outletId),
      orderBy: (sections, { asc }) => [asc(sections.displayOrder)],
    });

    return NextResponse.json({ tables: allTables, sections });
  } catch (error) {
    console.error('[TABLES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { sectionId, name, capacity, shape, positionX, positionY, width, height } = body;

    const [table] = await db.insert(tables).values({
      id: `tbl-${Date.now()}`,
      outletId: session.user.outletId,
      sectionId,
      name,
      capacity,
      shape,
      positionX,
      positionY,
      width,
      height,
      status: 'available',
    }).returning();

    return NextResponse.json(table);
  } catch (error) {
    console.error('[TABLES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
