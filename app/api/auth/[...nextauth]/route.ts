import { NextRequest, NextResponse } from 'next/server';

import { handlers } from '@/lib/auth';
import { createDemoSession, DEMO_MODE } from '@/lib/demo-mode';

export async function GET(req: NextRequest) {
  if (DEMO_MODE && new URL(req.url).pathname.endsWith('/session')) {
    return NextResponse.json(createDemoSession());
  }

  return handlers.GET(req);
}

export const POST = handlers.POST;
