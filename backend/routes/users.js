const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');
// const admin = require('../middleware/admin.js');
// const upload = require('../middleware/upload.js');

// Protected routes
router.get('/profile', auth, userController.getUserById);
router.put('/profile', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// Admin routes
router.get('/', [auth, admin], userController.getUsers);
router.get('/:id', [auth, admin], userController.getUserById);
router.put('/:id/role', [auth, admin], userController.updateUserRole);
router.delete('/:id', [auth, admin], userController.deleteUser);

module.exports = router; 