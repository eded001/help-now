// NOTE arquivo que junta todas as rotas do route da API

const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;