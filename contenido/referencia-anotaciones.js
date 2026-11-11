Docs.registrar("anotaciones", {
  titulo: "Anotaciones de Spring",
  resumen: "Resumen de las anotaciones vistas hasta ahora. Esta tabla crece con cada tema.",
  render: () => `
<h2>Arranque y componentes</h2>
${D.tabla(["Anotación", "Va en", "Qué hace", "Visto en"], [
  ["<code>@SpringBootApplication</code>", "Clase principal", "Activa la autoconfiguración y busca componentes en el paquete y subpaquetes.", "<a href=\"#spring-boot\">Spring Boot</a>"],
  ["<code>@RestController</code>", "Clase", "Controlador cuyas respuestas se convierten a JSON.", "<a href=\"#mvc\">MVC</a>"],
  ["<code>@Service</code>", "Clase", "Componente de la capa de servicio (lógica del negocio).", "<a href=\"#mago-servicio\">Ejercicio</a>"]
])}

<h2>Rutas y datos de la petición</h2>
${D.tabla(["Anotación", "Va en", "Qué hace", "Ejemplo"], [
  ["<code>@RequestMapping</code>", "Clase", "Prefijo de ruta para todos los métodos.", "<code>@RequestMapping(\"/api/mago\")</code>"],
  ["<code>@GetMapping</code>", "Método", "Atiende <code>GET</code>.", "<code>@GetMapping(\"/{id}\")</code>"],
  ["<code>@PostMapping</code>", "Método", "Atiende <code>POST</code>.", "<code>@PostMapping</code>"],
  ["<code>@PutMapping</code>", "Método", "Atiende <code>PUT</code>.", "<code>@PutMapping(\"/{id}\")</code>"],
  ["<code>@DeleteMapping</code>", "Método", "Atiende <code>DELETE</code>.", "<code>@DeleteMapping(\"/{id}\")</code>"],
  ["<code>@PathVariable</code>", "Parámetro", "Lee una parte variable de la ruta.", "<code>@PathVariable int id</code>"],
  ["<code>@RequestBody</code>", "Parámetro", "Convierte el JSON del cuerpo en un objeto.", "<code>@RequestBody Mago mago</code>"],
  ["<code>@RequestParam</code>", "Parámetro", "Lee un parámetro de consulta (<code>?clave=valor</code>).", "<code>@RequestParam String nombre</code>"]
])}

<h2>Persistencia (JPA) y Lombok</h2>
${D.tabla(["Anotación", "Va en", "Qué hace"], [
  ["<code>@Entity</code>", "Clase", "La clase se guarda como tabla en la base de datos."],
  ["<code>@Id</code>", "Atributo", "Llave primaria."],
  ["<code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code>", "Atributo", "La base de datos genera el valor de la llave."],
  ["<code>@Data</code>", "Clase", "Lombok: genera getters, setters, <code>toString</code>, <code>equals</code> y <code>hashCode</code>."]
])}

<h2>Clases útiles de Spring</h2>
${D.tabla(["Clase o método", "Para qué"], [
  ["<code>ResponseEntity.ok(cuerpo)</code>", "Respuesta 200 con cuerpo."],
  ["<code>new ResponseEntity&lt;&gt;(cuerpo, HttpStatus.CREATED)</code>", "Respuesta con el código que elijas (aquí 201)."],
  ["<code>ResponseEntity.noContent().build()</code>", "Respuesta 204 sin cuerpo."],
  ["<code>ResponseEntity.notFound().build()</code>", "Respuesta 404 sin cuerpo."],
  ["<code>JpaRepository&lt;Entidad, TipoId&gt;</code>", "Interfaz que da <code>findAll</code>, <code>findById</code>, <code>save</code>, <code>deleteById</code>…"],
  ["<code>Optional&lt;T&gt;</code>", "Caja que puede traer un valor o estar vacía."]
])}
`
});
