/* =========================================================================
   TEMA 1.5: CONEXIÓN A BASE DE DATOS Y OPERACIONES CRUD
   Taller guiado: API de Tareas sobre MySQL o PostgreSQL.
   ========================================================================= */
(function () {
  const URL = () => (window.CONFIG && CONFIG.urlBase) || "http://localhost:9090";
  const curlJson = (metodo, ruta, json) =>
    `curl -i -X ${metodo} ${URL()}${ruta} \\\n  -H "Content-Type: application/json" \\\n  -d '${json}'`;

  /* ---------------- Configuración por motor ---------------- */
  const POM_MYSQL = `
<!-- Driver de MySQL: reemplaza a la dependencia de H2 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>`;
  const POM_PG = `
<!-- Driver de PostgreSQL: reemplaza a la dependencia de H2 -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>`;

  const PROPS_MYSQL = `
spring.application.name=tareas

# ----- Conexión a MySQL -----
spring.datasource.url=jdbc:mysql://localhost:3306/tareasdb
spring.datasource.username=tareas
spring.datasource.password=tareas123

# ----- JPA / Hibernate -----
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=9090`;
  const PROPS_MYSQL_P = `
spring.application.name=tareas

# ----- Conexión a MySQL -----
# TODO: URL JDBC (servidor local, puerto por defecto de MySQL, base tareasdb)
spring.datasource.url=
# TODO: usuario y contraseña de la base
spring.datasource.username=
spring.datasource.password=

# ----- JPA / Hibernate -----
# TODO: que Hibernate cree o actualice las tablas sin borrar datos
spring.jpa.hibernate.ddl-auto=
spring.jpa.show-sql=true

server.port=9090`;

  const PROPS_PG = `
spring.application.name=tareas

# ----- Conexión a PostgreSQL -----
spring.datasource.url=jdbc:postgresql://localhost:5432/tareasdb
spring.datasource.username=tareas
spring.datasource.password=tareas123

# ----- JPA / Hibernate -----
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=9090`;
  const PROPS_PG_P = `
spring.application.name=tareas

# ----- Conexión a PostgreSQL -----
# TODO: URL JDBC (servidor local, puerto por defecto de PostgreSQL, base tareasdb)
spring.datasource.url=
# TODO: usuario y contraseña de la base
spring.datasource.username=
spring.datasource.password=

# ----- JPA / Hibernate -----
# TODO: que Hibernate cree o actualice las tablas sin borrar datos
spring.jpa.hibernate.ddl-auto=
spring.jpa.show-sql=true

server.port=9090`;

  const SQL_MYSQL = `
-- Ejecutar como root (MySQL Workbench, DBeaver o la consola mysql)
CREATE DATABASE tareasdb;

CREATE USER 'tareas'@'localhost' IDENTIFIED BY 'tareas123';
GRANT ALL PRIVILEGES ON tareasdb.* TO 'tareas'@'localhost';
FLUSH PRIVILEGES;`;
  const SQL_PG = `
-- Ejecutar como postgres (pgAdmin, DBeaver o la consola psql)
CREATE USER tareas WITH PASSWORD 'tareas123';
CREATE DATABASE tareasdb OWNER tareas;`;

  const DOCKER_MYSQL = `
docker run --name mysql-clase -d -p 3306:3306 \\
  -e MYSQL_ROOT_PASSWORD=root123 \\
  -e MYSQL_DATABASE=tareasdb \\
  -e MYSQL_USER=tareas \\
  -e MYSQL_PASSWORD=tareas123 \\
  mysql:8.4`;
  const DOCKER_PG = `
docker run --name postgres-clase -d -p 5432:5432 \\
  -e POSTGRES_DB=tareasdb \\
  -e POSTGRES_USER=tareas \\
  -e POSTGRES_PASSWORD=tareas123 \\
  postgres:17`;

  /* ---------------- Código del taller ---------------- */
  const MODELO = `
package com.jr.tareas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String titulo;
    private String descripcion;
    private int prioridad;        // 1 = alta, 2 = media, 3 = baja
    private boolean completada;
}`;
  const MODELO_P = `
package com.jr.tareas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Tarea {

    // TODO: llave primaria autogenerada por la base de datos
    private int id;

    // TODO: titulo (texto), descripcion (texto),
    //       prioridad (entero) y completada (verdadero/falso)
}`;

  const REPO = `
package com.jr.tareas.repository;

import com.jr.tareas.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Integer> {

}`;

  const SERV = `
package com.jr.tareas.service;

import com.jr.tareas.model.Tarea;
import com.jr.tareas.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    // READ: todas
    public List<Tarea> traerTodas() {
        return tareaRepository.findAll();
    }

    // READ: una
    public Optional<Tarea> traerUna(int id) {
        return tareaRepository.findById(id);
    }

    // CREATE
    public Tarea crear(Tarea tarea) {
        tarea.setId(0);              // asegura un INSERT aunque el JSON traiga id
        return tareaRepository.save(tarea);
    }

    // UPDATE
    public Optional<Tarea> actualizar(int id, Tarea datos) {
        return tareaRepository.findById(id)
                .map(existe -> {
                    existe.setTitulo(datos.getTitulo());
                    existe.setDescripcion(datos.getDescripcion());
                    existe.setPrioridad(datos.getPrioridad());
                    existe.setCompletada(datos.isCompletada());
                    return tareaRepository.save(existe);
                });
    }

    // DELETE
    public boolean eliminar(int id) {
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}`;
  const SERV_P = `
package com.jr.tareas.service;

import com.jr.tareas.model.Tarea;
import com.jr.tareas.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    // READ: todas
    public List<Tarea> traerTodas() {
        // TODO
    }

    // READ: una
    public Optional<Tarea> traerUna(int id) {
        // TODO
    }

    // CREATE
    public Tarea crear(Tarea tarea) {
        // TODO: asegura que se haga un INSERT y guarda la tarea
    }

    // UPDATE
    public Optional<Tarea> actualizar(int id, Tarea datos) {
        // TODO: busca la tarea, copia los 4 campos, guarda y devuelve
    }

    // DELETE
    public boolean eliminar(int id) {
        // TODO: true si existía y se eliminó; false si no existía
    }
}`;

  const CTRL = `
package com.jr.tareas.controller;

import com.jr.tareas.model.Tarea;
import com.jr.tareas.service.TareaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarea")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public List<Tarea> listar() {
        return tareaService.traerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> traerUna(@PathVariable int id) {
        return tareaService.traerUna(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
        Tarea nueva = tareaService.crear(tarea);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizar(@PathVariable int id, @RequestBody Tarea tarea) {
        return tareaService.actualizar(id, tarea)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        return tareaService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}`;
  const CTRL_P = `
package com.jr.tareas.controller;

import com.jr.tareas.model.Tarea;
import com.jr.tareas.service.TareaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarea")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public List<Tarea> listar() {
        // TODO: 200 con la lista
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> traerUna(@PathVariable int id) {
        // TODO: 200 o 404
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
        // TODO: 201 con la tarea creada
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizar(@PathVariable int id, @RequestBody Tarea tarea) {
        // TODO: 200 o 404
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        // TODO: 204 o 404
    }
}`;

  const JSON_TAREA = `{
  "id": 1,
  "titulo": "Instalar MySQL",
  "descripcion": "Crear la base tareasdb y el usuario tareas",
  "prioridad": 1,
  "completada": false
}`;

  const motor = (mysql, pg) => D.pestanas([{ titulo: "MySQL", html: mysql }, { titulo: "PostgreSQL", html: pg }]);

  Docs.registrar("base-datos-crud", {
    titulo: "Conexión a base de datos y operaciones CRUD",
    resumen: "Cómo pasar de H2 a un gestor real como MySQL o PostgreSQL, cómo viajan los datos entre el cliente y la base, y cómo se traduce cada operación CRUD en HTTP, Java y SQL. Cierra con un taller guiado: la API de Tareas.",
    capa: "bd",
    capaTextos: { bd: "MySQL / PostgreSQL", modelo: "Tarea" },
    render: () => `
<h2>De H2 a una base de datos real</h2>
<p>H2 es cómoda para aprender: vive en un archivo del proyecto y no hay que instalar nada. Pero las aplicaciones reales usan un <strong>gestor de bases de datos</strong> que corre como un servidor aparte, al que se conectan uno o varios backends por la red.</p>
${D.tabla(["", "H2 (archivo)", "MySQL / PostgreSQL"], [
  ["Dónde corre", "Dentro de la aplicación Java", "Como un servidor independiente (puerto 3306 o 5432)"],
  ["Instalación", "Ninguna, es una dependencia", "Instalar el gestor o levantarlo con Docker"],
  ["Usuarios y permisos", "Básicos", "Usuarios con contraseña y privilegios por base"],
  ["Varias aplicaciones a la vez", "No es su propósito", "Sí, es lo normal"],
  ["Uso típico", "Pruebas y aprendizaje", "Desarrollo serio y producción"]
])}
<p>La buena noticia: gracias a JPA, <strong>el código Java no cambia</strong>. La entidad, el repositorio, el servicio y el controlador son los mismos. Solo cambian dos cosas: el <em>driver</em> en el <code>pom.xml</code> y los datos de conexión en <code>application.properties</code>.</p>
<figure class="diagrama">
  <svg viewBox="0 0 720 210" role="img" aria-labelledby="dg5-t">
    <title id="dg5-t">La aplicación Spring Boot usa JPA e Hibernate, que mediante el driver JDBC envía SQL al servidor MySQL o PostgreSQL por la red.</title>
    <defs><marker id="pt5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-punta"/></marker></defs>
    <rect x="10" y="30" width="300" height="150" rx="12" class="dg-caja"/>
    <text x="160" y="58" text-anchor="middle" class="dg-texto">Aplicación Spring Boot</text>
    <rect x="30" y="74" width="120" height="44" rx="8" class="dg-caja--marino"/>
    <text x="90" y="101" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-size:13px">Repository</text>
    <rect x="170" y="74" width="120" height="44" rx="8" class="dg-caja--marino"/>
    <text x="230" y="101" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-size:13px">JPA / Hibernate</text>
    <rect x="170" y="128" width="120" height="40" rx="8" class="dg-caja--turquesa"/>
    <text x="230" y="153" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-size:13px">Driver JDBC</text>
    <path d="M152 96H166" class="dg-flecha" marker-end="url(#pt5)"/>
    <path d="M230 120V124" class="dg-flecha" marker-end="url(#pt5)"/>
    <path d="M292 148H470" class="dg-flecha" marker-end="url(#pt5)"/>
    <text x="381" y="138" text-anchor="middle" class="dg-etq">SQL por la red</text>
    <text x="381" y="168" text-anchor="middle" class="dg-sub">jdbc:mysql://localhost:3306/tareasdb</text>
    <rect x="474" y="30" width="236" height="150" rx="12" class="dg-caja"/>
    <text x="592" y="80" text-anchor="middle" class="dg-texto">Servidor de base de datos</text>
    <text x="592" y="104" text-anchor="middle" class="dg-sub">MySQL (3306) o PostgreSQL (5432)</text>
    <text x="592" y="132" text-anchor="middle" class="dg-sub">base: tareasdb</text>
    <text x="592" y="152" text-anchor="middle" class="dg-sub">usuario: tareas</text>
  </svg>
  <figcaption>El driver JDBC es el “traductor” que sabe hablar con cada gestor. Por eso hay un driver distinto para MySQL y para PostgreSQL.</figcaption>
</figure>

<h2>Configuración de la conexión</h2>
<p>Elige un gestor y sigue los cuatro pasos en la pestaña correspondiente. Ambos funcionan igual con Spring Boot.</p>

<h3>1. Tener el gestor funcionando</h3>
<p>Puedes instalarlo en tu equipo (MySQL Community Server o PostgreSQL desde su sitio oficial) o levantarlo con Docker, que es lo más rápido si ya lo tienes instalado. Este comando crea el servidor, la base y el usuario de una vez:</p>
${motor(
  D.codigo({ lenguaje: "bash", titulo: "Terminal (Docker)", completo: DOCKER_MYSQL }),
  D.codigo({ lenguaje: "bash", titulo: "Terminal (Docker)", completo: DOCKER_PG })
)}

<h3>2. Crear la base de datos y el usuario</h3>
<p>Si usaste Docker con el comando anterior, este paso ya está hecho. Si instalaste el gestor, ejecuta este script con el usuario administrador:</p>
${motor(
  D.codigo({ lenguaje: "sql", titulo: "Script MySQL", completo: SQL_MYSQL }),
  D.codigo({ lenguaje: "sql", titulo: "Script PostgreSQL", completo: SQL_PG })
)}
${D.nota("consejo", "¿Por qué no usar root o postgres?", `<p>La aplicación debe conectarse con un usuario que solo tenga permisos sobre <strong>su</strong> base. Si alguien llegara a obtener esa contraseña, no podría tocar las demás bases del servidor.</p>`)}

<h3>3. Agregar el driver al pom.xml</h3>
<p>Al crear un proyecto nuevo en start.spring.io, agrega <strong>MySQL Driver</strong> o <strong>PostgreSQL Driver</strong> en lugar de H2. En un proyecto existente, agrega la dependencia a mano y recarga Maven:</p>
${motor(
  D.codigo({ archivo: "pom.xml", lenguaje: "xml", completo: POM_MYSQL }),
  D.codigo({ archivo: "pom.xml", lenguaje: "xml", completo: POM_PG })
)}

<h3>4. Configurar application.properties</h3>
${motor(
  D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: PROPS_MYSQL, prueba: PROPS_MYSQL_P }),
  D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: PROPS_PG, prueba: PROPS_PG_P })
)}
${D.tabla(["Propiedad", "Qué indica"], [
  ["<code>spring.datasource.url</code>", "Dónde está la base: <code>jdbc:</code> + gestor + <code>//servidor:puerto/</code> + nombre de la base."],
  ["<code>spring.datasource.username</code> / <code>password</code>", "Credenciales del usuario creado en el paso 2."],
  ["<code>spring.jpa.hibernate.ddl-auto=update</code>", "Hibernate crea las tablas a partir de las entidades y las ajusta sin borrar datos."],
  ["<code>spring.jpa.show-sql=true</code>", "Muestra en la consola cada SQL que se ejecuta. Muy útil para aprender."],
  ["<code>hibernate.format_sql=true</code>", "Imprime ese SQL con saltos de línea, más fácil de leer."]
])}
<p>Anatomía de la URL de conexión:</p>
${D.tabla(["Parte", "MySQL", "PostgreSQL"], [
  ["Protocolo", "<code>jdbc:mysql://</code>", "<code>jdbc:postgresql://</code>"],
  ["Servidor", "<code>localhost</code>", "<code>localhost</code>"],
  ["Puerto por defecto", "<code>3306</code>", "<code>5432</code>"],
  ["Base de datos", "<code>/tareasdb</code>", "<code>/tareasdb</code>"]
])}
${D.nota("cuidado", "No subas contraseñas reales a GitHub", `<p>Para clase está bien escribirlas en el archivo. En un proyecto real se leen de variables de entorno: <code>spring.datasource.password=\${DB_PASSWORD}</code>. Lo veremos en el tema de despliegue.</p>`)}

<h3>Verificar la conexión</h3>
<p>Ejecuta la aplicación. Si la conexión es correcta, en la consola verás que Hibernate crea la tabla (gracias a <code>show-sql</code>) y al final <code>Tomcat started on port 9090</code>. Si algo falla, el error suele decir exactamente qué pasa:</p>
${D.tabla(["Mensaje en la consola", "Causa probable", "Solución"], [
  ["<code>Communications link failure</code> / <code>Connection refused</code>", "El gestor no está corriendo o el puerto es otro.", "Arranca el servicio o el contenedor; revisa el puerto de la URL."],
  ["<code>Access denied for user</code> / <code>password authentication failed</code>", "Usuario o contraseña incorrectos.", "Revisa <code>username</code> y <code>password</code>; prueba entrar con ellos desde el gestor."],
  ["<code>Unknown database 'tareasdb'</code> / <code>database \"tareasdb\" does not exist</code>", "La base no existe.", "Ejecuta el script del paso 2."],
  ["<code>Failed to determine a suitable driver class</code>", "Falta la dependencia del driver o no se recargó Maven.", "Agrega el driver del paso 3 y recarga el proyecto."],
  ["<code>Port 9090 was already in use</code>", "Otra aplicación usa el puerto.", "Detén la ejecución anterior o cambia <code>server.port</code>."]
])}
${D.nota("info", "¿Y el proyecto de Magos?", `<p>Puedes moverlo a MySQL o PostgreSQL sin tocar una sola línea de Java: cambia la dependencia de H2 por el driver y reemplaza la URL de H2 en <code>application.properties</code> por la del gestor. Los datos que estaban en H2 no se copian; la tabla <code>mago</code> se crea vacía.</p>`)}

<h2>Recepción y envío de datos</h2>
<p>Un backend recibe datos del cliente, los transforma en objetos Java, los guarda o consulta, y envía de vuelta una respuesta en JSON. Spring hace casi toda la conversión por ti con la librería <strong>Jackson</strong>.</p>
<figure class="diagrama">
  <svg viewBox="0 0 720 190" role="img" aria-labelledby="dg6-t">
    <title id="dg6-t">El JSON que llega se convierte en un objeto Tarea con @RequestBody, el repositorio lo guarda con INSERT, y la Tarea guardada se convierte de nuevo en JSON para la respuesta.</title>
    <defs><marker id="pt6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-punta"/></marker></defs>
    <rect x="10" y="20" width="150" height="60" rx="10" class="dg-caja"/>
    <text x="85" y="46" text-anchor="middle" class="dg-texto">JSON recibido</text>
    <text x="85" y="66" text-anchor="middle" class="dg-sub">cuerpo del POST</text>
    <rect x="200" y="20" width="150" height="60" rx="10" class="dg-caja--marino"/>
    <text x="275" y="46" text-anchor="middle" class="dg-texto dg-texto--claro">Objeto Tarea</text>
    <text x="275" y="66" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">id = 0</text>
    <rect x="390" y="20" width="150" height="60" rx="10" class="dg-caja--marino"/>
    <text x="465" y="46" text-anchor="middle" class="dg-texto dg-texto--claro">save(tarea)</text>
    <text x="465" y="66" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">repositorio</text>
    <rect x="580" y="20" width="130" height="60" rx="10" class="dg-caja"/>
    <text x="645" y="46" text-anchor="middle" class="dg-texto">INSERT</text>
    <text x="645" y="66" text-anchor="middle" class="dg-sub">tabla tarea</text>
    <path d="M162 50H196" class="dg-flecha" marker-end="url(#pt6)"/>
    <text x="179" y="102" text-anchor="middle" class="dg-etq">@RequestBody</text>
    <path d="M352 50H386" class="dg-flecha" marker-end="url(#pt6)"/>
    <path d="M542 50H576" class="dg-flecha" marker-end="url(#pt6)"/>
    <rect x="200" y="120" width="150" height="56" rx="10" class="dg-caja--turquesa"/>
    <text x="275" y="146" text-anchor="middle" class="dg-texto dg-texto--claro">Tarea guardada</text>
    <text x="275" y="164" text-anchor="middle" class="dg-texto dg-texto--claro" style="font-weight:400;font-size:12px">id = 7</text>
    <rect x="10" y="120" width="150" height="56" rx="10" class="dg-caja"/>
    <text x="85" y="146" text-anchor="middle" class="dg-texto">JSON enviado</text>
    <text x="85" y="164" text-anchor="middle" class="dg-sub">201 Created</text>
    <path d="M645 82V148H354" class="dg-flecha" marker-end="url(#pt6)"/>
    <path d="M198 148H164" class="dg-flecha" marker-end="url(#pt6)"/>
    <text x="500" y="140" text-anchor="middle" class="dg-etq">la base asigna el id</text>
  </svg>
  <figcaption>Ida: JSON a objeto. Vuelta: objeto a JSON. El id lo pone la base de datos al insertar.</figcaption>
</figure>

<h3>Por dónde llegan los datos</h3>
${D.tabla(["Fuente", "Ejemplo", "Anotación", "Cuándo usarla"], [
  ["Ruta", "<code>/api/tarea/<strong>7</strong></code>", "<code>@PathVariable int id</code>", "Identificar un registro concreto."],
  ["Parámetro de consulta", "<code>/api/tarea?<strong>completada=true</strong></code>", "<code>@RequestParam boolean completada</code>", "Filtros, orden, búsquedas opcionales."],
  ["Cuerpo (JSON)", "<code>{ \"titulo\": \"…\" }</code>", "<code>@RequestBody Tarea tarea</code>", "Datos para crear o actualizar."]
])}

<h3>Cómo convierte Jackson el JSON</h3>
<p>Jackson empareja cada clave del JSON con un atributo de la clase usando los setters que genera Lombok. Lo que no coincide se ignora o se deja con su valor por defecto:</p>
${D.tabla(["Situación en el JSON", "Qué pasa en el objeto Java"], [
  ["La clave coincide con un atributo (<code>\"titulo\"</code>)", "Se asigna el valor."],
  ["Falta un campo de texto (<code>descripcion</code>)", "Queda en <code>null</code>."],
  ["Falta un campo numérico o booleano (<code>prioridad</code>, <code>completada</code>)", "Queda en <code>0</code> o <code>false</code> (tipos primitivos)."],
  ["Clave que no existe en la clase (<code>\"color\"</code>)", "Se ignora."],
  ["Nombre distinto (<code>\"Titulo\"</code> o <code>\"title\"</code>)", "No coincide: el atributo queda en <code>null</code>. Los nombres deben ser exactos."],
  ["Tipo incorrecto (<code>\"prioridad\": \"alta\"</code>) o JSON mal escrito", "Spring responde <code>400 Bad Request</code> antes de llegar a tu código."]
])}

<h3>Qué se envía de vuelta</h3>
<p>Lo que devuelve el método del controlador se convierte en JSON. Con <code>ResponseEntity</code> además eliges el código de estado:</p>
${D.pestanas([
  { titulo: "Objeto → JSON", html: D.codigo({ lenguaje: "json", titulo: "Respuesta de GET /api/tarea/1", completo: JSON_TAREA }) },
  { titulo: "Lista → arreglo", html: D.codigo({ lenguaje: "json", titulo: "Respuesta de GET /api/tarea", completo: `[\n  { "id": 1, "titulo": "Instalar MySQL", "descripcion": "…", "prioridad": 1, "completada": true },\n  { "id": 2, "titulo": "Configurar el proyecto", "descripcion": "…", "prioridad": 2, "completada": false }\n]` }) },
  { titulo: "Sin cuerpo", html: `<p>Con <code>ResponseEntity.noContent().build()</code> (204) o <code>ResponseEntity.notFound().build()</code> (404) solo viaja el código de estado, sin JSON.</p>` }
])}
${D.nota("info", "De Java a columnas", `<p>Hibernate convierte los nombres al crear la tabla: la clase <code>Tarea</code> se vuelve la tabla <code>tarea</code>, y un atributo como <code>fechaLimite</code> se vuelve la columna <code>fecha_limite</code>. En el JSON, en cambio, se mantiene <code>fechaLimite</code>.</p>`)}

<h2>Operaciones CRUD</h2>
<p>CRUD son las cuatro operaciones básicas sobre datos. En una API REST cada una tiene su método HTTP, su método del repositorio y su sentencia SQL:</p>
${D.tabla(["CRUD", "HTTP", "Repositorio", "SQL que genera Hibernate", "Respuesta"], [
  ["Create", D.metodo("POST") + " <code>/api/tarea</code>", "<code>save(tarea)</code> con id 0", "<code>INSERT INTO tarea (…) VALUES (…)</code>", "201"],
  ["Read", D.metodo("GET") + " <code>/api/tarea</code>", "<code>findAll()</code>", "<code>SELECT … FROM tarea</code>", "200"],
  ["Read", D.metodo("GET") + " <code>/api/tarea/{id}</code>", "<code>findById(id)</code>", "<code>SELECT … WHERE id = ?</code>", "200 o 404"],
  ["Update", D.metodo("PUT") + " <code>/api/tarea/{id}</code>", "<code>findById</code> + <code>save(existente)</code>", "<code>SELECT</code> y luego <code>UPDATE tarea SET … WHERE id = ?</code>", "200 o 404"],
  ["Delete", D.metodo("DELETE") + " <code>/api/tarea/{id}</code>", "<code>existsById</code> + <code>deleteById(id)</code>", "<code>DELETE FROM tarea WHERE id = ?</code>", "204 o 404"]
])}
${D.nota("info", "save sirve para crear y para actualizar", `<p><code>save</code> decide según el id: si el id es 0 (o no existe en la tabla) hace un <code>INSERT</code>; si ya existe, hace un <code>UPDATE</code>. Por eso en <code>crear</code> forzamos <code>id = 0</code>: si el cliente enviara <code>"id": 3</code> por error, sin esa línea se sobrescribiría la tarea 3.</p>`)}

<h2>Taller guiado: API de Tareas</h2>
<p>Vamos a construir un CRUD sencillo de tareas pendientes conectado a MySQL o PostgreSQL. Cada tarea tiene título, descripción, prioridad (1 alta, 2 media, 3 baja) y si está completada.</p>
${D.pasos([
  "<strong>Crea el proyecto</strong> en start.spring.io: Group <code>com.jr</code>, Artifact <code>tareas</code>, Java 17, con las dependencias <strong>Spring Web</strong>, <strong>Spring Data JPA</strong>, <strong>Lombok</strong> y <strong>MySQL Driver</strong> o <strong>PostgreSQL Driver</strong>.",
  "<strong>Prepara la base</strong> (Docker o script) y escribe <code>application.properties</code> como en la sección de configuración.",
  "<strong>Crea los cuatro paquetes</strong> dentro de <code>com.jr.tareas</code>: <code>model</code>, <code>repository</code>, <code>service</code> y <code>controller</code>.",
  "<strong>Escribe cada capa</strong> siguiendo los bloques de abajo, en ese orden.",
  "<strong>Prueba</strong> con Postman o curl y <strong>revisa la tabla</strong> en el gestor."
])}
${D.arbol(`
tareas/
├── pom.xml
└── src/main/
    ├── java/com/jr/tareas/
    │   ├── TareasApplication.java
    │   ├── model/Tarea.java
    │   ├── repository/TareaRepository.java
    │   ├── service/TareaService.java
    │   └── controller/TareaController.java
    └── resources/application.properties`)}

<h3>Paso 1: el modelo</h3>
<p>Al arrancar la aplicación con esta clase, Hibernate crea la tabla <code>tarea</code> en tu gestor. Revisa la consola: verás el <code>create table</code>.</p>
${D.codigo({ archivo: "model/Tarea.java", completo: MODELO, prueba: MODELO_P })}

<h3>Paso 2: el repositorio</h3>
${D.codigo({ archivo: "repository/TareaRepository.java", completo: REPO })}

<h3>Paso 3: el servicio</h3>
<p>Fíjate en <code>crear</code>: es la única diferencia con el proyecto de Magos, y evita sobrescribir una tarea si el JSON trae un id.</p>
${D.codigo({ archivo: "service/TareaService.java", completo: SERV, prueba: SERV_P })}

<h3>Paso 4: el controlador</h3>
${D.codigo({ archivo: "controller/TareaController.java", completo: CTRL, prueba: CTRL_P })}

<h3>Paso 5: probar el CRUD</h3>
<p>Ejecuta estas peticiones en orden. Después de cada una, mira en la consola el SQL que generó Hibernate.</p>
${D.pestanas([
  { titulo: "Create", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo:
    curlJson("POST", "/api/tarea", '{"titulo": "Instalar MySQL", "descripcion": "Crear la base tareasdb y el usuario tareas", "prioridad": 1, "completada": false}') + "\n\n" +
    curlJson("POST", "/api/tarea", '{"titulo": "Configurar el proyecto", "descripcion": "Driver y application.properties", "prioridad": 2, "completada": false}') + "\n# Esperado: 201 Created con el id asignado" }) },
  { titulo: "Read", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `curl -i ${URL()}/api/tarea\n# 200 con las dos tareas\n\ncurl -i ${URL()}/api/tarea/1\n# 200 con la tarea 1\n\ncurl -i ${URL()}/api/tarea/99\n# 404` }) },
  { titulo: "Update", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo:
    curlJson("PUT", "/api/tarea/1", '{"titulo": "Instalar MySQL", "descripcion": "Listo con Docker", "prioridad": 1, "completada": true}') + "\n# 200 con la tarea actualizada" }) },
  { titulo: "Delete", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `curl -i -X DELETE ${URL()}/api/tarea/2\n# 204\n\ncurl -i -X DELETE ${URL()}/api/tarea/2\n# 404: ya no existe` }) }
])}

