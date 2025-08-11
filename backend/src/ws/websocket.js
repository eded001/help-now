require('dotenv').config({ path: '../../.env' });

const WebSocket = require('ws');

const IP = process.env.IP;
const PORT = process.env.PORT;

const clients = new Map();

module.exports = function (server) {
    const ws = new WebSocket.Server({ server });

    ws.on('connection', socket => {
        socket.isAlive = true;

        socket.on('pong', () => {
            socket.isAlive = true;
        });

        const interval = setInterval(() => {
            ws.clients.forEach(client => {
                if (!client.isAlive) {
                    return client.terminate();
                }
                client.isAlive = false;
                client.ping();
            });
        }, 5000); // verifica a cada 5s

        let id = null;
        let isHost = false;

        socket.on('message', data => {
            let msg;

            try {
                msg = JSON.parse(data);
            } catch (error) {
                console.error('Mensagem inválida (JSON mal formado):', error);
                return;
            }

            console.log('Mensagem recebida:', msg);

            // Inicialização da conexão
            if (msg.type === 'init' && msg.id) {
                id = msg.id;
                isHost = msg.host === true;
                const sessionId = msg.session || 'no-session-id';

                // Remove duplicata se já existir
                if (clients.has(id)) {
                    console.warn(`ID duplicado detectado (${id}), substituindo conexão antiga`);
                    const oldClient = clients.get(id);
                    oldClient.socket.close(); // Fecha a conexão anterior
                    clients.delete(id);
                }

                clients.set(id, { socket, isHost, sessionId });

                console.info(`[INIT] ${isHost ? 'Host' : 'Cliente'} identificado como '${id}'`);
                console.info(`[Sessão] ${sessionId}`);
                return;
            }

            // Cliente enviando mensagem para host
            if (msg.type === 'message' && msg.message && msg.id) {
                const clientEntry = clients.get(msg.id);

                if (!clientEntry || clientEntry.isHost) {
                    console.warn(`Mensagem rejeitada de ${msg.id}: ID não encontrado ou é host`);
                    return;
                }

                const hostEntry = [...clients.entries()].find(([_, entry]) => entry.isHost);

                if (hostEntry && hostEntry[1].socket.readyState === WebSocket.OPEN) {
                    const fullMsg = {
                        type: 'message',
                        session: clientEntry.sessionId,
                        id: msg.id,
                        content: msg.message,
                        time: new Date().toLocaleTimeString()
                    };

                    hostEntry[1].socket.send(JSON.stringify(fullMsg));
                    console.log(`Mensagem enviada do cliente '${msg.id}' para host`);
                } else {
                    console.warn('Nenhum host disponível para receber a mensagem');
                }

                clientEntry.socket.send(JSON.stringify({
                    type: 'confirmation',
                    message: 'Sua mensagem foi recebida com sucesso!'
                }));

                console.log(`Confirmação enviada ao cliente '${msg.id}'`);
                return;
            }

            // Host confirmando mensagem para cliente
            if (msg.type === 'host-confirm' && msg.to && msg.message) {
                if (!isHost) {
                    console.warn('Cliente comum tentou enviar host-confirm');
                    return;
                }

                const clientEntry = clients.get(msg.to);
                if (clientEntry?.socket.readyState === WebSocket.OPEN) {
                    clientEntry.socket.send(JSON.stringify({
                        type: 'host-confirmation',
                        message: msg.message
                    }));
                    console.log(`Confirmação enviada do host para o cliente '${msg.to}'`);
                } else {
                    console.warn(`Cliente '${msg.to}' não está disponível`);
                }

                return;
            }

            // Host enviando "ocupado"
            if (msg.type === 'host-busy' && msg.to && msg.message) {
                if (!isHost) {
                    console.warn('Cliente comum tentou enviar host-busy');
                    return;
                }

                const clientEntry = clients.get(msg.to);
                if (clientEntry?.socket.readyState === WebSocket.OPEN) {
                    clientEntry.socket.send(JSON.stringify({
                        type: 'host-busy',
                        message: msg.message
                    }));
                    console.log(`Host ocupado notificou cliente '${msg.to}'`);
                } else {
                    console.warn(`Cliente '${msg.to}' não disponível`);
                }

                return;
            }

            console.warn('Tipo de mensagem desconhecido:', msg.type);
        });

        socket.on('close', () => {
            clearInterval(interval);

            if (id && clients.has(id)) {
                clients.delete(id);
                console.log(`${isHost ? 'Host' : 'Cliente'} '${id}' desconectado e removido`);
            } else {
                console.log('Cliente não identificado foi desconectado');
            }
        });
    });

    console.log(`Servidor WebSocket em execução: ws://${IP}:${PORT}`);
}