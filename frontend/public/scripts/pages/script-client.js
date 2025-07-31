const { departments, problems } = window.allOptions;

const elements = {
    startButton: document.querySelector('#start'),
    submitButton: document.querySelector('#submit'),
    cancelButton: document.querySelector('#cancel'),
    form: document.querySelector('form'),
    ticketType: document.querySelector('#type'),
    clientName: document.querySelector('#name'),
    departmentSelect: document.querySelector('#departments'),
    descriptionField: document.querySelector('#description'),
    statusResponse: document.querySelector('#status'),
};

let webSocket, clientId;

const { ip, webSocketPort } = window.env;

document.addEventListener('DOMContentLoaded', () => {
    populateSelect(elements.departmentSelect, departments);
    populateSelect(elements.ticketType, problems);
});

window.addEventListener('beforeunload', event => {
    if (elements.statusResponse.textContent !== "Suporte a caminho!") {
        event.preventDefault();
        event.returnValue = '';
    }
});

function populateSelect(selectElement, options) {
    const defaultOption = document.createElement('option');
    defaultOption.value = 'none';
    defaultOption.textContent = 'Selecione...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    for (const [key, value] of Object.entries(options)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        selectElement.appendChild(option);
    }
}

elements.startButton.addEventListener('click', startSession);
elements.form.addEventListener('submit', handleSubmit);
elements.cancelButton.addEventListener('click', handleCancel);

function startSession() {
    const sessionId = generateSessionId();

    clientId = generateUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log('WebSocket connection already established');
        return;
    }

    webSocket = new WebSocket(`ws://${ip}:${webSocketPort}`);

    webSocket.addEventListener('open', () => {
        console.log('WebSocket connection established');

        showElements(true);

        sendMessage({
            type: 'init',
            id: clientId,
            session: sessionId
        });
    });

    webSocket.addEventListener('message', handleWebSocketMessage);
    webSocket.addEventListener('error', error => {
        console.error('WebSocket error: ', error);

        showElements(false);
    });
    webSocket.addEventListener('close', () => {
        console.log('WebSocket connection closed')

        showElements(false);
    });
}

function handleWebSocketMessage(event) {
    const response = JSON.parse(event.data);

    switch (response.type) {
        case 'confirmation':
            console.log('Confirmação do servidor: ', response.message);
            break;
        case 'host-confirmation':
            elements.cancelButton.disabled = true;
            updateStatus("Suporte a caminho!", "#1dc42b", true);
            break;
        case 'host-busy':
            updateStatus("Os técnicos estão ocupados, aguarde alguns instantes", "#c4441d", true);
            break;
        default:
            console.log('Mensagem do servidor: ', response);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const fields = [
        elements.clientName,
        elements.ticketType,
        elements.departmentSelect,
        elements.descriptionField
    ];

    const invalid = fields.some(element => element.tagName === 'SELECT' ? element.value === 'none' : !element.value.trim());

    if (invalid) {
        alert('Por favor, preencha todos os campos corretamente antes de enviar.');
        return;
    }

    fields.forEach(element => element.disabled = true);
    elements.cancelButton.disabled = false;

    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
        alert('Erro: WebSocket não está conectado. Por favor, inicie a conexão primeiro.');
        elements.form.hidden = true;
        return;
    }

    const message = {
        type: 'message',
        id: clientId,
        host: false,
        message: {
            name: elements.clientName.value.trim(),
            option: elements.ticketType.value,
            department: elements.departmentSelect.value,
            description: elements.descriptionField.value.trim(),
            status: 'active'
        }
    };

    sendMessage(message);
    updateStatus("Aguardando resposta...", "#1d2dc4", true);
}

function handleCancel(event) {
    event.preventDefault();

    const confirmed = confirm('Tem certeza que deseja cancelar o chamado?');

    if (confirmed) {
        const message = {
            type: 'message',
            id: clientId,
            host: false,
            message: {
                status: 'cancelled'
            }
        };

        sendMessage(message);

        resetSession();
    }
}

function resetSession() {
    if (webSocket?.readyState === WebSocket.OPEN) {
        webSocket.close();
    }

    elements.form.reset();
    elements.form.hidden = true;
    elements.form.style.display = 'none';
    elements.startButton.hidden = false;
    elements.cancelButton.disabled = true;

    updateStatus('Esperando o envio...', '#c48a1d', false);

    const inputs = elements.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = false;
        if (input.tagName === 'SELECT') input.value = 'none';
    });
}

function updateStatus(message, color, disableSubmit) {
    elements.statusResponse.textContent = message;
    elements.statusResponse.style.color = color;
    elements.submitButton.disabled = disableSubmit;
}

function sendMessage(data) {
    if (webSocket?.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(data));
        console.log('Mensagem enviada ao servidor');
    } else {
        console.error('WebSocket não está pronto para enviar mensagens.');
    }
}

function generateUUID() {
    return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateSessionId(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function showElements(bool) {
    elements.startButton.hidden = bool;
    bool ? elements.form.removeAttribute('style') : null;
    elements.form.hidden = !bool;
}