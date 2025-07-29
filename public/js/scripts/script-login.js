const form = document.querySelector('form');
const idUserInput = document.querySelector("#id-user");
const passUserInput = document.querySelector("#pass-admin") || false;
const { ip, port } = window.env;

const url = `http://${ip}:${port}/api`;

form.addEventListener('submit', event => {
    event.preventDefault();

    const idUser = idUserInput.value.trim();
    const passUser = passUserInput ? passUserInput.value.trim() : false;

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
                return login({username: idUser, password: passUser})
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