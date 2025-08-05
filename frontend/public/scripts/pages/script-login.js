const form = document.querySelector('form');
const userUsernameInput = document.querySelector("#user-username");
const userPasswordInput = document.querySelector("#user-password");

import { login, checkAuth } from "./utils/user.util.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth().then(response => {
        if (!response.authenticated) {
            window.location.href = '/';
        }
    });
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const user = {
        username: userUsernameInput.value,
        password: userPasswordInput.value
    }

    if (!user.username || !user.password) {
        alert('Por favor, preencha todos os campos.');
        return;
    } else {
        login(user).then(response => {
            if (response.success) {
                window.location.href = '/';
            }
        }).catch(error => {
            console.log(error);
        });
    }
});