const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';


//this function will get the database connection string from the systems manager service from aws
async function getDatabaseUrl() {
  //this is the parameter name in aws systems manager
  const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;
  const client = new SSMClient({ region: AWS_REGION });

  const paramStoreData = {
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true
  };

  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);

  return result.Parameter.Value;
}

module.exports.getDatabaseUrl = getDatabaseUrl