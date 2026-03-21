import { NextResponse } from 'next/server';
import { db } from '@/db';
import { outlets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const outlet = await db.query.outlets.findFirst({
      where: eq(outlets.id, session.user.outletId),
    });

    if (!outlet) {
      return new NextResponse('Outlet not found', { status: 404 });
    }

    return NextResponse.json(outlet);
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, phone, address, gstin, fssaiNumber, settings } = body;

    const [updatedOutlet] = await db.update(outlets)
      .set({
        name,
        phone,
        address,
        gstin,
        fssaiNumber,
        settings,
      })
      .where(eq(outlets.id, session.user.outletId))
      .returning();

    return NextResponse.json(updatedOutlet);
  } catch (error) {
    console.error('[SETTINGS_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
