const express = require('express');
const { getFeed, savePost, reportPost, sharePost } = require('../controllers/feedController.js');
const { auth } = require('../middleware/auth.js');
const awardCredits = require('../middleware/credits.js');

const router = express.Router();

router.get('/', auth, awardCredits, getFeed);
router.post('/save', auth, awardCredits, savePost);
router.post('/report', auth, awardCredits, reportPost);
router.post('/share', auth, awardCredits, sharePost);

module.exports = router;