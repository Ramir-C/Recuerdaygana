const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta con tu index.html o front


db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar con MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL.');

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
    db.query(createTable, (err) => {
        if (err) console.error('❌ Error al crear la tabla:', err);
        else console.log('✅ Tabla players lista.');
    });
});

// Endpoint para guardar datos del jugador
app.post('/save', (req, res) => {
    const { nombre, intento, tiempo, errores, aciertos } = req.body;

    const query = `
        INSERT INTO players (nombre, intento, tiempo, errores, aciertos, fecha_hora)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(query, [nombre, intento, tiempo, errores, aciertos], (err, result) => {
        if (err) {
            console.error('❌ Error al insertar:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: '✅ Jugador guardado correctamente' });
    });
});

// Endpoint para obtener datos de jugadores
app.get('/users', (req, res) => {
    const query = `SELECT * FROM players ORDER BY fecha_hora DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error('❌ Error al consultar:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

// Servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
