import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicamentoService, VentaService } from '../../../services/services';
import { Medicamento, VentaRequest, DetalleRequest } from '../../../models/models';

interface ItemCarrito {
  medicamento: Medicamento;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-nueva-venta',
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-0">Nueva Venta</h4>
      <small class="text-muted">Agregue productos al carrito y confirme la venta</small>
    </div>

    <div class="row g-3">
      <!-- Panel izquierdo: búsqueda y productos -->
      <div class="col-md-7">
        <div class="card mb-3">
          <div class="card-header bg-white fw-semibold">
            <i class="bi bi-search me-2"></i>Buscar Medicamento
          </div>
          <div class="card-body">
            <input type="text" class="form-control mb-3"
                   placeholder="Escribe el nombre del medicamento..."
                   [(ngModel)]="termino" (input)="buscar()">

            <div class="table-responsive" *ngIf="resultados.length > 0">
              <table class="table table-hover table-sm">
                <thead><tr>
                  <th>Nombre</th><th>Precio</th><th>Stock</th><th></th>
                </tr></thead>
                <tbody>
                  <tr *ngFor="let m of resultados">
                    <td>{{ m.nombre }}</td>
                    <td class="text-success fw-semibold">S/. {{ m.precio | number:'1.2-2' }}</td>
                    <td>
                      <span class="badge"
                        [class.bg-success]="m.stock > 10"
                        [class.bg-warning]="m.stock > 0 && m.stock <= 10"
                        [class.bg-danger]="m.stock === 0"
                        [class.text-dark]="m.stock > 0 && m.stock <= 10">
                        {{ m.stock }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary"
                              [disabled]="m.stock === 0"
                              (click)="agregarAlCarrito(m)">
                        <i class="bi bi-plus"></i> Agregar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="termino && resultados.length === 0" class="text-muted text-center py-2">
              No se encontraron medicamentos
            </p>
          </div>
        </div>

        <!-- Datos del cliente -->
        <div class="card">
          <div class="card-header bg-white fw-semibold">
            <i class="bi bi-person me-2"></i>Datos del Cliente
          </div>
          <div class="card-body">
            <input type="text" class="form-control"
                   placeholder="Nombre del cliente (opcional)"
                   [(ngModel)]="clienteNombre">
          </div>
        </div>
      </div>

      <!-- Panel derecho: carrito -->
      <div class="col-md-5">
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-semibold"><i class="bi bi-cart3 me-2"></i>Carrito</span>
            <span class="badge bg-primary rounded-pill">{{ carrito.length }}</span>
          </div>
          <div class="card-body p-0">
            <div *ngIf="carrito.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-cart-x fs-3 d-block mb-2"></i>Carrito vacío
            </div>

            <table *ngIf="carrito.length > 0" class="table table-sm mb-0">
              <thead><tr>
                <th>Producto</th><th>Cant.</th><th>Subtotal</th><th></th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let item of carrito; let i = index">
                  <td>
                    <div class="fw-semibold" style="font-size:.85rem">{{ item.medicamento.nombre }}</div>
                    <small class="text-muted">S/. {{ item.medicamento.precio }}</small>
                  </td>
                  <td style="width:80px">
                    <input type="number" class="form-control form-control-sm"
                           [(ngModel)]="item.cantidad" min="1"
                           [max]="item.medicamento.stock"
                           (change)="recalcular(item)">
                  </td>
                  <td class="fw-semibold text-success">
                    S/. {{ item.subtotal | number:'1.2-2' }}
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" (click)="quitarDelCarrito(i)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer bg-white" *ngIf="carrito.length > 0">
            <div class="d-flex justify-content-between mb-3">
              <span class="fw-bold fs-5">TOTAL:</span>
              <span class="fw-bold fs-5 text-success">S/. {{ totalCarrito | number:'1.2-2' }}</span>
            </div>
            <button class="btn btn-success w-100"
                    [disabled]="procesando"
                    (click)="confirmarVenta()">
              <span *ngIf="procesando" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!procesando" class="bi bi-bag-check me-1"></i>
              Confirmar Venta
            </button>
            <button class="btn btn-outline-secondary w-100 mt-2" (click)="limpiarCarrito()">
              <i class="bi bi-x-circle me-1"></i>Vaciar Carrito
            </button>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      </div>
    </div>
  `
})
export class NuevaVentaComponent implements OnInit {
  termino = '';
  resultados: Medicamento[] = [];
  carrito: ItemCarrito[] = [];
  clienteNombre = '';
  procesando = false;
  error = '';

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  buscar(): void {
    if (this.termino.trim().length < 2) { this.resultados = []; return; }
    this.medService.buscarPorNombre(this.termino)
      .subscribe(data => this.resultados = data.filter(m => m.stock > 0));
  }

  agregarAlCarrito(m: Medicamento): void {
    const existente = this.carrito.find(i => i.medicamento.id === m.id);
    if (existente) {
      if (existente.cantidad < m.stock) {
        existente.cantidad++;
        this.recalcular(existente);
      }
    } else {
      this.carrito.push({ medicamento: m, cantidad: 1, subtotal: +m.precio });
    }
  }

  quitarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
  }

  recalcular(item: ItemCarrito): void {
    item.subtotal = item.cantidad * +item.medicamento.precio;
  }

  limpiarCarrito(): void {
    this.carrito = [];
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, i) => acc + i.subtotal, 0);
  }

  confirmarVenta(): void {
    if (this.carrito.length === 0) return;
    this.procesando = true;
    this.error = '';

    const req: VentaRequest = {
      clienteNombre: this.clienteNombre || 'Cliente General',
      detalles: this.carrito.map(i => ({
        medicamentoId: i.medicamento.id!,
        cantidad: i.cantidad
      } as DetalleRequest))
    };

    this.ventaService.registrar(req).subscribe({
      next: (venta) => {
        this.procesando = false;
        this.router.navigate(['/ventas/comprobante', venta.id]);
      },
      error: (err) => {
        this.procesando = false;
        this.error = err.error?.error || 'Error al procesar la venta.';
      }
    });
  }
}
