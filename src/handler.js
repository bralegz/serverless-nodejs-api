const serverless = require('serverless-http');
const express = require('express');
const { getDbClient } = require('./db/clients.js');
const { newLeads, listLeads, getLead } = require('./db/crud.js');
const app = express();

app.use(express.json());

app.get('/', async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();
  const [dbNowResult] = await sql`select now();`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;

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

app.get('/leads', async (req, res, next) => {
  const results = await listLeads();
  
  //get a single lead test
  // const results = await getLead(2);

  return res.status(200).json({
    results
  });
});

app.post('/leads', async (req, res, next) => {
  //POST> => Create data
  const data = await req.body;
  const { email } = data;
  const result = await newLeads(email);

  //insert data to the database

  return res.status(200).json({
    results: result
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
