import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }         from './components/dashboard/dashboard.component';
import { ListaMedicamentosComponent } from './components/medicamentos/lista/lista-medicamentos.component';
import { FormMedicamentoComponent }   from './components/medicamentos/form/form-medicamento.component';
import { NuevaVentaComponent }        from './components/ventas/nueva/nueva-venta.component';
import { HistorialVentasComponent }   from './components/ventas/historial/historial-ventas.component';
import { ComprobanteComponent }       from './components/comprobante/comprobante.component';
import { AuditoriaComponent }         from './components/auditoria/auditoria.component';

const routes: Routes = [
  { path: '',                    redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',           component: DashboardComponent },
  { path: 'medicamentos',        component: ListaMedicamentosComponent },
  { path: 'medicamentos/nuevo',  component: FormMedicamentoComponent },
  { path: 'medicamentos/editar/:id', component: FormMedicamentoComponent },
  { path: 'ventas/nueva',        component: NuevaVentaComponent },
  { path: 'ventas/historial',    component: HistorialVentasComponent },
  { path: 'ventas/comprobante/:id', component: ComprobanteComponent },
  { path: 'auditoria',           component: AuditoriaComponent },
  { path: '**',                  redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
