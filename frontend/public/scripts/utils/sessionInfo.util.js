async function getSessionInfo() {
    return await fetch('/session-info');
}

export async function getUserInfos() {
    const response = await getSessionInfo();
    if (response.ok) {
        const data = await response.json();
        return {
            name: data.name,
            department: data.department
        };
    } else {
        console.error('Erro ao obter informações da sessão:', response.status);
        return { name: 'Usuário', department: 'Desconhecido' };
    }
}