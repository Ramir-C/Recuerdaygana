const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // carpeta para el HTML

// Configuración de conexión con Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "vJxrUwgbREPcAdNKbaRoEinrLYQydTfb",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 3306,
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    return;
  }
  console.log("✅ Conexión a la base de datos establecida");
});

// Ruta para guardar resultados
app.post("/save", (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;
  const sql = "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, intento, tiempo, errores], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar datos:", err);
      return res.status(500).json({ error: "Error al guardar los datos" });
    }
    res.json({ message: "✅ Datos guardados correctamente" });
  });
});

// Ruta para obtener resultados
app.get("/resultados", (req, res) => {
  const sql = "SELECT * FROM resultados ORDER BY fecha DESC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener resultados:", err);
      return res.status(500).json({ error: "Error al obtener los resultados" });
    }
    res.json(rows);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

