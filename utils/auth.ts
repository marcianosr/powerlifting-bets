import { Session } from 'next-auth';

const ADMIN_EMAIL_PREFIX = 'msrschildmeijer';

export const isAdmin = (session: Session | null): boolean => {
  if (!session?.user?.email) return false;
  return session.user.email.startsWith(ADMIN_EMAIL_PREFIX);
};

// Type guard version for more precise TypeScript typing
export const assertIsAdmin = (session: Session | null): boolean => {
  if (!isAdmin(session)) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
};
