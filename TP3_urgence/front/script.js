const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('loginBtn');
const toggleBtn = document.getElementById('toggleBtn');
const toggleText = document.getElementById('toggleText');
const formTitle = document.querySelector('h2');

let isLoginMode = true;


// Toggle functionality is handled by switchMode function below


toggleBtn.addEventListener('click', switchMode);

function switchMode(e) {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;

    loginForm.reset();
    messageEl.textContent = '';
    messageEl.className = 'message';

    if (isLoginMode) {
        formTitle.textContent = 'Bienvenue';
        submitBtn.textContent = 'Se connecter';
        toggleText.childNodes[0].nodeValue = 'Pas encore de compte ? '; // Text node
        toggleBtn.textContent = "S'inscrire";
    } else {
        formTitle.textContent = 'Créer un compte';
        submitBtn.textContent = "S'inscrire";
        toggleText.childNodes[0].nodeValue = 'Déjà un compte ? ';
        toggleBtn.textContent = 'Se connecter';
    }
}


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }


    setLoading(true);

    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    const url = `http://localhost:3000${endpoint}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (isLoginMode) {

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showMessage('Connexion réussie ! Redirection...', 'success');
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 1000);
            } else {

                showMessage('Compte créé avec succès ! Vous pouvez vous connecter.', 'success');
                setTimeout(() => {
                    switchMode(null);
                }, 1500);
            }
        } else {
            showMessage(data.message || data.error || 'Une erreur est survenue', 'error');
        }
    } catch (error) {
        console.error(error);
        showMessage('Erreur de connexion au serveur', 'error');
    } finally {
        setLoading(false);
    }
});

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : "S'inscrire");
}
