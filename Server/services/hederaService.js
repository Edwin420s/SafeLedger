const {
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  Client,
} = require('@hashgraph/sdk');
const hederaClient = require('../config/hedera');
const logger = require('../utils/logger');

let topicId = process.env.HEDERA_TOPIC_ID ? process.env.HEDERA_TOPIC_ID : null;

async function createTopic() {
  try {
    const tx = new TopicCreateTransaction();
    const response = await tx.execute(hederaClient);
    const receipt = await response.getReceipt(hederaClient);
    topicId = receipt.topicId.toString();
    logger.info(`Hedera topic created: ${topicId}`);
    
    console.log(`Please add this to your .env file: HEDERA_TOPIC_ID=${topicId}`);
    
    return topicId;
  } catch (error) {
    logger.error('Error creating Hedera topic:', error);
    throw error;
  }
}

async function submitHash(hash) {
  try {
    if (!topicId) {
      topicId = await createTopic();
    }
    const tx = new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: hash,
    });
    const response = await tx.execute(hederaClient);
    const receipt = await response.getReceipt(hederaClient);
    logger.info(`Hash submitted. Transaction ID: ${response.transactionId.toString()}`);
    return response.transactionId.toString();
  } catch (error) {
    logger.error('Error submitting hash to Hedera:', error);
    throw error;
  }
}

async function verifyHash(hash) {
  try {
    if (!topicId) return false;
    const query = new TopicMessageQuery()
      .setTopicId(topicId)
      .setLimit(50);
    const messages = await query.execute(hederaClient);
    for (const msg of messages) {
      if (msg.contents.toString() === hash) {
        return true;
      }
    }
    return false;
  } catch (error) {
    logger.error('Error verifying hash:', error);
    return false;
  }
}

module.exports = { createTopic, submitHash, verifyHash };