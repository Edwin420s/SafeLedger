const {
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  Client,
} = require('@hashgraph/sdk');
const hederaClient = require('../config/hedera');
const logger = require('../utils/logger');

// We'll use a single topic for all agreement hashes (or create per user)
let topicId = null;

/**
 * Create a new topic for storing hashes (run once at setup)
 */
async function createTopic() {
  try {
    const tx = new TopicCreateTransaction();
    const response = await tx.execute(hederaClient);
    const receipt = await response.getReceipt(hederaClient);
    topicId = receipt.topicId;
    logger.info(`Hedera topic created: ${topicId.toString()}`);
    return topicId;
  } catch (error) {
    logger.error('Error creating Hedera topic:', error);
    throw error;
  }
}

/**
 * Submit a hash to the topic
 * @param {string} hash - SHA-256 hash of agreement
 * @returns {string} transaction ID
 */
async function submitHash(hash) {
  try {
    if (!topicId) {
      // For demo, create topic on first use
      await createTopic();
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

/**
 * Verify a hash exists on the topic (by querying recent messages)
 * @param {string} hash - hash to verify
 * @returns {boolean}
 */
async function verifyHash(hash) {
  try {
    if (!topicId) return false;
    // Query the last 10 messages (simplified)
    const query = new TopicMessageQuery()
      .setTopicId(topicId)
      .setLimit(10);
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