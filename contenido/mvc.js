Docs.registrar("mvc", {
  titulo: "Patrón MVC y estructura del proyecto",
  resumen: "Cómo se reparte el trabajo dentro de un backend: el patrón Modelo-Vista-Controlador y la organización por capas controller, service y repository.",
  render: () => `
<h2>Modelo, vista y controlador</h2>
<p>MVC es una forma de separar responsabilidades para que cada parte del código haga una sola cosa. Así el proyecto es más fácil de entender, probar y cambiar.</p>
${D.tabla(["Parte", "Responsabilidad", "En nuestra API"], [
  ["<strong>Modelo</strong>", "Representa los datos y sus reglas.", "La clase <code>Mago</code> (id, nombre, fuerza)."],
  ["<strong>Vista</strong>", "Presenta la información al usuario.", "La respuesta JSON. Quien la muestra en pantalla es el frontend."],
  ["<strong>Controlador</strong>", "Recibe la petición, coordina y responde.", "<code>MagoController</code> con sus rutas <code>/api/mago</code>."]
])}
${D.nota("info", "¿Dónde está la vista en una API REST?", `<p>En una aplicación web clásica, la vista es una página HTML generada en el servidor. En una API REST el servidor solo devuelve datos (JSON); la vista la construye el frontend, que veremos en la Unidad 3.</p>`)}

<h2>Organización por capas</h2>
<p>En Spring Boot el MVC se complementa con una división en <strong>capas</strong>. Cada capa solo habla con la de al lado: el controlador nunca toca la base de datos directamente.</p>
<figure class="diagrama">
  <svg viewBox="0 0 720 300" role="img" aria-labelledby="dg4-t">
    <title id="dg4-t">La petición entra al Controller, pasa al Service, luego al Repository y llega a la base de datos. La respuesta regresa por el mismo camino. El modelo Mago viaja entre todas las capas.</title>
    <defs><marker id="pt4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-punta"/></marker></defs>
    <rect x="10" y="40" width="120" height="70" rx="10" class="dg-caja"/>
    <text x="70" y="72" text-anchor="middle" class="dg-texto">Cliente</text>
    <text x="70" y="92" text-anchor="middle" class="dg-sub">Postman</text>
    <rect x="160" y="40" width="130" height="70" rx="10" class="dg-caja--marino"/>
    <text x="225" y="72" text-anchor="middle" class="dg-texto dg-texto--claro">Controller</text>
    <text x="225" y="92" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">rutas HTTP</text>
    <rect x="320" y="40" width="130" height="70" rx="10" class="dg-caja--marino"/>
    <text x="385" y="72" text-anchor="middle" class="dg-texto dg-texto--claro">Service</text>
    <text x="385" y="92" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">reglas del negocio</text>
    <rect x="480" y="40" width="130" height="70" rx="10" class="dg-caja--marino"/>
    <text x="545" y="72" text-anchor="middle" class="dg-texto dg-texto--claro">Repository</text>
    <text x="545" y="92" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">acceso a datos</text>
    <rect x="630" y="40" width="80" height="70" rx="10" class="dg-caja"/>
    <text x="670" y="80" text-anchor="middle" class="dg-texto">BD</text>
    <path d="M132 64H156" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M292 64H316" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M452 64H476" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M612 64H626" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M626 88H614" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M476 88H456" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M316 88H296" class="dg-flecha" marker-end="url(#pt4)"/>
    <path d="M156 88H136" class="dg-flecha" marker-end="url(#pt4)"/>
    <text x="225" y="140" text-anchor="middle" class="dg-etq">@RestController</text>
    <text x="385" y="140" text-anchor="middle" class="dg-etq">@Service</text>
    <text x="545" y="140" text-anchor="middle" class="dg-etq">JpaRepository</text>
    <rect x="160" y="190" width="450" height="64" rx="10" class="dg-caja--turquesa"/>
    <text x="385" y="219" text-anchor="middle" class="dg-texto dg-texto--claro">Model: Mago</text>
    <text x="385" y="240" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12.5px">@Entity, el objeto que todas las capas reciben y devuelven</text>
    <path d="M225 186V150M385 186V150M545 186V150" class="dg-flecha" stroke-dasharray="4 4"/>
  </svg>
  <figcaption>La petición baja capa por capa y la respuesta sube por el mismo camino.</figcaption>
</figure>
${D.tabla(["Capa", "Paquete", "Hace", "No hace"], [
  ["Controller", "<code>controller</code>", "Define rutas, lee datos de la petición y arma la respuesta HTTP.", "Reglas del negocio ni consultas a la base."],
  ["Service", "<code>service</code>", "Aplica las reglas: filtrar, validar, decidir qué guardar.", "Saber de rutas o códigos HTTP."],
  ["Repository", "<code>repository</code>", "Guarda, busca y elimina en la base de datos.", "Tomar decisiones del negocio."],
  ["Model", "<code>model</code>", "Describe los datos (una clase = una tabla).", "Lógica de la aplicación."]
])}
<p>La estructura de paquetes del ejercicio queda así:</p>
${D.arbol(`
src/main/java/com/jr/app3/
├── App3Application.java
├── controller/
│   └── MagoController.java     Rutas /api/mago
├── service/
│   └── MagoService.java        Lógica del negocio
├── repository/
│   └── MagoRepository.java     Acceso a la tabla MAGO
└── model/
    └── Mago.java               La entidad`)}

<h3>Inyección de dependencias</h3>
<p>El controlador necesita al servicio, y el servicio necesita al repositorio. En lugar de crearlos con <code>new</code>, los pedimos en el <strong>constructor</strong> y Spring los entrega ya armados. A esto se le llama inyección de dependencias.</p>
${D.codigo({ archivo: "MagoController.java (fragmento)", completo: `
@RestController
@RequestMapping("/api/mago")
public class MagoController {
    private MagoService magoService;

    // Spring ve que el constructor pide un MagoService y se lo entrega.
    public MagoController(MagoService magoService) {
        this.magoService = magoService;
    }
}`, prueba: `
@RestController
@RequestMapping("/api/mago")
public class MagoController {
    private MagoService magoService;

    public MagoController(/* TODO */) {
        // TODO: recibe el servicio que Spring inyecta
    }
}` })}
${D.nota("consejo", "Buena práctica", `<p>Puedes declarar el atributo como <code>private final MagoService magoService;</code>. Con <code>final</code> nadie puede reemplazarlo por accidente después de crearlo. Si la clase tiene un solo constructor, no hace falta la anotación <code>@Autowired</code>.</p>`)}

<h2>Controladores y rutas</h2>
<p>Un controlador es una clase con <code>@RestController</code>. Cada método público con una anotación de ruta se convierte en un <strong>endpoint</strong>.</p>
${D.tabla(["Anotación", "Dónde va", "Qué hace"], [
  ["<code>@RestController</code>", "Clase", "Marca la clase como controlador. Lo que devuelven sus métodos se convierte a JSON."],
  ["<code>@RequestMapping(\"/api/mago\")</code>", "Clase", "Prefijo común para todas las rutas de la clase."],
  ["<code>@GetMapping</code>", "Método", "Atiende peticiones <code>GET</code>."],
  ["<code>@PostMapping</code>", "Método", "Atiende peticiones <code>POST</code>."],
  ["<code>@PutMapping(\"/{id}\")</code>", "Método", "Atiende <code>PUT</code>; <code>{id}</code> es una parte variable de la ruta."],
  ["<code>@DeleteMapping(\"/{id}\")</code>", "Método", "Atiende <code>DELETE</code>."],
  ["<code>@PathVariable</code>", "Parámetro", "Toma el valor de <code>{id}</code> de la ruta."],
  ["<code>@RequestBody</code>", "Parámetro", "Convierte el JSON del cuerpo en un objeto Java."],
  ["<code>@RequestParam</code>", "Parámetro", "Toma un parámetro de consulta (<code>?nombre=Ana</code>)."]
])}
<p>La ruta final de cada endpoint es el prefijo de la clase más la ruta del método:</p>
${D.tabla(["Anotación del método", "Ruta completa"], [
  ["<code>@GetMapping</code>", D.metodo("GET") + " <code>/api/mago</code>"],
  ["<code>@GetMapping(\"/{id}\")</code>", D.metodo("GET") + " <code>/api/mago/{id}</code>"],
  ["<code>@PostMapping</code>", D.metodo("POST") + " <code>/api/mago</code>"],
  ["<code>@PutMapping(\"/{id}\")</code>", D.metodo("PUT") + " <code>/api/mago/{id}</code>"],
  ["<code>@DeleteMapping(\"/{id}\")</code>", D.metodo("DELETE") + " <code>/api/mago/{id}</code>"],
  ["<code>@GetMapping(\"/fuertes\")</code>", D.metodo("GET") + " <code>/api/mago/fuertes</code>"]
])}

<h2>Recorrido de una petición</h2>
<p>Así viaja <code>GET /api/mago/1</code> por el proyecto:</p>
${D.pasos([
  "Spring recibe la petición y busca un método con <code>@GetMapping(\"/{id}\")</code> dentro de un controlador con prefijo <code>/api/mago</code>. Encuentra <code>traerUno</code>.",
  "<code>@PathVariable int id</code> convierte el texto <code>\"1\"</code> de la ruta en el número <code>1</code>.",
  "El controlador llama a <code>magoService.traerUno(1)</code>.",
  "El servicio llama a <code>magoRepository.findById(1)</code>.",
  "El repositorio ejecuta <code>SELECT * FROM mago WHERE id = 1</code> y devuelve un <code>Optional&lt;Mago&gt;</code>.",
  "De vuelta en el controlador: si el <code>Optional</code> trae un mago responde <code>200 OK</code> con el JSON; si está vacío, <code>404 Not Found</code>."
])}
<p>Pruébalo y mira cada capa en acción en el <a href="#mago">simulador del ejercicio</a>.</p>

<h2>Práctica: endpoints básicos</h2>
<p>Crea un proyecto nuevo (o usa el del tema anterior) y agrega un controlador <code>LibroController</code> con prefijo <code>/api/libro</code> que, por ahora sin base de datos, tenga:</p>
${D.pasos([
  "<code>GET /api/libro</code> que devuelva una lista fija de tres títulos.",
  "<code>GET /api/libro/{id}</code> que devuelva el texto <code>\"Libro número \" + id</code>.",
  "<code>POST /api/libro</code> que reciba un texto en el cuerpo y lo devuelva con código <code>201</code>.",
  "Prueba los tres endpoints en Postman y anota el código de estado de cada respuesta."
])}
${D.soloCompleto(D.pestanas([
  { titulo: "Solución de referencia", html: D.codigo({ archivo: "LibroController.java", completo: `
package com.jr.app3.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libro")
public class LibroController {

    @GetMapping
    public List<String> listar() {
        return List.of("Don Quijote", "Cien años de soledad", "Huasipungo");
    }

    @GetMapping("/{id}")
    public String uno(@PathVariable int id) {
        return "Libro número " + id;
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody String titulo) {
        return new ResponseEntity<>(titulo, HttpStatus.CREATED);
    }
}` }) }
]))}

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "¿En qué capa pondrías la regla \"un mago no puede tener fuerza negativa\"?", r: "<p>En el <strong>Service</strong>, porque es una regla del negocio. (En el tema de validación de datos veremos además las anotaciones de validación.)</p>" },
  { p: "¿Por qué el controlador no llama directamente al repositorio?", r: "<p>Para mantener separadas las responsabilidades: el controlador solo maneja HTTP. Si mañana cambian las reglas, se modifica el servicio sin tocar las rutas.</p>" },
  { p: "Con <code>@RequestMapping(\"/api/curso\")</code> en la clase y <code>@DeleteMapping(\"/{id}\")</code> en un método, ¿cuál es la ruta completa?", r: "<p><code>DELETE /api/curso/{id}</code>, por ejemplo <code>DELETE /api/curso/4</code>.</p>" }
])}
`
});
