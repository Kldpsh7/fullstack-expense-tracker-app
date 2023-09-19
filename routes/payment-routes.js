const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/auth');
const paymentController = require('../controllers/payment-controller');

router.get('/buypremium',userAuth.authenticate,paymentController.getBuyPremium);
router.post('/paid',userAuth.authenticate,paymentController.postPaymentDone);

module.exports = router;