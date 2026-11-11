Docs.registrar("backend", {
  titulo: "Introducción al desarrollo backend",
  resumen: "Qué hace el backend, cómo se comunica con el cliente y en qué se diferencia una página estática de una aplicación dinámica.",
  render: () => `
<h2>¿Qué es el backend y qué hace?</h2>
<p>Una aplicación web tiene dos partes. El <strong>frontend</strong> es lo que ves y tocas: botones, formularios, listas. El <strong>backend</strong> es lo que no ves: el programa que corre en un servidor, recibe pedidos, aplica las reglas del negocio, guarda y consulta datos, y responde.</p>
<p>Piensa en un restaurante. El comensal (frontend) mira el menú y pide. El mesero lleva el pedido a la cocina con un formato que la cocina entiende (eso es la <strong>API</strong>). La cocina (backend) prepara el plato usando lo que hay en la despensa (la <strong>base de datos</strong>). El comensal nunca entra a la cocina: solo recibe el resultado.</p>
${D.tabla(["El backend se encarga de", "Ejemplo"], [
  ["Recibir peticiones", "Un usuario envía el formulario de registro."],
  ["Validar datos", "Revisar que el correo tenga formato válido y que no exista ya."],
  ["Aplicar reglas del negocio", "Un estudiante no puede inscribirse en más de 7 materias."],
  ["Guardar y consultar datos", "Insertar el usuario en la tabla <code>usuarios</code>."],
  ["Proteger la información", "Solo un administrador puede borrar registros."],
  ["Responder", "Devolver los datos en formato JSON con un código de estado."]
])}

<h2>Arquitectura cliente-servidor</h2>
<p>En este modelo hay dos papeles. El <strong>cliente</strong> inicia la comunicación y pide algo. El <strong>servidor</strong> espera peticiones, las procesa y responde. Un mismo servidor atiende a muchos clientes a la vez: un navegador, una app móvil o incluso otro servidor.</p>
<figure class="diagrama">
  <svg viewBox="0 0 720 230" role="img" aria-labelledby="dg1-t">
    <title id="dg1-t">El cliente envía una petición HTTP al servidor; el servidor consulta la base de datos y devuelve una respuesta.</title>
    <defs><marker id="pt1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-punta"/></marker></defs>
    <rect x="10" y="60" width="170" height="110" rx="12" class="dg-caja"/>
    <text x="95" y="108" text-anchor="middle" class="dg-texto">Cliente</text>
    <text x="95" y="130" text-anchor="middle" class="dg-sub">Navegador, app, Postman</text>
    <rect x="275" y="60" width="190" height="110" rx="12" class="dg-caja--marino"/>
    <text x="370" y="108" text-anchor="middle" class="dg-texto dg-texto--claro">Servidor</text>
    <text x="370" y="130" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12.5px">Spring Boot (backend)</text>
    <rect x="560" y="60" width="150" height="110" rx="12" class="dg-caja"/>
    <text x="635" y="108" text-anchor="middle" class="dg-texto">Base de datos</text>
    <text x="635" y="130" text-anchor="middle" class="dg-sub">H2, MySQL, PostgreSQL</text>
    <path d="M182 92H270" class="dg-flecha" marker-end="url(#pt1)"/>
    <text x="226" y="82" text-anchor="middle" class="dg-etq">petición</text>
    <path d="M270 140H185" class="dg-flecha" marker-end="url(#pt1)"/>
    <text x="226" y="160" text-anchor="middle" class="dg-etq">respuesta</text>
    <path d="M468 92H555" class="dg-flecha" marker-end="url(#pt1)"/>
    <text x="512" y="82" text-anchor="middle" class="dg-etq">consulta</text>
    <path d="M555 140H471" class="dg-flecha" marker-end="url(#pt1)"/>
    <text x="512" y="160" text-anchor="middle" class="dg-etq">datos</text>
  </svg>
  <figcaption>El cliente nunca habla directamente con la base de datos: siempre pasa por el servidor.</figcaption>
</figure>
${D.pasos([
  "El cliente arma una <strong>petición</strong>: qué quiere hacer (método), sobre qué recurso (ruta) y, si hace falta, con qué datos (cuerpo).",
  "La petición viaja por la red usando el protocolo <strong>HTTP</strong>.",
  "El servidor la recibe, decide qué código debe atenderla y ejecuta la lógica.",
  "Si necesita datos, el servidor consulta la base de datos.",
  "El servidor envía una <strong>respuesta</strong> con un código de estado (por ejemplo, 200) y normalmente un cuerpo en JSON."
])}
${D.nota("consejo", "¿Por qué no conectar el frontend directo a la base de datos?", `<p>Porque cualquiera podría ver la contraseña de la base de datos en el código del navegador y hacer lo que quiera con los datos. El backend es el guardián: decide quién puede hacer qué.</p>`)}

<h2>Aplicaciones web estáticas y dinámicas</h2>
<p>Una página <strong>estática</strong> es un archivo que se entrega tal cual: todos los visitantes ven lo mismo. Una aplicación <strong>dinámica</strong> genera la respuesta en el momento, según quién pide y qué hay en la base de datos.</p>
${D.tabla(["", "Estática", "Dinámica"], [
  ["Contenido", "Fijo, escrito en archivos HTML, CSS y JS", "Se arma en cada petición con datos de la base"],
  ["¿Necesita backend?", "No, basta un servidor de archivos", "Sí"],
  ["Ejemplo", "Esta misma documentación (GitHub Pages)", "El aula virtual, la banca en línea, una tienda"],
  ["Para cambiar el contenido", "Hay que editar y volver a publicar archivos", "Basta con cambiar los datos"]
])}
<p>En este curso construiremos el lado dinámico: una <strong>API REST</strong> que entrega datos en JSON para que cualquier frontend los muestre.</p>

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "¿Quién inicia la comunicación en la arquitectura cliente-servidor?", r: "<p>El cliente. El servidor solo responde a las peticiones que recibe.</p>" },
  { p: "Menciona tres tareas que le corresponden al backend.", r: "<p>Por ejemplo: validar datos, aplicar reglas del negocio, guardar y consultar la base de datos, controlar el acceso y responder en JSON.</p>" },
  { p: "Una tienda en línea que muestra el stock real de cada producto, ¿es estática o dinámica? ¿Por qué?", r: "<p>Dinámica: el stock cambia y la página se arma con los datos actuales de la base de datos en cada petición.</p>" }
])}
`
});
