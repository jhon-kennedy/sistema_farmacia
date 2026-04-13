package com.farmacia.dto;

import java.util.List;

public class VentaRequest {

    private String clienteNombre;
    private List<DetalleRequest> detalles;

    public VentaRequest() {}

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    public List<DetalleRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleRequest> detalles) { this.detalles = detalles; }

    public static class DetalleRequest {
        private Integer medicamentoId;
        private Integer cantidad;

        public DetalleRequest() {}

        public Integer getMedicamentoId() { return medicamentoId; }
        public void setMedicamentoId(Integer medicamentoId) { this.medicamentoId = medicamentoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}
