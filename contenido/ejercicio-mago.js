/* =========================================================================
   EJERCICIO GUIADO: API DE MAGOS (proyecto app3)
   Cada bloque tiene versión "completo" y versión "prueba" (estructura).
   ========================================================================= */
(function () {
  const URL = () => (window.CONFIG && CONFIG.urlBase) || "http://localhost:9090";

  /* ---------------- Código fuente: versiones completas ---------------- */
  const MODELO = `
package com.jr.app3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Data
@Entity
public class Mago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private double fuerza;
}`;
  const MODELO_P = `
package com.jr.app3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Data
@Entity
public class Mago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private double fuerza;
}`;

  const REPO = `
package com.jr.app3.repository;

import com.jr.app3.model.Mago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagoRepository extends JpaRepository<Mago, Integer> {

}`;
  const REPO_P = `
package com.jr.app3.repository;

import com.jr.app3.model.Mago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagoRepository extends JpaRepository<Mago, Integer> {
    // TODO: ¿qué métodos hereda? ¿hace falta escribir alguno?
}`;

  const S = {
    cabecera: `
package com.jr.app3.service;

import com.jr.app3.model.Mago;
import com.jr.app3.repository.MagoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MagoService {

    private MagoRepository magoRepository;

    public MagoService(MagoRepository magoRepository){
        this.magoRepository = magoRepository;
    }`,
    cabeceraP: `
package com.jr.app3.service;

import com.jr.app3.model.Mago;
import com.jr.app3.repository.MagoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MagoService {

    private MagoRepository magoRepository;

    public MagoService(MagoRepository magoRepository){
        // TODO: guarda el repositorio que Spring inyecta
    }`,
    todos: `
    //TRAER TODOS
    public List <Mago> traerTodos(){
        return magoRepository.findAll();
    }`,
    todosP: `
    //TRAER TODOS
    public List <Mago> traerTodos(){
        // TODO: devuelve todos los magos de la base de datos
    }`,
    uno: `
    //TRAER UNO
    public Optional <Mago> traerUno(int id){
        return magoRepository.findById(id);
    }`,
    unoP: `
    //TRAER UNO
    public Optional <Mago> traerUno(int id){
        // TODO: busca un mago por su id (puede no existir)
    }`,
    guardar: `
    //GUARDAR
    public Mago  guardar (Mago mago){
        return magoRepository.save(mago);
    }`,
    guardarP: `
    //GUARDAR
    public Mago  guardar (Mago mago){
        // TODO: guarda el mago y devuelve el mago guardado (con su id)
    }`,
    editar: `
    //EDITAR
    public Optional <Mago> editar(int id, Mago magoActualziado){
        return magoRepository.findById(id)
                .map( magoExiste ->{
                   magoExiste.setFuerza( magoActualziado.getFuerza());
                   magoExiste.setNombre(magoActualziado.getNombre());

                   return magoRepository.save( magoExiste);
                });
    }`,
    editarP: `
    //EDITAR
    public Optional <Mago> editar(int id, Mago magoActualziado){
        // TODO:
        // 1. Busca el mago por id.
        // 2. Si existe, copia nombre y fuerza de magoActualziado.
        // 3. Guárdalo y devuélvelo dentro del Optional.
    }`,
    eliminar: `
    //ELIMINAR
    public boolean eliminar (int id){
        if ( magoRepository.existsById(id)){
            magoRepository.deleteById(id);
            return true;
        }else{
            return false;
        }
    }`,
    eliminarP: `
    //ELIMINAR
    public boolean eliminar (int id){
        // TODO:
        // Si el mago existe, elimínalo y devuelve true.
        // Si no existe, devuelve false.
    }`,
    fuertes: `
    //Especial
    public List <Mago> fuertes (){
        return magoRepository.findAll()
                .stream().filter(
                        mago -> mago.getFuerza()>200
                ).collect(Collectors.toList());
    }`,
    fuertesP: `
    //Especial
    public List <Mago> fuertes (){
        // TODO: trae todos los magos y quédate solo con los de fuerza mayor a 200
    }`
  };

  const C = {
    cabecera: `
package com.jr.app3.controller;

import com.jr.app3.model.Mago;
import com.jr.app3.service.MagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mago")
public class MagoController {
    private MagoService magoService;

    public MagoController( MagoService magoService){
        this.magoService= magoService;
    }`,
    cabeceraP: `
package com.jr.app3.controller;

import com.jr.app3.model.Mago;
import com.jr.app3.service.MagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mago")
public class MagoController {
    private MagoService magoService;

    public MagoController( MagoService magoService){
        // TODO: guarda el servicio que Spring inyecta
    }`,
    todos: `
    @GetMapping
    public List<Mago> verTodos(){
        return magoService.traerTodos();
    }`,
    todosP: `
    @GetMapping
    public List<Mago> verTodos(){
        // TODO: pide la lista al servicio y devuélvela
    }`,
    uno: `
    //TRAER UNO
    @GetMapping("/{id}")
    public ResponseEntity<Mago> traerUno(@PathVariable int id){
        return magoService.traerUno(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }`,
    unoP: `
    //TRAER UNO
    @GetMapping("/{id}")
    public ResponseEntity<Mago> traerUno(@PathVariable int id){
        // TODO: busca el mago con el servicio.
        // Si existe -> 200 OK con el mago. Si no -> 404 Not Found.
    }`,
    guardar: `
    //GUARDAR
    @PostMapping
    public ResponseEntity<Mago> guardar(@RequestBody  Mago mago){
        Mago nuevoMago = magoService.guardar(mago);
        return new ResponseEntity<>(nuevoMago, HttpStatus.CREATED);
    }`,
    guardarP: `
    //GUARDAR
    @PostMapping
    public ResponseEntity<Mago> guardar(/* TODO: recibe el mago del cuerpo JSON */){
        // TODO: guárdalo con el servicio y responde 201 Created con el mago guardado
    }`,
    editar: `
    //EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Mago> editar(@PathVariable int id, @RequestBody Mago mago){
        return magoService.editar(id, mago)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }`,
    editarP: `
    //EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Mago> editar(/* TODO: id de la ruta y mago del cuerpo */){
        // TODO: edita con el servicio.
        // Si existía -> 200 OK con el mago editado. Si no -> 404 Not Found.
    }`,
    eliminar: `
    @DeleteMapping("/{id}")
    public ResponseEntity <Mago> eliminar (@PathVariable int id){
        if (magoService.eliminar(id)){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }

    }`,
    eliminarP: `
    @DeleteMapping("/{id}")
    public ResponseEntity <Mago> eliminar (@PathVariable int id){
        // TODO: elimina con el servicio.
        // Si se eliminó -> 204 No Content. Si no existía -> 404 Not Found.
    }`,
    fuertes: `
    @GetMapping("/fuertes")
    public List <Mago> mejores(){
        return magoService.fuertes();
    }`,
    fuertesP: `
    @GetMapping("/fuertes")
    public List <Mago> mejores(){
        // TODO: devuelve los magos fuertes que calcula el servicio
    }`
  };

  const ORDEN = ["todos", "uno", "guardar", "editar", "eliminar", "fuertes"];
  const armar = (obj, prueba) =>
    obj[prueba ? "cabeceraP" : "cabecera"] + "\n" +
    ORDEN.map((k) => obj[prueba ? k + "P" : k]).join("\n") + "\n}";
  const SERVICIO = armar(S, false), SERVICIO_P = armar(S, true);
  const CONTROLADOR = armar(C, false), CONTROLADOR_P = armar(C, true);

  const PROPS = `
spring.application.name=app3

spring.datasource.url=jdbc:h2:file:./data/magodb

spring.jpa.hibernate.ddl-auto=update

server.port=9090`;

  const PROPS_CONSOLA = `
spring.application.name=app3

# Base de datos H2 guardada en el archivo ./data/magodb.mv.db
spring.datasource.url=jdbc:h2:file:./data/magodb
spring.datasource.username=sa
spring.datasource.password=

# Crea o actualiza las tablas a partir de las entidades
spring.jpa.hibernate.ddl-auto=update
# Muestra en la consola el SQL que ejecuta Hibernate
spring.jpa.show-sql=true

# Consola web de H2 en http://localhost:9090/h2-console
spring.h2.console.enabled=true

server.port=9090`;

  const PROPS_CONSOLA_P = `
spring.application.name=app3

# TODO: URL de H2 en modo archivo (./data/magodb), usuario y contraseña
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

# TODO: estrategia de creación de tablas
spring.jpa.hibernate.ddl-auto=
spring.jpa.show-sql=true

# TODO: activa la consola web de H2
spring.h2.console.enabled=

server.port=9090`;

  /* Petición curl y respuesta de ejemplo para cada endpoint */
  const peticion = (metodo, ruta, cuerpo) => {
    const u = URL() + ruta;
    if (!cuerpo) return metodo === "GET" ? `curl ${u}` : `curl -X ${metodo} ${u}`;
    return `curl -X ${metodo} ${u} \\\n  -H "Content-Type: application/json" \\\n  -d '${cuerpo}'`;
  };
  const tabsEndpoint = (codigo, codigoP, metodo, ruta, cuerpo, respuestas) =>
    D.pestanas([
      { titulo: "Controlador", html: D.codigo({ archivo: "MagoController.java", completo: codigo, prueba: codigoP }) },
      { titulo: "Petición", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion(metodo, ruta, cuerpo) }) +
          (cuerpo ? `<p>En Postman: método <code>${metodo}</code>, URL <code>${URL()}${ruta}</code>, pestaña <strong>Body</strong>, <strong>raw</strong>, <strong>JSON</strong>.</p>` : "") },
      ...respuestas.map((r) => ({
        titulo: `Respuesta ${r.estado}`,
        html: `<p><strong>${r.estado} ${r.nombre}</strong>. ${r.cuando}</p>` +
          (r.cuerpo ? D.codigo({ lenguaje: "json", titulo: "Cuerpo de la respuesta", completo: r.cuerpo }) : `<p><em>Sin cuerpo.</em></p>`)
      }))
    ]);

  const LISTA = `
[
  { "id": 1, "nombre": "Merlín", "fuerza": 350.0 },
  { "id": 2, "nombre": "Morgana", "fuerza": 280.5 },
  { "id": 3, "nombre": "Aprendiz Tomás", "fuerza": 75.0 }
]`;

  /* ====================== Visión general ====================== */
  Docs.registrar("mago", {
    titulo: "Ejercicio guiado: API de Magos",
    resumen: "Una API REST completa que guarda magos en una base de datos H2. La construimos archivo por archivo siguiendo las capas Model, Repository, Service y Controller.",
    render: () => `
<h2>Qué vamos a construir</h2>
<p>Una API que administra magos. Cada mago tiene un <code>id</code>, un <code>nombre</code> y una <code>fuerza</code>. La API permite listarlos, consultarlos, crearlos, editarlos, eliminarlos y obtener solo los más fuertes.</p>
${D.tabla(["Método y ruta", "Qué hace", "Respuesta"], [
  [D.metodo("GET") + " <code>/api/mago</code>", "Lista todos los magos", "<code>200</code> con la lista"],
  [D.metodo("GET") + " <code>/api/mago/{id}</code>", "Trae un mago por su id", "<code>200</code> o <code>404</code>"],
  [D.metodo("POST") + " <code>/api/mago</code>", "Guarda un mago nuevo", "<code>201</code> con el mago creado"],
  [D.metodo("PUT") + " <code>/api/mago/{id}</code>", "Edita un mago", "<code>200</code> o <code>404</code>"],
  [D.metodo("DELETE") + " <code>/api/mago/{id}</code>", "Elimina un mago", "<code>204</code> o <code>404</code>"],
  [D.metodo("GET") + " <code>/api/mago/fuertes</code>", "Magos con fuerza mayor a 200", "<code>200</code> con la lista"]
])}
${D.nota("info", "Adelantamos un poco", `<p>Este ejercicio ya usa Spring Data JPA y una base H2 para que el CRUD funcione de verdad. Los veremos a fondo en los temas de base de datos y de JPA; por ahora basta con entender qué hace cada pieza.</p>`)}

<h2>Archivos del proyecto</h2>
${D.arbol(`
app3/
├── pom.xml
├── data/
│   └── magodb.mv.db                  La base H2 (se crea sola al ejecutar)
└── src/main/
    ├── java/com/jr/app3/
    │   ├── App3Application.java
    │   ├── model/Mago.java             La entidad
    │   ├── repository/MagoRepository.java
    │   ├── service/MagoService.java
    │   └── controller/MagoController.java
    └── resources/application.properties`)}
<p>Te recomendamos crearlos en este orden, porque cada capa depende de la anterior:</p>
${D.enlaces([
  { id: "mago-modelo", titulo: "1. Modelo", desc: "La clase Mago y cómo se convierte en tabla." },
  { id: "mago-repositorio", titulo: "2. Repositorio", desc: "Acceso a datos sin escribir SQL." },
  { id: "mago-servicio", titulo: "3. Servicio", desc: "Las seis operaciones del negocio." },
  { id: "mago-controlador", titulo: "4. Controlador", desc: "Los endpoints HTTP de la API." },
  { id: "mago-h2", titulo: "5. Base de datos H2", desc: "Configuración y consola web." },
  { id: "mago-pruebas", titulo: "6. Probar la API", desc: "Todas las peticiones listas para Postman o curl." }
])}

<h2>Simulador: recorre una petición</h2>
<p>Este simulador imita el proyecto real en tu navegador. Elige una petición, envíala y observa qué método se ejecuta en cada capa y qué responde la API. Prueba también los ejemplos de error.</p>
${D.simulador()}
${D.nota("consejo", "Antes de seguir", `<p>Intenta predecir el código de estado antes de pulsar <strong>Enviar petición</strong>. Por ejemplo: ¿qué devuelve eliminar el mismo mago dos veces seguidas?</p>`)}
`
  });

  /* ====================== Modelo ====================== */
  Docs.registrar("mago-modelo", {
    titulo: "Modelo: la entidad Mago",
    resumen: "La clase que representa a un mago. Con dos anotaciones, Java sabe que es un objeto con getters y setters y que debe guardarse como una tabla.",
    capa: "model",
    render: () => `
<h2>Código</h2>
${D.codigo({ archivo: "src/main/java/com/jr/app3/model/Mago.java", completo: MODELO, prueba: MODELO_P })}

<h2>Qué hace cada anotación</h2>
${D.tabla(["Anotación", "Origen", "Qué hace"], [
  ["<code>@Data</code>", "Lombok", "Genera al compilar los getters, setters, <code>toString</code>, <code>equals</code> y <code>hashCode</code>. Por eso existen <code>getFuerza()</code> y <code>setNombre()</code> aunque no los escribimos."],
  ["<code>@Entity</code>", "JPA", "Indica que esta clase se guarda en la base de datos. Cada objeto <code>Mago</code> será una fila de la tabla <code>MAGO</code>."],
  ["<code>@Id</code>", "JPA", "Marca el atributo que es la llave primaria."],
  ["<code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code>", "JPA", "La base de datos asigna el id automáticamente (1, 2, 3…) al insertar."]
])}

<h2>De clase a tabla</h2>
<p>Con <code>spring.jpa.hibernate.ddl-auto=update</code>, Hibernate lee la entidad al arrancar y crea la tabla si no existe. El resultado equivale a este SQL:</p>
${D.pestanas([
  { titulo: "Tabla generada", html: D.codigo({ lenguaje: "sql", titulo: "SQL equivalente", completo: `
CREATE TABLE mago (
    id      INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nombre  VARCHAR(255),
    fuerza  FLOAT(53) NOT NULL
);` }) },
  { titulo: "Como JSON", html: `<p>Así se ve un <code>Mago</code> cuando viaja por la API. Los nombres de las propiedades salen de los getters.</p>` + D.codigo({ lenguaje: "json", titulo: "JSON", completo: `
{
  "id": 1,
  "nombre": "Merlín",
  "fuerza": 350.0
}` }) },
  { titulo: "Sin Lombok", html: `<p>Esto es, en resumen, lo que <code>@Data</code> escribe por ti:</p>` + D.codigo({ archivo: "Mago.java (equivalente sin Lombok)", completo: `
public class Mago {
    private int id;
    private String nombre;
    private double fuerza;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getFuerza() { return fuerza; }
    public void setFuerza(double fuerza) { this.fuerza = fuerza; }

    // + toString(), equals() y hashCode()
}` }) }
])}
${D.tabla(["Atributo Java", "Columna", "Observación"], [
  ["<code>int id</code>", "<code>ID</code>", "Llave primaria autogenerada."],
  ["<code>String nombre</code>", "<code>NOMBRE</code>", "Puede quedar <code>null</code> si no se envía."],
  ["<code>double fuerza</code>", "<code>FUERZA</code>", "Tipo primitivo: si no se envía, vale <code>0.0</code>."]
])}
${D.nota("cuidado", "Lombok en el IDE", `<p>Si el IDE marca en rojo <code>getFuerza()</code>, falta activar el procesamiento de anotaciones. En IntelliJ: <strong>Settings</strong>, <strong>Build, Execution, Deployment</strong>, <strong>Compiler</strong>, <strong>Annotation Processors</strong>, y marca <strong>Enable annotation processing</strong>. En VS Code instala la extensión de Lombok.</p>`)}
`
  });

  /* ====================== Repositorio ====================== */
  Docs.registrar("mago-repositorio", {
    titulo: "Repositorio: MagoRepository",
    resumen: "Una interfaz vacía que, al heredar de JpaRepository, recibe gratis los métodos para guardar, buscar y eliminar magos.",
    capa: "repository",
    render: () => `
<h2>Código</h2>
${D.codigo({ archivo: "src/main/java/com/jr/app3/repository/MagoRepository.java", completo: REPO, prueba: REPO_P })}
<p>Es una <strong>interfaz</strong>, no una clase, y no tiene métodos escritos. Spring crea la implementación al arrancar. Los dos tipos entre <code>&lt; &gt;</code> le dicen qué maneja:</p>
${D.tabla(["Tipo", "Significado"], [
  ["<code>Mago</code>", "La entidad que guarda este repositorio."],
  ["<code>Integer</code>", "El tipo de su llave primaria (<code>int id</code> en la entidad; aquí va la clase envoltorio <code>Integer</code>)."]
])}

<h2>Métodos heredados</h2>
<p>Estos son los que usamos en el servicio. Hay más (<code>count</code>, <code>saveAll</code>, <code>findAll(Sort)</code>…), pero con estos se arma un CRUD completo.</p>
${D.tabla(["Método", "Devuelve", "SQL aproximado", "Uso en el ejercicio"], [
  ["<code>findAll()</code>", "<code>List&lt;Mago&gt;</code>", "<code>SELECT * FROM mago</code>", "traerTodos, fuertes"],
  ["<code>findById(id)</code>", "<code>Optional&lt;Mago&gt;</code>", "<code>SELECT … WHERE id = ?</code>", "traerUno, editar"],
  ["<code>save(mago)</code>", "<code>Mago</code>", "<code>INSERT</code> si es nuevo, <code>UPDATE</code> si ya existe", "guardar, editar"],
  ["<code>existsById(id)</code>", "<code>boolean</code>", "<code>SELECT COUNT(*) … WHERE id = ?</code>", "eliminar"],
  ["<code>deleteById(id)</code>", "<code>void</code>", "<code>DELETE FROM mago WHERE id = ?</code>", "eliminar"]
])}
${D.nota("info", "¿Qué es Optional?", `<p><code>findById</code> devuelve una <strong>caja</strong> que puede traer un mago o estar vacía. Así el código está obligado a pensar en el caso “no existe” en lugar de recibir un <code>null</code> que luego provoca errores.</p>`)}

<h2>Para ir más allá: consultas por nombre de método</h2>
<p>Spring Data puede crear consultas leyendo el nombre del método. Por ejemplo, en vez de traer todos los magos y filtrarlos en el servicio, la base de datos podría filtrar directamente:</p>
${D.codigo({ archivo: "MagoRepository.java (opcional)", completo: `
public interface MagoRepository extends JpaRepository<Mago, Integer> {

    // SELECT * FROM mago WHERE fuerza > ?
    List<Mago> findByFuerzaGreaterThan(double fuerza);

    // SELECT * FROM mago WHERE nombre = ?
    List<Mago> findByNombre(String nombre);
}` })}
<p>Lo veremos con detalle en el tema <a href="#jpa">Persistencia con JPA/Hibernate</a>.</p>
`
  });

  /* ====================== Servicio ====================== */
  const opServicio = (id, titulo, firma, descripcion, params, retorna, cod, codP, extra = "") =>
    D.operacion({
      id, titulo, firma, descripcion, parametros: params, retorna,
      codigo: D.codigo({ archivo: "MagoService.java", completo: cod, prueba: codP }) + extra
    });

  Docs.registrar("mago-servicio", {
    titulo: "Servicio: MagoService",
    resumen: "La capa con la lógica del negocio. Recibe pedidos del controlador, usa el repositorio y decide qué devolver. No sabe nada de HTTP.",
    capa: "service",
    render: () => `
<h2>Estructura de la clase</h2>
<p><code>@Service</code> registra la clase en Spring para que pueda inyectarse en el controlador. El constructor recibe el repositorio.</p>
${D.codigo({ archivo: "src/main/java/com/jr/app3/service/MagoService.java", completo: S.cabecera + "\n\n    // ... métodos ...\n}", prueba: S.cabeceraP + "\n\n    // ... métodos ...\n}" })}

${opServicio("traer-todos", "traerTodos", "public List<Mago> traerTodos()",
  `<p>Devuelve todos los magos guardados. Si la tabla está vacía, devuelve una lista vacía (no <code>null</code>).</p>`,
  [], `<p><code>List&lt;Mago&gt;</code> con todos los registros.</p>`, S.todos, S.todosP)}

${opServicio("traer-uno", "traerUno", "public Optional<Mago> traerUno(int id)",
  `<p>Busca un mago por su llave primaria. El resultado puede estar vacío si ese id no existe; el controlador decide qué responder en ese caso.</p>`,
  [["id", "int", "Llave primaria del mago a buscar."]],
  `<p><code>Optional&lt;Mago&gt;</code>: con el mago si existe, vacío si no.</p>`, S.uno, S.unoP)}

${opServicio("guardar", "guardar", "public Mago guardar(Mago mago)",
  `<p>Inserta un mago nuevo. Como el id es autogenerado, el objeto que se recibe llega con <code>id = 0</code> y el que se devuelve ya trae el id asignado por la base de datos.</p>`,
  [["mago", "Mago", "Datos del mago a crear (nombre y fuerza)."]],
  `<p>El <code>Mago</code> guardado, con su <code>id</code>.</p>`, S.guardar, S.guardarP)}

${opServicio("editar", "editar", "public Optional<Mago> editar(int id, Mago magoActualziado)",
  `<p>Busca el mago existente y, si lo encuentra, copia sobre él el nombre y la fuerza recibidos y lo vuelve a guardar. Como el objeto ya tiene id, <code>save</code> hace un <code>UPDATE</code>.</p>
   <p><code>.map(...)</code> solo se ejecuta si el <code>Optional</code> trae un mago. Si está vacío, el resultado sigue vacío y nada se guarda.</p>`,
  [["id", "int", "Id del mago a editar."], ["magoActualziado", "Mago", "Objeto con los valores nuevos de nombre y fuerza."]],
  `<p><code>Optional&lt;Mago&gt;</code> con el mago ya editado, o vacío si el id no existía.</p>`, S.editar, S.editarP,
  D.nota("cuidado", "Los campos que no envíes se reemplazan", `<p>Si el JSON del <code>PUT</code> trae solo <code>fuerza</code>, <code>getNombre()</code> devuelve <code>null</code> y el nombre queda borrado. PUT significa “reemplazar”: envía siempre todos los campos.</p>`))}

${opServicio("eliminar", "eliminar", "public boolean eliminar(int id)",
  `<p>Primero comprueba si el mago existe. Si existe lo elimina y devuelve <code>true</code>; si no, devuelve <code>false</code> sin intentar borrar. Así el controlador puede responder 204 o 404.</p>`,
  [["id", "int", "Id del mago a eliminar."]],
  `<p><code>true</code> si se eliminó, <code>false</code> si no existía.</p>`, S.eliminar, S.eliminarP)}

${opServicio("fuertes", "fuertes", "public List<Mago> fuertes()",
  `<p>Ejemplo de regla del negocio: trae todos los magos y, con un <code>stream</code>, se queda solo con los que tienen fuerza mayor a 200.</p>`,
  [], `<p><code>List&lt;Mago&gt;</code> filtrada; puede estar vacía.</p>`, S.fuertes, S.fuertesP,
  D.soloCompleto(D.pestanas([
    { titulo: "¿Cómo funciona el stream?", html: `<p>Se lee de izquierda a derecha como una tubería:</p>${D.tabla(["Paso", "Qué hace"], [
      ["<code>findAll()</code>", "Trae la lista completa."],
      ["<code>.stream()</code>", "La convierte en una secuencia que se puede procesar."],
      ["<code>.filter(mago -> mago.getFuerza() > 200)</code>", "Deja pasar solo los magos que cumplen la condición."],
      ["<code>.collect(Collectors.toList())</code>", "Junta los que pasaron en una lista nueva."]
    ])}` },
    { titulo: "Versión con for", html: D.codigo({ archivo: "Equivalente sin stream", completo: `
public List<Mago> fuertes() {
    List<Mago> resultado = new ArrayList<>();
    for (Mago mago : magoRepository.findAll()) {
        if (mago.getFuerza() > 200) {
            resultado.add(mago);
        }
    }
    return resultado;
}` }) }
  ])))}
`
  });

  /* ====================== Controlador ====================== */
  Docs.registrar("mago-controlador", {
    titulo: "Controlador: MagoController",
    resumen: "La puerta de entrada de la API. Cada método atiende una ruta y un método HTTP, llama al servicio y arma la respuesta con el código de estado correcto.",
    capa: "controller",
    render: () => `
<h2>Estructura de la clase</h2>
<p><code>@RestController</code> convierte a JSON lo que devuelven los métodos. <code>@RequestMapping("/api/mago")</code> pone ese prefijo a todas las rutas de la clase.</p>
${D.codigo({ archivo: "src/main/java/com/jr/app3/controller/MagoController.java", completo: C.cabecera + "\n\n    // ... endpoints ...\n}", prueba: C.cabeceraP + "\n\n    // ... endpoints ...\n}" })}
${D.nota("info", "ResponseEntity", `<p>Cuando un método devuelve directamente un objeto (como <code>List&lt;Mago&gt;</code>), Spring responde siempre <code>200</code>. Para elegir el código (201, 204, 404…) se devuelve un <code>ResponseEntity</code>, que envuelve el cuerpo junto con el estado.</p>`)}

${D.operacion({
  id: "ver-todos", titulo: "Listar todos los magos", metodo: "GET", ruta: "/api/mago",
  descripcion: `<p>Método <code>verTodos()</code>. Llama a <code>magoService.traerTodos()</code> y devuelve la lista tal cual, con estado 200.</p>`,
  codigo: tabsEndpoint(C.todos, C.todosP, "GET", "/api/mago", null, [
    { estado: 200, nombre: "OK", cuando: "Siempre, aunque la lista esté vacía (<code>[]</code>).", cuerpo: LISTA }
  ])
})}

${D.operacion({
  id: "traer-uno", titulo: "Traer un mago por id", metodo: "GET", ruta: "/api/mago/{id}",
  descripcion: `<p>Método <code>traerUno(int id)</code>. Recibe el <code>Optional</code> del servicio: <code>.map(ResponseEntity::ok)</code> lo convierte en 200 si trae un mago, y <code>.orElse(...)</code> da 404 si está vacío.</p>`,
  parametros: [["id", "int (ruta)", "Se toma de la URL gracias a <code>@PathVariable</code>. Si no es un número, Spring responde 400."]],
  codigo: tabsEndpoint(C.uno, C.unoP, "GET", "/api/mago/1", null, [
    { estado: 200, nombre: "OK", cuando: "El mago existe.", cuerpo: `{\n  "id": 1,\n  "nombre": "Merlín",\n  "fuerza": 350.0\n}` },
    { estado: 404, nombre: "Not Found", cuando: "No hay un mago con ese id." }
  ])
})}

${D.operacion({
  id: "guardar", titulo: "Guardar un mago", metodo: "POST", ruta: "/api/mago",
  descripcion: `<p>Método <code>guardar(Mago mago)</code>. <code>@RequestBody</code> convierte el JSON del cuerpo en un objeto <code>Mago</code>. Responde <code>201 Created</code> con el mago guardado, que ya incluye su id.</p>`,
  parametros: [["nombre", "String (cuerpo)", "Nombre del mago."], ["fuerza", "double (cuerpo)", "Nivel de fuerza. Si no se envía, queda en 0.0."]],
  codigo: tabsEndpoint(C.guardar, C.guardarP, "POST", "/api/mago", '{"nombre": "Gandolfo", "fuerza": 420.0}', [
    { estado: 201, nombre: "Created", cuando: "Se guardó correctamente.", cuerpo: `{\n  "id": 4,\n  "nombre": "Gandolfo",\n  "fuerza": 420.0\n}` },
    { estado: 400, nombre: "Bad Request", cuando: "El JSON está mal escrito o falta el cuerpo.", cuerpo: `{\n  "timestamp": "2026-11-11T15:04:12.000+00:00",\n  "status": 400,\n  "error": "Bad Request",\n  "path": "/api/mago"\n}` }
  ])
})}
${D.nota("consejo", "No envíes el id al crear", `<p>El id lo genera la base de datos. Si lo incluyes en el JSON de un <code>POST</code>, JPA intentará actualizar un registro que quizá no existe.</p>`)}

${D.operacion({
  id: "editar", titulo: "Editar un mago", metodo: "PUT", ruta: "/api/mago/{id}",
  descripcion: `<p>Método <code>editar(int id, Mago mago)</code>. Combina las dos fuentes de datos: el id viene de la ruta y los valores nuevos del cuerpo.</p>`,
  parametros: [["id", "int (ruta)", "Mago que se quiere editar."], ["nombre", "String (cuerpo)", "Nuevo nombre."], ["fuerza", "double (cuerpo)", "Nueva fuerza."]],
  codigo: tabsEndpoint(C.editar, C.editarP, "PUT", "/api/mago/3", '{"nombre": "Tomás el Sabio", "fuerza": 210.0}', [
    { estado: 200, nombre: "OK", cuando: "El mago existía y se actualizó.", cuerpo: `{\n  "id": 3,\n  "nombre": "Tomás el Sabio",\n  "fuerza": 210.0\n}` },
    { estado: 404, nombre: "Not Found", cuando: "No hay un mago con ese id." }
  ])
})}

${D.operacion({
  id: "eliminar", titulo: "Eliminar un mago", metodo: "DELETE", ruta: "/api/mago/{id}",
  descripcion: `<p>Método <code>eliminar(int id)</code>. Usa el <code>boolean</code> del servicio para decidir: <code>204 No Content</code> si se borró, <code>404</code> si no existía.</p>`,
  parametros: [["id", "int (ruta)", "Mago que se quiere eliminar."]],
  codigo: tabsEndpoint(C.eliminar, C.eliminarP, "DELETE", "/api/mago/2", null, [
    { estado: 204, nombre: "No Content", cuando: "Se eliminó. No hay nada que devolver." },
    { estado: 404, nombre: "Not Found", cuando: "No había un mago con ese id." }
  ])
})}

${D.operacion({
  id: "fuertes", titulo: "Listar magos fuertes", metodo: "GET", ruta: "/api/mago/fuertes",
  descripcion: `<p>Método <code>mejores()</code>. Devuelve lo que calcula <code>magoService.fuertes()</code>: los magos con fuerza mayor a 200.</p>
  <p>Aunque <code>/fuertes</code> también “encaja” en <code>/{id}</code>, Spring elige primero la ruta fija, que es más específica.</p>`,
  codigo: tabsEndpoint(C.fuertes, C.fuertesP, "GET", "/api/mago/fuertes", null, [
    { estado: 200, nombre: "OK", cuando: "Siempre; la lista puede estar vacía.", cuerpo: `[\n  { "id": 1, "nombre": "Merlín", "fuerza": 350.0 },\n  { "id": 2, "nombre": "Morgana", "fuerza": 280.5 }\n]` }
  ])
})}
`
  });

  /* ====================== H2 ====================== */
  Docs.registrar("mago-h2", {
    titulo: "Base de datos H2",
    resumen: "H2 es una base de datos escrita en Java que se guarda en un archivo del proyecto. No hay que instalar nada: ideal para aprender y hacer pruebas.",
    capa: "bd",
    render: () => `
<h2>Configuración del ejercicio</h2>
${D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: PROPS, prueba: `
spring.application.name=app3

# TODO: URL de H2 en modo archivo, guardada en ./data/magodb
spring.datasource.url=

# TODO: que Hibernate cree o actualice las tablas sin borrar datos
spring.jpa.hibernate.ddl-auto=

server.port=9090` })}
${D.tabla(["Propiedad", "Qué hace"], [
  ["<code>spring.datasource.url=jdbc:h2:file:./data/magodb</code>", "Conecta a H2 en modo <strong>archivo</strong>. Los datos se guardan en <code>data/magodb.mv.db</code> y sobreviven a los reinicios."],
  ["<code>spring.jpa.hibernate.ddl-auto=update</code>", "Al arrancar, crea las tablas que falten y agrega columnas nuevas sin borrar datos."],
  ["<code>server.port=9090</code>", "La API escucha en <code>http://localhost:9090</code>."]
])}
${D.tabla(["Valor de ddl-auto", "Efecto", "Cuándo usarlo"], [
  ["<code>update</code>", "Crea o ajusta tablas, conserva los datos.", "Desarrollo (el que usamos)."],
  ["<code>create</code>", "Borra y vuelve a crear las tablas en cada arranque.", "Pruebas desde cero."],
  ["<code>create-drop</code>", "Como <code>create</code>, y además las borra al detener.", "Pruebas automáticas."],
  ["<code>none</code>", "No toca la estructura.", "Producción."]
])}
${D.nota("info", "Archivo o memoria", `<p>Con <code>jdbc:h2:mem:magodb</code> la base vive solo en memoria y se pierde al detener la aplicación. Con <code>jdbc:h2:file:...</code> queda guardada en disco.</p>`)}

<h2>Ver los datos en la consola web</h2>
<p>H2 trae una página web para ver las tablas y ejecutar SQL. El proyecto ya incluye la dependencia <code>spring-boot-h2console</code>; falta activarla. Esta es una configuración completa recomendada:</p>
${D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: PROPS_CONSOLA, prueba: PROPS_CONSOLA_P })}
${D.pasos([
  "Reinicia la aplicación y abre <code>" + URL() + "/h2-console</code> en el navegador.",
  "En <strong>JDBC URL</strong> escribe exactamente <code>jdbc:h2:file:./data/magodb</code>.",
  "Usuario <code>sa</code> y contraseña vacía. Pulsa <strong>Connect</strong>.",
  "Haz clic en la tabla <code>MAGO</code> o escribe una consulta y pulsa <strong>Run</strong>."
])}
${D.codigo({ lenguaje: "sql", titulo: "Consultas para probar en la consola", completo: `
SELECT * FROM mago;

SELECT * FROM mago WHERE fuerza > 200;

INSERT INTO mago (nombre, fuerza) VALUES ('Merlín', 350.0);` })}
${D.nota("cuidado", "Database not found", `<p>Si la consola dice que la base no existe, revisa que la <strong>JDBC URL</strong> sea igual a la de <code>application.properties</code>. La ruta <code>./data</code> es relativa a la carpeta desde donde se ejecuta el proyecto.</p>`)}
`
  });

  /* ====================== Pruebas ====================== */
  Docs.registrar("mago-pruebas", {
    titulo: "Probar la API",
    resumen: "Todas las peticiones del ejercicio en orden, listas para copiar en la terminal o reproducir en Postman.",
    capa: "cliente",
    render: () => `
<h2>Recorrido completo</h2>
<p>Con la aplicación en marcha, ejecuta estas peticiones en orden. Cada una depende del estado que dejó la anterior.</p>
${D.pasos([
  `Crea dos magos con ${D.metodo("POST")}.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("POST", "/api/mago", '{"nombre": "Merlín", "fuerza": 350.0}') + "\n\n" + peticion("POST", "/api/mago", '{"nombre": "Aprendiz Tomás", "fuerza": 75.0}') }),
  `Lista todos con ${D.metodo("GET")}. Deberías ver los dos con sus id.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("GET", "/api/mago") }),
  `Consulta uno por id.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("GET", "/api/mago/1") }),
  `Pide solo los fuertes: debe aparecer únicamente Merlín.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("GET", "/api/mago/fuertes") }),
  `Edita al aprendiz con ${D.metodo("PUT")} y vuelve a pedir los fuertes: ahora aparecen los dos.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("PUT", "/api/mago/2", '{"nombre": "Tomás el Sabio", "fuerza": 210.0}') }),
  `Elimínalo con ${D.metodo("DELETE")} y repite la misma petición: la primera da 204 y la segunda 404.` + D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: peticion("DELETE", "/api/mago/2") })
])}
${D.nota("consejo", "Ver el código de estado en curl", `<p>Agrega <code>-i</code> después de <code>curl</code> para ver la línea de estado y las cabeceras, por ejemplo <code>curl -i ${URL()}/api/mago/99</code>.</p>`)}

