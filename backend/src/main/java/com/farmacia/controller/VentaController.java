package com.farmacia.controller;

import com.farmacia.dto.VentaRequest;
import com.farmacia.model.Venta;
import com.farmacia.service.VentaService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Venta>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/total-acumulado")
    public ResponseEntity<Map<String, BigDecimal>> totalAcumulado() {
        return ResponseEntity.ok(Map.of("total", service.totalAcumulado()));
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody VentaRequest req) {
        try {
            Venta venta = service.registrarVenta(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(venta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
