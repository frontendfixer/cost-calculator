import { cuid2 as cuid } from 'drizzle-cuid2/mysql';
import { relations, sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { type AdapterAccount } from 'next-auth/adapters';

export const addItemCategoryList = [
  'food',
  'medicine',
  'grocery',
  'market',
  'clothing',
  'entertainment',
  'other',
  'salary',
  'loan',
  'lend',
  'borrow',
  'donation',
  'investment',
] as const;
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(name => `cc_${name}`);

export const users = createTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 }),
  role: mysqlEnum('role', ['user', 'admin']).notNull().default('user'),

  createdAt: timestamp('created_at', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  dailyExpenseLists: many(dailyExpenseList),
}));

export const accounts = createTable(
  'account',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 }).$type<AdapterAccount>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: varchar('id_token', { length: 2048 }),
    session_state: varchar('session_state', { length: 255 }),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  'session',
  {
    sessionToken: varchar('session_token', { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  session => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const dailyExpenseList = createTable('daily_expense_list', {
  id: cuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  transaction_type: mysqlEnum('transaction_type', ['credit', 'debit'])
    .notNull()
    .default('credit'),
  date: timestamp('date', {
    mode: 'date',
    fsp: 3,
  }).notNull(),
  amount: int('amount').notNull(),
  category: mysqlEnum('category', addItemCategoryList)
    .notNull()
    .default('other'),
  paymentMethod: mysqlEnum('payment_method', ['cash', 'online'])
    .notNull()
    .default('cash'),
  title: varchar('title', { length: 255 }).notNull(),
  status: mysqlEnum('status', ['active', 'inactive', 'deleted']).default(
    'active',
  ),

  createdAt: timestamp('created_at', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
});

export const dailyExpenseListRelations = relations(
  dailyExpenseList,
  ({ one }) => ({
    user: one(users, {
      fields: [dailyExpenseList.userId],
      references: [users.id],
    }),
  }),
);
