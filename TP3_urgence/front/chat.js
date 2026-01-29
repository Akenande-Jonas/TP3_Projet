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

// Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Handle message sending
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value;

    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // In case we add auth middleware later
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

// Placeholder for GPS functionality
refreshGps.addEventListener('click', () => {
    gpsData.textContent = 'Chargement des coordonnées...';
    // Simulate GPS fetch or implement real endpoint later
    setTimeout(() => {
        gpsData.textContent = 'Latitude: 48.8566, Longitude: 2.3522 (Simulé)';
    }, 1000);
});

function showStatus(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = `status-display ${type}`;

    // Auto hide success message
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}
