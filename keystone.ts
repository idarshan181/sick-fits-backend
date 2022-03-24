/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { User } from './schemas/User';

import 'dotenv/config';
import { insertSeedData } from './seed-data';

const dbURL =
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // todo: Add Roles here
  },
});

export default withAuth(
  config({
    server: {
      cors: { origin: [process.env.FRONTEND_URL], credentials: true },
    },
    db: {
      adapter: 'mongoose',
      url: dbURL,
      async onConnect(keystone) {
        console.log('🌱 Connected to MongoDB');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // todo: Change this for roles
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: `id`,
    }),
    // todo: Add Session values here
  })
);
