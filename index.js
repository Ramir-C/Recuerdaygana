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
// Guardar resultados del juego con cálculo automático del intento
app.post("resultados1", (req, res) => {
    const { nombre, tiempo, errores } = req.body;

    // Verificar si ya existe el nombre
    const selectSql = "SELECT intento FROM resultados1 WHERE nombre = ? ORDER BY id DESC LIMIT 1";
    db.query(selectSql, [nombre], (err, results) => {
        if (err) return res.status(500).send("Error al verificar el usuario");

        let intento = 1; // Primer intento por defecto
        if (results.length > 0) {
            intento = results[0].intento + 1; // Incrementar intento si ya existe
        }

        const insertSql = "INSERT INTO resultados1 (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [nombre, intento, tiempo, errores], (err, result) => {
            if (err) return res.status(500).send("Error al guardar los resultados");
            res.json({ success: true, id: result.insertId, intento });
        });
    });
});


// Consultar todos los resultados
app.get('/resultados1', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resultados1 ORDER BY fecha DESC'
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

