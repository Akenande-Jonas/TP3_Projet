// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const statusMessage = document.getElementById('statusMessage');
const logoutBtn = document.getElementById('logoutBtn');
const gpsData = document.getElementById('gpsData');
const refreshGps = document.getElementById('refreshGps');

// Déconnexion
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Envoie du méssage
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value;

    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        if (response.ok) {
            showStatus('Message envoyé avec succès !', 'success');
            messageInput.value = '';
        } else {
            showStatus('Erreur lors de l\'envoi du message', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Erreur de connexion', 'error');
    }
});

// Fonctionalité GPS
refreshGps.addEventListener('click', () => {
    gpsData.textContent = 'Chargement des coordonnées...';
    // Simulation du GPS
    setTimeout(() => {
        gpsData.textContent = 'Latitude: 48.8566, Longitude: 2.3522 (Simulé)';
    }, 1000);
});

function showStatus(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = `status-display ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}
