const express = require('express');
const session = require('express-session');
require('dotenv').config({ path: '../../.env' });

const webApp = require('./src/web/app.web'); // rotas web
const apiApp = require('./src/api/app.api'); // rotas API
const createWebSocketServer = require('./src/ws/app.websocket');

const app = express();

app.use(session({
    secret: 'default-secret', // ideal usar process.env.SECRET_KEY
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true se estiver usando HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
    },
}));

// rotas da API
app.use(apiApp);

// rotas da aplicação Web
app.use(webApp);

const server = require('http').createServer(app);

const { IP, PORT } = process.env;

// cria o servidor WebSocket em cima do mesmo HTTP
createWebSocketServer(server, { ip: IP, port: PORT });

server.listen(PORT, () => {
    console.log(`> Network: http://${IP}:${PORT}`);
    console.log(`> Local:   http://localhost:${PORT}`);
});
