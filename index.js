const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Crear tabla
async function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS resultados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      intento INT NOT NULL,
      tiempo FLOAT NOT NULL,
      errores INT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(sql);
  console.log("✅ Tabla 'resultados' lista.");
}
initDB();

app.post("/api/resultados", async (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)",
      [nombre, intento, tiempo, errores]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error al insertar:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/resultados", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM resultados ORDER BY fecha DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al consultar:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

