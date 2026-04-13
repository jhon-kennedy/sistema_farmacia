package com.farmacia.repository;

import com.farmacia.model.AuditoriaMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<AuditoriaMedicamento, Integer> {
    List<AuditoriaMedicamento> findAllByOrderByFechaDesc();
    List<AuditoriaMedicamento> findByMedicamentoIdOrderByFechaDesc(Integer medicamentoId);
}
