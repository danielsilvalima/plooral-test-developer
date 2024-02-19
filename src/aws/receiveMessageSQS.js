const {SQS, ReceiveMessageCommand} = require('@aws-sdk/client-sqs');
const moderator = require('../moderator/moderator')
const deleteMessageSQS = require('./deleteMessageSQS');
const JobRepository = require('../repository/jobRepository');
const jobRepository = new JobRepository();
const UploaderFeed = require('./uploaderFeed');
const uploaderFeed = new UploaderFeed();
require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });

async function awsSQSConsumer( ) {
    const sqs = new SQS({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    while (true) {
        try {
            const command = new ReceiveMessageCommand({
                MaxNumberOfMessages: 1,
                QueueUrl: process.env.AWS_SQS_URL,
                WaitTimeSeconds: 5,
                MessageAttributeNames: ['All'],
            })
            
            const result = await sqs.send(command);
            if(result){
                if(result.Messages){
                    const jsonBody = JSON.parse(result.Messages[0].Body);
                    const receiptHandle = result.Messages[0].ReceiptHandle;
                    const json = jsonBody.message;
                    const {code, body} = await moderator.send(json);
                    const {id} = json[0];
                    
                    if(code === 200 && !body){//Grava no banco como publicado e envia para o S3                       
                        const ret = await jobRepository.publishByID(id);                        
                        if(ret){
                            const jobsPublished = await jobRepository.findByPublication();
                            const {code} = await uploaderFeed.sendUploadAws(jobsPublished);
                            if(code === 200){
                                const deleteMessage = await deleteMessageSQS.awsSQSDelete(receiptHandle);
                                console.log('MSG PUBLICADA E DELETADA');
                            }
                        }
                    }else if (code === 200 && body){//Grava no banco como arquivado
                        console.log('ARQUIVADO');
                        const ret = await jobRepository.archiveByIDInappropriate(id);
                        if(ret){
                            const deleteMessage = await deleteMessageSQS.awsSQSDelete(receiptHandle);
                            console.log('MSG PUBLICADA E DELETADA');
                        }
                    }else{
                        console.log('Error');
                    }
                }
            }
            
            
        } catch (error) {
            console.error('Error', error);
        }
    }
}

// Asynchronous IIFE (Immediately Invoked Function Expression) for consuming messages
/*(async () => {
    // Create an SQS client instance with specified AWS credentials and region
    const sqs = new SQS({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    // Call the function to start consuming messages from the specified queue
    //await awsSQSConsumer(sqs, process.env.AWS_SQS_URL);
})();*/

module.exports = {awsSQSConsumer};