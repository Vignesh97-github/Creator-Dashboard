import express from 'express';
import {getUserCredits, purchaseCredits, getCreditPackages, getTransactionHistory, getSystemCreditStats  } from '../controllers/creditController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Protected routes
router.get('/', auth, getUserCredits);
router.post('/purchase', auth, purchaseCredits);
router.get('/packages', auth, getCreditPackages);
router.get('/transactions', auth, getTransactionHistory);

// Admin routes
router.get('/stats', [auth, admin], getSystemCreditStats);

export default router; 