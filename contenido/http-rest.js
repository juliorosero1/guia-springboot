Docs.registrar("http-rest", {
  titulo: "Protocolo HTTP y APIs REST",
  resumen: "Cómo es por dentro una petición y una respuesta HTTP, qué significa cada método, cómo se leen los códigos de estado y cómo se diseñan las rutas de una API REST.",
  render: () => `
<h2>Petición y respuesta HTTP</h2>
<p>HTTP es el idioma que usan cliente y servidor. Todo intercambio es un par: una <strong>petición</strong> y su <strong>respuesta</strong>. Ambas son texto con una estructura fija.</p>
${D.pestanas([
  { titulo: "Petición", html: `
<p>La primera línea dice <strong>qué</strong> (método) y <strong>sobre qué</strong> (ruta). Luego vienen las cabeceras y, separado por una línea en blanco, el cuerpo.</p>
${D.codigo({ lenguaje: "http", titulo: "Petición HTTP", completo: `
POST /api/mago HTTP/1.1
Host: localhost:9090
Content-Type: application/json
Accept: application/json

{
  "nombre": "Merlín",
  "fuerza": 350.0
}` })}` },
  { titulo: "Respuesta", html: `
<p>La primera línea trae el <strong>código de estado</strong>. Después, cabeceras y el cuerpo con el resultado.</p>
${D.codigo({ lenguaje: "http", titulo: "Respuesta HTTP", completo: `
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "nombre": "Merlín",
  "fuerza": 350.0
}` })}` }
])}
${D.tabla(["Parte", "Para qué sirve"], [
  ["Método", "La acción que se quiere hacer: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>."],
  ["Ruta (URL)", "El recurso sobre el que se actúa: <code>/api/mago/1</code>."],
  ["Cabeceras", "Información extra: tipo de contenido, autorización, idioma."],
  ["Cuerpo", "Los datos que se envían o se reciben, normalmente en JSON."],
  ["Código de estado", "Solo en la respuesta: indica si salió bien o qué falló."]
])}

<h2>Métodos GET, POST, PUT y DELETE</h2>
<p>Cada método expresa una intención. En una API REST se combinan con la ruta para formar las operaciones CRUD (crear, leer, actualizar, eliminar).</p>
${D.tabla(["Método", "Intención", "CRUD", "¿Lleva cuerpo?", "Ejemplo"], [
  [D.metodo("GET"), "Leer información", "Read", "No", "<code>GET /api/mago</code>"],
  [D.metodo("POST"), "Crear un recurso nuevo", "Create", "Sí", "<code>POST /api/mago</code>"],
  [D.metodo("PUT"), "Reemplazar o actualizar un recurso", "Update", "Sí", "<code>PUT /api/mago/3</code>"],
  [D.metodo("DELETE"), "Eliminar un recurso", "Delete", "No", "<code>DELETE /api/mago/3</code>"]
])}
${D.nota("info", "GET no debe cambiar datos", `<p>Un <code>GET</code> solo consulta. Si una ruta con <code>GET</code> borrara o modificara información, un buscador o el historial del navegador podrían dispararla sin querer.</p>`)}

<h2>Códigos de estado</h2>
<p>El primer dígito indica la familia: <strong>2xx</strong> salió bien, <strong>4xx</strong> el cliente se equivocó, <strong>5xx</strong> falló el servidor.</p>
${D.tabla(["Código", "Nombre", "Cuándo se usa"], [
  ["<code>200</code>", "OK", "La consulta o la edición salió bien y hay datos en la respuesta."],
  ["<code>201</code>", "Created", "Se creó un recurso nuevo (después de un <code>POST</code>)."],
  ["<code>204</code>", "No Content", "Salió bien y no hay nada que devolver (después de un <code>DELETE</code>)."],
  ["<code>400</code>", "Bad Request", "La petición está mal formada: JSON roto o un id que no es número."],
  ["<code>404</code>", "Not Found", "La ruta no existe o el recurso pedido no está."],
  ["<code>405</code>", "Method Not Allowed", "La ruta existe, pero no acepta ese método."],
  ["<code>500</code>", "Internal Server Error", "Ocurrió un error no controlado dentro del servidor."]
])}

<h2>Rutas en una API REST</h2>
<p>REST organiza la API alrededor de <strong>recursos</strong> (sustantivos), no de acciones. La acción la pone el método.</p>
${D.tabla(["Bien", "Evitar", "Por qué"], [
  ["<code>GET /api/mago</code>", "<code>GET /api/obtenerMagos</code>", "El método ya dice que es una consulta."],
  ["<code>DELETE /api/mago/3</code>", "<code>POST /api/borrarMago?id=3</code>", "Cada operación usa su método propio."],
  ["<code>GET /api/mago/3</code>", "<code>GET /api/mago?id=3</code>", "Un recurso concreto se identifica en la ruta."]
])}
<p>Hay tres lugares donde viaja información en una petición:</p>
${D.tabla(["Lugar", "Ejemplo", "Uso típico", "En Spring"], [
  ["Variable de ruta", "<code>/api/mago/<strong>3</strong></code>", "Identificar un recurso", "<code>@PathVariable</code>"],
  ["Parámetro de consulta", "<code>/api/mago?<strong>orden=fuerza</strong></code>", "Filtros, orden, paginación", "<code>@RequestParam</code>"],
  ["Cuerpo", "<code>{ \"nombre\": \"Merlín\" }</code>", "Datos para crear o editar", "<code>@RequestBody</code>"]
])}

<h2>Probar APIs públicas con Postman</h2>
<p>Postman permite armar peticiones sin escribir un frontend. Practica con una API pública de prueba como JSONPlaceholder.</p>
${D.pasos([
  "Abre Postman y crea una petición nueva con <strong>New</strong> y luego <strong>HTTP</strong>.",
  "Elige el método <code>GET</code> y escribe <code>https://jsonplaceholder.typicode.com/posts/1</code>. Pulsa <strong>Send</strong>.",
  "Revisa el código de estado (arriba a la derecha) y el cuerpo JSON de la respuesta.",
  "Cambia a <code>POST</code> con la ruta <code>https://jsonplaceholder.typicode.com/posts</code>. En <strong>Body</strong> elige <strong>raw</strong> y <strong>JSON</strong>, escribe un objeto y envíalo. Deberías recibir <code>201</code>."
])}
${D.pestanas([
  { titulo: "GET", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `curl https://jsonplaceholder.typicode.com/posts/1` }) },
  { titulo: "POST", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `
curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Hola", "body": "Mi primer POST", "userId": 1}'` }) },
  { titulo: "PUT", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `
curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \\
  -H "Content-Type: application/json" \\
  -d '{"id": 1, "title": "Editado", "body": "Nuevo texto", "userId": 1}'` }) },
  { titulo: "DELETE", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `curl -X DELETE https://jsonplaceholder.typicode.com/posts/1` }) }
])}
${D.nota("consejo", "curl en Windows", `<p>En PowerShell, <code>curl</code> puede ser un alias de otro comando. Usa <code>curl.exe</code> o, más sencillo, Postman. En CMD reemplaza las barras invertidas del final de línea por <code>^</code>.</p>`)}

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "¿Qué método y ruta usarías para actualizar el producto con id 8?", r: "<p><code>PUT /api/producto/8</code>, con los datos nuevos en el cuerpo.</p>" },
  { p: "Recibes un 404 al pedir <code>GET /api/mago/50</code>. ¿Qué significa?", r: "<p>Que no existe un mago con id 50 (o que la ruta no existe). El error está del lado del cliente: pidió algo que no hay.</p>" },
  { p: "¿Por qué <code>/api/borrarUsuario</code> no es una buena ruta REST?", r: "<p>Porque mete la acción en la ruta. En REST la ruta nombra el recurso (<code>/api/usuario/5</code>) y la acción la indica el método (<code>DELETE</code>).</p>" }
])}
`
});
