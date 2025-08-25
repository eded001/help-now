const form = document.querySelector('form');
const userUsernameInput = document.querySelector("#user-username");
const userPasswordInput = document.querySelector("#user-password");

import { login, checkAuth } from "./utils/user.util.js";

document.addEventListener('DOMContentLoaded', async () => {
    const response = await checkAuth();

    if (response.status === 401) {
        console.warn('Usuário não autenticado');
        return;
    }

    const { authenticated } = await response.json();


    if (authenticated) {
        window.location.href = '/';
    }
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    const user = {
        username: userUsernameInput.value.trim(),
        password: userPasswordInput.value
    };

    if (!user.username || !user.password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await login(user);

        const data = await response.json();

        if (data.success) {
            window.location.href = '/';
        } else {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Senha incorreta. Tente novamente.');
                }
                if (response.status === 404) {
                    alert('Usuário não encontrado');
                }
                return;
            }
        }
    } catch (error) {
        console.error('Erro inesperado:', error);
        alert('Erro de conexão com o servidor.');
    }
});