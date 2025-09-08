import { startSession } from "./ws.support.js";

// utils e helpers
import { getUserInfos } from "../utils/sessionInfo.util.js";
import { renderUnassigned } from "../utils/renderUnassigned.util.js";

window.addEventListener("DOMContentLoaded", async () => {
    const nameUserSpan = document.querySelector("#name-user");

    const { name } = await getUserInfos();
    nameUserSpan.textContent = name;

    renderUnassigned();

    startSession();
});