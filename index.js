// index.js
const express = require('express');
const path = require('path');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- RUTAS --------------------

// Insertar un resultado en la BD
app.post('/resultados1', async (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;

  // Validación rápida
  if (!nombre || intento === undefined || tiempo === undefined || errores === undefined) {
    return res.status(400).json({ success: false, error: "Faltan datos en la petición" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO resultados1 (nombre, intento, tiempo, errores) 
       VALUES (?, ?, ?, ?)`,
      [nombre, intento, tiempo, errores]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error al insertar:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Consultar todos los resultados
app.get('/api/resultados', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resultados ORDER BY fecha DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener resultados:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------- INICIO DEL SERVIDOR --------------------
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  await initDB(); // Crear tablas si no existen
});

