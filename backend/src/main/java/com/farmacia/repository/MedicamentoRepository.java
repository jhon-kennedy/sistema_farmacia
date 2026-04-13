package com.farmacia.repository;

import com.farmacia.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {

    List<Medicamento> findByNombreContainingIgnoreCase(String nombre);

    List<Medicamento> findByStockLessThanEqual(Integer stock);

    @Query("SELECT m FROM Medicamento m WHERE m.fechaVencimiento <= :fecha")
    List<Medicamento> findByFechaVencimientoBefore(@Param("fecha") LocalDate fecha);

    List<Medicamento> findByCategoriaId(Integer categoriaId);
}
