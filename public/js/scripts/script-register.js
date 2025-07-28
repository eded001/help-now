const form = document.querySelector('form');
const usernameInput = document.querySelector("#username");
const idUserInput = document.querySelector("#id-user");

const apiInfos = {
    ip: window.env.ip,
    port: window.env.apiPort
}

const url = `http://${apiInfos.ip}:${apiInfos.port}`;

form.addEventListener('submit', event => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const idUser = idUserInput.value.trim();

    if (username === "" || idUser === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch(url + '/health')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao conectar com o servidor.");
            return response.json();
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            if (data.status === 'OK') {
                return fetch(url + '/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: username,
                        username: idUser,
                    }),
                });
            } else {
                throw new Error('Servidor indisponível');
            }
        })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Erro ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            alert(`Usuário "${data.username || data.name}" criado com sucesso!`);
            window.location.href = '/app';
        })
        .catch(error => {
            alert(`Erro ao criar usuário: ${error.message}`);
        });
});