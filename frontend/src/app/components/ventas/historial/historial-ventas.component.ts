import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../services/services';
import { Venta } from '../../../models/models';

@Component({
  selector: 'app-historial-ventas',
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Historial de Ventas</h4>
        <small class="text-muted">{{ ventas.length }} ventas registradas</small>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="fw-semibold text-success fs-5">
          Total: S/. {{ totalAcumulado | number:'1.2-2' }}
        </span>
        <a routerLink="/ventas/nueva" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-lg me-1"></i>Nueva Venta
        </a>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#Venta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of ventas">
                <td><span class="badge bg-light text-dark border">#{{ v.id }}</span></td>
                <td>{{ v.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ v.clienteNombre }}</td>
                <td>
                  <span *ngFor="let d of v.detalles" class="badge bg-light text-dark border me-1">
                    {{ d.medicamento?.nombre }} x{{ d.cantidad }}
                  </span>
                </td>
                <td class="fw-bold text-success">S/. {{ v.total | number:'1.2-2' }}</td>
                <td>
                  <a [routerLink]="['/ventas/comprobante', v.id]"
                     class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-receipt me-1"></i>Comprobante
                  </a>
                </td>
              </tr>
              <tr *ngIf="ventas.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-receipt fs-3 d-block mb-2"></i>No hay ventas registradas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class HistorialVentasComponent implements OnInit {
  ventas: Venta[] = [];
  totalAcumulado = 0;

  constructor(private service: VentaService) {}

  ngOnInit(): void {
    this.service.listar().subscribe(data => this.ventas = data);
    this.service.totalAcumulado().subscribe(r => this.totalAcumulado = r.total);
  }
}
