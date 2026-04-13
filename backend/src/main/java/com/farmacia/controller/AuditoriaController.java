package com.farmacia.controller;

import com.farmacia.model.AuditoriaMedicamento;
import com.farmacia.repository.AuditoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    private final AuditoriaRepository repo;

    public AuditoriaController(AuditoriaRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<AuditoriaMedicamento>> listar() {
        return ResponseEntity.ok(repo.findAllByOrderByFechaDesc());
    }

    @GetMapping("/medicamento/{id}")
    public ResponseEntity<List<AuditoriaMedicamento>> porMedicamento(@PathVariable Integer id) {
        return ResponseEntity.ok(repo.findByMedicamentoIdOrderByFechaDesc(id));
    }
}
