package pe.edu.pucp.gestor_rsl.modelo;

import jakarta.persistence.*;
        import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "EXTRACCION_P1")
@Getter @Setter @RequiredArgsConstructor
public class ExtraccionP1 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idArticulo", nullable = false)
    private Articulo articulo;

    @Column(name = "analisis_espacial", columnDefinition = "TEXT")
    private String analisisEspacial;

    @Column(name = "analisis_temporal", columnDefinition = "TEXT")
    private String analisisTemporal;

    @Column(name = "software", length = 300)
    private String software;

    @Column(name = "diseno_estudio", length = 200)
    private String disenoEstudio;
}