package pe.edu.pucp.gestor_rsl.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.pucp.gestor_rsl.repository.ArticuloRepository;
import pe.edu.pucp.gestor_rsl.repository.ExtraccionP1Repository;
import pe.edu.pucp.gestor_rsl.repository.ExtraccionP2Repository;
import pe.edu.pucp.gestor_rsl.repository.ExtraccionP3Repository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ArticuloRepository articuloRepository;
    private final ExtraccionP1Repository extraccionP1Repository;
    private final ExtraccionP2Repository extraccionP2Repository;
    private final ExtraccionP3Repository extraccionP3Repository;

    public Map<String, Object> obtenerDashboard() {
        long total = articuloRepository.count();
        List<Object[]> filas = articuloRepository.contarPorCadenaYEstado();

        Map<String, Map<String, Long>> porCadena = new LinkedHashMap<>();
        for (Object[] fila : filas) {
            String cadena = fila[0].toString();
            String estado = fila[1].toString();
            Long cantidad = (Long) fila[2];
            porCadena.computeIfAbsent(cadena, k -> new LinkedHashMap<>()).put(estado, cantidad);
        }

        Map<String, Double> porcentaje = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Long>> entry : porCadena.entrySet()) {
            long totalCadena = entry.getValue().values().stream().mapToLong(Long::longValue).sum();
            long completos = entry.getValue().getOrDefault("Completo", 0L);
            porcentaje.put(entry.getKey(), totalCadena > 0 ? (completos * 100.0 / totalCadena) : 0.0);
        }

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("total_articulos", total);
        dashboard.put("por_cadena_y_estado", porCadena);
        dashboard.put("porcentaje_completado", porcentaje);
        return dashboard;
    }

    public Map<String, Long> frecuenciasContaminantes() {
        return contarTokens(extraccionP2Repository.findAllContaminantes());
    }

    public Map<String, Long> frecuenciasMetodos() {
        return contarTokens(extraccionP3Repository.findAllMetodos());
    }

    public Map<String, Long> distribucionLags() {
        return contarTokens(extraccionP3Repository.findAllLags());
    }

    public Map<String, Long> frecuenciasPaisesRegiones() {
        return contarTokens(extraccionP2Repository.findAllPaisesRegiones());
    }

    public Map<String, Long> frecuenciasSoftware() {
        List<String> valores = extraccionP1Repository.findAll()
                .stream()
                .map(p1 -> p1.getSoftware())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return contarTokens(valores);
    }

    public Map<String, Map<String, Long>> matrizPaisTopografia() {
        List<Object[]> resultados = articuloRepository.findAll().stream()
                .filter(a -> a.getExtraccionP2() != null && a.getExtraccionP3() != null)
                .filter(a -> a.getExtraccionP2().getPaisRegion() != null
                        && a.getExtraccionP3().getFactoresTopograficos() != null)
                .map(a -> new Object[]{
                        a.getExtraccionP2().getPaisRegion(),
                        a.getExtraccionP3().getFactoresTopograficos()
                })
                .collect(Collectors.toList());

        Map<String, Map<String, Long>> matriz = new LinkedHashMap<>();
        for (Object[] fila : resultados) {
            String pais = (String) fila[0];
            String topo = (String) fila[1];
            matriz.computeIfAbsent(pais, k -> new LinkedHashMap<>())
                    .merge(topo, 1L, Long::sum);
        }
        return matriz;
    }

    private Map<String, Long> contarTokens(List<String> valores) {
        Map<String, Long> frecuencias = new LinkedHashMap<>();
        for (String valor : valores) {
            String[] tokens = valor.split("[,;/]");
            for (String token : tokens) {
                String clave = token.trim();
                if (!clave.isEmpty()) {
                    frecuencias.merge(clave, 1L, Long::sum);
                }
            }
        }
        return frecuencias.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }
}