Docs.registrar("spring-boot", {
  titulo: "Introducción a Spring Boot",
  resumen: "Qué es un framework, qué nos ahorra Spring Boot, cómo preparar el entorno y cómo crear y ejecutar el primer proyecto.",
  render: () => `
<h2>Frameworks backend y sus ventajas</h2>
<p>Un <strong>framework</strong> es un esqueleto de aplicación ya resuelto: trae la conexión a la red, el manejo de peticiones HTTP, la conversión a JSON y el acceso a datos. Tú escribes solo la parte propia de tu problema.</p>
<p><strong>Spring</strong> es el framework más usado en Java para backend. <strong>Spring Boot</strong> es la forma rápida de usarlo: configura casi todo por ti.</p>
${D.tabla(["Ventaja", "Qué significa en la práctica"], [
  ["Autoconfiguración", "Si agregas la dependencia de H2, Spring Boot crea la conexión sin que escribas código de conexión."],
  ["Servidor incluido", "Trae Tomcat adentro. Ejecutas la aplicación y ya escucha peticiones; no instalas un servidor aparte."],
  ["Starters", "Paquetes de dependencias listos: <code>webmvc</code> para la API, <code>data-jpa</code> para la base de datos."],
  ["Anotaciones", "Con <code>@RestController</code> o <code>@GetMapping</code> le dices a Spring qué hace cada clase o método."],
  ["Comunidad", "Mucha documentación, ejemplos y ofertas de trabajo."]
])}

<h2>Instalación del entorno</h2>
${D.tabla(["Herramienta", "Para qué", "Recomendación"], [
  ["JDK", "Compilar y ejecutar Java", "JDK 17 o superior (el proyecto usa <code>java.version</code> 17)."],
  ["IDE", "Escribir y ejecutar el código", "IntelliJ IDEA Community o VS Code con el Extension Pack for Java."],
  ["Maven", "Descargar dependencias y construir", "No hace falta instalarlo: el proyecto trae <code>mvnw</code> (Maven Wrapper)."],
  ["Postman", "Probar la API", "Cualquier versión reciente."]
])}
<p>Verifica que Java quedó instalado:</p>
${D.codigo({ lenguaje: "bash", titulo: "Terminal", completo: `
java -version
# Debe mostrar 17 o un número mayor` })}

<h2>Creación del primer proyecto</h2>
<p>Los proyectos se generan en <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> (Spring Initializr). Estos son los valores que usamos en el ejercicio de clase:</p>
${D.tabla(["Campo", "Valor", "Significado"], [
  ["Project", "Maven", "Herramienta que gestiona dependencias y construcción."],
  ["Language", "Java", ""],
  ["Spring Boot", "La versión estable más reciente", "El ejercicio usa la 4.1.2."],
  ["Group", "<code>com.jr</code>", "Identifica a la organización; define el paquete base."],
  ["Artifact", "<code>app3</code>", "Nombre del proyecto."],
  ["Packaging", "Jar", "Se empaqueta como un archivo ejecutable."],
  ["Java", "17", "Versión de Java del proyecto."]
])}
<p>Dependencias que agregamos con <strong>Add dependencies</strong>:</p>
${D.tabla(["Dependencia", "Para qué sirve"], [
  ["Spring Web", "Crear controladores y endpoints REST. Incluye Tomcat y la conversión a JSON."],
  ["Spring Data JPA", "Guardar y consultar objetos Java en una base de datos sin escribir SQL a mano."],
  ["H2 Database", "Base de datos ligera que se guarda en un archivo dentro del proyecto."],
  ["Lombok", "Genera getters, setters y otros métodos repetitivos con una anotación."]
])}
<p>Pulsa <strong>Generate</strong>, descomprime el zip y ábrelo en el IDE. La estructura queda así:</p>
${D.arbol(`
app3/
├── pom.xml                      Dependencias y configuración de Maven
├── mvnw, mvnw.cmd               Maven Wrapper (Linux/Mac y Windows)
└── src/
    ├── main/
    │   ├── java/com/jr/app3/
    │   │   └── App3Application.java   Punto de arranque
    │   └── resources/
    │       └── application.properties Configuración (puerto, base de datos)
    └── test/                          Pruebas automáticas`)}

<h3>La clase principal</h3>
<p>Spring Initializr crea esta clase. Su método <code>main</code> arranca todo: el servidor, la conexión a la base de datos y tus controladores.</p>
${D.codigo({ archivo: "src/main/java/com/jr/app3/App3Application.java", completo: `
package com.jr.app3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App3Application {

    public static void main(String[] args) {
        SpringApplication.run(App3Application.class, args);
    }

}`, prueba: `
package com.jr.app3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App3Application {

    public static void main(String[] args) {
        // TODO: arranca la aplicación Spring Boot
    }

}` })}
${D.nota("info", "¿Qué hace @SpringBootApplication?", `<p>Activa la autoconfiguración y le dice a Spring que busque clases anotadas (<code>@RestController</code>, <code>@Service</code>…) <strong>en este paquete y sus subpaquetes</strong>. Por eso los paquetes <code>controller</code>, <code>service</code>, etc. deben estar dentro de <code>com.jr.app3</code>.</p>`)}

<h3>El archivo pom.xml</h3>
<p>Lista las dependencias. Maven las descarga la primera vez que ejecutas el proyecto. Este es el bloque de dependencias del ejercicio:</p>
${D.codigo({ archivo: "pom.xml", lenguaje: "xml", completo: `
<dependencies>
    <!-- Consola web para ver la base H2 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-h2console</artifactId>
    </dependency>
    <!-- JPA: guardar objetos en la base de datos -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <!-- Web: controladores REST y servidor Tomcat -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
    <!-- Motor de base de datos H2 -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <!-- Lombok: genera getters y setters -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>` })}

<h2>Hola mundo en Spring Boot</h2>
<p>Crea el paquete <code>controller</code> dentro de <code>com.jr.app3</code> y agrega esta clase:</p>
${D.pestanas([
  { titulo: "HolaController.java", html: D.codigo({ archivo: "src/main/java/com/jr/app3/controller/HolaController.java", completo: `
package com.jr.app3.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    // GET http://localhost:9090/hola
    @GetMapping("/hola")
    public String hola() {
        return "¡Hola mundo desde Spring Boot!";
    }

    // GET http://localhost:9090/saludo?nombre=Ana
    @GetMapping("/saludo")
    public String saludo(@RequestParam(defaultValue = "estudiante") String nombre) {
        return "Hola, " + nombre;
    }
}`, prueba: `
package com.jr.app3.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    // GET http://localhost:9090/hola
    @GetMapping("/hola")
    public String hola() {
        // TODO: devuelve un texto de saludo
    }

    // GET http://localhost:9090/saludo?nombre=Ana
    @GetMapping("/saludo")
    public String saludo(/* TODO: recibe el parámetro "nombre" de la URL */) {
        // TODO: devuelve "Hola, " + nombre
    }
}` }) },
  { titulo: "Probar", html: D.codigo({ lenguaje: "bash", titulo: "Terminal (curl)", completo: `
curl http://localhost:9090/hola
# ¡Hola mundo desde Spring Boot!

curl "http://localhost:9090/saludo?nombre=Ana"
# Hola, Ana` }) }
])}

<h3>Ejecutar el proyecto</h3>
<p>Desde el IDE, ejecuta el método <code>main</code> de <code>App3Application</code>. O desde la terminal, en la carpeta del proyecto:</p>
${D.pestanas([
  { titulo: "Linux / Mac", html: D.codigo({ lenguaje: "bash", titulo: "Terminal", completo: `./mvnw spring-boot:run` }) },
  { titulo: "Windows", html: D.codigo({ lenguaje: "bash", titulo: "CMD o PowerShell", completo: `mvnw.cmd spring-boot:run` }) }
])}
<p>Cuando veas en la consola una línea parecida a <code>Tomcat started on port 9090</code>, la aplicación está lista. El puerto se define en <code>application.properties</code>:</p>
${D.codigo({ archivo: "src/main/resources/application.properties", lenguaje: "ini", completo: `
spring.application.name=app3
server.port=9090` })}
${D.nota("cuidado", "Errores frecuentes al arrancar", `
<p><strong>Port 9090 was already in use:</strong> ya hay otra aplicación (o una ejecución anterior) usando ese puerto. Detén la anterior o cambia <code>server.port</code>.</p>
<p><strong>404 al visitar /hola:</strong> el controlador está fuera del paquete <code>com.jr.app3</code> o le falta <code>@RestController</code>.</p>`)}

<h2>Autoevaluación</h2>
${D.autoevaluacion([
  { p: "¿Por qué no necesitamos instalar Tomcat por separado?", r: "<p>Porque Spring Boot lo trae incluido dentro de la dependencia web. Al ejecutar <code>main</code>, el servidor arranca solo.</p>" },
  { p: "Creaste un controlador en el paquete <code>com.otro.prueba</code> y Spring no lo encuentra. ¿Por qué?", r: "<p><code>@SpringBootApplication</code> solo busca componentes en el paquete de la clase principal (<code>com.jr.app3</code>) y sus subpaquetes.</p>" },
  { p: "¿Qué dependencia agrega los controladores REST?", r: "<p>Spring Web (<code>spring-boot-starter-webmvc</code>).</p>" }
])}
`
});
