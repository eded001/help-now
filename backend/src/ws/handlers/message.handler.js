const { registerConnection, broadcastToSupports } = require('../managers/connection.manager');
const prisma = require('../../../prisma/client');

async function handleIncomingMessage(socket, data) {
    try {
        const message = JSON.parse(data);

        switch (message.type) {
            case 'init':
                registerConnection(socket, 'client', message.id, message.user.username);

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
                    payload: 'Suporte conectado',
                    username: message.user.username
                }));
                break;

            case 'client-message':
                broadcastToSupports({
                    type: 'client-message',
                    clientId: message.clientId,
                    payload: message.payload,
                    user: message.user
                });

                await prisma.ticket.create({
                    data: {
                        title: message.payload.title,
                        category: message.payload.category,
                        priority: message.payload.priority,
                        created_by: {
                            connect: { username: message.payload.username }
                        },
                    }
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