import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento, Categoria, Venta, VentaRequest, AuditoriaMedicamento } from '../models/models';

const API = 'http://localhost:8080/api';

// ──────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${API}/medicamentos`);
  }
  buscarPorNombre(nombre: string): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${API}/medicamentos/buscar`, {
      params: new HttpParams().set('nombre', nombre)
    });
  }
  stockBajo(umbral = 10): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${API}/medicamentos/stock-bajo`, {
      params: new HttpParams().set('umbral', umbral)
    });
  }
  porVencer(dias = 90): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${API}/medicamentos/por-vencer`, {
      params: new HttpParams().set('dias', dias)
    });
  }
  crear(m: Medicamento): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${API}/medicamentos`, m);
  }
  actualizar(id: number, m: Medicamento): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${API}/medicamentos/${id}`, m);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/medicamentos/${id}`);
  }
}

// ──────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API}/categorias`);
  }
  crear(c: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${API}/categorias`, c);
  }
}

// ──────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class VentaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${API}/ventas`);
  }
  buscarPorId(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${API}/ventas/${id}`);
  }
  totalAcumulado(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${API}/ventas/total-acumulado`);
  }
  registrar(req: VentaRequest): Observable<Venta> {
    return this.http.post<Venta>(`${API}/ventas`, req);
  }
}

// ──────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<AuditoriaMedicamento[]> {
    return this.http.get<AuditoriaMedicamento[]>(`${API}/auditoria`);
  }
}
