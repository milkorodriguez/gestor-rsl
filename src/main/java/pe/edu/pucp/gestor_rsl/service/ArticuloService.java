package pe.edu.pucp.gestor_rsl.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.pucp.gestor_rsl.modelo.Articulo;
import pe.edu.pucp.gestor_rsl.modelo.ExtraccionP3;
import pe.edu.pucp.gestor_rsl.repository.ArticuloRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticuloService {

    private final ArticuloRepository articuloRepository;

    public List<Articulo> listarTodos() {
        return articuloRepository.findAll();
    }

    public Optional<Articulo> buscarPorId(Integer id) {
        return articuloRepository.findById(id);
    }

    @Transactional
    public Articulo crear(Articulo articulo) {
        return articuloRepository.save(articulo);
    }

    @Transactional
    public Optional<Articulo> actualizar(Integer id, Articulo datos) {
        return articuloRepository.findById(id).map(articulo -> {
            articulo.setCodigo(datos.getCodigo());
            articulo.setDoi(datos.getDoi());
            articulo.setFechaExtraccion(datos.getFechaExtraccion());
            articulo.setAutores(datos.getAutores());
            articulo.setTitulo(datos.getTitulo());
            articulo.setAnio(datos.getAnio());
            articulo.setRevista(datos.getRevista());
            articulo.setResumen(datos.getResumen());
            articulo.setCadena(datos.getCadena());
            articulo.setPrioridad(datos.getPrioridad());
            articulo.setEstado(datos.getEstado());
            articulo.setAccesoPdf(datos.getAccesoPdf());
            return articuloRepository.save(articulo);
        });
    }

    @Transactional
    public boolean eliminar(Integer id) {
        if (articuloRepository.existsById(id)) {
            articuloRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Articulo> buscarPorCadena(Articulo.Cadena cadena) {
        return articuloRepository.findByCadena(cadena);
    }

    public List<Articulo> buscarPorEstado(Articulo.Estado estado) {
        return articuloRepository.findByEstado(estado);
    }

    public List<Articulo> buscarPorCadenaYEstado(Articulo.Cadena cadena, Articulo.Estado estado) {
        return articuloRepository.findByCadenaAndEstado(cadena, estado);
    }

    public List<Articulo> buscarPorCadenaYPrioridad(Articulo.Cadena cadena, Articulo.Prioridad prioridad) {
        return articuloRepository.findByCadenaAndPrioridad(cadena, prioridad);
    }

    public List<Articulo> buscarLibre(String q) {
        return articuloRepository.buscarAmplio(q);
    }

    public List<Articulo> buscarPorPais(String pais) {
        return articuloRepository.findByPais(pais);
    }

    public List<Articulo> buscarPorContaminante(String contaminante) {
        return articuloRepository.findByContaminante(contaminante);
    }

    public List<Articulo> buscarPorTopografia(String topografia) {
        return articuloRepository.findByTopografia(topografia);
    }

    public List<Articulo> buscarPorSistemaAlerta(ExtraccionP3.SiNo alerta) {
        return articuloRepository.findBySistemaAlerta(alerta);
    }

    public List<Articulo> obtenerDuplicados() {
        return articuloRepository.findDuplicadosPorDoi();
    }
}