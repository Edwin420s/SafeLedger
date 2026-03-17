const express = require('express');
const { create, getOne, list, sign } = require('../controllers/agreementController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // All routes require authentication

router.post('/', create);
router.get('/', list);
router.get('/:id', getOne);
router.patch('/:id/sign', sign);

module.exports = router;