const http = require('http');
const appApi = require('./src/api/app.api');
const appWeb = require('./src/web/app.web');
require('dotenv').config();

const serverWeb = http.createServer(appWeb);

// inicia WebSocket
require('./src/ws/websocket')(serverWeb);

// web
serverWeb.listen(process.env.PORT, () => {
    console.log(`Servidor Web rodando em http://${process.env.IP}:${process.env.PORT}`);
});

// api
appApi.listen(process.env.API_PORT, () => {
    console.log(`Servidor API rodando em http://${process.env.IP}:${process.env.API_PORT}/api`);
});