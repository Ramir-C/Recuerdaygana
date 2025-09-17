const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Intento de conexión
db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        process.exit(1); // Detener la app si falla
    }
    console.log("✅ Conectado a MySQL");
   
   

    // Crear tabla si no existe
    const createTableQuery = `
     CREATE DATABASE IF NOT EXISTS railway;
        CREATE TABLE IF NOT EXISTS resultados (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            intento INT NOT NULL,
            tiempo FLOAT NOT NULL,
            errores INT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) console.error("❌ Error al crear la tabla:", err);
        else console.log("✅ Tabla 'resultados' lista");
    });
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Guardar resultados
app.post("/save", (req, res) => {
    const { nombre, intento, tiempo, errores } = req.body;
    const sql = "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, intento, tiempo, errores], (err) => {
        if (err) {
            console.error("❌ Error al guardar los resultados:", err);
            return res.status(500).send("Error al guardar los resultados");
        }
        res.send("✅ Resultado guardado");
    });
});

// Obtener resultados
app.get("/resultados", (req, res) => {
    const sql = "SELECT * FROM resultados ORDER BY fecha DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener resultados:", err);
            return res.status(500).send("Error al obtener resultados");
        }
        res.json(results);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
