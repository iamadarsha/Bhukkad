import { NextResponse } from 'next/server';
import { db } from '@/db';
import { kots, kotItems, orders, tables } from '@/db/schema';
import { eq, inArray, and, ne } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    // Fetch active KOTs (not served/cancelled)
    const activeKots = await db.query.kots.findMany({
      where: and(
        ne(kots.status, 'served'),
        ne(kots.status, 'cancelled')
      ),
      with: {
        order: {
          with: {
            table: true
          }
        }
      }
    });

    // Fetch items for these KOTs
    const kotIds = activeKots.map(k => k.id);
    let allItems: any[] = [];
    
    if (kotIds.length > 0) {
      allItems = await db.query.kotItems.findMany({
        where: inArray(kotItems.kotId, kotIds)
      });
    }

    const formattedKots = activeKots.map(kot => ({
      ...kot,
      items: allItems.filter(item => item.kotId === kot.id),
      table: kot.order?.table,
      orderType: kot.order?.orderType,
    }));

    return NextResponse.json(formattedKots);
  } catch (error) {
    console.error('[KITCHEN_KOTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
