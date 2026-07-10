package pe.edu.pucp.gestor_rsl.modelo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "EXTRACCION_P3")
@Getter @Setter @RequiredArgsConstructor
public class ExtraccionP3 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idArticulo", nullable = false)
    @JsonIgnore
    private Articulo articulo;

    @Column(name = "metodo_modelamiento", columnDefinition = "TEXT")
    private String metodoModelamiento;

    @Column(name = "lag_estimado", length = 200)
    private String lagEstimado;

    @Column(name = "ajuste_confusores", columnDefinition = "TEXT")
    private String ajusteConfusores;

    @Column(name = "factores_topograficos", length = 100)
    private String factoresTopograficos;

    @Column(name = "metrica_evaluacion", length = 200)
    private String metricaEvaluacion;

    @Column(name = "valor_alcanzado", length = 300)
    private String valorAlcanzado;

    @Enumerated(EnumType.STRING)
    @Column(name = "sistema_alerta")
    private SiNo sistemaAlerta = SiNo.No;

    @Column(name = "tipo_alerta", length = 200)
    private String tipoAlerta;

    @Column(name = "resultado_principal", columnDefinition = "TEXT")
    private String resultadoPrincipal;

    @Column(name = "limitaciones", columnDefinition = "TEXT")
    private String limitaciones;

    @Column(name = "oportunidades", columnDefinition = "TEXT")
    private String oportunidades;

    public enum SiNo { Si, No }
}
