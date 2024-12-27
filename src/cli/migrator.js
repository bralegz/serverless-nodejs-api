const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const schema = require('../db/schemas.js');
const secrets = require('../lib/secrets.js');

require('dotenv').config();

const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

async function performMigration() {
  const dbUrl = await secrets.getDatabaseUrl();

  if (!dbUrl) return;
  console.log(dbUrl);

  //neon serverless pool
  neonConfig.webSocketConstructor = ws; // <-- this is the key bit

  const pool = new Pool({ connectionString: dbUrl });
  pool.on('error', (err) => console.error(err)); // deal with e.g. re-connect
  // ...

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: 'src/migrations' });
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

// checks if the current module is the main module
//If this condition is true, it means that the script is being run directly from the command line.
// If it is false, it means that the script is being required by another module.
if (require.main === module) {
  console.log('run this!');
  console.log(process.env.AWS_ACCESS_KEY_ID);
  performMigration()
    .then((val) => {
      console.log('Migrations done');
      process.exit(0);
    })
    .catch((err) => {
      console.log('Migrations error');
      process.exit(1);
    });
}
