-- ============================================================
--  TRIGGERS DE AUDITORÍA - SISTEMA FARMACIA
-- ============================================================
USE sistema_farmacia;

DELIMITER $$

-- ── TRIGGER: INSERT ──────────────────────────────────────────
CREATE TRIGGER trg_medicamento_after_insert
AFTER INSERT ON medicamento
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_medicamento (medicamento_id, tipo_accion, fecha, descripcion)
    VALUES (
        NEW.id,
        'INSERT',
        NOW(),
        CONCAT('NUEVO medicamento | Nombre: ', NEW.nombre,
               ' | Precio: S/.', NEW.precio,
               ' | Stock: ', NEW.stock,
               ' | Vence: ', NEW.fecha_vencimiento)
    );
END$$

-- ── TRIGGER: UPDATE ──────────────────────────────────────────
CREATE TRIGGER trg_medicamento_after_update
AFTER UPDATE ON medicamento
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_medicamento (medicamento_id, tipo_accion, fecha, descripcion)
    VALUES (
        NEW.id,
        'UPDATE',
        NOW(),
        CONCAT('MODIFICADO | Nombre: ', NEW.nombre,
               ' | Stock: ', OLD.stock, ' → ', NEW.stock,
               ' | Precio: S/.', OLD.precio, ' → S/.', NEW.precio)
    );
END$$

-- ── TRIGGER: DELETE ──────────────────────────────────────────
CREATE TRIGGER trg_medicamento_before_delete
BEFORE DELETE ON medicamento
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_medicamento (medicamento_id, tipo_accion, fecha, descripcion)
    VALUES (
        OLD.id,
        'DELETE',
        NOW(),
        CONCAT('ELIMINADO | Nombre: ', OLD.nombre,
               ' | Precio: S/.', OLD.precio,
               ' | Stock restante: ', OLD.stock)
    );
END$$

DELIMITER ;
