import { eq } from 'drizzle-orm';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';

export const isValidSessionUser = async () => {
  const session = await getServerAuthSession();
  const sesUser = session?.user;
  if (!sesUser) return false;
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, sesUser.id))
    .limit(1);
  return dbUser.length > 0;
};
