/* =========================================================================
   TEMARIO POR TEMAS
   - Cada tema tiene un "id". Si existe una página registrada con ese id
     (archivo en /contenido), el tema aparece como disponible.
   - Si no existe, se muestra como "Próximamente" con sus subtemas.
   - "hijos" crea subpáginas dentro de un tema (por ejemplo, un ejercicio).
   ========================================================================= */
window.TEMARIO = [
  {
    unidad: "Desarrollo de APIs RESTful",
    descripcion: "Arquitectura cliente-servidor, fundamentos de REST, estructura de un proyecto backend y operaciones CRUD.",
    temas: [
      { id: "backend", titulo: "Introducción al desarrollo backend",
        subtemas: ["¿Qué es el backend y qué hace?", "Arquitectura cliente-servidor", "Aplicaciones web estáticas y dinámicas"] },
      { id: "http-rest", titulo: "Protocolo HTTP y APIs REST",
        subtemas: ["Petición y respuesta HTTP", "Métodos GET, POST, PUT y DELETE", "Códigos de estado y rutas"] },
      { id: "spring-boot", titulo: "Introducción a Spring Boot",
        subtemas: ["Frameworks backend y sus ventajas", "Instalación del entorno (JDK, IDE, Maven)", "Creación del primer proyecto"] },
      { id: "mvc", titulo: "Patrón MVC y estructura del proyecto",
        subtemas: ["Modelo, vista y controlador", "Organización por capas: controller, service, repository", "Controladores y rutas"] },
      { id: "mago", titulo: "Ejercicio guiado: API de Magos", ejercicio: true,
        hijos: [
          { id: "mago", titulo: "Visión general" },
          { id: "mago-modelo", titulo: "Modelo: Mago" },
          { id: "mago-repositorio", titulo: "Repositorio" },
          { id: "mago-servicio", titulo: "Servicio" },
          { id: "mago-controlador", titulo: "Controlador" },
          { id: "mago-h2", titulo: "Base de datos H2" },
          { id: "mago-pruebas", titulo: "Probar la API" },
          { id: "mago-completo", titulo: "Código completo" }
        ] },
      { id: "base-datos-crud", titulo: "Conexión a base de datos y operaciones CRUD",
        subtemas: ["Configuración de la conexión a MySQL/PostgreSQL", "Recepción y envío de datos", "Operaciones CRUD"] }
    ]
  },
  {
    unidad: "Seguridad e integración de datos",
    descripcion: "Persistencia con ORM, relaciones, validación de datos, manejo de errores, autenticación y autorización.",
    temas: [
      { id: "jpa", titulo: "Persistencia con JPA/Hibernate",
        subtemas: ["¿Qué es un ORM?", "Entidades y repositorios", "CRUD con Spring Data JPA"] },
      { id: "relaciones", titulo: "Relaciones entre entidades",
        subtemas: ["Relación uno a muchos", "Relación muchos a muchos", "Consultas con datos relacionados"] },
      { id: "validacion", titulo: "Validación de datos",
        subtemas: ["Importancia de validar la información", "Anotaciones de validación (@NotBlank, @Size, @Email)", "Formularios con campos validados"] },
      { id: "errores", titulo: "Manejo de errores",
        subtemas: ["Errores comunes en una API", "Manejo centralizado de excepciones", "Respuestas HTTP claras al usuario"] },
      { id: "spring-security", titulo: "Seguridad básica con Spring Security",
        subtemas: ["Principales vulnerabilidades web", "Autenticación de usuarios y contraseñas cifradas", "Roles y acceso a rutas"] }
    ]
  },
  {
    unidad: "Integración de backend con frontend",
    descripcion: "Intercambio de datos en JSON, peticiones HTTP desde el frontend, seguridad en el cliente, reportes y despliegue.",
    temas: [
      { id: "json", titulo: "Intercambio de datos con JSON",
        subtemas: ["Estructura de un JSON", "Envío y recepción de JSON en la API", "Documentación de endpoints"] },
      { id: "fetch", titulo: "Peticiones HTTP desde el frontend",
        subtemas: ["Introducción a JavaScript asíncrono", "Consumo de la API con Fetch", "Configuración de CORS"] },
      { id: "crud-frontend", titulo: "Consumo del CRUD desde la interfaz",
        subtemas: ["Formularios conectados a la API", "Listado, edición y eliminación de registros", "Mensajes de éxito y error"] },
      { id: "seguridad-frontend", titulo: "Seguridad en el frontend",
        subtemas: ["Inicio de sesión desde la interfaz", "Envío del token en las peticiones", "Buenas prácticas de seguridad en el cliente"] },
      { id: "reportes", titulo: "Generación de reportes",
        subtemas: ["¿Para qué sirven los reportes?", "Generación de reportes en PDF desde el backend", "Descarga del reporte desde la interfaz"] },
      { id: "despliegue", titulo: "Despliegue básico de la aplicación",
        subtemas: ["Empaquetado del proyecto (JAR)", "Configuración y variables de entorno", "Publicación en un servidor o servicio en la nube"] },
      { id: "pruebas", titulo: "Pruebas e integración del proyecto",
        subtemas: ["Pruebas de funcionamiento del sistema", "Corrección de errores frecuentes"] }
    ]
  },
  {
    unidad: "Referencia",
    referencia: true,
    temas: [
      { id: "anotaciones", titulo: "Anotaciones de Spring" }
    ]
  }
];
