const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Conexión sin DB primero (para crearla si no existe)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// 1. Crear la base de datos si no existe
db.query("CREATE DATABASE IF NOT EXISTS railway", (err) => {
    if (err) {
        console.error("❌ Error al crear la base de datos:", err);
        return;
    }
    console.log("✅ Base de datos verificada/creada");

    // 2. Seleccionar la BD
    db.changeUser({ database: process.env.DB_NAME }, (err) => {
        if (err) {
            console.error("❌ Error al seleccionar la BD:", err);
            return;
        }
        console.log("✅ Usando la BD:", process.env.DB_NAME);

        // 3. Crear la tabla si no existe
        const createTable = `
            CREATE TABLE IF NOT EXISTS resultados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                intento INT NOT NULL,
                tiempo FLOAT NOT NULL,
                errores INT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.query(createTable, (err) => {
            if (err) {
                console.error("❌ Error al crear la tabla:", err);
            } else {
                console.log("✅ Tabla 'resultados' lista");
            }
        });
    });
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Guardar resultados
app.post("/save", (req, res) => {
    const { nombre, intento, tiempo, errores } = req.body;
    const sql = "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, intento, tiempo, errores], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al guardar los resultados");
        }
        res.send("✅ Resultado guardado");
    });
});

// Ver resultados
app.get("/resultados", (req, res) => {
    db.query("SELECT * FROM resultados ORDER BY fecha DESC", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener resultados");
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
