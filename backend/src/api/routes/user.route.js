const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.temp');

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.post('/users/:id', UserController);
router.delete('/users', UserController);