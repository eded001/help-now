import { generateSessionId, generateUUID } from "../utils/uuid.util.js";
import { env } from "../constants/main.constant.js";
import { getUserInfos } from "../utils/sessionInfo.util.js";
import { addTicketToDOM } from "../utils/ticket.util.js";
import { statusMap } from "../helpers/ticketState.helper.js";

let webSocket = null;
let clientId = null;

const { ip, port } = env;

function startSession() {
    const sessionId = generateSessionId();
    clientId = generateUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket já conectado");
        return;
    }

    webSocket = new WebSocket(`ws://${ip}:${port}`);

    webSocket.addEventListener("open", async () => {
        const { username, name } = await getUserInfos();

        sendMessage({
            type: "client-init",
            id: clientId,
            session: sessionId,
            user: { username, name }
        });
    });

    webSocket.addEventListener("message", handleClientMessage);

    webSocket.addEventListener("error", (error) => {
        console.error("Erro no WebSocket do cliente:", error);
    });

    webSocket.addEventListener("close", () => {
        console.log("WebSocket do cliente fechado");
    });
}

function sendMessage(data) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
    } else {
        console.warn("WebSocket do cliente não está pronto para envio");
    }
}

async function sendMessageToSupport(payload) {
    try {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const { username, name } = await getUserInfos();

            const message = {
                type: "client-request",
                id: clientId,
                payload,
                user: { username, name }
            };

            sendMessage(message);
        } else {
            console.warn("WebSocket não está pronto para enviar mensagens");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem para suporte:", error);
    }
}

function handleClientMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case "confirmation":
            console.log(response.payload);
            break;

        case "db-info":
            console.log("Informações recebidas do DB:", response.payload);

            const container = document.querySelector('.user__tickets');
            const ticket = addTicketToDOM(response.payload, "client");

            container.insertBefore(ticket, container.firstChild);

            break;

        case "support-response":
            console.log("Resposta do suporte:", response.payload);

            const ticketContainer = document.querySelector('.user__tickets');
            const ticketElement = [...ticketContainer.querySelectorAll('.ticket')]
                .find(t => t.querySelector('.ticket__code').textContent.includes("#" + response.payload.id));

            if (ticketElement) {
                const statusEl = ticketElement.querySelector('.ticket__status');
                statusEl.textContent = statusMap[response.payload.status]?.text || '';
                statusEl.className = `ticket__status ${statusMap[response.payload.status]?.class || ''}`;

                const infoEl = ticketElement.querySelector('.ticket__info');
                if (response.payload.status === 'closed' && response.payload.date_closed) {
                    const date = new Date(response.payload.date_closed);
                    infoEl.textContent = `Fechado em ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                } else if (response.payload.createdAt) {
                    const date = new Date(response.payload.createdAt);
                    infoEl.textContent = `Aberto em ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                }
            }

            break;

        default:
            console.warn("Mensagem de tipo desconhecido: ", response.type);
    }
}

function getWebSocket() {
    return webSocket;
}

function getClientId() {
    return clientId;
}

export { startSession, handleClientMessage, getWebSocket, getClientId, sendMessageToSupport };