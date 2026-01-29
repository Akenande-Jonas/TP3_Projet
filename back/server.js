// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors'); // --- NOUVEAU : Import pour éviter les erreurs de sécurité navigateur
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 3001; // Note : Votre Python devra viser ce port 3001

// --- NOUVEAU : Variable pour stocker le message LCD (en mémoire vive)
let messagePourArduino = "";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT)
});

// Test de connexion
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
    connection.release();
  }
});

// Middleware
app.use(cors()); // --- NOUVEAU : Autorise toutes les connexions
app.use('/back/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // --- NOUVEAU : Permet de lire les formulaires HTML classiques

// Middleware de vérification du token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = decoded;
    next();
  });
}

// ==========================================
// --- NOUVEAU : SECTION ARDUINO LCD ---
// ==========================================

// 1. Route pour que le Python récupère le message (Pas de Token nécessaire pour faire simple)
app.get('/api/arduino/message', (req, res) => {
  // On renvoie juste le texte brut, facile à lire pour Python
  res.send(messagePourArduino);
});

// 2. Route pour envoyer le message depuis le site Web
app.post('/api/arduino/envoyer', (req, res) => {
  // On accepte soit du JSON, soit un formulaire classique
  const message = req.body.message;

  if (message) {
    messagePourArduino = message;
    console.log("Nouveau message LCD reçu : " + messagePourArduino);

    // Si la requête vient d'un formulaire HTML classique, on redirige
    // Sinon (API/Fetch), on renvoie du JSON
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      res.redirect('/'); // Redirige vers l'accueil
    } else {
      res.json({ status: "OK", text: messagePourArduino });
    }
  } else {
    res.status(400).json({ error: "Message vide" });
  }
});

// ==========================================
// FIN SECTION ARDUINO
// ==========================================


// Route pour poster les données (Login)
app.post('/api/login', (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: 'Utilisateur manquant' });
  }

  const token = jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  res.json({ token });
});

// Route pour récupérer les dernières données GPS
app.get('/api/gps/latest', verifyToken, (req, res) => {
  const query = `
    SELECT Date, Heure_UTC, Latitude, Longitude
    FROM gps
    ORDER BY CONCAT(Date, ' ', TRIM(Heure_UTC)) DESC
    LIMIT 1
  `;

  console.log('Requête reçue: /api/gps/latest');

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur de requête SQL:', err);
      return res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Aucune donnée trouvée' });
    }

    res.json(results[0]);
  });
});

// Route pour récupérer toutes les données GPS (limitées à 100)
app.get('/api/gps/all', verifyToken, (req, res) => {
  const query = `
    SELECT Date, Heure_UTC, Latitude, Longitude
    FROM gps
    ORDER BY CONCAT(Date, ' ', TRIM(Heure_UTC)) DESC
    LIMIT 100
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
    res.json(results);
  });
});

// EMPÊCHER LE CACHE
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Route de test
app.get('/api/test', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur', details: err.message });
    }
    res.json({ tables: results });
  });
});

// Route principale (Frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API GPS disponible sur http://localhost:${PORT}/api/gps/latest`);
  console.log(`API Arduino disponible sur http://localhost:${PORT}/api/arduino/message`);
});