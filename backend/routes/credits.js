const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController.js');
const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');

// Protected routes
router.get('/', auth, creditController.getUserCredits);
router.post('/purchase', auth, creditController.purchaseCredits);
router.get('/packages', auth, creditController.getCreditPackages);
router.get('/transactions', auth, creditController.getTransactionHistory);

// Admin routes
router.get('/stats', [auth, admin], creditController.getSystemCreditStats);

module.exports = router; 