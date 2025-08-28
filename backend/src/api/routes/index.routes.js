const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const ticketRoutes = require('./ticket.routes');

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/tickets', ticketRoutes);
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'Ok', timestamp: new Date().toISOString() });
});

module.exports = router;