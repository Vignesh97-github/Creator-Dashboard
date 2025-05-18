import express from 'express';
import { getFeed, savePost, reportPost, sharePost } from '../controllers/feedController.js';
import auth from '../middleware/auth.js';
import awardCredits from '../middleware/credits.js';

const router = express.Router();

router.get('/', auth, getFeed);
router.post('/', auth, awardCredits, savePost);
router.post('/:id/report', auth, reportPost);
router.post('/:id/share', auth, sharePost);

export default router;