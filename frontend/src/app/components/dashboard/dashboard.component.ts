import { Component, OnInit } from '@angular/core';
import { MedicamentoService, VentaService } from '../../services/services';
import { Medicamento } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Dashboard</h4>
        <small class="text-muted">Resumen del sistema</small>
      </div>
      <span class="badge bg-success fs-6">
        <i class="bi bi-circle-fill me-1" style="font-size:.5rem"></i>Sistema Activo
      </span>
    </div>

    <!-- Estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="stat-card bg-primary">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="value">{{ totalMedicamentos }}</div>
              <div class="label">Medicamentos</div>
            </div>
            <i class="bi bi-box-seam icon"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-success">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="value">{{ totalVentas }}</div>
              <div class="label">Ventas registradas</div>
            </div>
            <i class="bi bi-cart-check icon"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-danger">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="value">{{ stockBajo }}</div>
              <div class="label">Stock bajo (≤10)</div>
            </div>
            <i class="bi bi-exclamation-triangle icon"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-warning">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="value">S/. {{ totalAcumulado | number:'1.2-2' }}</div>
              <div class="label">Total en ventas</div>
            </div>
            <i class="bi bi-cash-coin icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <!-- Stock bajo -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header bg-white fw-semibold">
            <i class="bi bi-exclamation-circle text-danger me-2"></i>Medicamentos con Stock Bajo
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead><tr>
                <th>Medicamento</th><th>Stock</th><th>Acción</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let m of medStockBajo">
                  <td>{{ m.nombre }}</td>
                  <td><span class="badge bg-danger">{{ m.stock }}</span></td>
                  <td>
                    <a [routerLink]="['/medicamentos/editar', m.id]"
                       class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-pencil"></i>
                    </a>
                  </td>
                </tr>
                <tr *ngIf="medStockBajo.length === 0">
                  <td colspan="3" class="text-center text-muted py-3">
                    ✅ Todos los stocks están en buen nivel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Próximos a vencer -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header bg-white fw-semibold">
            <i class="bi bi-calendar-x text-warning me-2"></i>Próximos a Vencer (90 días)
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead><tr>
                <th>Medicamento</th><th>Vence</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let m of medPorVencer">
                  <td>{{ m.nombre }}</td>
                  <td>
                    <span class="badge bg-warning text-dark">
                      {{ m.fechaVencimiento }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="medPorVencer.length === 0">
                  <td colspan="2" class="text-center text-muted py-3">
                    ✅ Ningún medicamento próximo a vencer
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalMedicamentos = 0;
  totalVentas = 0;
  stockBajo = 0;
  totalAcumulado = 0;
  medStockBajo: Medicamento[] = [];
  medPorVencer: Medicamento[] = [];

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.medService.listar().subscribe(list => {
      this.totalMedicamentos = list.length;
    });
    this.medService.stockBajo(10).subscribe(list => {
      this.medStockBajo = list;
      this.stockBajo = list.length;
    });
    this.medService.porVencer(90).subscribe(list => {
      this.medPorVencer = list;
    });
    this.ventaService.listar().subscribe(list => {
      this.totalVentas = list.length;
    });
    this.ventaService.totalAcumulado().subscribe(r => {
      this.totalAcumulado = r.total;
    });
  }
}
