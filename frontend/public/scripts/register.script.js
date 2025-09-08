const form = document.querySelector('form');
const userNameInput = document.querySelector("#username-user");
const userUsernameInput = document.querySelector("#id-user");
const userPasswordInput = document.querySelector("#pass-user");
const userDepartmentInput = document.querySelector("#department-user");
import { populateSelect } from "./utils/dom.util.js";
import { departments } from "./constants/main.constant.js";

import { register, login } from "./utils/user.util.js";

document.addEventListener("DOMContentLoaded", () => {
    populateSelect(document.querySelector('#department-user'), departments);
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    const user = {
        name: userNameInput.value.trim(),
        username: userUsernameInput.value.trim(),
        password: userPasswordInput.value,
        department: userDepartmentInput.value
    };

    if (!user.name || !user.username || !user.password) {
        console.warn('[Cadastro] Campos obrigatórios faltando.');
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await register(user);

        const data = await response.json();

        if (data.success) {
            const loginResponse = await login({ username: user.username, password: user.password });

            const loginData = await loginResponse.json();

            if (loginData.success) {
                window.location.href = '/';
            }
        } else {
            if (!response.ok) {
                if (response.status === 409) {
                    console.warn('[Cadastro] Usuário já existe.');
                    alert('Usuário já existe.');
                } else {
                    alert('Falha no cadastro.');
                }
            }
        }
    } catch (error) {
        console.error('[Cadastro] Erro inesperado:', error);
        alert('Erro de conexão com o servidor.');
    }
});