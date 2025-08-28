import { generateUUID } from "./utils/uuid.util.js";
import { env } from "./constants/main.constant.js";
import { createTicket } from "./utils/ticket.util.js";

let webSocket = null;
let supportId = null;

const { ip, port } = env;

function startSession() {
    supportId = generateUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket já conectado");
        return;
    }

    webSocket = new WebSocket(`ws://${ip}:${port}`);

    webSocket.addEventListener("open", () => {
        console.log("Conexão WebSocket do suporte estabelecida");

        sendMessage({
            type: "support-init",
            id: supportId,
            session: sessionId
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

function sendMessageToClient(targetClientId, payload) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        const message = {
            type: "support-message",
            id: supportId,
            targetClientId,
            payload
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

            console.log(createTicket(response.payload));
            break;

        case 'confirmation':
            console.log(`Confirmação do servidor: ${response.payload}`);
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