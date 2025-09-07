import { parseMessage } from "./ws.helper.js";

export function handleOpen() {
    console.log("✅ WebSocket conectado");
}

export function handleMessage(event) {
    const data = parseMessage(event.data);
    console.log("📩 Mensagem recebida:", data);

    // aqui você pode direcionar para funções específicas
    if (data.type === "ticket") {
        console.log("Novo ticket recebido:", data.payload);
    }
}

export function handleError(error) {
    console.error("❌ Erro no WebSocket:", error);
}

export function handleClose() {
    console.log("🔌 WebSocket fechado");
}