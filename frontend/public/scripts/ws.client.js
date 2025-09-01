import { generateSessionId, generateUUID } from "./utils/uuid.util.js";
import { env } from "./constants/main.constant.js";
import { getUserInfos } from "./utils/sessionInfo.util.js";

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
            type: "init",
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
        console.log("Mensagem enviada ao servidor");
    } else {
        console.warn("WebSocket do cliente não está pronto para envio");
    }
}

async function sendMessageToSupport(payload) {
    const { username, name } = await getUserInfos();

    sendMessage({
        type: "client-message",
        clientId,
        payload,
        user: { username, name }
    });
}

function handleClientMessage(event) {
    const response = JSON.parse(event.data);
    if (response.type === "confirmation") console.log(response.payload);
    else console.log("Mensagem recebida:", response);
}

function getWebSocket() {
    return webSocket;
}

function getClientId() {
    return clientId;
}

export { startSession, handleClientMessage, getWebSocket, getClientId, sendMessageToSupport };