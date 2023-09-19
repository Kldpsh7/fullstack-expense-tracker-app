const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense-controller');
const userAuth = require('../middleware/auth');

router.get('/expense',expenseController.getExpense);
router.get('/data',userAuth.authenticate,expenseController.getData);
router.post('/data',userAuth.authenticate,expenseController.postData);
router.delete('/delete',userAuth.authenticate,expenseController.deleteExpense);

module.exports = router;