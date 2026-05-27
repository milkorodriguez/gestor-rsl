# gestor-rsl

API REST para gestionar la extracción de 176 artículos científicos de una Revisión Sistemática de Literatura sobre incendios forestales, PM2.5 e IRA en Áncash, Perú.

Proyecto del curso Lenguajes de Programación (1INF13) — Maestría en Informática, PUCP.

## Stack

Java 21 - Spring Boot 3.5 - Spring Data JPA - MySQL - Lombok - Maven

## Configuración

```bash
mysql -u root slr_rsl < slr_rsl.sql
mvn spring-boot:run
```

API disponible en `http://localhost:8080`

## Endpoints principales

```
GET  /api/articulos               listar (filtros: cadena, estado, pais, contaminante, q)
POST /api/articulos               crear artículo
POST /api/articulos/importar-doi  importar metadatos desde DOI (Crossref API)
GET  /api/articulos/duplicados    artículos con DOI duplicado
GET  /api/dashboard               progreso por cadena de búsqueda
GET  /api/reportes/frecuencias?campo=contaminantes
GET  /api/reportes/lags
GET  /api/reportes/matriz
```
