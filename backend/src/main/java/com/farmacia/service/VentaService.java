package com.farmacia.service;

import com.farmacia.dto.VentaRequest;
import com.farmacia.model.*;
import com.farmacia.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepo;
    private final MedicamentoRepository medRepo;

    public VentaService(VentaRepository ventaRepo, MedicamentoRepository medRepo) {
        this.ventaRepo = ventaRepo;
        this.medRepo = medRepo;
    }

    public List<Venta> listarTodas() { return ventaRepo.findAllByOrderByFechaDesc(); }

    public Venta buscarPorId(Integer id) {
        return ventaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada: " + id));
    }

    public BigDecimal totalAcumulado() { return ventaRepo.sumTotalVentas(); }

    @Transactional
    public Venta registrarVenta(VentaRequest req) {
        if (req.getDetalles() == null || req.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un producto.");
        }

        Venta venta = new Venta();
        String cliente = req.getClienteNombre();
        venta.setClienteNombre((cliente == null || cliente.isBlank()) ? "Cliente General" : cliente);
        venta.setFecha(LocalDateTime.now());
        venta.setTotal(BigDecimal.ZERO);

        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        for (VentaRequest.DetalleRequest dr : req.getDetalles()) {
            Medicamento med = medRepo.findById(dr.getMedicamentoId())
                    .orElseThrow(() -> new RuntimeException("Medicamento no encontrado: " + dr.getMedicamentoId()));

            if (med.getStock() < dr.getCantidad()) {
                throw new RuntimeException(
                        "Stock insuficiente para: " + med.getNombre() +
                        " (disponible: " + med.getStock() + ")");
            }

            BigDecimal subtotal = med.getPrecio().multiply(BigDecimal.valueOf(dr.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setMedicamento(med);
            detalle.setCantidad(dr.getCantidad());
            detalle.setPrecioUnitario(med.getPrecio());
            detalle.setSubtotal(subtotal);

            detalles.add(detalle);
            totalVenta = totalVenta.add(subtotal);

            med.setStock(med.getStock() - dr.getCantidad());
            medRepo.save(med);
        }

        venta.setTotal(totalVenta);
        venta.setDetalles(detalles);
        return ventaRepo.save(venta);
    }
}
