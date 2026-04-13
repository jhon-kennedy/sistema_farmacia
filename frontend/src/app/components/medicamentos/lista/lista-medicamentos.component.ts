import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicamentoService } from '../../../services/services';
import { Medicamento } from '../../../models/models';

@Component({
  selector: 'app-lista-medicamentos',
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Medicamentos</h4>
        <small class="text-muted">{{ medicamentos.length }} registros encontrados</small>
      </div>
      <a routerLink="/medicamentos/nuevo" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>Nuevo
      </a>
    </div>

    <!-- Buscador -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input type="text" class="form-control border-start-0"
                 placeholder="Buscar medicamento por nombre..."
                 [(ngModel)]="termino"
                 (input)="buscar()" />
          <button class="btn btn-outline-secondary" *ngIf="termino" (click)="limpiar()">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of medicamentos; let i = index"
                  [class.expired]="estaVencido(m.fechaVencimiento)"
                  [class.near-exp]="porVencer(m.fechaVencimiento)">
                <td class="text-muted">{{ i + 1 }}</td>
                <td>
                  <div class="fw-semibold">{{ m.nombre }}</div>
                  <small class="text-muted">{{ m.descripcion | slice:0:40 }}</small>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">
                    {{ m.categoria?.nombre || '—' }}
                  </span>
                </td>
                <td class="fw-semibold text-success">S/. {{ m.precio | number:'1.2-2' }}</td>
                <td>
                  <span class="badge"
                    [class.bg-success]="m.stock > 20"
                    [class.bg-warning]="m.stock > 0 && m.stock <= 20"
                    [class.bg-danger]="m.stock === 0"
                    [class.text-dark]="m.stock > 0 && m.stock <= 20">
                    {{ m.stock }} uds.
                  </span>
                </td>
                <td>{{ m.fechaVencimiento }}</td>
                <td>
                  <span *ngIf="estaVencido(m.fechaVencimiento)" class="badge badge-danger">VENCIDO</span>
                  <span *ngIf="porVencer(m.fechaVencimiento) && !estaVencido(m.fechaVencimiento)"
                        class="badge badge-warning">POR VENCER</span>
                  <span *ngIf="!estaVencido(m.fechaVencimiento) && !porVencer(m.fechaVencimiento)"
                        class="badge badge-ok">OK</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <a [routerLink]="['/medicamentos/editar', m.id]"
                       class="btn btn-outline-primary" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-outline-danger" title="Eliminar"
                            (click)="eliminar(m)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="medicamentos.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-3 d-block mb-2"></i>No se encontraron medicamentos
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Alerta éxito/error -->
    <div *ngIf="mensaje" class="alert mt-3"
         [class.alert-success]="tipoMensaje==='success'"
         [class.alert-danger]="tipoMensaje==='danger'">
      {{ mensaje }}
    </div>
  `
})
export class ListaMedicamentosComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  termino = '';
  mensaje = '';
  tipoMensaje = '';

  constructor(
    private service: MedicamentoService,
    private router: Router
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe(data => this.medicamentos = data);
  }

  buscar(): void {
    if (this.termino.trim().length < 2) { this.cargar(); return; }
    this.service.buscarPorNombre(this.termino)
      .subscribe(data => this.medicamentos = data);
  }

  limpiar(): void { this.termino = ''; this.cargar(); }

  eliminar(m: Medicamento): void {
    if (!confirm(`¿Eliminar "${m.nombre}"?`)) return;
    this.service.eliminar(m.id!).subscribe({
      next: () => { this.mostrar('Medicamento eliminado correctamente.', 'success'); this.cargar(); },
      error: () => this.mostrar('Error al eliminar el medicamento.', 'danger')
    });
  }

  estaVencido(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }

  porVencer(fecha: string): boolean {
    const limite = new Date();
    limite.setDate(limite.getDate() + 90);
    return new Date(fecha) <= limite && !this.estaVencido(fecha);
  }

  mostrar(msg: string, tipo: string): void {
    this.mensaje = msg; this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
