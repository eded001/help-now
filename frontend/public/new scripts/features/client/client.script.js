import { getUserInfos } from "../../core/utils/session.util.js";
import { elements } from "../../core/constants/elements.constant.js";
import { problems } from "../../core/constants/main.constant.js";
import { startClientSession } from "./ws.client.js";

window.addEventListener("DOMContentLoaded", async () => {
    const user = await getUserInfos();
    if (!user) return;

    elements.nameUser.textContent = user.name;

    problems.forEach(problem => {
        const opt = document.createElement("option");
        opt.value = problem;
        opt.textContent = problem;
        elements.problemCategorySelect.appendChild(opt);
    });

    startClientSession();
});