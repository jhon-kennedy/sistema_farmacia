import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { NavbarComponent }          from './components/navbar/navbar.component';
import { DashboardComponent }       from './components/dashboard/dashboard.component';
import { ListaMedicamentosComponent } from './components/medicamentos/lista/lista-medicamentos.component';
import { FormMedicamentoComponent }   from './components/medicamentos/form/form-medicamento.component';
import { NuevaVentaComponent }        from './components/ventas/nueva/nueva-venta.component';
import { HistorialVentasComponent }   from './components/ventas/historial/historial-ventas.component';
import { ComprobanteComponent }       from './components/comprobante/comprobante.component';
import { AuditoriaComponent }         from './components/auditoria/auditoria.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ListaMedicamentosComponent,
    FormMedicamentoComponent,
    NuevaVentaComponent,
    HistorialVentasComponent,
    ComprobanteComponent,
    AuditoriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
