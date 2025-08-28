const { registerConnection, broadcastToSupports } = require('../managers/connection.manager');

function handleIncomingMessage(socket, data) {
    try {
        const message = JSON.parse(data);

        switch (message.type) {
            case 'init':
                registerConnection(socket, 'client', message.id);

                console.log(`[RECEIVED] Mensagem do socket: ${socket.userId || "não registrado"}`);
                console.log("[RECEIVED] Conteúdo:");
                console.log(message);
                console.log('-----------------------------------');

                socket.send(JSON.stringify({
                    type: 'confirmation',
                    payload: 'Cliente conectado'
                }));
                break;

            case 'support-init':
                registerConnection(socket, 'support', message.id);
                socket.send(JSON.stringify({
                    type: 'confirmation',
                    payload: 'Suporte conectado'
                }));
                break;

            case 'client-message':
                broadcastToSupports({
                    type: 'client-message',
                    clientId: message.clientId,
                    payload: message.payload
                });
                break;

            default:
                console.warn("Tipo de mensagem não reconhecido:", message.type);
        }
    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
    }
}

module.exports = { handleIncomingMessage };