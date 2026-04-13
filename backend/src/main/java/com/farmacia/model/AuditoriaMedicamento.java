package com.farmacia.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_medicamento")
public class AuditoriaMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "medicamento_id")
    private Integer medicamentoId;

    @Column(name = "tipo_accion", nullable = false, length = 20)
    private String tipoAccion;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    public AuditoriaMedicamento() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getMedicamentoId() { return medicamentoId; }
    public void setMedicamentoId(Integer medicamentoId) { this.medicamentoId = medicamentoId; }
    public String getTipoAccion() { return tipoAccion; }
    public void setTipoAccion(String tipoAccion) { this.tipoAccion = tipoAccion; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
