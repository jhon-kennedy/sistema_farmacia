// ── Categoria ──────────────────────────────────────────────
export interface Categoria {
  id?: number;
  nombre: string;
}

// ── Medicamento ────────────────────────────────────────────
export interface Medicamento {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  fechaVencimiento: string;   // 'YYYY-MM-DD'
  categoria?: Categoria;
}

// ── Detalle de Venta ───────────────────────────────────────
export interface DetalleVenta {
  id?: number;
  medicamento: Medicamento;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// ── Venta ──────────────────────────────────────────────────
export interface Venta {
  id?: number;
  fecha?: string;
  total: number;
  clienteNombre?: string;
  detalles?: DetalleVenta[];
}

// ── Request para nueva venta ───────────────────────────────
export interface DetalleRequest {
  medicamentoId: number;
  cantidad: number;
}

export interface VentaRequest {
  clienteNombre: string;
  detalles: DetalleRequest[];
}

// ── Auditoría ──────────────────────────────────────────────
export interface AuditoriaMedicamento {
  id?: number;
  medicamentoId: number;
  tipoAccion: string;
  fecha: string;
  descripcion: string;
}
