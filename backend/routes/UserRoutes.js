const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// TODO: adicionar middleware de rota para validação

router.post('/users', UserController.create);

module.exports = router;