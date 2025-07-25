const messagesContainer = document.querySelector('#messages');
const buttonFree = document.querySelector('#button-free');

let webSocket, busy;

const webSocketInfos = {
    ip: window.env.ip,
    port: window.env.webSocketPort
};

window.addEventListener('DOMContentLoaded', () => {
    if (webSocket?.readyState === WebSocket.OPEN) {
        console.log('WebSocket connection established');
        return;
    }

    const hostId = `host-${generateUUID()}`;
    webSocket = new WebSocket(`ws://${webSocketInfos.ip}:${webSocketInfos.port}`);

    webSocket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        messagesContainer.hidden = false;

        sendMessage({
            type: 'init',
            id: hostId,
            host: true
        });
    });

    webSocket.addEventListener('message', handleIncomingMessage);
    webSocket.addEventListener('error', err => console.error('Erro WebSocket: ', err));
});

buttonFree.addEventListener('click', () => {
    if (buttonFree.textContent === 'Livre') {
        buttonFree.textContent = 'Ocupado';
        busy = true;
        console.log("ocupado");
    } else {
        buttonFree.textContent = 'Livre';
        busy = false;
        console.log("livre");
    }
});

function handleIncomingMessage(event) {
    const { content, id } = JSON.parse(event.data);

    if (busy) {
        sendMessage({
            type: 'host-busy',
            to: id,
            message: "Pera aí rapidola que ele tá ocupado agora"
        });
    }

    if (!content || !id) {
        console.warn('Mensagem inesperada ou mal formatada: ', event.data);
        return;
    }

    const existing = messagesContainer.querySelector(`[data-id="${id}"]`);

    if (content.status === 'cancelled') {
        if (existing) {
            // existing.remove();

            existing.style.backgroundColor = "#cc3b3b";
            existing.children[0].style.color = "#5c0808";
            existing.children[1].style.color = "#700a0a";
            existing.children[2].style.color = "#850d0d";
            existing.children[3].style.color = "#910f0f";

            existing.style.border = '2px solid #b30000';
            existing.querySelector('button')?.remove();

            const cancelledTag = document.createElement('p');
            cancelledTag.textContent = 'Chamado cancelado pelo usuário';
            cancelledTag.style.color = '#b30000';

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remover';
            removeButton.style.backgroundColor = '#880c0c';
            removeButton.style.color = '#e86f6f';
            removeButton.classList.add("remove");
            removeButton.addEventListener('click', () => {
                existing.remove();
            });

            existing.appendChild(cancelledTag);
            existing.appendChild(removeButton);
        }
        return;
    }

    if (existing) {
        console.warn('Chamado já exibido: ', id);
        return;
    }

    // Caso novo chamado
    const messageElement = createMessageElement({ content, id });
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement({ content, id }) {
    const container = document.createElement('div');
    container.classList.add('message');
    container.dataset.id = id;

    const title = document.createElement('h1');
    const department = document.createElement('h2');
    const author = document.createElement('h3');
    const description = document.createElement('p');
    const confirmButton = document.createElement('button');
    const status = document.createElement('p');

    title.textContent = getProblemLabel(content.option);
    department.textContent = `Setor/Departamento: ${content.department}`;
    author.textContent = `Servidor(a): ${content.name}`;
    description.textContent = content.description;
    status.textContent = content.status;
    confirmButton.textContent = 'Confirmar recebimento';

    confirmButton.addEventListener('click', event => {
        const parent = event.target.parentNode;

        if (!isWebSocketOpen()) {
            alert('WebSocket desconectado. Atualize a página.');
            return;
        }

        sendMessage({
            type: 'host-confirm',
            to: id,
            message: `Sua mensagem foi lida pelo host às ${new Date().toLocaleTimeString()}`
        });

        confirmButton.disabled = true;
        confirmButton.textContent = 'Confirmado';

        parent.style.backgroundColor = "#3bcc47";
        parent.style.color = "#195c08";

        parent.children[0].style.color = "#085c16";
        parent.children[1].style.color = "#0d700a";
        parent.children[2].style.color = "#11850d";
        parent.children[3].style.color = "#0d850d";
    });

    container.append(title, department, author, description, confirmButton);
    return container;
}

function getProblemLabel(key) {
    const problems = {
        bug: 'Bug',
        technical: 'Problema técnico',
        'activation-recurse': 'Problema de ativação de recurso',
        'sharing-recurse': 'Problema de compartilhamento de recurso',
        other: 'Outro'
    };

    return problems[key] || 'Desconhecido';
}

function isWebSocketOpen() {
    return webSocket?.readyState === WebSocket.OPEN;
}

function sendMessage(data) {
    if (isWebSocketOpen()) {
        webSocket.send(JSON.stringify(data));
    } else {
        console.error('Não foi possível enviar mensagem. WebSocket não está conectado.');
    }
}

function generateUUID() {
    return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}