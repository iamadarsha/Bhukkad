import type { Session } from 'next-auth';

const demoModeEnv = process.env.APP_DEMO_MODE?.toLowerCase();

export const DEMO_MODE =
  demoModeEnv === 'true' ||
  (demoModeEnv !== 'false' && !process.env.AUTH_SECRET);

export const DEMO_OUTLET_ID = 'outlet-1';
export const DEMO_USER_ID = 'user-1';

export function createDemoSession(): Session {
  return {
    user: {
      id: DEMO_USER_ID,
      name: 'Demo Admin',
      email: 'admin@admin.com',
      image: null,
      role: 'owner',
      permissions: ['all'],
      outletId: DEMO_OUTLET_ID,
    },
    expires: '2999-12-31T23:59:59.999Z',
  };
}
