# AGENTS.md

Guía operativa para cualquier agente (IA o humano) que desarrolle este proyecto.

---

## 1. Resumen del proyecto

Sitio web personal de una sola página que funciona como carta de presentación
y CV extendido. El autor es estudiante de Matemáticas Puras, sin título aún ni
experiencia de industria, con interés mixto (≈2/3 académico, ≈1/3 industria).

**Objetivo del sitio**: que un reclutador entienda en menos de 10 segundos
quién es el autor, qué sabe hacer y cómo contactarlo.

**Alcance cerrado**: página estática, sin backend, sin base de datos, sin
analytics, sin formulario de contacto funcional. Contacto vía `mailto:`,
LinkedIn y GitHub (estos dos últimos reservados, se muestran solo si están
rellenados).

**Idiomas**: español (por defecto) e inglés, con conmutador persistente.

**Hosting**: GitHub Pages, servido como sitio estático desde la raíz del
repositorio en la rama `main`.

---

## 2. Estructura de archivos objetivo
```
├── index.html # esqueleto semántico, sin contenido real
├── content.example.js # plantilla del contenido, con placeholders
├── content.js # FUENTE ÚNICA DE VERDAD (copia de example, rellenada)
├── css/
│ ├── tokens.css # variables de diseño (colores, espaciado, tipografía)
│ ├── base.css # reset, tipografía global, layout de página
│ └── components.css # tarjetas, botones, chips, enlaces, conmutador
├── js/
│ └── app.js # renderiza content.js, gestiona idioma
├── AGENTS.md # este archivo
└── README.md # (opcional) instrucciones de despliegue
```


Reglas:
- No crear más archivos que los listados sin justificarlo.
- No añadir carpeta `assets/` hasta que existan imágenes reales que lo ameriten.
- No usar frameworks, bundlers, preprocesadores ni dependencias de npm.
  Solo HTML, CSS y JavaScript moderno nativo (ES modules).

---

## 3. Orden y contenido de las secciones

La página es un único scroll. Sin barra de navegación, sin subpáginas, sin
anclas internas.

1. **Hero**
   - Nombre
   - Línea de posicionamiento (una frase, específica, no genérica)
   - Línea de estado ("Buscando prácticas" / "Abierto a roles de industria" /
     "En preparación de tesis")
   - Enlaces de contacto visibles: email siempre; LinkedIn y GitHub solo si
     tienen valor.
   - Conmutador de idioma en la esquina superior derecha.

2. **Sobre mí**
   - 2–3 frases. Área de interés concreta, tipo de problemas que disfruta
     resolviendo, motivación hacia industria.
   - Prohibido lenguaje de relleno ("apasionado por", "siempre me ha gustado").

3. **Educación**
   - Institución, carrera, período, estado ("en curso, se espera 20XX").

4. **Habilidades**
   - Lista corta y honesta. Priorizar herramientas reales (LaTeX, Python con
     numpy/sympy, R, herramientas de visualización). No listar tecnologías que
     el autor no domine.

5. **Proyectos**
   - Incluye proyectos en progreso. Cada tarjeta: nombre, una línea de
     problema, método/enfoque, estado (chip "en progreso" o "completado"),
     enlace opcional.
   - Aceptado como proyecto: tesis en curso, trabajo de curso, notebooks,
     notas de lectura técnicas.

6. **Contacto**
   - Email como `mailto:` principal. LinkedIn y GitHub como enlaces
     secundarios si existen.

---

## 4. Estilo visual

Paleta (definir exclusivamente en `css/tokens.css` como custom properties):

| Token                     | Valor                     | Uso                                  |
|---------------------------|---------------------------|--------------------------------------|
| `--bg`                    | `#0A0E14`                 | Fondo de página                      |
| `--surface`               | `#111820`                 | Fondo de tarjetas                   |
| `--border`                | `rgba(255,255,255,0.08)`  | Bordes de separación                 |
| `--accent`                | `#22D3EE`                 | Acento cian (máx. 3 usos por vista)  |
| `--text`                  | `#F0F4F8`                 | Títulos                              |
| `--text-body`             | `#B0B8C4`                 | Texto corrido                        |
| `--text-muted`            | `#6B7280`                 | Metadatos, fechas, texto auxiliar    |

