import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Convert file to base64 data URI
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUri });
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
