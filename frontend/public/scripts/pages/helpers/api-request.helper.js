import { env } from "../../main.js";

async function request(endpoint, method, content = {}) {
    const url = `http://${env.ip}:${env.port}/api/${endpoint}`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    });

    if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
}

async function checkHealth() {
    const url = `http://${env.ip}:${env.port}/health`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao verificar health:", error.message);
        throw error;
    }
}

export { request, checkHealth };