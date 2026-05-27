package pe.edu.pucp.gestor_rsl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.pucp.gestor_rsl.service.ReporteService;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(reporteService.obtenerDashboard());
    }

    @GetMapping("/reportes/frecuencias")
    public ResponseEntity<?> frecuencias(@RequestParam String campo) {
        Map<String, Long> resultado = switch (campo) {
            case "contaminantes" -> reporteService.frecuenciasContaminantes();
            case "metodos"       -> reporteService.frecuenciasMetodos();
            case "software"      -> reporteService.frecuenciasSoftware();
            case "paises"        -> reporteService.frecuenciasPaisesRegiones();
            default -> null;
        };

        if (resultado == null) {
            return ResponseEntity.badRequest()
                    .body("Campo no soportado. Use: contaminantes | metodos | software | paises");
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/reportes/lags")
    public ResponseEntity<Map<String, Long>> lags() {
        return ResponseEntity.ok(reporteService.distribucionLags());
    }

    @GetMapping("/reportes/software")
    public ResponseEntity<Map<String, Long>> software() {
        return ResponseEntity.ok(reporteService.frecuenciasSoftware());
    }

    @GetMapping("/reportes/metodos")
    public ResponseEntity<Map<String, Long>> metodos(
            @RequestParam(required = false) String cadena
    ) {
        return ResponseEntity.ok(reporteService.frecuenciasMetodos());
    }

    @GetMapping("/reportes/matriz")
    public ResponseEntity<Map<String, Map<String, Long>>> matriz(
            @RequestParam(defaultValue = "pais") String filas,
            @RequestParam(defaultValue = "topografia") String columnas
    ) {
        return ResponseEntity.ok(reporteService.matrizPaisTopografia());
    }
}