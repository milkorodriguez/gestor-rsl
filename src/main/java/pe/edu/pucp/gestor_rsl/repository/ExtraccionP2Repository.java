package pe.edu.pucp.gestor_rsl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP2;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExtraccionP2Repository extends JpaRepository<ExtraccionP2, Integer> {
    Optional<ExtraccionP2> findByArticuloId(Integer articuloId);

    @Query("SELECT p2.contaminantes FROM ExtraccionP2 p2 WHERE p2.contaminantes IS NOT NULL")
    List<String> findAllContaminantes();

    @Query("SELECT p2.paisRegion FROM ExtraccionP2 p2 WHERE p2.paisRegion IS NOT NULL")
    List<String> findAllPaisesRegiones();
}