const serverless = require('serverless-http');
const express = require('express');
const { neon, neonConfig } = require('@neondatabase/serverless');

const app = express();

async function dbClient() {
  //for http connections
  //non-pooling
  // neonConfig.fetchConnectionCache = true; this line is deprecated
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const sql = neon(process.env.DATABASE_URL);

  return sql;
}

app.get('/', async (req, res, next) => {
  const sql = await dbClient();
  const [results] = await sql`select now();`;
  console.log(process.env.DATABASE_URL)
  return res.status(200).json({
    message: 'Hello from root!',
    results: results.now
  });
});

app.get('/hello', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path!'
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found'
  });
});

//server full-app
// app.listen(3000, () => {
//   console.log('Running at port 3000');
// })

exports.handler = serverless(app);
