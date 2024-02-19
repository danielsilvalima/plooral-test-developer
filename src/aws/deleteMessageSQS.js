const {SQS, DeleteMessageCommand} = require('@aws-sdk/client-sqs');

require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });


async function awsSQSDelete(ReceiptHandl ) {
    const sqs = new SQS({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    
    try {
        const result = await sqs.send(new DeleteMessageCommand({
        QueueUrl: process.env.AWS_SQS_URL,
        ReceiptHandle: ReceiptHandl
        }));        
        
    } catch (error) {
        console.error('Error', error);
    }
}

module.exports = {awsSQSDelete};