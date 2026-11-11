Docs.registrar("inicio", {
  titulo: "Inicio",
  portada: true,
  render: () => {
    const C = window.CONFIG;
    const unidades = TEMARIO.filter((u) => !u.referencia).map((u, i) => {
      const temas = u.temas.filter((t) => !t.ejercicio);
      const avance = temas.map((t) => `<span class="${Docs.existe(t.id) ? "lista" : ""}"></span>`).join("");
      const chips = u.temas.map((t) =>
        Docs.existe(t.id)
          ? `<li><a href="#${t.id}">${D.esc(t.titulo)}</a></li>`
          : `<li><span>${D.esc(t.titulo)}</span></li>`).join("");
      return `
  <section class="unidad-portada" aria-labelledby="u${i}">
    <span class="unidad-num" aria-hidden="true">${i + 1}</span>
    <div>
      <h3 id="u${i}">${D.esc(u.unidad)}</h3>
      <p>${D.esc(u.descripcion || "")}</p>
      <div class="unidad-avance" aria-label="${temas.filter((t) => Docs.existe(t.id)).length} de ${temas.length} temas disponibles">${avance}</div>
      <ul class="unidad-temas">${chips}</ul>
    </div>
  </section>`;
    }).join("");

    return `
<section class="portada">
  <h1>${D.esc(C.curso || "Back End con Spring Boot")}</h1>
  <p class="portada-sub">Guía de clase y documentación de referencia. Explica qué hace cada pieza de un proyecto Spring Boot y te deja copiar ejemplos completos que funcionan.</p>
  <div class="unidades-portada">${unidades}</div>
  <p class="portada-datos">Los temas resaltados ya están disponibles; los demás se publicarán a medida que avancemos.</p>
</section>

<h2>Empieza por aquí</h2>
${D.enlaces([
  { id: "backend", titulo: "1. ¿Qué es el backend?", desc: "Cliente, servidor y por qué existe una API." },
  { id: "http-rest", titulo: "2. HTTP y APIs REST", desc: "Peticiones, métodos, rutas y códigos de estado." },
  { id: "spring-boot", titulo: "3. Spring Boot", desc: "Instalar, crear el proyecto y el primer Hola mundo." },
  { id: "mvc", titulo: "4. Patrón MVC y capas", desc: "Controller, Service, Repository y Model." },
  { id: "mago", titulo: "Ejercicio: API de Magos", desc: "Un CRUD completo explicado archivo por archivo." },
  { id: "anotaciones", titulo: "Referencia de anotaciones", desc: "Qué hace cada @ que hemos usado." }
])}

<h2>Cómo usar esta documentación</h2>
<p>Cada tema tiene una explicación y ejemplos de código. En los ejercicios, cada función está documentada por separado: qué hace, qué recibe, qué devuelve y el código listo para copiar.</p>
${D.pasos([
  "<strong>Lee la explicación</strong> antes de copiar. El código tiene sentido cuando sabes en qué capa vive.",
  "<strong>Usa las pestañas</strong> para cambiar entre el código Java, la petición HTTP y la respuesta esperada.",
  "<strong>Copia con el botón Copiar</strong> de cada bloque y pégalo en el archivo indicado en la cabecera del bloque.",
  "<strong>Prueba</strong> cada endpoint con Postman o con el simulador del ejercicio antes de seguir."
])}
${D.nota("info", "Modo evaluación", `<p>En las evaluaciones puede activarse un modo en el que los bloques muestran solo la estructura del código (clases, firmas de métodos y comentarios <code>TODO</code>). Lo reconocerás por la franja amarilla en la parte superior.</p>`)}
`;
  }
});
