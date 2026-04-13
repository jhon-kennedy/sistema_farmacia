import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <div class="sidebar d-flex flex-column">
      <div class="brand">
        <h5><i class="bi bi-capsule me-2"></i>FarmaSystem</h5>
        <small>Gestión de Farmacia</small>
      </div>

      <nav class="nav flex-column mt-3 px-1">
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
          <i class="bi bi-speedometer2"></i> Dashboard
        </a>

        <div class="px-3 py-2 mt-2">
          <small class="text-uppercase" style="color:#5a7898;font-size:.7rem;letter-spacing:.08em">
            Inventario
          </small>
        </div>
        <a class="nav-link" routerLink="/medicamentos" routerLinkActive="active">
          <i class="bi bi-box-seam"></i> Medicamentos
        </a>
        <a class="nav-link" routerLink="/medicamentos/nuevo" routerLinkActive="active">
          <i class="bi bi-plus-circle"></i> Nuevo Medicamento
        </a>

        <div class="px-3 py-2 mt-2">
          <small class="text-uppercase" style="color:#5a7898;font-size:.7rem;letter-spacing:.08em">
            Ventas
          </small>
        </div>
        <a class="nav-link" routerLink="/ventas/nueva" routerLinkActive="active">
          <i class="bi bi-cart-plus"></i> Nueva Venta
        </a>
        <a class="nav-link" routerLink="/ventas/historial" routerLinkActive="active">
          <i class="bi bi-receipt"></i> Historial
        </a>

        <div class="px-3 py-2 mt-2">
          <small class="text-uppercase" style="color:#5a7898;font-size:.7rem;letter-spacing:.08em">
            Sistema
          </small>
        </div>
        <a class="nav-link" routerLink="/auditoria" routerLinkActive="active">
          <i class="bi bi-shield-check"></i> Auditoría
        </a>
      </nav>

      <div class="mt-auto p-3 border-top" style="border-color:rgba(255,255,255,.1)!important">
        <small style="color:#5a7898">ELP © 2025</small>
      </div>
    </div>
  `
})
export class NavbarComponent {}
