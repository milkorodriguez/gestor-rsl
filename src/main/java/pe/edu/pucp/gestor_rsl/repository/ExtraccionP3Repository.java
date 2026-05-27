package pe.edu.pucp.gestor_rsl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP3;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExtraccionP3Repository extends JpaRepository<ExtraccionP3, Integer> {
    Optional<ExtraccionP3> findByArticuloId(Integer articuloId);

    @Query("SELECT p3.lagEstimado FROM ExtraccionP3 p3 WHERE p3.lagEstimado IS NOT NULL")
    List<String> findAllLags();

    @Query("SELECT p3.metodoModelamiento FROM ExtraccionP3 p3 WHERE p3.metodoModelamiento IS NOT NULL")
    List<String> findAllMetodos();
}