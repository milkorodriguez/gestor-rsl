package pe.edu.pucp.gestor_rsl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.gestor_rsl.modelo.Articulo;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP3;

import java.util.List;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Integer> {

    List<Articulo> findByCadena(Articulo.Cadena cadena);
    List<Articulo> findByEstado(Articulo.Estado estado);
    List<Articulo> findByPrioridad(Articulo.Prioridad prioridad);
    List<Articulo> findByCadenaAndEstado(Articulo.Cadena cadena, Articulo.Estado estado);
    List<Articulo> findByCadenaAndPrioridad(Articulo.Cadena cadena, Articulo.Prioridad prioridad);

    List<Articulo> findByTituloContainingIgnoreCaseOrResumenContainingIgnoreCase(String titulo, String resumen);

    List<Articulo> findByDoi(String doi);

    @Query("SELECT a FROM Articulo a WHERE a.doi IS NOT NULL AND a.doi IN " +
            "(SELECT a2.doi FROM Articulo a2 GROUP BY a2.doi HAVING COUNT(a2.doi) > 1)")
    List<Articulo> findDuplicadosPorDoi();

    @Query("SELECT a.cadena, a.estado, COUNT(a) FROM Articulo a GROUP BY a.cadena, a.estado")
    List<Object[]> contarPorCadenaYEstado();

    @Query("SELECT a FROM Articulo a JOIN a.extraccionP2 p2 " +
            "WHERE LOWER(p2.paisRegion) LIKE LOWER(CONCAT('%', :pais, '%'))")
    List<Articulo> findByPais(@Param("pais") String pais);

    @Query("SELECT a FROM Articulo a JOIN a.extraccionP2 p2 " +
            "WHERE LOWER(p2.contaminantes) LIKE LOWER(CONCAT('%', :contaminante, '%'))")
    List<Articulo> findByContaminante(@Param("contaminante") String contaminante);

    @Query("SELECT a FROM Articulo a JOIN a.extraccionP3 p3 " +
            "WHERE LOWER(p3.factoresTopograficos) = LOWER(:topografia)")
    List<Articulo> findByTopografia(@Param("topografia") String topografia);

    @Query("SELECT a FROM Articulo a JOIN a.extraccionP3 p3 " +
            "WHERE p3.sistemaAlerta = :alerta")
    List<Articulo> findBySistemaAlerta(@Param("alerta") ExtraccionP3.SiNo alerta);

    @Query("SELECT DISTINCT a FROM Articulo a " +
            "LEFT JOIN a.extraccionP1 p1 LEFT JOIN a.extraccionP2 p2 LEFT JOIN a.extraccionP3 p3 " +
            "WHERE LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(a.resumen) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(a.autores) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p1.software) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p1.analisisEspacial) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p1.analisisTemporal) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p2.contaminantes) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p2.paisRegion) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p3.metodoModelamiento) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(p3.resultadoPrincipal) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Articulo> buscarAmplio(@Param("q") String q);
}
