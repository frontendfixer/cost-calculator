'use server';

import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { dailyExpenseList, users } from '~/server/db/schema';
import { type TAddItemSchema } from '../components/AddItemModal';
import { getServerAuthSession } from '~/server/auth';
import { StatusCodes } from 'http-status-codes';

export async function getUser(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user[0] ?? null;
}

export async function addItem(item: TAddItemSchema) {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      message: 'User not found',
    };
  }
  const query = await db.insert(dailyExpenseList).values({
    userId: user_id,
    amount: +item.amount,
    category: item.category,
    date: item.date,
    paymentMethod: item.payment_method,
    title: item.title ?? '',
  });
  if (query[0].affectedRows) {
    return {
      status: StatusCodes.OK,
      message: 'Item added successfully',
    };
  } else {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error while adding item',
    };
  }
}
