// Utilitaires de stockage (localStorage)
const USERS_KEY = "users";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {}; // { username: { password: "..." } }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setMessage(el, text, type = "error") {
  el.textContent = text;
  el.className = `msg ${type}`;
}

// Gestion des onglets
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    const target = document.querySelector(btn.dataset.target);
    target.classList.add("active");
  });
});

// Inscription
const registerForm = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMsg");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(registerForm);
  const username = form.get("username").trim();
  const password = form.get("password");

  const users = getUsers();

  if (!username || !password) {
    return setMessage(registerMsg, "Veuillez remplir tous les champs.");
  }
  if (users[username]) {
    return setMessage(registerMsg, "Ce nom d'utilisateur existe déjà.");
  }
  if (password.length < 4) {
    return setMessage(registerMsg, "Le mot de passe doit contenir au moins 4 caractères.");
  }

  // Enregistrement (ATTENTION: mot de passe en clair pour démo)
  users[username] = { password };
  saveUsers(users);

  setMessage(registerMsg, "Inscription réussie. Vous pouvez vous connecter.", "success");

  // Basculer sur l’onglet Connexion
  document.querySelector('.tab-btn[data-target="#login"]').click();
});

// Connexion
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(loginForm);
  const username = form.get("username").trim();
  const password = form.get("password");

  if (!username) {
    return setMessage(loginMsg, "Veuillez entrer un nom d'utilisateur.");
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: username })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la connexion.");
    }

    // Stocker le token
    localStorage.setItem("token", data.token);
    // On peut aussi stocker le username si besoin
    localStorage.setItem("currentUser", username);

    setMessage(loginMsg, "Connexion réussie !", "success");

    // Redirection
    setTimeout(() => {
      window.location.href = "arduino.html";
    }, 1000);

  } catch (err) {
    console.error(err);
    setMessage(loginMsg, err.message);
  }
});