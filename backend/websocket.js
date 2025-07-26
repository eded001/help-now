require('dotenv').config({ path: './.env' });

const WebSocket = require('ws');

const IP = process.env.IP;
const PORT = process.env.HOST_WEBSOCKET_PORT;
const server = new WebSocket.Server({ port: PORT });

const clients = new Map();

server.on('connection', socket => {
    console.log('Cliente conectado');

    let id = null;
    let isHost = false;

    socket.on('message', data => {
        let msg;

        try {
            msg = JSON.parse(data);
        } catch (error) {
            console.error('[ERRO] Formato de mensagem inválido: ', error);
            return;
        }

        console.log('[RECEBIDO] Mensagem: ', msg);

        if (msg.type === 'init' && msg.id) {
            id = msg.id;
            isHost = msg.host === true;

            const sessionId = msg.session || 'no-session-id';

            clients.set(id, { socket, isHost, sessionId });

            console.info(`[INFO] ${isHost ? 'Host' : 'Cliente'} identificado como ${id}`);
            console.info(`[INFO] Sessão: ${sessionId}`);
            return;
        }

        if (msg.type === 'message' && msg.message && msg.id) {
            const clientEntry = clients.get(msg.id);
            if (!clientEntry || clientEntry.isHost) {
                console.warn('[NEGADO] Host tentando enviar chamado ou cliente não registrado: ', msg.id);
                return;
            }

            const fullMsg = {
                type: 'message',
                session: clientEntry.sessionId,
                id: msg.id,
                content: msg.message,
                time: new Date().toLocaleTimeString()
            };

            const messageString = JSON.stringify(fullMsg);

            const hostEntry = [...clients.entries()].find(([_, entry]) => entry.isHost);
            if (hostEntry && hostEntry[1].socket.readyState === WebSocket.OPEN) {
                hostEntry[1].socket.send(messageString);
                console.log(`[ENVIO] Mensagem enviada do cliente ${msg.id} para host`);
            } else {
                console.warn('[AVISO] Nenhum host conectado para receber mensagens');
            }

            // Confirmação ao cliente
            clientEntry.socket.send(JSON.stringify({
                type: 'confirmation',
                message: 'Sua mensagem foi recebida com sucesso!'
            }));
            console.log(`[CONFIRMAÇÃO] Enviada ao cliente ${msg.id}`);

            return;
        }

        if (msg.type === 'host-confirm' && msg.to && msg.message) {
            if (!isHost) {
                console.warn('[NEGADO] Cliente comum tentou enviar host-confirm');
                return;
            }

            const clientEntry = clients.get(msg.to);
            if (clientEntry && clientEntry.socket.readyState === WebSocket.OPEN) {
                clientEntry.socket.send(JSON.stringify({
                    type: 'host-confirmation',
                    message: msg.message
                }));
                console.log(`[HOST-CONFIRM] Confirmação enviada para o cliente ${msg.to}`);
                console.log('[HOST-CONFIRM] Conteúdo da confirmação: ', msg);
            } else {
                console.warn(`[AVISO] Cliente ${msg.to} não está conectado para receber confirmação`);
            }

            return;
        }

        if (msg.type === 'host-busy' && msg.to && msg.message) {
            if (!isHost) {
                console.warn('[NEGADO] Cliente comum tentou enviar host-busy');
                return;
            }

            const clientEntry = clients.get(msg.to);
            if (clientEntry && clientEntry.socket.readyState === WebSocket.OPEN) {
                clientEntry.socket.send(JSON.stringify({
                    type: 'host-busy',
                    message: msg.message
                }));
                console.log(`[HOST-BUSY] Mensagem de host ocupado enviada para o cliente ${msg.to}`);
                console.log('[HOST-BUSY] Conteúdo da mensagem: ', msg);
            } else {
                console.warn(`[AVISO] Cliente ${msg.to} não está conectado para receber a mensagem`);
            }

            return;
        }

        console.warn('[ERRO] Tipo de mensagem desconhecido ou mal formatado: ', msg.type);
        console.warn('[ERRO] Conteúdo da mensagem inválida: ', msg);
    });

    socket.on('close', () => {
        if (id) {
            clients.delete(id);
            console.log(`[DESCONECTADO] ${isHost ? 'Host' : 'Cliente'} ${id} foi removido da lista`);
        } else {
            console.log('[DESCONECTADO] Cliente desconhecido desconectado');
        }
    });
});

console.log(`🚀 Servidor WebSocket rodando em ws://${IP}:${PORT}`);