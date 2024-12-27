const { desc, eq } = require('drizzle-orm');
const clients = require('./clients.js');
const schemas = require('./schemas.js');

async function newLeads(email) {
  const db = await clients.getDrizzleDbClient();
  const result = await db
    .insert(schemas.LeadTable)
    .values({
      email
    })
    .returning();

  if (result.length === 1) return result[0];

  return result;
}

async function listLeads() {
  const db = await clients.getDrizzleDbClient();
  const result = await db.select().from(schemas.LeadTable).orderBy(desc(schemas.LeadTable.createdAt)).limit(10);

  return result;
}

async function getLead(id) {
  const db = await clients.getDrizzleDbClient();
  const result = await db.select().from(schemas.LeadTable).where(eq(schemas.LeadTable.id, id));
   if (result.length === 1) return result[0];

  return null;
}

module.exports = { newLeads, listLeads, getLead };
