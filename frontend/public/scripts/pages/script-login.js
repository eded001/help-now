const form = document.querySelector('form');
const userUsernameInput = document.querySelector("#id-user");
const userPasswordInput = document.querySelector("#pass-user");

import { login } from "./utils/user.util.js";

form.addEventListener('submit', event => {
    event.preventDefault();

    const user = {
        username: userUsernameInput.value,
        password: userPasswordInput.value
    }

    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    } else {
        login(user);
    }
});