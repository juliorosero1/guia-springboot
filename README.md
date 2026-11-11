# Back End con Spring Boot (JR)

Sitio de documentación y guía de clase de **Back End con Spring Boot**, organizado por temas.
No depende de ninguna institución ni calendario: sirve para cualquier curso que vea estos temas.
Es un sitio estático: funciona en GitHub Pages sin compilar nada, y también se puede abrir
`index.html` directamente en el navegador.

## Publicar en GitHub Pages

1. Crea un repositorio y sube todo el contenido de esta carpeta (incluido `.nojekyll`).
2. En el repositorio: **Settings → Pages → Build and deployment**.
3. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
4. En uno o dos minutos el sitio queda en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

## Activar o desactivar el modo prueba

Edita `js/config.js` y cambia:

```js
modoPrueba: false,   // documentación completa
modoPrueba: true,    // modo evaluación
```

Haz commit y push. GitHub Pages tarda alrededor de un minuto en actualizar
(los estudiantes pueden necesitar recargar con Ctrl+F5).

En modo prueba:
- Los bloques de código que tienen versión de estructura muestran solo clases, anotaciones,
  firmas de métodos y comentarios `TODO`. Se marcan con la etiqueta **Estructura**.
- Se ocultan las respuestas de las autoevaluaciones y las soluciones de las actividades.
- Aparece una franja amarilla con el aviso (texto editable en `mensajePrueba`).
- Las peticiones de ejemplo (curl, JSON) y el simulador siguen visibles.
- Las anotaciones se mantienen visibles; lo que se retira es la lógica de cada método.

> **Importante:** solo quien tiene permiso de escritura en el repositorio puede cambiar el
> modo. Pero si el repositorio es público, el código completo sigue existiendo dentro de los
> archivos `contenido/*.js`, y alguien que sepa buscar en GitHub o en las herramientas del
> navegador puede encontrarlo. Para evaluaciones de alto peso conviene combinarlo con
> supervisión en el laboratorio.

## Agregar un tema nuevo

1. Copia `contenido/_plantilla-clase.js` con un nombre nuevo, por ejemplo `contenido/base-datos-crud.js`.
2. Usa el mismo `id` que tiene el tema en `js/temario.js` (por ejemplo `"base-datos-crud"`).
3. Agrega la línea `<script src="contenido/base-datos-crud.js"></script>` en `index.html`,
   dentro del bloque "2. Páginas".

El tema pasa automáticamente de *Próximamente* a disponible en el temario y en la portada.

Para cambiar la marca ("JR") o el título, edita `marca` y `curso` en `js/config.js`.

## Estructura

```
index.html                 Página única; carga todo
css/estilos.css            Estilos (tema claro y oscuro)
js/config.js               Modo prueba, marca y título
js/temario.js              Unidades y temas del curso
js/componentes.js          Funciones para escribir páginas (D.codigo, D.pestanas, D.nota...)
js/simulador.js            Simulador de la API de Magos
js/app.js                  Navegación, índice, copiar código, pestañas
contenido/*.js             Una página (o grupo de páginas) por archivo
```

## Componentes disponibles para escribir páginas

| Función | Para qué |
|---|---|
| `D.codigo({ archivo, lenguaje, completo, prueba })` | Bloque con botón Copiar. `prueba` es opcional. Lenguajes: `java`, `xml`, `json`, `bash`, `ini`, `http`, `sql`. |
| `D.pestanas([{ titulo, html }])` | Pestañas (código, petición, respuesta…). |
| `D.operacion({ id, titulo, metodo, ruta, firma, descripcion, parametros, retorna, codigo })` | Referencia de una función o endpoint. |
| `D.nota(tipo, titulo, html)` | Aviso: `info`, `consejo` o `cuidado`. |
| `D.tabla(cabeceras, filas)` | Tabla. |
| `D.pasos([...])` | Lista numerada de pasos. |
| `D.autoevaluacion([{ p, r }])` | Preguntas con respuesta desplegable (oculta en modo prueba). |
| `D.soloCompleto(html)` | Contenido que desaparece en modo prueba. |
| `D.capas("controller")` | Franja que muestra en qué capa está el archivo. |
| `D.metodo("GET")` | Insignia de método HTTP. |
