// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

require('dotenv').config();

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
app.use(express.static('public'));
app.use(express.json());

const jwt = require('jsonwebtoken');

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

app.post('/api/login', (req, res) => {
  const { user } = req.body;

  // Ici tu peux vérifier un vrai utilisateur dans ta base
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
    SELECT
      Date,
      Heure_UTC,
      Latitude,
      Longitude
    FROM gps
    ORDER BY CONCAT(Date, ' ', TRIM(Heure_UTC)) DESC
    LIMIT 1
  `;

  console.log('Requête reçue: /api/gps/latest');

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur de requête SQL:', err);
      return res.status(500).json({
        error: 'Erreur serveur',
        details: err.message
      });
    }

    console.log('Résultats:', results);

    if (results.length === 0) {
      console.log('Aucune donnée trouvée');
      return res.status(404).json({ error: 'Aucune donnée trouvée' });
    }

    console.log('Données envoyées:', results[0]);
    res.json(results[0]);
  });
});

// Route pour récupérer toutes les données GPS (limitées à 100)
app.get('/api/gps/all', verifyToken, (req, res) => {
  const query = `
    SELECT
      Date,
      Heure_UTC,
      Latitude,
      Longitude
    FROM gps
    ORDER BY CONCAT(Date, ' ', TRIM(Heure_UTC)) DESC
    LIMIT 100
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Erreur serveur',
        details: err.message
      });
    }

    res.json(results);
  });
});

// EMPÊCHER LE CACHE (Important pour le GPS temps réel)
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Route de test pour vérifier les tables
app.get('/api/test', (req, res) => {
  const query = 'SHOW TABLES';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Erreur',
        details: err.message
      });
    }
    res.json({ tables: results });
  });
});

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api/gps/latest`);
});