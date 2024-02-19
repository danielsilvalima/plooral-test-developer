const receiveMessage = require('../aws/receiveMessageSQS')

async function updateFeedAws( ) {
    const awsSQS = await receiveMessage.awsSQSConsumer();
}

(async () => {
    await updateFeedAws();
})();

