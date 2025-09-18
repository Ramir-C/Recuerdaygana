const express = require('express');
const path = require('path');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Guardar resultados
app.post('/resultados1', async (req, res) => {
  try {
    const { nombre, intento, tiempo, errores } = req.body;
    await pool.query(
      "INSERT INTO resultados1 (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)",
      [nombre, intento, tiempo, errores]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al guardar resultados:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener resultados
app.get('/resultados1', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM resultados1 ORDER BY fecha DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener resultados:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await initDB();
});
