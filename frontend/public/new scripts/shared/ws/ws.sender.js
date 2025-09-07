import { getWebSocket } from "./ws.factory.js";
import { stringifyMessage } from "./ws.helper.js";

export function sendMessage(type, payload) {
    const ws = getWebSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(stringifyMessage({ type, payload }));
        console.log("📤 Mensagem enviada:", type, payload);
    } else {
        console.warn("⚠️ Não foi possível enviar, WebSocket não está aberto.");
    }
}