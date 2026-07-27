package com.printing.managment.repository;

import com.printing.managment.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByRucDni(String rucDni);
    boolean existsByRucDni(String rucDni);
    boolean existsByRucDniAndIdNot(String rucDni, Long id);
}
