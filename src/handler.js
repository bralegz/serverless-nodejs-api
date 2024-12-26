const serverless = require('serverless-http');
const express = require('express');
const { getDbClient } = require('./db/clients.js');
const app = express();

app.get('/', async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now()
  const [dbNowResult] = await sql`select now();`;
  const delta = (dbNowResult.now.getTime() - now) / 1000
  
  return res.status(200).json({
    message: 'Hello from root!',
    delta: delta
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
