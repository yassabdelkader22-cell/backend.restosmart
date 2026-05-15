var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

// ==================== AUTH ROUTES ====================

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout/:token', authController.logout);
router.put('/profile/:userId', authController.updateProfile);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/upload-avatar/:userId', authController.uploadAvatar);
router.post('/upload-cover/:userId', authController.uploadCoverImage);
router.put('/social-link/:userId', authController.updateSocialLink);
router.post('/social-links/:userId', authController.saveSocialLinks);
router.get('/social-links/:userId', authController.getSocialLinks);
router.get('/users', authController.getAllUsers);
router.get('/user/:id', authController.getUserById);
router.get('/profile/:userId', authController.getProfileInfo);

module.exports = router;