Tipografía:
- Títulos y texto: `Inter` (o `system-ui` como fallback).
- Solo si se muestran fragmentos de código o fórmulas: `JetBrains Mono`.
- Cargar Inter vía `fonts.googleapis.com` con `display=swap`. No descargar
  ni auto-hospedar fuentes por ahora.

Reglas de diseño:
- Modo oscuro permanente. No hay modo claro.
- Minimalismo. Espaciado generoso, jerarquía por tamaño y color, no por
  ruido visual.
- La profundidad se logra con bordes de 1px y cambios sutiles de superficie.
  Prohibido usar `box-shadow` para crear elevación.
- El color de acento se usa como máximo en tres puntos de la página (por
  ejemplo: punto de estado en Hero, hover de enlaces, borde de un botón).
- Sin animaciones de scroll, sin parallax, sin librerías de animación. Solo
  transiciones CSS puntuales (`transition: color 150ms ease`).

Responsive:
- Mobile-first. Un solo breakpoint principal a `768px`.
- Ancho máximo de contenido: `720px` centrado.
- En móvil, secciones apiladas verticalmente; en desktop, misma estructura
  (no hay layout de dos columnas, se pierde claridad para tan poco contenido).

Accesibilidad mínima:
- Contraste de texto cuerpo ≥ 4.5:1 sobre `--bg` (verificar `--text-body`).
- Todo elemento interactivo es focusable y tiene `:focus-visible`.
- `<html lang="es">` que cambia a `en` al conmutar idioma.
- Imágenes (si algún día las hay) con `alt` obligatorio.

---

## 5. Modelo de contenido

Toda la información editable por el autor vive en `content.js`. El HTML y el
CSS no contienen texto personal. Esta separación es obligatoria.

`content.example.js` es la plantilla de referencia con placeholders visibles
en mayúsculas (`"NOMBRE COMPLETO"`, `"tu@correo.com"`, `"TÍTULO DEL PROYECTO"`)
y campos opcionales vacíos. El autor la copia a `content.js` y sustituye los
placeholders a mano. Ambas versiones se versionan en el repositorio.

**Regla de oro para el agente**: al generar `content.js` por primera vez, no
inventar contenido personal real ni rellenar datos ficticios plausibles. Usar
exactamente los placeholders de `content.example.js`.

Estructura de `content.js`:

```js
export const content = {
  es: {
    hero: {
      name: "NOMBRE COMPLETO",
      tagline: "Estudiante de Matemáticas Puras · interés en [área]",
      status: "Abierto a [tipo de oportunidad]",
      email: "tu@correo.com",
      linkedin: "",
      github: ""
    },
    about: "TEXTO AQUÍ",
    education: [
      {
        institution: "UNIVERSIDAD",
        degree: "Licenciatura en Matemáticas",
        period: "20XX — 20XX (en curso)",
        note: ""
      }
    ],
    skills: [
      { group: "Herramientas", items: ["LaTeX", "Python", "R"] },
      { group: "Matemáticas", items: ["Análisis", "Álgebra", "Probabilidad"] }
    ],
    projects: [
      {
        title: "TÍTULO DEL PROYECTO",
        problem: "Una línea describiendo el problema.",
        approach: "Método o enfoque.",
        status: "en-progreso",
        link: ""
      }
    ],
    contact: {
      email: "tu@correo.com",
      linkedin: "",
      github: ""
    }
  },
  en: {
    // misma estructura, contenido en inglés
  }
};
```

### 5.1 Contenido mínimo requerido para renderizar

