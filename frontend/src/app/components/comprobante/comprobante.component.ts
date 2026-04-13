import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../services/services';
import { Venta } from '../../models/models';

@Component({
  selector: 'app-comprobante',
  template: `
    <div class="d-flex gap-2 mb-4">
      <button class="btn btn-outline-secondary btn-sm" (click)="volver()">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
      <button class="btn btn-primary btn-sm" (click)="imprimir()">
        <i class="bi bi-printer me-1"></i>Imprimir
      </button>
    </div>

    <div *ngIf="cargando" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div *ngIf="venta && !cargando" class="comprobante" id="comprobante-print">
      <div class="text-center mb-3">
        <i class="bi bi-capsule" style="font-size:2rem;color:#0d6efd"></i>
        <h5 class="fw-bold mb-0 mt-1">FARMACIA ELP</h5>
        <small>Escuela Superior La Pontificia</small>
        <hr>
        <div class="badge bg-success mb-2">✓ VENTA CONFIRMADA</div>
        <br>
        <strong>COMPROBANTE DE VENTA</strong>
      </div>

      <div class="row mb-2" style="font-size:.85rem">
        <div class="col-6"><strong>N° Venta:</strong></div>
        <div class="col-6 text-end">#{{ venta.id }}</div>
        <div class="col-6"><strong>Fecha:</strong></div>
        <div class="col-6 text-end">{{ venta.fecha | date:'dd/MM/yyyy HH:mm' }}</div>
        <div class="col-6"><strong>Cliente:</strong></div>
        <div class="col-6 text-end">{{ venta.clienteNombre }}</div>
      </div>

      <hr>
      <table class="table table-sm" style="font-size:.82rem">
        <thead>
          <tr>
            <th>Producto</th><th class="text-center">Cant.</th>
            <th class="text-end">P.Unit</th><th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of venta.detalles">
            <td>{{ d.medicamento?.nombre }}</td>
            <td class="text-center">{{ d.cantidad }}</td>
            <td class="text-end">S/. {{ d.precioUnitario | number:'1.2-2' }}</td>
            <td class="text-end">S/. {{ d.subtotal | number:'1.2-2' }}</td>
          </tr>
        </tbody>
      </table>
      <hr>

      <div class="d-flex justify-content-between fw-bold fs-6 mb-2">
        <span>TOTAL A PAGAR:</span>
        <span class="text-success">S/. {{ venta.total | number:'1.2-2' }}</span>
      </div>

      <hr>
      <div class="text-center mt-3" style="font-size:.75rem;color:#888">
        Gracias por su compra<br>
        Conserve su comprobante
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .btn { display: none !important; }
      .main-content { margin-left: 0 !important; }
      .sidebar { display: none !important; }
    }
  `]
})
export class ComprobanteComponent implements OnInit {
  venta?: Venta;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: VentaService
  ) {}

  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    this.service.buscarPorId(id).subscribe({
      next: v => { this.venta = v; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  imprimir(): void { window.print(); }
  volver(): void { this.router.navigate(['/ventas/historial']); }
}
