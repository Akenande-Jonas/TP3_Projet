// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 8000;

// Configuration de la base de données
const db = mysql.createPool({
  host: '172.29.17.171',
  user: 'lowrence',
  password: 'root',
  database: 'Lowrence',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// EMPÊCHER LE CACHE (Important pour le GPS temps réel)
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Route pour récupérer les dernières données GPS
app.get('/api/gps/latest', (req, res) => {
  /*
  * CORRECTION DÉFINITIVE DU TRI :
  * On ne peut pas trier par 'id'. On utilise donc CONCAT() et TRIM()
  * pour créer une valeur DATETIME propre à partir de Date et Heure_UTC,
  * même si l'un d'eux contient des espaces invisibles.
  */
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

// Route pour récupérer toutes les positions (optionnel)
app.get('/api/gps/all', (req, res) => {
  // Application de la même logique de tri pour l'historique
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

  console.log('📡 Requête reçue: /api/gps/all');

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur de requête SQL:', err);
      return res.status(500).json({
        error: 'Erreur serveur',
        details: err.message
      });
    }

    console.log(`${results.length} enregistrements trouvés`);
    res.json(results);
  });
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