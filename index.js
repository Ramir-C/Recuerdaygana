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
app.post("/resultado1", (req, res) => {
    const { nombre, tiempo, errores } = req.body;

    // Buscar el último intento de este usuario
    const selectSql = "SELECT MAX(intento) AS ultimoIntento FROM resultados1 WHERE nombre = ?";
    db.query(selectSql, [nombre], (err, results) => {
        if (err) {
            console.error("❌ Error al buscar último intento:", err);
            return res.status(500).send("Error al buscar último intento");
        }

        // Calcular nuevo intento
        const nuevoIntento = (results[0].ultimoIntento || 0) + 1;

        // Insertar nuevo registro
        const insertSql = "INSERT INTO resultados1 (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [nombre, nuevoIntento, tiempo, errores], (err2, result2) => {
            if (err2) {
                console.error("❌ Error al guardar resultado:", err2);
                return res.status(500).send("Error al guardar resultado");
            }

            res.send(`✅ Resultado guardado. Intento ${nuevoIntento}`);
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