| Sección     | Contenido mínimo                                  | Comportamiento si falta/vacío              |
|-------------|---------------------------------------------------|--------------------------------------------|
| Hero        | `name`, `tagline`, `email`                        | Banner visible + resto del sitio normal    |
| Sobre mí    | `about` no vacío                                  | Sección oculta                             |
| Educación   | ≥ 1 entrada con `institution` y `degree`          | Sección oculta                             |
| Habilidades | ≥ 1 grupo con ≥ 1 ítem                            | Sección oculta                             |
| Proyectos   | ≥ 1 entrada con `title` y `problem`               | Sección oculta                             |
| Contacto    | `email`                                           | Sección oculta (ya cubierto por Hero)      |

Reglas asociadas:

- Todo campo opcional vacío (`linkedin`, `github`, `note`, `link`, etc.) se
  oculta al renderizar. Nunca se muestra como `""` ni `undefined`.
- Si falta alguno de los 3 campos requeridos del Hero en el idioma activo,
  `app.js` muestra un banner visible con el texto
  `"Falta contenido en content.js"` y renderiza el resto con normalidad.
- Al conmutar de idioma se vuelve a evaluar la tabla en el idioma destino.

### 5.2 Conmutador de idioma

El conmutador en el Hero alterna entre `es` y `en`, y guarda la preferencia
en `localStorage` bajo la clave `lang`.

---

## 6. Reglas de código

- **Modularidad**: una responsabilidad por archivo. `app.js` no mezcla
  renderizado con lógica de idioma; separar en funciones pequeñas
  (`renderSection`, `applyLanguage`, `renderProjects`, etc.).
- **Código autoexplicativo**: nombres descriptivos en inglés
  (`renderProjects`, `content`, `applyLanguage`), estructura predecible.
- **Comentarios prohibidos**:
  - No escribir comentarios que repitan lo que el código dice
    (`// esto renderiza los proyectos`).
  - No escribir bloques de "explicación general" al inicio de cada función.
  - Solo se permite un comentario cuando explica un *por qué* no obvio
    (por ejemplo, un workaround de navegador o una decisión de
    accesibilidad).
  - Los placeholders en `content.js` no necesitan comentarios; su forma en
    mayúsculas es suficiente señal.
- **HTML semántico**: usar `<section>`, `<article>`, `<header>`, `<main>`,
  `<footer>`. Cada sección con `id` en kebab-case (`#about`, `#education`).
- **CSS**:
  - Usar variables de `tokens.css` para todo color, espaciado y tipografía.
  - No usar `!important`.
  - Un selector por regla cuando sea posible; evitar anidamiento profundo.
  - Nombres de clase en kebab-case: `.project-card`, `.hero-status`.
- **JS**:
  - ES modules (`<script type="module">`).
  - Sin dependencias externas.
  - Sin `innerHTML` con contenido de `content.js` cuando exista alternativa
    con `textContent` o creación de nodos; para bloques estructurados, usar
    `createElement` o `<template>` en el HTML.
- **Sin "slop"**:
  - Sin `console.log` de depuración en el código final.
  - Sin `TODO`, `FIXME` ni notas de "implementar luego" en el commit final.
  - Sin secciones comentadas.

---

## 7. Dependencias

Cero dependencias de JavaScript. Solo se permite una dependencia externa:

- **Fuente Inter** vía Google Fonts (`<link>` en `index.html` con
  `preconnect` y `display=swap`).

Cualquier otra dependencia (una librería de iconos, un validador, un
polyfill) requiere justificación explícita y aprobación del autor antes de
añadirse.

---

## 8. Desarrollo local

Servir el sitio con un servidor estático local para que los ES modules
funcionen:

- Con Python: `python3 -m http.server 8000` desde la raíz del proyecto.
- Abrir `http://localhost:8000`.

No abrir `index.html` directamente con `file://`.

---

## 9. Despliegue

GitHub Pages desde la rama `main`, carpeta raíz (`/`). El repositorio puede
llamarse `usuario.github.io` (sitio de usuario, URL
`https://usuario.github.io/`) o cualquier otro nombre (sitio de proyecto,
URL `https://usuario.github.io/nombre-repo/`). Sin dominio propio, sin
build step.

Cada `git push` a `main` redespliega automáticamente.

---

