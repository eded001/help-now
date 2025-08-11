import getNameUser from "./utils/getSessionInfo.util.js";

document.addEventListener("DOMContentLoaded", async () => {
    const nameUserSpan = document.querySelector("#name-user");

    const userName = await getNameUser();
    nameUserSpan.textContent = userName;
});