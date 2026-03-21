import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

const { handlers, auth: originalAuth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'fallback-secret-for-dev-only-12345',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        pin: { label: 'PIN', type: 'password' },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        if (!credentials) return null;

        let userRecord;

        try {
          if (credentials.email && credentials.password) {
            console.log("Authenticating with email:", credentials.email);
            userRecord = await db.query.users.findFirst({
              where: eq(users.email, credentials.email as string),
              with: { role: true },
            });

            if (!userRecord) {
              console.log("User not found");
              throw new Error('Invalid email or password');
            }
            
            const isMatch = bcrypt.compareSync(credentials.password as string, userRecord.passwordHash);
            if (!isMatch) {
              console.log("Password mismatch");
              throw new Error('Invalid email or password');
            }
          } else if (credentials.pin) {
            console.log("Authenticating with PIN");
            const allUsers = await db.select().from(users);
            userRecord = allUsers.find(u => bcrypt.compareSync(credentials.pin as string, u.pinHash));
            
            if (userRecord) {
              // Fetch role
              const roleRecord = await db.query.roles.findFirst({
                where: eq(roles.id, userRecord.roleId!),
              });
              userRecord = { ...userRecord, role: roleRecord };
            } else {
              console.log("Invalid PIN");
              throw new Error('Invalid PIN');
            }
          } else {
            console.log("Missing credentials");
            throw new Error('Missing credentials');
          }

          if (!userRecord.isActive) {
            console.log("Account disabled");
            throw new Error('Account is disabled');
          }

          console.log("Authentication successful for user:", userRecord.id);
          return {
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            role: userRecord.role?.name,
            permissions: userRecord.role?.permissions,
            outletId: userRecord.outletId,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
});

export { handlers, signIn, signOut };

export const auth = async () => {
  const session = await originalAuth();
  if (session) return session;

  // Provide a mock session if none exists (for dev/demo purposes as per user request)
  console.log("Providing mock session");
  return {
    user: {
      id: 'user-1',
      name: 'admin',
      email: 'admin@admin.com',
      role: 'owner',
      permissions: ['all'],
      outletId: 'outlet-1',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
};
