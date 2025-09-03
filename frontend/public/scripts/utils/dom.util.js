function populateSelect(selectElement, options) {
    for (const [key, value] of Object.entries(options)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        selectElement.appendChild(option);
    }
}

function createMessageElement({ content, id }, sendMessage) {
    const container = document.createElement('div');
    container.classList.add('message');
    container.dataset.id = id;

    const title = document.createElement('h1');
    const department = document.createElement('h2');
    const author = document.createElement('h3');
    const confirmButton = document.createElement('button');

    department.textContent = `Setor/Departamento: ${content.department}`;
    author.textContent = `Servidor(a): ${content.name}`;
    confirmButton.textContent = 'Confirmar recebimento';

    confirmButton.addEventListener('click', event => {
        const parent = event.target.parentNode;
        if (!sendMessage) return;

        sendMessage({
            type: 'host-confirm',
            id: id,
            payload: `Sua mensagem foi lida pelo host às ${new Date().toLocaleTimeString()}`
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

    container.append(title, department, author, confirmButton);
    return container;
}

export { populateSelect, createMessageElement };