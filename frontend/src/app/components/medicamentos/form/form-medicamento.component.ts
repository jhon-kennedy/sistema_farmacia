import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentoService, CategoriaService } from '../../../services/services';
import { Categoria } from '../../../models/models';

@Component({
  selector: 'app-form-medicamento',
  template: `
    <div class="d-flex align-items-center mb-4 gap-2">
      <a routerLink="/medicamentos" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left"></i>
      </a>
      <div>
        <h4 class="fw-bold mb-0">{{ esEdicion ? 'Editar' : 'Nuevo' }} Medicamento</h4>
        <small class="text-muted">Complete todos los campos requeridos</small>
      </div>
    </div>

    <div class="card" style="max-width:680px">
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="guardar()">

          <div class="mb-3">
            <label class="form-label fw-semibold">Nombre <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="nombre"
                   placeholder="Ej: Paracetamol 500mg">
            <div *ngIf="f['nombre'].touched && f['nombre'].invalid"
                 class="text-danger small mt-1">El nombre es obligatorio.</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Descripción</label>
            <textarea class="form-control" formControlName="descripcion"
                      rows="2" placeholder="Descripción breve del medicamento"></textarea>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Precio (S/.) <span class="text-danger">*</span></label>
              <input type="number" class="form-control" formControlName="precio"
                     step="0.01" min="0" placeholder="0.00">
              <div *ngIf="f['precio'].touched && f['precio'].invalid"
                   class="text-danger small mt-1">Precio inválido.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Stock <span class="text-danger">*</span></label>
              <input type="number" class="form-control" formControlName="stock"
                     min="0" placeholder="0">
              <div *ngIf="f['stock'].touched && f['stock'].invalid"
                   class="text-danger small mt-1">Stock inválido.</div>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Fecha de Vencimiento <span class="text-danger">*</span></label>
              <input type="date" class="form-control" formControlName="fechaVencimiento">
              <div *ngIf="f['fechaVencimiento'].touched && f['fechaVencimiento'].invalid"
                   class="text-danger small mt-1">Fecha requerida.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Categoría</label>
              <select class="form-select" formControlName="categoriaId">
                <option value="">-- Seleccionar --</option>
                <option *ngFor="let c of categorias" [value]="c.id">{{ c.nombre }}</option>
              </select>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4"
                    [disabled]="form.invalid || guardando">
              <span *ngIf="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!guardando" class="bi bi-check-lg me-1"></i>
              {{ esEdicion ? 'Actualizar' : 'Registrar' }}
            </button>
            <a routerLink="/medicamentos" class="btn btn-outline-secondary px-4">
              Cancelar
            </a>
          </div>

          <div *ngIf="mensaje" class="alert mt-3"
               [class.alert-success]="tipoMensaje==='success'"
               [class.alert-danger]="tipoMensaje==='danger'">
            {{ mensaje }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormMedicamentoComponent implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  esEdicion = false;
  editId?: number;
  guardando = false;
  mensaje = '';
  tipoMensaje = '';

  constructor(
    private fb: FormBuilder,
    private medService: MedicamentoService,
    private catService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:           ['', Validators.required],
      descripcion:      [''],
      precio:           [null, [Validators.required, Validators.min(0)]],
      stock:            [0,   [Validators.required, Validators.min(0)]],
      fechaVencimiento: ['', Validators.required],
      categoriaId:      ['']
    });

    this.catService.listar().subscribe(c => this.categorias = c);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.editId = +id;
      this.medService.listar().subscribe(list => {
        const m = list.find(x => x.id === this.editId);
        if (m) {
          this.form.patchValue({
            nombre: m.nombre,
            descripcion: m.descripcion,
            precio: m.precio,
            stock: m.stock,
            fechaVencimiento: m.fechaVencimiento,
            categoriaId: m.categoria?.id || ''
          });
        }
      });
    }
  }

  get f() { return this.form.controls; }

  guardar(): void {
    if (this.form.invalid) return;
    this.guardando = true;

    const val = this.form.value;
    const payload: any = {
      nombre: val.nombre,
      descripcion: val.descripcion,
      precio: val.precio,
      stock: val.stock,
      fechaVencimiento: val.fechaVencimiento,
      categoria: val.categoriaId ? { id: +val.categoriaId } : null
    };

    const op = this.esEdicion
      ? this.medService.actualizar(this.editId!, payload)
      : this.medService.crear(payload);

    op.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrar(
          this.esEdicion ? 'Medicamento actualizado.' : 'Medicamento registrado.',
          'success'
        );
        setTimeout(() => this.router.navigate(['/medicamentos']), 1500);
      },
      error: () => { this.guardando = false; this.mostrar('Error al guardar.', 'danger'); }
    });
  }

  mostrar(msg: string, tipo: string): void {
    this.mensaje = msg; this.tipoMensaje = tipo;
  }
}
