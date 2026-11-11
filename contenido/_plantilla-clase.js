/* =========================================================================
   PLANTILLA PARA UN TEMA NUEVO
   1. Copia este archivo como contenido/base-datos-crud.js (por ejemplo).
   2. Usa en Docs.registrar el mismo id que tiene el tema en js/temario.js.
   3. Agrega en index.html:  <script src="contenido/base-datos-crud.js"></script>
      (en el bloque "2. Páginas", antes de js/app.js).
   Al publicar, el tema deja de aparecer como "Próximamente".
   ========================================================================= */
Docs.registrar("base-datos-crud", {
  titulo: "Conexión a base de datos y operaciones CRUD",
  resumen: "Una o dos frases sobre lo que aprenderá el estudiante.",
  // capa: "service",   // opcional: muestra la franja de capas resaltando una
  render: () => `
<h2>Primer tema</h2>
<p>Explicación en texto.</p>

${D.codigo({
  archivo: "src/main/java/com/jr/app3/Ejemplo.java",
  completo: `
public class Ejemplo {
    public int sumar(int a, int b) {
        return a + b;
    }
}`,
  prueba: `
public class Ejemplo {
    public int sumar(int a, int b) {
        // TODO: devuelve la suma
    }
}`
})}

${D.nota("consejo", "Título de la nota", `<p>Tipos de nota: info, consejo, cuidado.</p>`)}

${D.pestanas([
  { titulo: "Código", html: D.codigo({ completo: `System.out.println("hola");` }) },
  { titulo: "Petición", html: D.codigo({ lenguaje: "bash", completo: `curl http://localhost:9090/api/algo` }) }
])}

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "Pregunta", r: "<p>Respuesta (se oculta en modo prueba).</p>" }
])}
`
});
