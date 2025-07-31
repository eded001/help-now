// NOTE arquivo que junta todas as rotas da API

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

// error handler no fim, para capturar erros das rotas acima
app.use(errorHandler);

module.exports = app;