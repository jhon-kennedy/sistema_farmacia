-- ============================================================
--  SISTEMA DE GESTIÓN DE FARMACIA - BASE DE DATOS
--  Escuela Superior La Pontificia
-- ============================================================

CREATE DATABASE IF NOT EXISTS sistema_farmacia
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_farmacia;

-- ── CATEGORÍAS ──────────────────────────────────────────────
CREATE TABLE categoria (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL
);

-- ── MEDICAMENTOS ─────────────────────────────────────────────
CREATE TABLE medicamento (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(200) NOT NULL,
    descripcion       TEXT,
    precio            DECIMAL(10,2) NOT NULL,
    stock             INT NOT NULL DEFAULT 0,
    fecha_vencimiento DATE NOT NULL,
    categoria_id      INT,
    CONSTRAINT fk_med_cat FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- ── VENTAS ───────────────────────────────────────────────────
CREATE TABLE venta (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    fecha          DATETIME     DEFAULT CURRENT_TIMESTAMP,
    total          DECIMAL(10,2) NOT NULL DEFAULT 0,
    cliente_nombre VARCHAR(200)  DEFAULT 'Cliente General'
);

-- ── DETALLE DE VENTA ─────────────────────────────────────────
CREATE TABLE detalle_venta (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    venta_id       INT NOT NULL,
    medicamento_id INT NOT NULL,
    cantidad       INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal       DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_dv_venta FOREIGN KEY (venta_id)       REFERENCES venta(id),
    CONSTRAINT fk_dv_med   FOREIGN KEY (medicamento_id) REFERENCES medicamento(id)
);

-- ── AUDITORÍA ────────────────────────────────────────────────
CREATE TABLE auditoria_medicamento (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT,
    tipo_accion    VARCHAR(20)  NOT NULL,
    fecha          DATETIME     DEFAULT CURRENT_TIMESTAMP,
    descripcion    TEXT
);

-- ── DATOS DE PRUEBA ──────────────────────────────────────────
INSERT INTO categoria (nombre) VALUES
('Analgésicos'),
('Antibióticos'),
('Vitaminas'),
('Antiinflamatorios'),
('Antigripales'),
('Antiácidos'),
('Antialérgicos');

INSERT INTO medicamento (nombre, descripcion, precio, stock, fecha_vencimiento, categoria_id) VALUES
('Paracetamol 500mg',   'Analgésico y antipirético de uso general',        2.50,  100, '2026-12-31', 1),
('Amoxicilina 500mg',   'Antibiótico de amplio espectro',                   8.90,   50, '2026-06-30', 2),
('Vitamina C 1000mg',   'Suplemento vitamínico efervescente',               5.00,  200, '2027-03-31', 3),
('Ibuprofeno 400mg',    'Antiinflamatorio no esteroideo (AINE)',            3.80,   80, '2026-09-30', 4),
('NyQuil Antigripal',   'Medicamento combinado para gripe y resfriado',    12.50,   30, '2026-08-31', 5),
('Omeprazol 20mg',      'Inhibidor de bomba de protones para acidez',       4.20,   60, '2027-01-31', 6),
('Loratadina 10mg',     'Antihistamínico para alergias',                    3.50,   70, '2026-11-30', 7),
('Metronidazol 500mg',  'Antibiótico y antiparasitario',                    6.80,   40, '2026-07-31', 2),
('Aspirina 100mg',      'Ácido acetilsalicílico, analgésico y antiagregante',1.90, 150, '2027-02-28', 1),
('Diclofenaco 50mg',    'Antiinflamatorio y analgésico potente',            4.50,   55, '2026-10-31', 4);
