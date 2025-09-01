import { generateSessionId, generateUUID } from "./utils/uuid.util.js";
import { env } from "./constants/main.constant.js";
import { addTicketToDOM, createTicket } from "./utils/ticket.util.js";
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
        console.log("Mensagem enviada ao servidor");
    } else {
        console.warn("WebSocket do cliente não está pronto para envio");
    }
}

async function sendMessageToClient(targetClientId, payload) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {

        const { username, name } = await getUserInfos();

        const message = {
            type: "support-message",
            id: supportId,
            targetClientId,
            payload,
            user: { username, name }
        };
        webSocket.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket não está pronto para enviar mensagens");
    }
}

function handleSupportMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case 'client-message':
            console.log(`Mensagem do cliente [${response.clientId}]: ${response.payload}`);
            console.log(response.payload);

            createTicket(response.payload);
            addTicketToDOM(response.payload, document.querySelector('.user__tickets'));
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

export { startSession, sendMessageToClient, handleSupportMessage, getWebSocket, getSupportId };