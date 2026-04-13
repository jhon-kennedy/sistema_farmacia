package com.farmacia.service;

import com.farmacia.model.Categoria;
import com.farmacia.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) { this.repo = repo; }

    public List<Categoria> listarTodas() { return repo.findAll(); }

    public Categoria buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
    }

    public Categoria guardar(Categoria c) { return repo.save(c); }

    public void eliminar(Integer id) { repo.deleteById(id); }
}
