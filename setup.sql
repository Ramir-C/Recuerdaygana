-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS railway;

-- Usar la base de datos
USE railway;

-- Crear tabla para almacenar los resultados del juego
CREATE TABLE IF NOT EXISTS resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    intento INT NOT NULL,
    tiempo DECIMAL(10,2) NOT NULL, -- tiempo en segundos
    errores INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
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

