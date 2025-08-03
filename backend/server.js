require('dotenv').config();

const http = require('http');
const express = require('express');
const session = require('express-session');

const webApp = require('./src/web/app.web'); // rotas web
const apiApp = require('./src/api/app.api'); // rotas API
const websocket = require('./src/ws/websocket'); // websocket

const app = express();

app.use(session({
    secret: 'default-secret', // process.env.SECRET_KEY
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

const server = http.createServer(app);

websocket(server);

const { IP, PORT } = process.env;

server.listen(PORT, () => {
    console.log(`> Network: http://${IP}:${PORT}`);
    console.log(`> Local:   http://localhost:${PORT}`);
});