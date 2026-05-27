package pe.edu.pucp.gestor_rsl.controller;
import pe.edu.pucp.gestor_rsl.modelo.Articulo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP3;
import pe.edu.pucp.gestor_rsl.service.ArticuloService;
import pe.edu.pucp.gestor_rsl.service.CrossrefService;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
@RequiredArgsConstructor
public class ArticuloController {

    private final ArticuloService articuloService;
    private final CrossrefService crossrefService;

    @GetMapping
    public ResponseEntity<List<Articulo>> listar(
            @RequestParam(required = false) String cadena,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String prioridad,
            @RequestParam(required = false) String pais,
            @RequestParam(required = false) String contaminante,
            @RequestParam(required = false) String topografia,
            @RequestParam(required = false) String sistema_alerta,
            @RequestParam(required = false) String q
    ) {
        List<Articulo> resultado;

        if (q != null) {
            resultado = articuloService.buscarLibre(q);
        } else if (cadena != null && estado != null) {
            resultado = articuloService.buscarPorCadenaYEstado(
                    Articulo.Cadena.valueOf(cadena), Articulo.Estado.valueOf(estado));
        } else if (cadena != null && prioridad != null) {
            resultado = articuloService.buscarPorCadenaYPrioridad(
                    Articulo.Cadena.valueOf(cadena), Articulo.Prioridad.valueOf(prioridad));
        } else if (cadena != null) {
            resultado = articuloService.buscarPorCadena(Articulo.Cadena.valueOf(cadena));
        } else if (estado != null) {
            resultado = articuloService.buscarPorEstado(Articulo.Estado.valueOf(estado));
        } else if (pais != null) {
            resultado = articuloService.buscarPorPais(pais);
        } else if (contaminante != null) {
            resultado = articuloService.buscarPorContaminante(contaminante);
        } else if (topografia != null) {
            resultado = articuloService.buscarPorTopografia(topografia);
        } else if (sistema_alerta != null) {
            resultado = articuloService.buscarPorSistemaAlerta(ExtraccionP3.SiNo.valueOf(sistema_alerta));
        } else {
            resultado = articuloService.listarTodos();
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Articulo> obtenerPorId(@PathVariable Integer id) {
        return articuloService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/duplicados")
    public ResponseEntity<List<Articulo>> obtenerDuplicados() {
        return ResponseEntity.ok(articuloService.obtenerDuplicados());
    }

    @PostMapping
    public ResponseEntity<Articulo> crear(@RequestBody Articulo articulo) {
        Articulo creado = articuloService.crear(articulo);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/importar-doi")
    public ResponseEntity<?> importarDoi(@RequestBody ImportarDoiRequest request) {
        try {
            Articulo articulo = crossrefService.importarDesdeDoiComoArticulo(request.doi());
            articulo.setCadena(Articulo.Cadena.valueOf(request.cadena()));
            Articulo guardado = articuloService.crear(articulo);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("No se pudo importar el DOI: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Articulo> actualizar(
            @PathVariable Integer id,
            @RequestBody Articulo articulo
    ) {
        return articuloService.actualizar(id, articulo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        return articuloService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    record ImportarDoiRequest(String doi, String cadena) {}
    record ErrorResponse(String mensaje) {}
}