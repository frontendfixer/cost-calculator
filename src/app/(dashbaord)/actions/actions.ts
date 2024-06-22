'use server';

import { and, between, desc, eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { dailyExpenseList, users } from '~/server/db/schema';
import { type TAddItemSchema } from '../components/AddItemModal';
import { getServerAuthSession } from '~/server/auth';
import { StatusCodes } from 'http-status-codes';
import { endOfMonth, format, startOfMonth } from 'date-fns';

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
    transaction_type: item.transaction_type,
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

export async function listItems() {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      message: 'Invalid user request',
    };
  }
  const user = await getUser(user_id);
  if (!user)
    return {
      status: StatusCodes.UNAUTHORIZED,
      message: 'User not found',
    };

  const query = await db
    .select()
    .from(dailyExpenseList)
    .where(
      and(
        eq(dailyExpenseList.userId, user.id),
        eq(dailyExpenseList.status, 'active'),
        between(
          dailyExpenseList.date,
          startOfMonth(new Date()),
          endOfMonth(new Date()),
        ),
      ),
    )
    .orderBy(desc(dailyExpenseList.date));

  const data = query?.map(item => {
    return {
      id: item.id,
      transaction_type: item.transaction_type,
      amount: item.amount,
      category: item.category,
      date: format(new Date(item.date), 'do MMMM yyyy'),
      payment_method: item.paymentMethod,
      title: item.title,
    };
  });

  return {
    status: StatusCodes.OK,
    message: 'Items fetched successfully',
    data,
  };
}

export type TListItems = Awaited<ReturnType<typeof listItems>>['data'];
