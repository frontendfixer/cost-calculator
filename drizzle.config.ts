import { type Config } from 'drizzle-kit';

import { env } from '~/env';

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'mysql',
  out: './database',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['cc_*'],
} satisfies Config;
