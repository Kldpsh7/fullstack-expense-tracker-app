const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium-controller');
const userAuth = require('../middleware/auth');

router.get('/leaderboard',premiumController.getleaderboard);

module.exports = router;