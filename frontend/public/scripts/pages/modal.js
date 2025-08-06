const supportButton = document.querySelector('.support-button');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const ticketForm = document.getElementById('ticketForm');

supportButton.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});

ticketForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const category = ticketForm.category.value.trim();
    const title = ticketForm.title.value.trim();
    const description = ticketForm.description.value.trim();

    console.log('Chamado enviado:', { category, title, description });

    alert('Chamado enviado com sucesso!');
    ticketForm.reset();
    modalOverlay.style.display = 'none';
});