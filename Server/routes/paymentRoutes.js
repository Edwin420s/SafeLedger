const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPayment);
router.get('/agreement/:agreementId', getPayments);

module.exports = router;