const serverless = require('serverless-http');
const express = require('express');
const AWS = require("aws-sdk");
const { neon, neonConfig } = require('@neondatabase/serverless');

const AWS_REGION = 'us-east-2';

const app = express();
const ssm = new AWS.SSM({ region: AWS_REGION });
const STAGE = process.env.STAGE || 'prod';

//this is the parameter name in aws systems manaer
const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

async function dbClient() {
  //for http connections
  //non-pooling
  // neonConfig.fetchConnectionCache = true; this line is deprecated

  const paramStoreData = await ssm.getParameter({
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  }).promise()

  const sql = neon(paramStoreData.Parameter.Value);

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
