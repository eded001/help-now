const form = document.querySelector('form');
const idUserInput = document.querySelector("#id-user");

const { ip, port } = window.env;

const url = `http://${ip}:${port}/api/user`;

form.addEventListener('submit', event => {
    event.preventDefault();

    const idUser = idUserInput.value.trim();
    if (idUser === "") {
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
                return fetch(url + '/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: idUser }),
                });
            } else {
                throw new Error('Servidor indisponível');
            }
        })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro desconhecido');
            }
            return res.json();
        })
        .then(data => {
            alert(`Bem-vindo, ${data.user.name}!`);
            window.location.href = '/';
        })
        .catch(err => {
            alert(`Falha no login: ${err.message}`);
        });
});