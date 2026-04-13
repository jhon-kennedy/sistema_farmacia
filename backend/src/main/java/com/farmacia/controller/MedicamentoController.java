package com.farmacia.controller;

import com.farmacia.model.Medicamento;
import com.farmacia.service.MedicamentoService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    private final MedicamentoService service;

    public MedicamentoController(MedicamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Medicamento>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Medicamento>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(service.buscarPorNombre(nombre));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Medicamento>> stockBajo(
            @RequestParam(defaultValue = "10") Integer umbral) {
        return ResponseEntity.ok(service.stockBajo(umbral));
    }

    @GetMapping("/por-vencer")
    public ResponseEntity<List<Medicamento>> porVencer(
            @RequestParam(defaultValue = "90") int dias) {
        return ResponseEntity.ok(service.proximosAVencer(dias));
    }

    @PostMapping
    public ResponseEntity<Medicamento> crear(@RequestBody Medicamento medicamento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(medicamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> actualizar(@PathVariable Integer id,
                                                   @RequestBody Medicamento medicamento) {
        return ResponseEntity.ok(service.actualizar(id, medicamento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
