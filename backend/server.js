require('dotenv').config({ path: './.env' });

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';

const dirs = {
    public: path.join(__dirname, '../public'),
    pages: path.join(__dirname, '../public/pages')
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let filePath;
    let contentType;

    console.log(`Request: ${req.url}`);

    if (req.url === '/') {
        filePath = path.join(dirs.pages, 'login.html');
        contentType = 'text/html';
    } else if (req.url === '/register') {
        filePath = path.join(dirs.pages, 'register.html');
        contentType = 'text/html';
    } else if (req.url === '/app') {
        filePath = path.join(dirs.pages, 'client.html');
        contentType = 'text/html';
    } else {
        const ext = path.extname(req.url);
        contentType = mimeTypes[ext] || 'application/octet-stream';

        const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
        filePath = path.join(dirs.public, safePath);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Página não encontrada</h1>');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, IP, () => {
    console.log(`Servidor rodando em http://${IP}:${PORT}`);
});