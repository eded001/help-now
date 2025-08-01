const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const router = express.Router();

router.use(cors({ origin: '*' }));
router.use(express.json());

// health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'Ok', timestamp: new Date().toISOString() });
});

router.use('/api', routes);

// error handler no fim
router.use(errorHandler);

module.exports = router;