import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from '../../services/services';
import { AuditoriaMedicamento } from '../../models/models';

@Component({
  selector: 'app-auditoria',
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-0">Auditoría del Sistema</h4>
      <small class="text-muted">Registro de todas las operaciones sobre medicamentos</small>
    </div>

    <!-- Filtro por tipo -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-sm"
                  [class.btn-secondary]="filtro===''"
                  [class.btn-outline-secondary]="filtro!=''"
                  (click)="filtro=''">Todos ({{ registros.length }})</button>
          <button class="btn btn-sm"
                  [class.btn-success]="filtro==='INSERT'"
                  [class.btn-outline-success]="filtro!='INSERT'"
                  (click)="filtro='INSERT'">
            INSERT ({{ contar('INSERT') }})
          </button>
          <button class="btn btn-sm"
                  [class.btn-warning]="filtro==='UPDATE'"
                  [class.btn-outline-warning]="filtro!='UPDATE'"
                  (click)="filtro='UPDATE'">
            UPDATE ({{ contar('UPDATE') }})
          </button>
          <button class="btn btn-sm"
                  [class.btn-danger]="filtro==='DELETE'"
                  [class.btn-outline-danger]="filtro!='DELETE'"
                  (click)="filtro='DELETE'">
            DELETE ({{ contar('DELETE') }})
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th><th>ID Med.</th><th>Acción</th><th>Fecha</th><th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of registrosFiltrados">
                <td class="text-muted">{{ r.id }}</td>
                <td><span class="badge bg-light text-dark border">#{{ r.medicamentoId }}</span></td>
                <td>
                  <span class="badge"
                    [class.bg-success]="r.tipoAccion==='INSERT'"
                    [class.bg-warning]="r.tipoAccion==='UPDATE'"
                    [class.text-dark]="r.tipoAccion==='UPDATE'"
                    [class.bg-danger]="r.tipoAccion==='DELETE'">
                    {{ r.tipoAccion }}
                  </span>
                </td>
                <td>{{ r.fecha | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                <td style="font-size:.83rem">{{ r.descripcion }}</td>
              </tr>
              <tr *ngIf="registrosFiltrados.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="bi bi-shield-check fs-3 d-block mb-2"></i>Sin registros de auditoría
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AuditoriaComponent implements OnInit {
  registros: AuditoriaMedicamento[] = [];
  filtro = '';

  constructor(private service: AuditoriaService) {}

  ngOnInit(): void {
    this.service.listar().subscribe(data => this.registros = data);
  }

  get registrosFiltrados(): AuditoriaMedicamento[] {
    return this.filtro
      ? this.registros.filter(r => r.tipoAccion === this.filtro)
      : this.registros;
  }

  contar(tipo: string): number {
    return this.registros.filter(r => r.tipoAccion === tipo).length;
  }
}
