package pe.edu.pucp.gestor_rsl.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "EXTRACCION_P2")
@Getter @Setter @RequiredArgsConstructor
public class ExtraccionP2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idArticulo", nullable = false)
    private Articulo articulo;

    @Column(name = "contaminantes", length = 300)
    private String contaminantes;

    @Column(name = "fuente_ambiental", columnDefinition = "TEXT")
    private String fuenteAmbiental;

    @Column(name = "fuente_satelital", columnDefinition = "TEXT")
    private String fuenteSatelital;

    @Column(name = "fuente_salud", columnDefinition = "TEXT")
    private String fuenteSalud;

    @Column(name = "otras_fuentes", columnDefinition = "TEXT")
    private String otrasFuentes;

    @Column(name = "poblacion", length = 300)
    private String poblacion;

    @Column(name = "resolucion_espacial", length = 200)
    private String resolucionEspacial;

    @Column(name = "resolucion_temporal", length = 100)
    private String resolucionTemporal;

    @Column(name = "pais_region", length = 300)
    private String paisRegion;

    @Column(name = "periodo_cubierto", length = 100)
    private String periodoCubierto;
}
