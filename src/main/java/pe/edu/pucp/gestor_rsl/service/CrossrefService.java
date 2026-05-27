package pe.edu.pucp.gestor_rsl.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pe.edu.pucp.gestor_rsl.modelo.Articulo;

import java.util.List;
import java.util.Map;

@Service
public class CrossrefService {

    private static final String BASE_URL = "https://api.crossref.org/works/";

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Articulo importarDesdeDoiComoArticulo(String doi) {
        String url = BASE_URL + doi;
        Map<String, Object> respuesta = restTemplate.getForObject(url, Map.class);

        if (respuesta == null || !"ok".equals(respuesta.get("status"))) {
            throw new RuntimeException("DOI no encontrado en Crossref: " + doi);
        }

        Map<String, Object> message = (Map<String, Object>) respuesta.get("message");
        Articulo articulo = new Articulo();

        articulo.setDoi(doi);

        List<String> titulos = (List<String>) message.get("title");
        if (titulos != null && !titulos.isEmpty()) {
            articulo.setTitulo(titulos.get(0));
        }

        List<Map<String, Object>> autoresRaw = (List<Map<String, Object>>) message.get("author");
        if (autoresRaw != null) {
            StringBuilder autoresSb = new StringBuilder();
            for (Map<String, Object> autor : autoresRaw) {
                if (!autoresSb.isEmpty()) autoresSb.append("; ");
                String apellido = (String) autor.getOrDefault("family", "");
                String nombre   = (String) autor.getOrDefault("given", "");
                autoresSb.append(apellido).append(", ").append(nombre);
            }
            articulo.setAutores(autoresSb.toString());
        }

        Map<String, Object> publicado = (Map<String, Object>) message.get("published");
        if (publicado != null) {
            List<List<Integer>> partes = (List<List<Integer>>) publicado.get("date-parts");
            if (partes != null && !partes.isEmpty() && !partes.get(0).isEmpty()) {
                articulo.setAnio(partes.get(0).get(0));
            }
        }

        List<String> revista = (List<String>) message.get("container-title");
        if (revista != null && !revista.isEmpty()) {
            articulo.setRevista(revista.get(0));
        }

        String resumen = (String) message.get("abstract");
        if (resumen != null) {
            articulo.setResumen(resumen.replaceAll("<[^>]+>", "").trim());
        }

        return articulo;
    }
}