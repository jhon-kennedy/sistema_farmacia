# 💊 Sistema de Gestión de Farmacia
**Escuela Superior La Pontificia — Actividad S11**
Stack: **Spring Boot 3 + Angular 17 + MySQL**

---

## 📁 Estructura del Proyecto

```
sistema_farmacia/
├── sql/                    ← Scripts SQL (ejecutar en orden)
│   ├── 01_database.sql     ← Tablas + 10 medicamentos de prueba
│   ├── 02_triggers.sql     ← Auditoría INSERT/UPDATE/DELETE
│   ├── 03_stored_procedures.sql  ← SP registrar venta
│   ├── 04_functions.sql    ← Funciones almacenadas
│   └── 05_backup.sql       ← Backup manual + evento automático
├── backend/                ← Spring Boot (Java 17)
└── frontend/               ← Angular 17
```

---

## ⚡ PASO 1 — Base de Datos (MySQL)

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar scripts en orden:
source ruta/sql/01_database.sql
source ruta/sql/02_triggers.sql
source ruta/sql/03_stored_procedures.sql
source ruta/sql/04_functions.sql
source ruta/sql/05_backup.sql
```

---

## ⚡ PASO 2 — Backend (Spring Boot)

### Requisitos
- Java 17+
- Maven 3.8+

### Configurar contraseña MySQL
Editar `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=TU_CONTRASEÑA_AQUI
```

### Ejecutar
```bash
cd backend
mvn spring-boot:run
```

El backend queda en: **http://localhost:8080**

### Endpoints disponibles

| Método | URL | Descripción |
|--------|-----|-------------|
| GET    | /api/medicamentos | Listar todos |
| GET    | /api/medicamentos/{id} | Buscar por ID |
| GET    | /api/medicamentos/buscar?nombre= | Buscar por nombre |
| GET    | /api/medicamentos/stock-bajo?umbral=10 | Stock bajo |
| GET    | /api/medicamentos/por-vencer?dias=90 | Próximos a vencer |
| POST   | /api/medicamentos | Crear medicamento |
| PUT    | /api/medicamentos/{id} | Actualizar |
| DELETE | /api/medicamentos/{id} | Eliminar |
| GET    | /api/ventas | Historial de ventas |
| POST   | /api/ventas | Registrar venta |
| GET    | /api/ventas/total-acumulado | Total ventas |
| GET    | /api/categorias | Listar categorías |
| GET    | /api/auditoria | Historial auditoría |

---

## ⚡ PASO 3 — Frontend (Angular)

### Requisitos
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

### Instalar y ejecutar
```bash
cd frontend
npm install
ng serve
```

La app queda en: **http://localhost:4200**

---

## 🗄️ BACKUP MANUAL

```bash
# Windows
mysqldump -u root -p sistema_farmacia > backup_%date%.sql

# Linux / Mac
mysqldump -u root -p sistema_farmacia > backup_$(date +%Y%m%d).sql
```

---

## 📋 Funcionalidades implementadas

### Requeridas por el documento:
- ✅ **Registrar medicamentos** (con categoría, precio, stock, vencimiento)
- ✅ **Controlar stock** (descuento automático al vender)
- ✅ **Fechas de vencimiento** (alertas en dashboard y lista)
- ✅ **Registrar ventas** (con carrito de compras)
- ✅ **Buscar medicamentos** por nombre
- ✅ **Generar comprobantes** (imprimibles)

### Base de datos:
- ✅ Tablas relacionadas (medicamento, venta, detalle_venta, auditoria)
- ✅ **Triggers** INSERT/UPDATE/DELETE → tabla auditoria_medicamento
- ✅ **Stored Procedure** sp_registrar_venta
- ✅ **Funciones almacenadas** fn_total_ventas_acumulado, fn_stock_medicamento
- ✅ **Backup** manual (.sql) + evento automático MySQL

### Backend Spring Boot:
- ✅ CRUD completo de medicamentos
- ✅ Endpoint registrar ventas (con transacción)
- ✅ CORS configurado para Angular
- ✅ Manejo de excepciones

### Frontend Angular:
- ✅ Dashboard con estadísticas
- ✅ Lista de medicamentos con búsqueda
- ✅ Formulario registro/edición
- ✅ Carrito de compras para ventas
- ✅ Historial de ventas
- ✅ Comprobante imprimible
- ✅ Auditoría del sistema