<h2>Errores que vale la pena provocar</h2>
${D.tabla(["Petición", "Resultado", "Por qué"], [
  [D.metodo("GET") + " <code>/api/mago/99</code>", "<code>404</code>", "El id no existe; el servicio devuelve un Optional vacío."],
  [D.metodo("GET") + " <code>/api/mago/abc</code>", "<code>400</code>", "<code>abc</code> no se puede convertir en <code>int</code>."],
  [D.metodo("DELETE") + " <code>/api/mago</code>", "<code>405</code>", "Esa ruta no tiene método <code>DELETE</code>, solo GET y POST."],
  [D.metodo("POST") + " con JSON sin cerrar la llave", "<code>400</code>", "Spring no puede leer el cuerpo."],
  [D.metodo("PUT") + " con solo <code>{\"fuerza\": 500}</code>", "<code>200</code>, pero el nombre queda en <code>null</code>", "El servicio copia todos los campos, incluso los que no enviaste."]
])}
<p>Puedes ver cada uno de estos casos paso a paso en el <a href="#mago">simulador</a>.</p>

<h2>Postman</h2>
${D.pasos([
  "Crea una colección llamada <strong>API Magos</strong>.",
  "En la pestaña <strong>Variables</strong> de la colección, agrega <code>base</code> con el valor <code>" + URL() + "</code>.",
  "Crea una petición por cada endpoint usando <code>{{base}}/api/mago</code> como URL.",
  "Para POST y PUT: pestaña <strong>Body</strong>, opción <strong>raw</strong>, tipo <strong>JSON</strong>.",
  "Guarda la colección para reutilizarla cada vez que modifiques la API."
])}
`
  });

  /* ====================== Código completo ====================== */
  Docs.registrar("mago-completo", {
    titulo: "Código completo",
    resumen: "Todos los archivos del ejercicio en un solo lugar, para copiar de una vez.",
    render: () => `
<h2>Archivos Java</h2>
${D.pestanas([
  { titulo: "Mago.java", html: D.codigo({ archivo: "model/Mago.java", completo: MODELO, prueba: MODELO_P }) },
  { titulo: "MagoRepository.java", html: D.codigo({ archivo: "repository/MagoRepository.java", completo: REPO, prueba: REPO_P }) },
  { titulo: "MagoService.java", html: D.codigo({ archivo: "service/MagoService.java", completo: SERVICIO, prueba: SERVICIO_P }) },
  { titulo: "MagoController.java", html: D.codigo({ archivo: "controller/MagoController.java", completo: CONTROLADOR, prueba: CONTROLADOR_P }) }
])}

<h2>Configuración</h2>
${D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: PROPS_CONSOLA, prueba: PROPS_CONSOLA_P })}
<p>Las dependencias del <code>pom.xml</code> están explicadas en <a href="#spring-boot">Introducción a Spring Boot</a>.</p>
`
  });
})();
