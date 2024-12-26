const { neon } = require('@neondatabase/serverless');
const secrets = require('../lib/secrets');



async function getDbClient() {
  const dburl = await secrets.getDatabaseUrl();
  const sql = neon(dburl);

  return sql;
}

module.exports.getDbClient = getDbClient;
