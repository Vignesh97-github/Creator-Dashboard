const express = require('express');
const { register, login, getMe } = require('../controllers/authController.js');
const { auth } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;