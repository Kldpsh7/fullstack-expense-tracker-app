const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense-controller');

router.get('/expense',expenseController.getExpense);
router.get('/data',expenseController.getData);
router.post('/data',expenseController.postData);

module.exports = router;