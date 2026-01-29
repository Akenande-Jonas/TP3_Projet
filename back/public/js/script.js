document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const statusDiv = document.getElementById('status');
    const gpsDiv = document.getElementById('gps-data');

    if (!token) {
        statusDiv.innerText = "Non connecté. Veuillez vous connecter.";
        statusDiv.style.color = "red";
    }

    // Gestion de l'envoi Arduino
    const arduinoForm = document.getElementById('arduinoForm');
    if (arduinoForm) {
        arduinoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value;

            try {
                const response = await fetch('/api/arduino/envoyer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();

                if (response.ok) {
                    statusDiv.innerText = "Message envoyé : " + data.text;
                    statusDiv.style.color = "green";
                    messageInput.value = '';
                } else {
                    throw new Error(data.error || "Erreur d'envoi");
                }
            } catch (err) {
                statusDiv.innerText = err.message;
                statusDiv.style.color = "red";
            }
        });
    }

    // Gestion du GPS
    const refreshGpsBtn = document.getElementById('refreshGpsBtn');
    async function refreshGPS() {
        if (!token) {
            gpsDiv.innerText = "Veuillez vous connecter pour voir les données GPS.";
            return;
        }

        gpsDiv.innerText = "Chargement...";

        try {
            const response = await fetch('/api/gps/latest', {
                headers: {
                    'Authorization': token
                }
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            const data = await response.json();

            if (response.ok) {
                gpsDiv.innerHTML = `
                    <strong>Date :</strong> ${data.Date} <br>
                    <strong>Heure :</strong> ${data.Heure_UTC} <br>
                    <strong>Lat :</strong> ${data.Latitude} <br>
                    <strong>Lon :</strong> ${data.Longitude}
                `;
            } else {
                throw new Error(data.error || "Erreur GPS: " + (data.error || "Inconnue"));
            }
        } catch (err) {
            gpsDiv.innerText = err.message;
            if (err.message.includes("Session expirée")) {
                setTimeout(() => window.location.href = "/", 2000);
            }
        }
    }

    if (refreshGpsBtn) {
        refreshGpsBtn.addEventListener('click', refreshGPS);
    }

    // Initial load
    if (token) {
        refreshGPS();
    }
});