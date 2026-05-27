package pe.edu.pucp.gestor_rsl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP1;
import java.util.Optional;

@Repository
public interface ExtraccionP1Repository extends JpaRepository<ExtraccionP1, Integer> {
    Optional<ExtraccionP1> findByArticuloId(Integer articuloId);
}