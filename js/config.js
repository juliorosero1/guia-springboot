/* =========================================================================
   CONFIGURACIÓN DEL SITIO
   Solo quien tiene permiso de escritura en el repositorio puede cambiar esto.
   ========================================================================= */
window.CONFIG = {
  // true  -> MODO PRUEBA: los fragmentos de código muestran solo la estructura
  //          (firmas, clases y comentarios TODO) y se ocultan las respuestas
  //          de las autoevaluaciones.
  // false -> modo normal: documentación completa.
  modoPrueba: false,

  // Texto del aviso que ven los estudiantes cuando el modo prueba está activo.
  mensajePrueba:
    "Modo evaluación activo: el código muestra solo la estructura principal. Complétalo con lo visto en clase.",

  // Marca y título que aparecen en la barra superior y en la portada.
  marca: "JR",
  curso: "Back End con Spring Boot",

  // Puerto y URL base del ejercicio (application.properties -> server.port)
  urlBase: "http://localhost:9090"
};
