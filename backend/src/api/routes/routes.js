const express = require('express');
const router = express.Router();

const UserRoutes = require('./user.routes');
const TicketRoutes = require('./ticket.routes');
const AuthRoutes = require('./auth.route');

router.use('/users', UserRoutes);

router.use('/tickets', TicketRoutes);

router.use('/auth', AuthRoutes);

router.get('/ping', (req, res) => {
    res.status(200).json({ status: 'Ok', timestamp: new Date().toISOString() });
});

router.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

router.use((error, req, res, next) => {
    console.error('Erro inesperado:', error);
    res.status(500).json({
        error: 'Erro interno no servidor',
        details: error.message,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;