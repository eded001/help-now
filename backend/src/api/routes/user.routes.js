const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', UserController.create);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/auth-check', UserController.authCheck);

module.exports = router;