// index.js
const express = require('express');
const path = require('path');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir HTML desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para insertar resultados
app.post('/api/resultados', async (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)',
      [nombre, intento, tiempo, errores]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error al insertar:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ruta para consultar resultados
app.get('/api/resultados', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resultados ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener resultados:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  await initDB(); // Crear tabla si no existe
});

