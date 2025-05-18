import express from 'express';
import { getUsers, getUserById, updateProfile, uploadAvatar, updateUserRole, deleteUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { upload } from '../middleware/multer.middleware.js'
// import admin from '../middleware/admin.js';
// import upload from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.get('/profile', auth, getUserById);
router.put('/profile', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

// Admin routes
// router.get('/', [auth, admin], getUsers);
// router.get('/:id', [auth, admin], getUserById);
// router.put('/:id/role', [auth, admin], updateUserRole);
// router.delete('/:id', [auth, admin], deleteUser);

export default router; 