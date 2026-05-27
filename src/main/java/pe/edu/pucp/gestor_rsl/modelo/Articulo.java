package pe.edu.pucp.gestor_rsl.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "ARTICULO")
@Getter @Setter @RequiredArgsConstructor
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo", nullable = false, length = 10)
    private String codigo;

    @Column(name = "doi", length = 200)
    private String doi;

    @Column(name = "fecha_extraccion")
    private LocalDate fechaExtraccion;

    @Column(name = "autores", length = 500)
    private String autores;

    @Column(name = "titulo", nullable = false, length = 500)
    private String titulo;

    @Column(name = "anio")
    private Integer anio;

    @Column(name = "revista", length = 300)
    private String revista;

    @Column(name = "resumen", columnDefinition = "TEXT")
    private String resumen;

    @Enumerated(EnumType.STRING)
    @Column(name = "cadena", nullable = false)
    private Cadena cadena;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad")
    private Prioridad prioridad = Prioridad.Media;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado = Estado.Pendiente;

    @Enumerated(EnumType.STRING)
    @Column(name = "acceso_pdf")
    private AccesoPdf accesoPdf = AccesoPdf.Sin_acceso;

    @OneToOne(mappedBy = "articulo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ExtraccionP1 extraccionP1;

    @OneToOne(mappedBy = "articulo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ExtraccionP2 extraccionP2;

    @OneToOne(mappedBy = "articulo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ExtraccionP3 extraccionP3;

    public enum Cadena    { P1, P2, P3 }
    public enum Prioridad { Alta, Media, Baja }
    public enum Estado    { Pendiente, En_progreso, Completo }
    public enum AccesoPdf { Disponible, Sin_acceso }
}