const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const router = express.Router();

router.use(cors({ origin: '*' }));
router.use(express.json());

router.use('/api', routes);

// error handler no fim
router.use(errorHandler);

module.exports = router;