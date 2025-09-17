const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Para recibir JSON
app.use(express.static(path.join(__dirname, 'public')));

// Conexión MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// Endpoint para guardar los datos del juego
app.post('/save', (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;
  const query = 'INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, intento, tiempo, errores], (err, result) => {
    if (err) {
      console.error('Error al guardar los datos:', err);
      return res.status(500).json({ error: 'Error al guardar los datos' });
    }
    res.json({ success: true });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
