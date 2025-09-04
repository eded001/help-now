const { registerConnection, broadcastToSupports, sendToUser } = require('../managers/connection.manager');
const prisma = require('../../../prisma/client');

async function handleIncomingMessage(socket, data) {
    try {
        const message = JSON.parse(data);
        let ticket;

        switch (message.type) {
            case 'client-init':
                registerConnection(socket, 'client', message.user.username);

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
                registerConnection(socket, 'support', message.user.username);

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
                console.log(message.payload);
                console.log('=============================================');
                console.log();

                ticket = await prisma.ticket.create({
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
                    id: message.id,
                    payload: ticketInfos
                }));

                broadcastToSupports({
                    type: 'client-request',
                    id: message.id,
                    payload: ticketInfos,
                    user: message.user
                });
                break;

            case 'support-message':
                console.log('================SUPPORT-MESSAGE==============');
                console.log(`[SUPPORT-MESSAGE] Usuário: ${message.user.name} (${message.user.username})`);
                console.log("[SUPPORT-MESSAGE] Conteúdo:");
                console.log(message.payload);
                console.log('=============================================');
                console.log();

            case 'support-response':
                console.log('================SUPPORT-RESPONSE=============');
                console.log(`[SUPPORT-MESSAGE] Usuário: ${message.user.name} (${message.user.username})`);
                console.log("[SUPPORT-MESSAGE] Conteúdo:");
                console.log(message.payload);
                console.log('=============================================');
                console.log();

                const { id, status, date_closed } = message.payload;

                const statusFormatted = status.replace("-", "_").toUpperCase();

                const updateData = { status: statusFormatted };

                if (status === 'closed' && date_closed) {
                    updateData.resolved_at = new Date(date_closed);
                }

                ticket = await prisma.ticket.update({
                    where: { id },
                    data: updateData,
                });

                sendToUser(message.target, 'client', {
                    type: 'support-response',
                    payload: message.payload,
                    user: message.user
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