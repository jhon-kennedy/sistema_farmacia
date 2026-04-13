-- ============================================================
--  FUNCIONES ALMACENADAS - SISTEMA FARMACIA
-- ============================================================
USE sistema_farmacia;

DELIMITER $$

-- ── FUNCIÓN: Total acumulado de ventas ───────────────────────
CREATE FUNCTION fn_total_ventas_acumulado()
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    SELECT COALESCE(SUM(total), 0.00) INTO v_total FROM venta;
    RETURN v_total;
END$$

-- ── FUNCIÓN: Stock disponible de un medicamento ──────────────
CREATE FUNCTION fn_stock_medicamento(p_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_stock INT DEFAULT 0;
    SELECT stock INTO v_stock FROM medicamento WHERE id = p_id;
    RETURN COALESCE(v_stock, 0);
END$$

-- ── FUNCIÓN: Verificar si medicamento está por vencer ────────
-- Retorna 1 si vence en los próximos p_dias días, 0 si no
CREATE FUNCTION fn_medicamento_por_vencer(p_id INT, p_dias INT)
RETURNS TINYINT(1)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_vence DATE;
    SELECT fecha_vencimiento INTO v_vence FROM medicamento WHERE id = p_id;
    IF v_vence IS NULL THEN
        RETURN 0;
    END IF;
    RETURN IF(v_vence <= DATE_ADD(CURDATE(), INTERVAL p_dias DAY), 1, 0);
END$$

-- ── FUNCIÓN: Total de ventas por medicamento ─────────────────
CREATE FUNCTION fn_total_ventas_medicamento(p_medicamento_id INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    SELECT COALESCE(SUM(dv.subtotal), 0.00) INTO v_total
    FROM detalle_venta dv WHERE dv.medicamento_id = p_medicamento_id;
    RETURN v_total;
END$$

DELIMITER ;

-- ── PRUEBA DE FUNCIONES ──────────────────────────────────────
-- SELECT fn_total_ventas_acumulado();
-- SELECT fn_stock_medicamento(1);
-- SELECT fn_medicamento_por_vencer(1, 90);
