import { generateSessionId, generateUUID } from "../utils/uuid.util.js";
import { env } from "../constants/main.constant.js";
import { addTicketToDOM } from "../utils/ticket.util.js";
import { getUserInfos } from "../utils/sessionInfo.util.js";

let webSocket = null;
let supportId = null;

const { ip, port } = env;

function startSession() {
    const sessionId = generateSessionId();
    supportId = generateUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket já conectado");
        return;
    }

    webSocket = new WebSocket(`ws://${ip}:${port}`);

    webSocket.addEventListener("open", async () => {
        const { username, name } = await getUserInfos();

        sendMessage({
            type: "support-init",
            id: supportId,
            session: sessionId,
            user: { username, name }
        });
    });

    webSocket.addEventListener("message", handleSupportMessage);

    webSocket.addEventListener("error", (error) => {
        console.error("Erro no WebSocket do suporte:", error);
    });

    webSocket.addEventListener("close", () => {
        console.log("WebSocket do suporte fechado");
    });
}

function sendMessage(data) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
    } else {
        console.warn("WebSocket do suporte não está pronto para envio");
    }
}

async function sendMessageToClient(targetId, payload) {
    try {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const { username, name } = await getUserInfos();

            const message = {
                type: "support-response",
                id: supportId,
                target: targetId,
                payload,
                user: { username, name }
            };

            console.log("mensagem:", message);

            sendMessage(message);
        } else {
            console.warn("WebSocket não está pronto para enviar mensagens");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem para cliente:", error);
    }
}

function handleSupportMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case "client-request":
            console.log("Novo ticket do cliente:", response.payload);

            const container = document.querySelector('.user__tickets');
            const ticket = addTicketToDOM(response.payload, "support");

            container.insertBefore(ticket, container.firstChild);
            break;

        case "confirmation":
            console.log(response.payload);
            break;

        default:
            console.warn("Mensagem não tratada:", response.payload);
    }
}

function getWebSocket() {
    return webSocket;
}

function getSupportId() {
    return supportId;
}

export { startSession, sendMessage, sendMessageToClient, handleSupportMessage, getWebSocket, getSupportId };