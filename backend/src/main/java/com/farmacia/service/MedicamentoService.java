package com.farmacia.service;

import com.farmacia.model.Medicamento;
import com.farmacia.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MedicamentoService {

    private final MedicamentoRepository repo;

    public MedicamentoService(MedicamentoRepository repo) {
        this.repo = repo;
    }

    public List<Medicamento> listarTodos() { return repo.findAll(); }

    public Medicamento buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado con ID: " + id));
    }

    public List<Medicamento> buscarPorNombre(String nombre) {
        return repo.findByNombreContainingIgnoreCase(nombre);
    }

    public Medicamento guardar(Medicamento medicamento) { return repo.save(medicamento); }

    public Medicamento actualizar(Integer id, Medicamento datos) {
        Medicamento existing = buscarPorId(id);
        existing.setNombre(datos.getNombre());
        existing.setDescripcion(datos.getDescripcion());
        existing.setPrecio(datos.getPrecio());
        existing.setStock(datos.getStock());
        existing.setFechaVencimiento(datos.getFechaVencimiento());
        existing.setCategoria(datos.getCategoria());
        return repo.save(existing);
    }

    public void eliminar(Integer id) { buscarPorId(id); repo.deleteById(id); }

    public List<Medicamento> stockBajo(Integer umbral) { return repo.findByStockLessThanEqual(umbral); }

    public List<Medicamento> proximosAVencer(int dias) {
        return repo.findByFechaVencimientoBefore(LocalDate.now().plusDays(dias));
    }
}
