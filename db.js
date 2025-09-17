// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Función para crear la tabla si no existe
async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        intento INT NOT NULL,
        tiempo FLOAT NOT NULL,
        errores INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Crear tabla si no existe
    const createTable = `
        CREATE TABLE IF NOT EXISTS players (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            intento INT,
            tiempo INT,
            errores INT,
            aciertos INT,
            fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    console.log("✅ Tabla 'resultados' lista");
    connection.release();
  } catch (err) {
    console.error("❌ Error al inicializar DB:", err);
  }
}

module.exports = { pool, initDB };
