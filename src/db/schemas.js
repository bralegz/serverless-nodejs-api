//database schema of leads table
const { serial } = require('drizzle-orm/pg-core');
const { text, pgTable, timestamp } = require('drizzle-orm/pg-core');

const LeadTable = pgTable('leads', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull(),
  description: text('description').default('This is my comment'),
  createdAt: timestamp('created_at').defaultNow()
});

module.exports.LeadTable = LeadTable;
