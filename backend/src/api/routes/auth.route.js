const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/auth-check', AuthController.authCheck);
router.put('/update-password', AuthController.updatePassword);

module.exports = router;