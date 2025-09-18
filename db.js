const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Crear tabla resultados1 si no existe
async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resultados1 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        intento INT NOT NULL,
        tiempo FLOAT NOT NULL,
        errores INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'resultados1' lista");
    connection.release();
  } catch (err) {
    console.error("❌ Error al inicializar DB:", err);
  }
}

module.exports = { pool, initDB };
