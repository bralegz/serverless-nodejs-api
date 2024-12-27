const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const secrets = require('../lib/secrets');

async function getDbClient() {
  const dburl = await secrets.getDatabaseUrl();
  const sql = neon(dburl);

  return sql;
}

async function getDrizzleDbClient() {
  const sql = await getDbClient();

  return drizzle(sql);
}

module.exports = { getDbClient, getDrizzleDbClient };
