const {SQSClient, SendMessageCommand} = require('@aws-sdk/client-sqs');
require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });


async function sendMessageSQSAws(message ) {
    const config = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
      };
      const params = new SendMessageCommand( {
        MessageBody: JSON.stringify({message}),
        QueueUrl: process.env.AWS_SQS_URL,
      });
    
    try {
        const sqs = new SQSClient(config);
        const data = await sqs.send(params);
        return {code: data.$metadata.httpStatusCode, body: data.$metadata};        
    } catch (error) {
        console.error('Error:', error);
        return {code: 400, body: {message: error}}
    }
}

module.exports = {sendMessageSQSAws};