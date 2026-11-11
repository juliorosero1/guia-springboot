/* =========================================================================
   SIMULADOR DE LA API DE MAGOS
   Reproduce en el navegador lo que hace el proyecto real (Controller ->
   Service -> Repository -> H2) para que se vea el recorrido de cada petición.
   Los datos viven solo en esta pestaña del navegador.
   ========================================================================= */
(function () {
  "use strict";
  const esc = D.esc;
  const URL_BASE = (window.CONFIG && CONFIG.urlBase) || "http://localhost:9090";

  /* ---------- "Base de datos" en memoria ---------- */
  const INICIALES = [
    { id: 1, nombre: "Merlín", fuerza: 350 },
    { id: 2, nombre: "Morgana", fuerza: 280.5 },
    { id: 3, nombre: "Aprendiz Tomás", fuerza: 75 }
  ];
  let tabla, siguienteId;
  function reiniciar() {
    tabla = INICIALES.map((m) => ({ ...m }));
    siguienteId = 4;
  }
  reiniciar();

  // Jackson escribe los double con decimal: 350 -> 350.0
  const num = (n) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
  function magoJSON(m, sangria = "") {
    return `${sangria}{\n${sangria}  "id": ${m.id},\n${sangria}  "nombre": ${m.nombre === null ? "null" : JSON.stringify(m.nombre)},\n${sangria}  "fuerza": ${num(m.fuerza)}\n${sangria}}`;
  }
  const listaJSON = (l) => (l.length ? `[\n${l.map((m) => magoJSON(m, "  ")).join(",\n")}\n]` : "[]");
  const errorSpring = (estado, error, ruta) =>
    `{\n  "timestamp": "${new Date().toISOString()}",\n  "status": ${estado},\n  "error": "${error}",\n  "path": "${ruta}"\n}`;

  /* ---------- Peticiones de ejemplo ---------- */
  const EJEMPLOS = [
    { nombre: "Ver todos los magos", metodo: "GET", ruta: "/api/mago" },
    { nombre: "Traer un mago por id", metodo: "GET", ruta: "/api/mago/1" },
    { nombre: "Guardar un mago nuevo", metodo: "POST", ruta: "/api/mago", cuerpo: '{\n  "nombre": "Gandolfo",\n  "fuerza": 420.0\n}' },
    { nombre: "Editar un mago", metodo: "PUT", ruta: "/api/mago/3", cuerpo: '{\n  "nombre": "Tomás el Sabio",\n  "fuerza": 210.0\n}' },
    { nombre: "Eliminar un mago", metodo: "DELETE", ruta: "/api/mago/2" },
    { nombre: "Magos fuertes (fuerza > 200)", metodo: "GET", ruta: "/api/mago/fuertes" },
    { nombre: "Error: id que no existe", metodo: "GET", ruta: "/api/mago/99" },
    { nombre: "Error: id que no es número", metodo: "GET", ruta: "/api/mago/abc" },
    { nombre: "Error: PUT sin todos los campos", metodo: "PUT", ruta: "/api/mago/1", cuerpo: '{\n  "fuerza": 500.0\n}' }
  ];

  /* ---------- Lógica: igual que el proyecto real ---------- */
  function leerCuerpo(texto) {
    if (!texto || !texto.trim()) return { error: "El cuerpo está vacío. Este método necesita un JSON con el mago." };
    let obj;
    try { obj = JSON.parse(texto); } catch (e) { return { error: "El JSON está mal escrito (revisa comillas, comas y llaves)." }; }
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return { error: "Se esperaba un objeto JSON { ... } con los datos de un mago." };
    let fuerza = 0;
    if (obj.fuerza !== undefined && obj.fuerza !== null) {
      fuerza = Number(obj.fuerza);
      if (typeof obj.fuerza === "boolean" || Number.isNaN(fuerza)) return { error: "\"fuerza\" debe ser un número." };
    }
    const nombre = obj.nombre === undefined || obj.nombre === null ? null : String(obj.nombre);
    return { mago: { id: Number(obj.id) || 0, nombre, fuerza } };
  }

  function procesar(metodo, ruta, cuerpo) {
    const p = [];
    const paso = (capa, texto) => p.push({ capa, texto });
    const resp = (estado, textoEstado, body, nota) => ({ pasos: p, estado, textoEstado, body, nota });
    ruta = ruta.trim().split("?")[0] || "/";
    if (!ruta.startsWith("/")) ruta = "/" + ruta;
    paso("cliente", `${metodo} ${ruta}`);

    const raiz = /^\/api\/mago\/?$/.test(ruta);
    const conId = ruta.match(/^\/api\/mago\/([^/]+)\/?$/);

    if (!raiz && !conId) {
      paso("controller", `Ningún controlador tiene una ruta que coincida con ${ruta}`);
      return resp(404, "Not Found", errorSpring(404, "Not Found", ruta), "La ruta no existe. Spring responde con su página de error en JSON.");
    }

    if (raiz) {
      if (metodo === "GET") {
        paso("controller", "@GetMapping  verTodos()");
        paso("service", "traerTodos()");
        paso("repository", "findAll()");
        paso("bd", "SELECT * FROM mago");
        return resp(200, "OK", listaJSON(tabla));
      }
      if (metodo === "POST") {
        const c = leerCuerpo(cuerpo);
        if (c.error) {
          paso("controller", "@RequestBody no pudo convertir el JSON en un Mago");
          return resp(400, "Bad Request", errorSpring(400, "Bad Request", ruta), c.error);
        }
        paso("controller", "@PostMapping  guardar(@RequestBody Mago mago)");
        paso("service", "guardar(mago)");
        paso("repository", "save(mago)");
        const nuevo = { id: siguienteId++, nombre: c.mago.nombre, fuerza: c.mago.fuerza };
        tabla.push(nuevo);
        paso("bd", `INSERT INTO mago (nombre, fuerza) VALUES (${nuevo.nombre === null ? "NULL" : "'" + nuevo.nombre + "'"}, ${num(nuevo.fuerza)})  -> id ${nuevo.id}`);
        let nota = "La base de datos generó el id automáticamente (@GeneratedValue).";
        if (c.mago.id) nota = "No envíes \"id\" al guardar: lo genera la base de datos. En el proyecto real puede provocar un error.";
        if (nuevo.nombre === null) nota = "Faltó \"nombre\" en el JSON y se guardó como null. Más adelante, en el tema de validación de datos, aprenderemos a evitarlo.";
        return resp(201, "Created", magoJSON(nuevo), nota);
      }
      paso("controller", `No hay un método ${metodo} para /api/mago (solo GET y POST)`);
      return resp(405, "Method Not Allowed", errorSpring(405, "Method Not Allowed", ruta), "La ruta existe, pero no acepta ese método HTTP.");
    }

    // /api/mago/{algo}
    const segmento = decodeURIComponent(conId[1]);
    if (segmento === "fuertes" && metodo === "GET") {
      paso("controller", "@GetMapping(\"/fuertes\")  mejores()");
      paso("service", "fuertes()  filtra fuerza > 200");
      paso("repository", "findAll()");
      paso("bd", "SELECT * FROM mago");
      return resp(200, "OK", listaJSON(tabla.filter((m) => m.fuerza > 200)), "La ruta fija /fuertes tiene prioridad sobre /{id}.");
    }
    if (!["GET", "PUT", "DELETE"].includes(metodo)) {
      paso("controller", `No hay un método ${metodo} para /api/mago/{id}`);
      return resp(405, "Method Not Allowed", errorSpring(405, "Method Not Allowed", ruta), "La ruta existe, pero no acepta ese método HTTP.");
    }
    if (!/^-?\d+$/.test(segmento) || Math.abs(Number(segmento)) > 2147483647) {
      paso("controller", `@PathVariable int id no puede convertir "${segmento}" en un número`);
      return resp(400, "Bad Request", errorSpring(400, "Bad Request", ruta), "El id de la ruta debe ser un número entero.");
    }
    const id = Number(segmento);
    const existente = tabla.find((m) => m.id === id);

    if (metodo === "GET") {
      paso("controller", `@GetMapping("/{id}")  traerUno(${id})`);
      paso("service", `traerUno(${id})  devuelve Optional<Mago>`);
      paso("repository", `findById(${id})`);
      paso("bd", `SELECT * FROM mago WHERE id = ${id}`);
      if (!existente) return resp(404, "Not Found", null, "Optional vacío: el controlador responde ResponseEntity.notFound() sin cuerpo.");
      return resp(200, "OK", magoJSON(existente), "Optional con valor: el controlador responde ResponseEntity.ok(mago).");
    }

    if (metodo === "PUT") {
      const c = leerCuerpo(cuerpo);
      if (c.error) {
        paso("controller", "@RequestBody no pudo convertir el JSON en un Mago");
        return resp(400, "Bad Request", errorSpring(400, "Bad Request", ruta), c.error);
      }
      paso("controller", `@PutMapping("/{id}")  editar(${id}, mago)`);
      paso("service", `editar(${id}, magoActualizado)`);
      paso("repository", `findById(${id})${existente ? "  luego save(magoExiste)" : ""}`);
      if (!existente) {
        paso("bd", `SELECT * FROM mago WHERE id = ${id}  (sin resultados)`);
        return resp(404, "Not Found", null, "No existe ese mago, así que no hay nada que editar.");
      }
      existente.nombre = c.mago.nombre;
      existente.fuerza = c.mago.fuerza;
      paso("bd", `UPDATE mago SET nombre = ${existente.nombre === null ? "NULL" : "'" + existente.nombre + "'"}, fuerza = ${num(existente.fuerza)} WHERE id = ${id}`);
      let nota = "El servicio copia nombre y fuerza sobre el mago que ya existía y lo guarda.";
      if (c.mago.nombre === null) nota = "Ojo: el JSON no traía \"nombre\" y el servicio copió null. PUT reemplaza todos los campos que el servicio actualiza.";
      return resp(200, "OK", magoJSON(existente), nota);
    }

    // DELETE
    paso("controller", `@DeleteMapping("/{id}")  eliminar(${id})`);
    paso("service", `eliminar(${id})  devuelve ${existente ? "true" : "false"}`);
    paso("repository", existente ? `existsById(${id}) -> true, deleteById(${id})` : `existsById(${id}) -> false`);
    if (!existente) {
      paso("bd", `SELECT COUNT(*) FROM mago WHERE id = ${id}  -> 0`);
      return resp(404, "Not Found", null, "El servicio devolvió false y el controlador respondió 404.");
    }
    tabla = tabla.filter((m) => m.id !== id);
    paso("bd", `DELETE FROM mago WHERE id = ${id}`);
    return resp(204, "No Content", null, "Se eliminó. 204 significa que salió bien y no hay cuerpo que devolver.");
  }

  /* ---------- Interfaz ---------- */
  const CAPAS = [
    ["cliente", "Cliente"],
    ["controller", "MagoController"],
    ["service", "MagoService"],
    ["repository", "MagoRepository"],
    ["bd", "H2: tabla MAGO"]
  ];

  function montar(nodo) {
    if (nodo.dataset.listo) return;
    nodo.dataset.listo = "1";
    nodo.innerHTML = `
      <div class="sim-peticion">
        <label class="sim-campo"><span>Ejemplo</span>
          <select data-s="ejemplo">${EJEMPLOS.map((e, i) => `<option value="${i}">${esc(e.nombre)}</option>`).join("")}</select>
        </label>
        <div class="sim-linea">
          <label class="visually-hidden" for="sim-metodo">Método</label>
          <select id="sim-metodo" data-s="metodo">${["GET", "POST", "PUT", "DELETE"].map((m) => `<option>${m}</option>`).join("")}</select>
          <span class="sim-base">${esc(URL_BASE)}</span>
          <label class="visually-hidden" for="sim-ruta">Ruta</label>
          <input id="sim-ruta" data-s="ruta" spellcheck="false" autocomplete="off">
        </div>
        <label class="sim-campo" data-s="campo-cuerpo"><span>Cuerpo (JSON)</span>
          <textarea data-s="cuerpo" rows="5" spellcheck="false"></textarea>
        </label>
        <div class="sim-acciones">
          <button type="button" class="btn btn--primario" data-s="enviar">Enviar petición</button>
          <button type="button" class="btn" data-s="reiniciar">Reiniciar datos</button>
        </div>
      </div>
      <ol class="sim-capas" data-s="capas">${CAPAS.map(([id, n]) => `<li data-capa="${id}"><span class="sim-capa-nombre">${n}</span><span class="sim-capa-detalle"></span></li>`).join("")}</ol>
      <div class="sim-respuesta" data-s="respuesta" aria-live="polite">
        <p class="sim-vacio">Elige un ejemplo y pulsa <strong>Enviar petición</strong> para ver por qué capas pasa.</p>
      </div>
      <details class="sim-tabla"><summary>Ver la tabla MAGO</summary><div data-s="tabla"></div></details>`;

    const s = (n) => nodo.querySelector(`[data-s="${n}"]`);
    const selEj = s("ejemplo"), selM = s("metodo"), inRuta = s("ruta"), taCuerpo = s("cuerpo");
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ocupado = false;

    function pintarTabla() {
      s("tabla").innerHTML = D.tabla(["ID", "NOMBRE", "FUERZA"],
        tabla.map((m) => [m.id, m.nombre === null ? "<em>null</em>" : esc(m.nombre), num(m.fuerza)]));
    }
    function ajustarCuerpo() {
      const usa = selM.value === "POST" || selM.value === "PUT";
      s("campo-cuerpo").hidden = !usa;
    }
    function cargarEjemplo() {
      const e = EJEMPLOS[Number(selEj.value)];
      selM.value = e.metodo;
      inRuta.value = e.ruta;
      taCuerpo.value = e.cuerpo || "";
      ajustarCuerpo();
    }
    selEj.addEventListener("change", cargarEjemplo);
    selM.addEventListener("change", ajustarCuerpo);
    s("reiniciar").addEventListener("click", () => {
      reiniciar(); pintarTabla();
      s("respuesta").innerHTML = `<p class="sim-vacio">Datos reiniciados: la tabla vuelve a tener 3 magos.</p>`;
      nodo.querySelectorAll("[data-capa]").forEach((li) => { li.className = ""; li.querySelector(".sim-capa-detalle").textContent = ""; });
    });

    s("enviar").addEventListener("click", async () => {
      if (ocupado) return;
      ocupado = true;
      s("enviar").disabled = true;
      const r = procesar(selM.value, inRuta.value, taCuerpo.value);
      const lis = nodo.querySelectorAll("[data-capa]");
      lis.forEach((li) => { li.className = ""; li.querySelector(".sim-capa-detalle").textContent = ""; });
      s("respuesta").innerHTML = `<p class="sim-vacio">Procesando…</p>`;
      const espera = (ms) => new Promise((ok) => setTimeout(ok, reducido ? 0 : ms));
      for (const p of r.pasos) {
        const li = nodo.querySelector(`[data-capa="${p.capa}"]`);
        lis.forEach((x) => x.classList.remove("sim-activa"));
        li.classList.add("sim-activa", "sim-tocada");
        li.querySelector(".sim-capa-detalle").textContent = p.texto;
        await espera(520);
      }
      lis.forEach((x) => x.classList.remove("sim-activa"));
      const tipo = r.estado < 300 ? "ok" : r.estado < 500 ? "error" : "fallo";
      s("respuesta").innerHTML = `
        <p class="sim-estado sim-estado--${tipo}"><strong>${r.estado}</strong> ${esc(r.textoEstado)}</p>
        ${r.body ? `<pre><code class="language-json">${esc(r.body)}</code></pre>` : `<p class="sim-sin-cuerpo">Respuesta sin cuerpo</p>`}
        ${r.nota ? `<p class="sim-nota">${esc(r.nota)}</p>` : ""}`;
      if (window.hljs) s("respuesta").querySelectorAll("pre code").forEach((b) => hljs.highlightElement(b));
      pintarTabla();
      ocupado = false;
      s("enviar").disabled = false;
    });

    cargarEjemplo();
    pintarTabla();
  }

  window.Simulador = { montar, procesar, reiniciar };
})();
