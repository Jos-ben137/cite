# CITE 2026 - Sitio del Coloquio

Landing page estatica para el evento CITE 2026 (Coloquio de Ingenieria y Tecnologias Emergentes). El sitio prioriza rendimiento y simplicidad: HTML semantico, CSS modular y JavaScript ligero sin framework.

## Objetivos
- Presentar fecha, sede y tematicas del evento.
- Mostrar agenda y ponentes.
- Dirigir al registro externo.
- Ofrecer una experiencia responsiva con modo claro/oscuro.

## Arquitectura
Se sigue una arquitectura por capas con separacion de responsabilidades:

- **Presentacion (HTML)**: `index.html` contiene la estructura semantica y los bloques de contenido. Se usan clases con convencion BEM-like (`bloque__elemento--modificador`) para mantener consistencia.
- **Estilos (CSS)**: hojas separadas por proposito para facilitar mantenimiento y escalabilidad.
- **Comportamiento (JS)**: scripts pequeños y aislados por feature (tema, navegacion, efectos).

### Capas de estilos
- `css/normalize.css`: reseteo base.
- `css/variables.css`: tokens y variables de diseno.
- `css/layout.css`: sistema de contenedores, grids y utilidades.
- `css/components.css`: botones, cards y componentes reutilizables.
- `css/sections.css`: estilos especificos de secciones.
- `css/responsive.css`: reglas responsivas y ajustes por breakpoint.
- `css/parallax.css`: efectos visuales y animaciones.

### Capa de scripts
- `js/main.js`: tema, navegacion movil, seccion activa, hover en tarjetas.
- `js/parallax.js`: utilidades, efectos, precarga y validaciones (cuando aplica).

## Estructura de carpetas
```
.
+- index.html
+- css/
¦  +- normalize.css
¦  +- variables.css
¦  +- layout.css
¦  +- components.css
¦  +- sections.css
¦  +- responsive.css
¦  +- parallax.css
+- js/
¦  +- main.js
¦  +- parallax.js
+- images/
   +- logos/
   +- speakers/
   +- parallax/
```

## Dependencias externas
- Tipografias y iconografia se cargan via CDN desde el HTML.
- Animaciones on-scroll usando AOS (via CDN).

## Como usar
Abrir `index.html` en un navegador o servir el directorio con cualquier servidor estatico.

## Convenciones
- Evitar estilos inline cuando sea posible.
- Mantener componentes reutilizables en `components.css`.
- Ajustes por breakpoint en `responsive.css`.
- JS sin dependencias; funciones pequenas y con early returns.