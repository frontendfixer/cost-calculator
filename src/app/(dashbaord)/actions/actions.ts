'use server';

import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { and, between, desc, eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { dailyExpenseList, users } from '~/server/db/schema';
import { type TAddItemSchema } from '../components/AddItemModal';

// ############# Users ############
export async function getUser(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user[0] ?? null;
}

// ############# Transactions ############
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
    throw new Error('User not found');
  }

  const query = await db
    .select()
    .from(dailyExpenseList)
    .where(
      and(
        eq(dailyExpenseList.userId, user_id),
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
      time: format(new Date(item.date), 'h:mm a'),
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

export async function deleteItem(id: string) {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    throw new Error('User not found');
  }

  const query = await db
    .update(dailyExpenseList)
    .set({ status: 'deleted' })
    .where(eq(dailyExpenseList.id, id));
  if (query[0].affectedRows) {
    return {
      status: StatusCodes.OK,
      message: 'Item deleted successfully',
    };
  } else {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error while deleting item',
    };
  }
}

// ############# Statistics ############
export async function currentMonthBalance() {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    throw new Error('User not found');
  }

  const query = await db
    .select({
      amount: dailyExpenseList.amount,
      transaction_type: dailyExpenseList.transaction_type,
    })
    .from(dailyExpenseList)
    .where(
      and(
        eq(dailyExpenseList.userId, user_id),
        between(
          dailyExpenseList.date,
          startOfMonth(new Date()),
          endOfMonth(new Date()),
        ),
        eq(dailyExpenseList.status, 'active'),
      ),
    );

  const totalIncome = query
    .filter(item => item.transaction_type === 'credit')
    .reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = query
    .filter(item => item.transaction_type === 'debit')
    .reduce((acc, item) => acc + item.amount, 0);
  return {
    status: StatusCodes.OK,
    message: 'Items fetched successfully',
    data: {
      totalIncome: totalIncome < 0 ? 0 : totalIncome,
      totalExpense: totalExpense < 0 ? 0 : totalExpense,
      balance: totalIncome - totalExpense,
    },
  };
}
export async function monthWiseStat() {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    throw new Error('User not found');
  }

  const query = await db.query.dailyExpenseList.findMany({
    where: and(
      eq(dailyExpenseList.userId, user_id),
      eq(dailyExpenseList.status, 'active'),
      between(
        dailyExpenseList.date,
        startOfYear(new Date()),
        endOfYear(new Date()),
      ),
    ),
    orderBy: [desc(dailyExpenseList.date)],
  });

  const data = query.reduce(
    (acc: Record<string, { income: number; expense: number }>, item) => {
      const month = format(new Date(item.date), 'MMMM');
      if (!acc[month]) {
        acc[month] = {
          income: 0,
          expense: 0,
        };
      }
      if (item.transaction_type === 'credit') {
        acc[month].income += item.amount;
      } else {
        acc[month].expense += item.amount;
      }
      return acc;
    },
    {},
  );

  const monthWiseStat = Object.entries(data).map(([key, value]) => {
    const saving = value.income - value.expense;
    return {
      month: key,
      income: value.income,
      expense: value.expense,
      saving,
    };
  });

  monthWiseStat.sort((a, b) => (a.month < b.month ? 1 : -1));

  return {
    status: StatusCodes.OK,
    message: 'Items fetched successfully',
    data: monthWiseStat,
  };
}

export async function categoryWiseStat() {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    throw new Error('User not found');
  }

  try {
    const query = await db.query.dailyExpenseList.findMany({
      where: and(
        eq(dailyExpenseList.userId, user_id),
        eq(dailyExpenseList.status, 'active'),
        between(
          dailyExpenseList.date,
          startOfMonth(new Date()),
          endOfMonth(new Date()),
        ),
      ),
      orderBy: [desc(dailyExpenseList.date)],
    });

    const expenses = query.filter(item => item.transaction_type === 'debit');
    const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
    const expensesStat = Object.values(
      expenses.reduce(
        (
          acc: Record<
            string,
            { category: string; spending: number; percentage: number }
          >,
          item,
        ) => {
          if (!acc[item.category]) {
            acc[item.category] = {
              category: item.category,
              spending: 0,
              percentage: 0,
            };
          }
          acc[item.category]!.spending += item.amount;
          acc[item.category]!.percentage =
            (acc[item.category]!.spending / totalExpense) * 100;
          return acc;
        },
        {},
      ),
    );

    const income = query.filter(item => item.transaction_type === 'credit');
    const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
    const incomeStat = Object.values(
      income.reduce(
        (
          acc: Record<
            string,
            { category: string; spending: number; percentage: number }
          >,
          item,
        ) => {
          if (!acc[item.category]) {
            acc[item.category] = {
              category: item.category,
              spending: 0,
              percentage: 0,
            };
          }
          acc[item.category]!.spending += item.amount;
          acc[item.category]!.percentage =
            (acc[item.category]!.spending / totalIncome) * 100;
          return acc;
        },
        {},
      ),
    );

    return {
      status: StatusCodes.OK,
      message: 'Items fetched successfully',
      data: {
        expenses: expensesStat.toSorted((a, b) => b.spending - a.spending),
        totalExpense: totalExpense < 0 ? 0 : totalExpense,
        income: incomeStat.toSorted((a, b) => b.spending - a.spending),
        totalIncome: totalIncome < 0 ? 0 : totalIncome,
        balance: totalIncome - totalExpense,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    };
  }
}
export async function spendingStat() {
  const user_id = await getServerAuthSession().then(
    session => session?.user?.id,
  );
  if (!user_id) {
    throw new Error('User not found');
  }
  const thisMonthQuery = await db
    .select({
      amount: dailyExpenseList.amount,
      transaction_type: dailyExpenseList.transaction_type,
    })
    .from(dailyExpenseList)
    .where(
      and(
        eq(dailyExpenseList.userId, user_id),
        eq(dailyExpenseList.status, 'active'),
        between(
          dailyExpenseList.date,
          startOfMonth(new Date()),
          endOfMonth(new Date()),
        ),
      ),
    );

  const thisMonth = thisMonthQuery.reduce(
    (acc: { income: number; expanse: number }, item) => {
      acc.expanse = acc.expanse || 0;
      acc.income = acc.income || 0;
      if (item.transaction_type === 'credit') {
        acc.income += item.amount;
      } else {
        acc.expanse += item.amount;
      }
      return acc;
    },
    { income: 0, expanse: 0 },
  );

  const totalIncome = thisMonthQuery
    .filter(item => item.transaction_type === 'credit')
    .reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = thisMonthQuery
    .filter(item => item.transaction_type === 'debit')
    .reduce((acc, item) => acc + item.amount, 0);
  return {
    status: StatusCodes.OK,
    message: 'Items fetched successfully',
    data: {
      thisMonth,
      totalIncome: totalIncome < 0 ? 0 : totalIncome,
      totalExpense: totalExpense < 0 ? 0 : totalExpense,
    },
  };
}

export type TListItems = Awaited<ReturnType<typeof listItems>>['data'];
