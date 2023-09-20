const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

router.get('/signup',userController.getSignUp);
router.post('/signup',userController.postSignUp);
router.get('/login',userController.getlogin);
router.post('/login',userController.postLogin);
router.get('/resetPassword',userController.getResetPassword);
router.post('/resetPassword',userController.postResetPassword);

module.exports = router;