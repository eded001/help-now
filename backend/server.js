require('dotenv').config({ path: './.env' });

const http = require('http');
const fs = require('fs');
const path = require('path');

const dirs = {
    pages: path.join(__dirname, '../public/pages'),
    css: path.join(__dirname, '../public/css'),
    js: path.join(__dirname, '../public/js/scripts'),
    public: path.join(__dirname, '../public')
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

// Função genérica para criar servidor
function createServer(port, ip, homePage) {
    const server = http.createServer((req, res) => {
        let filePath = '';
        let contentType = 'text/plain';

        console.log(`Request for: ${req.url} from IP: ${req.socket.remoteAddress}`);

        if (req.url === '/') {
            filePath = path.join(dirs.pages, homePage);
            contentType = 'text/html';
        } else {
            const ext = path.extname(req.url);
            contentType = mimeTypes[ext] || 'application/octet-stream';

            const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
            filePath = path.join(dirs.public, safePath);
        }

        if (!filePath.startsWith(dirs.public)) {
            res.writeHead(403);
            res.end('Acesso negado');
            console.warn('Tentativa de acesso indevido: ', filePath);
            return;
        }

        fs.readFile(filePath, (error, data) => {
            if (error) {
                const notFoundPath = path.join(dirs.pages, 'not-found.html');
                fs.readFile(notFoundPath, (err404, data404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    if (err404) {
                        res.end('<h1>404 - Página não encontrada</h1>');
                    } else {
                        res.end(data404);
                    }
                });
                console.warn('Não encontrado: ', filePath);
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });

    server.listen(port, ip, () => {
        console.log(`Servidor rodando em http://${ip}:${port} (${homePage})`);
    });
}

// Iniciar os dois servidores
createServer(process.env.HOST_PORT, process.env.IP, 'host.html');
createServer(process.env.CLIENT_PORT, process.env.IP, 'client.html');