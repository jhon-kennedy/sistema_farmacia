--  BACKUP MANUAL - SISTEMA FARMACIA
--  Ejecutar desde terminal:
--  mysqldump -u root -p sistema_farmacia > backup_farmacia.sql



/*
#!/bin/bash
DB_NAME="sistema_farmacia"
DB_USER="root"
DB_PASS="tu_password"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME \
  > "$BACKUP_DIR/farmacia_backup_$DATE.sql"

echo "✅ Backup generado: $BACKUP_DIR/farmacia_backup_$DATE.sql"

# Borrar backups de más de 7 días
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
echo "🧹 Backups antiguos eliminados."
*/

-- ── Backup automático con MySQL Event Scheduler ──────────────
-- (Alternativa a SQL Server Agent para MySQL)

SET GLOBAL event_scheduler = ON;

-- Nota: MySQL no puede escribir archivos directamente por seguridad.
-- Usar el evento para registrar la acción y lanzar mysqldump desde el OS.
-- El siguiente evento sirve como LOG de intención de backup:

DELIMITER $$

CREATE TABLE IF NOT EXISTS log_backup (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    fecha    DATETIME DEFAULT CURRENT_TIMESTAMP,
    mensaje  VARCHAR(300)
)$$

CREATE EVENT IF NOT EXISTS evt_backup_automatico
ON SCHEDULE EVERY 2 MINUTE
STARTS NOW()
DO
BEGIN
    INSERT INTO log_backup (fecha, mensaje)
    VALUES (NOW(), CONCAT('Backup programado - Total registros medicamento: ',
            (SELECT COUNT(*) FROM medicamento)));
END$$

DELIMITER ;

-- Para ver el log:
-- SELECT * FROM log_backup ORDER BY fecha DESC;
