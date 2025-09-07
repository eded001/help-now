export function translateStatus(status) {
    const map = {
        open: "Aberto",
        in_progress: "Em andamento",
        closed: "Resolvido"
    };
    return map[status] || status;
}