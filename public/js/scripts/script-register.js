const form = document.querySelector('form');
const usernameInput = document.querySelector("#username");
const idUserInput = document.querySelector("#id-user");

const apiInfos = {
    ip: window.env.ip,
    port: window.env.apiPort
}

const url = `http://${apiInfos.ip}:${apiInfos.port}`;

console.log(`${url}/health`);

form.addEventListener('submit', event => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const idUser = idUserInput.value.trim();

    if (username === "" || idUser === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch(`${url}/health`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao conectar com o servidor.");
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            if (data.status = 'OK') {
                fetch(`${url}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: username,
                        username: idUser,
                    }),
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`Erro ${res.status}: ${res.statusText}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data.error) {
                            throw new Error(data.error);
                        }

                        console.log(`Usuário "${data.username}" criado com sucesso!`);
                        alert(`Usuário "${data.username}" criado com sucesso!`);
                    })
                    .catch(error => {
                        console.error("Erro:", error.message);
                        alert("Erro ao criar usuário. Tente novamente mais tarde.");
                    });
            }
        })
        .catch(error => {
            console.error("Erro:", error.message);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        });
});