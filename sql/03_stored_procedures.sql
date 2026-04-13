-- ============================================================
--  PROCEDIMIENTOS ALMACENADOS - SISTEMA FARMACIA
-- ============================================================
USE sistema_farmacia;

DELIMITER $$

-- ── SP: REGISTRAR VENTA ──────────────────────────────────────
-- Registra una venta completa con múltiples productos
-- Parámetros de entrada: nombre cliente, medicamento_id, cantidad
-- Parámetros de salida:  venta_id generado, total calculado
-- ─────────────────────────────────────────────────────────────
CREATE PROCEDURE sp_registrar_venta(
    IN  p_cliente_nombre   VARCHAR(200),
    IN  p_medicamento_id   INT,
    IN  p_cantidad         INT,
    OUT p_venta_id         INT,
    OUT p_total            DECIMAL(10,2)
)
BEGIN
    DECLARE v_precio   DECIMAL(10,2);
    DECLARE v_stock    INT;
    DECLARE v_subtotal DECIMAL(10,2);

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verificar que el medicamento existe y obtener datos
    SELECT precio, stock INTO v_precio, v_stock
    FROM medicamento
    WHERE id = p_medicamento_id
    FOR UPDATE;

    IF v_precio IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medicamento no encontrado';
    END IF;

    -- Verificar stock suficiente
    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la venta';
    END IF;

    -- Calcular subtotal y total
    SET v_subtotal = v_precio * p_cantidad;
    SET p_total    = v_subtotal;

    -- Insertar cabecera de venta
    INSERT INTO venta (fecha, total, cliente_nombre)
    VALUES (NOW(), p_total, p_cliente_nombre);

    SET p_venta_id = LAST_INSERT_ID();

    -- Insertar detalle de venta
    INSERT INTO detalle_venta (venta_id, medicamento_id, cantidad, precio_unitario, subtotal)
    VALUES (p_venta_id, p_medicamento_id, p_cantidad, v_precio, v_subtotal);

    -- Descontar stock del medicamento
    UPDATE medicamento
    SET stock = stock - p_cantidad
    WHERE id = p_medicamento_id;

    COMMIT;
END$$

-- ── SP: BUSCAR MEDICAMENTO POR NOMBRE ────────────────────────
CREATE PROCEDURE sp_buscar_medicamento(
    IN p_nombre VARCHAR(200)
)
BEGIN
    SELECT m.id, m.nombre, m.descripcion, m.precio,
           m.stock, m.fecha_vencimiento, c.nombre AS categoria
    FROM medicamento m
    LEFT JOIN categoria c ON m.categoria_id = c.id
    WHERE m.nombre LIKE CONCAT('%', p_nombre, '%')
    ORDER BY m.nombre;
END$$

-- ── SP: REPORTE DE VENTAS POR FECHA ──────────────────────────
CREATE PROCEDURE sp_reporte_ventas(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT v.id, v.fecha, v.cliente_nombre, v.total,
           m.nombre AS medicamento,
           dv.cantidad, dv.precio_unitario, dv.subtotal
    FROM venta v
    JOIN detalle_venta dv ON v.id = dv.venta_id
    JOIN medicamento m    ON dv.medicamento_id = m.id
    WHERE DATE(v.fecha) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY v.fecha DESC;
END$$

DELIMITER ;
