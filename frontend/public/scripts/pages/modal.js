const supportButton = document.querySelector('.support-button');
const modal = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const ticketForm = document.getElementById('ticketForm');

supportButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('show')) {
        modal.style.display = 'none';
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
});