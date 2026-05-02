const express = require('express');
const { verifyAgreement } = require('../controllers/hederaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/verify/:id', verifyAgreement);

module.exports = router;