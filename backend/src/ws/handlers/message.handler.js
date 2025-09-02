const { registerConnection, broadcastToSupports } = require('../managers/connection.manager');
const prisma = require('../../../prisma/client');

async function handleIncomingMessage(socket, data) {
    try {
        const message = JSON.parse(data);

        switch (message.type) {
            case 'client-init':
                registerConnection(socket, 'client', message.id, message.user.username);

                console.log('=================CLIENT-INIT=================');
                console.log(`[USER-INFO] Usuário: ${message.user.name} (${message.user.username})`);
                console.log('=============================================');
                console.log();

                socket.send(JSON.stringify({
                    type: 'confirmation',
                    payload: 'Cliente conectado'
                }));
                break;

            case 'support-init':
                registerConnection(socket, 'support', message.id, message.user.username);

                console.log('=================SUPPORT-INIT================');
                console.log(`[SUPPORT-INFO] Usuário: ${message.user.name} (${message.user.username})`);
                console.log('=============================================');
                console.log();

                socket.send(JSON.stringify({
                    type: 'confirmation',
                    payload: 'Suporte conectado',
                    username: message.user.username
                }));
                break;

            case 'client-request':
                console.log('=================CLIENT-INFO=================');
                console.log(`[CLIENT-INFO] Usuário: ${message.user.name} (${message.user.username})`);
                console.log("[CLIENT-REQUEST] Conteúdo:");
                // console.log(message.payload);
                console.log(message);
                console.log('=============================================');
                console.log();

                const ticket = await prisma.ticket.create({
                    data: {
                        title: message.payload.title,
                        category: message.payload.category,
                        priority: message.payload.priority,
                        created_by: {
                            connect: { username: message.payload.username }
                        },
                    },
                    include: {
                        created_by: true
                    }
                });

                console.log(ticket);

                const ticketInfos = {
                    id: ticket.id,
                    title: ticket.title,
                    status: ticket.status.toLowerCase(),
                    priority: ticket.priority,
                    category: ticket.category,
                    name: ticket.created_by.name,
                    username: ticket.created_by.username,
                    createdAt: ticket.created_at,
                    department: ticket.created_by.department
                };

                socket.send(JSON.stringify({
                    type: 'db-info',
                    clientId: message.clientId,
                    payload: ticketInfos
                }));

                broadcastToSupports({
                    type: 'client-request',
                    clientId: message.clientId,
                    payload: ticketInfos,
                    user: message.user
                });
                break;

            case 'support-message':
                console.log('=================SUPPORT-MESSAGE===============');
                console.log(`[SUPPORT-MESSAGE] Usuário: ${message.user.name} (${message.user.username})`);
                console.log("[SUPPORT-MESSAGE] Conteúdo:");
                // console.log(message.payload);
                console.log(message);
                console.log('=============================================');
                console.log();

            default:
                console.warn("Tipo de mensagem não reconhecido:", message.type);
        }
    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
    }
}

module.exports = { handleIncomingMessage };