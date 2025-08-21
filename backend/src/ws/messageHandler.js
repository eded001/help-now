const { registerConnection, getUser, getHost } = require('./connectionManager');
const { safeSend } = require('./utils');

function handleMessage(socket, data) {
    let msg;
    try {
        msg = JSON.parse(data);
    } catch {
        console.error("Mensagem inválida (JSON mal formado)");
        return;
    }

    switch (msg.type) {
        case 'init':
            registerConnection(socket, {
                id: msg.id,
                isHost: msg.host === true,
                sessionId: msg.session || 'no-session-id'
            });
            console.info(`[INIT] ${msg.host ? 'Host' : 'Cliente'} '${msg.id}'`);
            break;

        case 'message': {
            const client = getUser(msg.id);
            const host = getHost();
            if (client && host) {
                safeSend(host.socket, {
                    type: 'message',
                    session: client.sessionId,
                    id: msg.id,
                    content: msg.message,
                    time: new Date().toLocaleTimeString()
                });
                safeSend(client.socket, { type: 'confirmation', message: 'Recebida com sucesso!' });
            }
            break;
        }

        case 'host-confirm': {
            const client = getUser(msg.to);
            if (client) {
                safeSend(client.socket, { type: 'host-confirmation', message: msg.message });
            }
            break;
        }

        default:
            console.warn('Tipo de mensagem desconhecido:', msg.type);
    }
}

module.exports = handleMessage;