## 10. Reglas de crecimiento futuro

Principios generales:

- Preferir extensión sobre modificación.
- Una responsabilidad por archivo.
- Extraer a componente reutilizable solo al detectar el segundo uso real.
- Si un cambio no encaja en ninguno de los checklists siguientes, se discute
  antes de ejecutarse.

### 10.1 Añadir una sección

1. Añadir el bloque correspondiente en `content.example.js` y `content.js`,
   en ambos idiomas (`es` y `en`).
2. Añadir `<section id="...">` en `index.html` con la estructura base.
3. Añadir la función de renderizado en `app.js` (o reutilizar una existente).
4. Añadir estilos en `css/components.css` si introduce un componente nuevo.
5. Actualizar la tabla de contenido mínimo (5.1) en este AGENTS.md.
6. Añadir criterio de aceptación en la sección 12.

### 10.2 Añadir un campo a una sección existente

1. Añadir el campo en `content.example.js` y `content.js`, en ambos idiomas.
2. Añadir lógica de renderizado en `app.js`; si está vacío, ocultarlo.
3. Actualizar la tabla 5.1 si el campo es requerido.
4. Actualizar criterios de aceptación si el campo tiene comportamiento
   verificable.

### 10.3 Añadir un idioma

1. Duplicar la estructura de `es` en `content.js` con la nueva clave de
   idioma y contenido traducido.
2. Ampliar el conmutador del Hero para incluir el nuevo idioma.
3. Actualizar la validación de idioma y el valor por defecto si aplica.
4. Actualizar criterios de aceptación.

### 10.4 Extraer un componente reutilizable

1. Confirmar que existe un segundo uso real del bloque.
2. Crear `<template>` en `index.html` o función render compartida en
   `app.js`.
3. Migrar los dos usos existentes al componente.
4. Actualizar criterios de aceptación si el componente tiene comportamiento
   verificable.

---

## 11. Bucle de trabajo y commits

### 11.1 Bucle agentico

Cada tarea sigue este ciclo:

1. **Proponer**: qué cambia, en qué archivos, por qué.
2. **Confirmar**: el autor responde afirmativamente o ajusta el alcance.
3. **Ejecutar**: solo el alcance confirmado, sin extras.
4. **Reportar**: archivos tocados, qué probar, siguiente tarea propuesta.
5. **Confirmar** antes de pasar a la siguiente tarea.

Regla: nunca ejecutar sin confirmación explícita del autor.

### 11.2 Commits

Convención: commits convencionales (`feat:`, `fix:`, `docs:`, `refactor:`,
`style:`, `chore:`). Un cambio = un commit = una tarea confirmada.

---

## 12. Criterios de aceptación

El proyecto se considera terminado cuando cumple todo lo siguiente:

- [ ] `index.html` carga sin errores en consola.
- [ ] Se ven las 6 secciones en el orden especificado.
- [ ] `content.example.js` contiene placeholders en mayúsculas y campos
      opcionales vacíos, sin datos personales inventados.
- [ ] `content.js` es una copia de `content.example.js` con placeholders
      (el autor lo rellena a mano).
- [ ] El banner `"Falta contenido en content.js"` aparece si falta alguno de
      los 3 campos requeridos del Hero, y el resto del sitio se renderiza.
- [ ] Las secciones con contenido vacío se ocultan según la tabla 5.1.
- [ ] Los campos opcionales vacíos (`linkedin`, `github`, `link`, `note`) no
      se renderizan.
- [ ] El conmutador de idioma alterna correctamente `es`/`en` y persiste la
      preferencia tras recargar.
- [ ] El sitio es usable a 360px de ancho y a 1440px de ancho.
- [ ] El contraste de `--text-body` sobre `--bg` es al menos 4.5:1.
- [ ] Todo elemento interactivo tiene `:focus-visible` visible.
- [ ] No hay dependencias de JS externas, ni `console.log` en el código
      final, ni comentarios que repitan lo que el código ya dice.
- [ ] Desplegado en GitHub Pages sin errores 404 en recursos.