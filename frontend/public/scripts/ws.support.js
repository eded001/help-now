import { generateSessionId, generateUUID } from "./utils/uuid.util.js";
import { env } from "./constants/main.constant.js";
import { addTicketToDOM } from "./utils/ticket.util.js";
import { getUserInfos } from "./utils/sessionInfo.util.js";

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

    webSocket.addEventListener("error", (err) => {
        console.error("Erro no WebSocket:", err);
    });

    webSocket.addEventListener("close", () => {
        console.log("WebSocket do suporte fechado");
    });
}

function sendMessage(data) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
    } else {
        console.warn("WebSocket do cliente não está pronto para envio");
    }
}

async function sendMessageToClient(clientId, payload) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        const { username, name } = await getUserInfos();

        const message = {
            type: "support-message",
            id: supportId,
            target: clientId,
            payload,
            user: { username, name }
        };
        sendMessage(JSON.stringify(message));
    } else {
        console.warn("WebSocket não está pronto para enviar mensagens");
    }
}

function handleSupportMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case 'client-request':
            console.log(response.payload);
            addTicketToDOM(response.payload, document.querySelector('.user__tickets'), "support");
            break;
        case 'confirmation':
            console.log(response.payload);
            break;

        default:
            console.log("Mensagem recebida:", response);
    }
}

function getWebSocket() {
    return webSocket;
}

function getSupportId() {
    return supportId;
}

export { startSession, sendMessage, sendMessageToClient, handleSupportMessage, getWebSocket, getSupportId };