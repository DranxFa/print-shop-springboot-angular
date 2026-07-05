package com.printing.managment.repository;

import com.printing.managment.model.Acabado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcabadoRepository extends JpaRepository<Acabado, Long> {
}