<h3>Paso 6: ver los datos en el gestor</h3>
<p>Conéctate con MySQL Workbench, pgAdmin o DBeaver usando el usuario <code>tareas</code> y comprueba que lo hecho desde la API está en la tabla:</p>
${D.codigo({ lenguaje: "sql", titulo: "Consultas de verificación", completo: `
SELECT * FROM tarea;

SELECT titulo, prioridad FROM tarea WHERE completada = false ORDER BY prioridad;

-- Inserta desde SQL y luego consulta GET /api/tarea: también aparece
INSERT INTO tarea (titulo, descripcion, prioridad, completada)
VALUES ('Tarea desde SQL', 'Creada en el gestor', 3, false);` })}
${D.nota("consejo", "La prueba de fuego", `<p>Detén la aplicación, vuelve a arrancarla y consulta <code>GET /api/tarea</code>. Los datos siguen ahí porque viven en el servidor de base de datos, no en la aplicación.</p>`)}

<h3>Retos del taller</h3>
<p>Si terminaste, agrega estas funciones aplicando lo visto sobre recepción de datos:</p>
${D.pasos([
  "<code>GET /api/tarea/pendientes</code>: solo las tareas con <code>completada = false</code>, ordenadas por prioridad.",
  "<code>GET /api/tarea/buscar?texto=mysql</code>: tareas cuyo título contenga el texto, sin importar mayúsculas.",
  "<code>PUT /api/tarea/{id}/completar</code>: marca la tarea como completada sin enviar cuerpo (200 o 404)."
])}
${D.soloCompleto(D.pestanas([
  { titulo: "Repositorio", html: D.codigo({ archivo: "repository/TareaRepository.java", completo: `
public interface TareaRepository extends JpaRepository<Tarea, Integer> {

    // SELECT * FROM tarea WHERE completada = false ORDER BY prioridad
    List<Tarea> findByCompletadaFalseOrderByPrioridadAsc();

    // SELECT * FROM tarea WHERE UPPER(titulo) LIKE UPPER('%texto%')
    List<Tarea> findByTituloContainingIgnoreCase(String texto);
}` }) },
  { titulo: "Servicio", html: D.codigo({ archivo: "service/TareaService.java", completo: `
    public List<Tarea> pendientes() {
        return tareaRepository.findByCompletadaFalseOrderByPrioridadAsc();
    }

    public List<Tarea> buscar(String texto) {
        return tareaRepository.findByTituloContainingIgnoreCase(texto);
    }

    public Optional<Tarea> completar(int id) {
        return tareaRepository.findById(id)
                .map(t -> {
                    t.setCompletada(true);
                    return tareaRepository.save(t);
                });
    }` }) },
  { titulo: "Controlador", html: D.codigo({ archivo: "controller/TareaController.java", completo: `
    @GetMapping("/pendientes")
    public List<Tarea> pendientes() {
        return tareaService.pendientes();
    }

    @GetMapping("/buscar")
    public List<Tarea> buscar(@RequestParam String texto) {
        return tareaService.buscar(texto);
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<Tarea> completar(@PathVariable int id) {
        return tareaService.completar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }` }) }
]), `<p class="respuesta-oculta">Solución oculta durante la evaluación.</p>`)}

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "Si cambias de H2 a PostgreSQL, ¿qué archivos del proyecto modificas?", r: "<p>Solo dos: <code>pom.xml</code> (reemplazar H2 por el driver de PostgreSQL) y <code>application.properties</code> (URL, usuario y contraseña). Las clases Java no cambian gracias a JPA.</p>" },
  { p: "Arrancas la aplicación y aparece <code>Access denied for user 'tareas'@'localhost'</code>. ¿Qué revisas?", r: "<p>El usuario y la contraseña en <code>application.properties</code>, y que ese usuario exista en MySQL con permisos sobre <code>tareasdb</code>.</p>" },
  { p: "Envías un POST con <code>{\"Titulo\": \"Leer\"}</code> y la tarea se guarda con título <code>null</code>. ¿Por qué?", r: "<p>Jackson empareja los nombres de forma exacta: <code>Titulo</code> no coincide con el atributo <code>titulo</code>, así que se ignora.</p>" },
  { p: "¿Por qué el método <code>crear</code> del servicio pone <code>id = 0</code> antes de guardar?", r: "<p>Porque <code>save</code> hace un <code>UPDATE</code> si el id ya existe. Forzar 0 garantiza un <code>INSERT</code> aunque el cliente envíe un id por error.</p>" },
  { p: "¿Qué SQL genera <code>DELETE /api/tarea/5</code> cuando la tarea existe?", r: "<p>Primero una consulta para comprobar que existe (<code>existsById</code>) y luego <code>DELETE FROM tarea WHERE id = 5</code>. La API responde 204.</p>" }
])}
`
  });
})();
