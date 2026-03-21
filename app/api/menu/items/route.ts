import { NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const items = await db.query.menuItems.findMany({
      where: eq(menuItems.outletId, session.user.outletId),
      orderBy: (items, { asc }) => [asc(items.displayOrder)],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[ITEMS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { 
      categoryId, name, description, basePrice, foodType, 
      isActive, isBestseller, spiceLevel, prepTimeMinutes 
    } = body;

    const [item] = await db.insert(menuItems).values({
      id: `item-${Date.now()}`,
      outletId: session.user.outletId,
      categoryId,
      name,
      description,
      basePrice,
      foodType,
      isActive: isActive ?? true,
      isBestseller: isBestseller ?? false,
      spiceLevel: spiceLevel ?? 0,
      prepTimeMinutes: prepTimeMinutes ?? 15,
    }).returning();

    return NextResponse.json(item);
  } catch (error) {
    console.error('[ITEMS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
