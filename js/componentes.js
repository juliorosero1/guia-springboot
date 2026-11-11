/* =========================================================================
   COMPONENTES PARA ESCRIBIR PÁGINAS
   Cada archivo de /contenido llama a Docs.registrar(id, { ... }) y arma su
   HTML con estas funciones. Así todas las páginas se ven igual.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Registro de páginas ---------- */
  const paginas = {};
  window.Docs = {
    registrar(id, definicion) { paginas[id] = definicion; },
    pagina(id) { return paginas[id]; },
    existe(id) { return Object.prototype.hasOwnProperty.call(paginas, id); }
  };

  const D = (window.D = {});

  /* ---------- Utilidades ---------- */
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  D.esc = esc;

  const enPrueba = () => !!(window.CONFIG && window.CONFIG.modoPrueba);
  D.enPrueba = enPrueba;

  // Quita el primer salto de línea y los espacios finales de un bloque.
  const limpiar = (s) => String(s).replace(/^\n/, "").replace(/\s+$/, "");

  let codigos = [];
  let contador = 0;
  D._reiniciar = () => { codigos = []; contador = 0; };
  D._codigo = (i) => codigos[i];
  const uid = (p) => `${p}-${++contador}`;

  const LENGUAJES = {
    java: "Java", xml: "XML", json: "JSON", bash: "Terminal", ini: "Properties",
    http: "HTTP", sql: "SQL", plaintext: "Texto"
  };

  /* ---------- Bloque de código con botón Copiar ----------
     completo: versión completa
     prueba:   (opcional) versión de estructura para el modo prueba.
               Si no se da, el bloque se muestra igual en ambos modos.     */
  D.codigo = function ({ archivo = "", lenguaje = "java", completo, prueba, titulo }) {
    const usarPrueba = enPrueba() && prueba != null;
    const texto = limpiar(usarPrueba ? prueba : completo);
    const i = codigos.push(texto) - 1;
    return `
<figure class="codigo${usarPrueba ? " codigo--prueba" : ""}">
  <figcaption>
    <span class="codigo-archivo">${esc(titulo || archivo || LENGUAJES[lenguaje] || lenguaje)}</span>
    ${usarPrueba ? '<span class="codigo-marca">Estructura</span>' : ""}
    <span class="codigo-lenguaje">${esc(LENGUAJES[lenguaje] || lenguaje)}</span>
    <button class="btn-copiar" type="button" data-copiar="${i}" aria-label="Copiar código">Copiar</button>
  </figcaption>
  <pre><code class="language-${lenguaje}">${esc(texto)}</code></pre>
</figure>`;
  };

  /* ---------- Pestañas ----------
     D.pestanas([{ titulo: "Servicio", html: D.codigo(...) }, ...])        */
  D.pestanas = function (lista) {
    const g = uid("tab");
    const botones = lista
      .map((p, n) =>
        `<button type="button" role="tab" id="${g}-b${n}" aria-controls="${g}-p${n}" aria-selected="${n === 0}" tabindex="${n === 0 ? 0 : -1}">${esc(p.titulo)}</button>`)
      .join("");
    const paneles = lista
      .map((p, n) =>
        `<div role="tabpanel" id="${g}-p${n}" aria-labelledby="${g}-b${n}"${n === 0 ? "" : " hidden"}>${p.html}</div>`)
      .join("");
    return `<div class="pestanas"><div class="pestanas-lista" role="tablist">${botones}</div>${paneles}</div>`;
  };

  /* ---------- Nota / aviso ---------- tipo: info | consejo | cuidado */
  D.nota = function (tipo, titulo, html) {
    return `<aside class="nota nota--${tipo}"><p class="nota-titulo">${esc(titulo)}</p>${html}</aside>`;
  };

  /* ---------- Tabla ---------- */
  D.tabla = function (cabeceras, filas, clase = "") {
    return `<div class="tabla-envoltura"><table class="${clase}"><thead><tr>${cabeceras
      .map((c) => `<th scope="col">${c}</th>`)
      .join("")}</tr></thead><tbody>${filas
      .map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  };

  /* ---------- Insignia de método HTTP ---------- */
  D.metodo = (m) => `<span class="metodo metodo--${m.toLowerCase()}">${m}</span>`;

  /* ---------- Contenido que se oculta en modo prueba ---------- */
  D.soloCompleto = function (html, reemplazo = "") {
    return enPrueba() ? reemplazo : html;
  };

  /* ---------- Pasos en orden ---------- */
  D.pasos = function (lista) {
    return `<ol class="pasos">${lista.map((p) => `<li>${p}</li>`).join("")}</ol>`;
  };

  /* ---------- Franja de capas: dónde vive este archivo ----------
     actual: "cliente" | "controller" | "service" | "repository" | "model" | "bd" */
  D.capas = function (actual) {
    const capas = [
      ["cliente", "Cliente", "Postman / navegador"],
      ["controller", "Controller", "Recibe la petición"],
      ["service", "Service", "Lógica de negocio"],
      ["repository", "Repository", "Acceso a datos"],
      ["bd", "Base de datos", "H2"]
    ];
    const items = capas
      .map(([id, nombre, desc]) =>
        `<li class="capa${id === actual ? " capa--actual" : ""}"${id === actual ? ' aria-current="true"' : ""}><span class="capa-nombre">${nombre}</span><span class="capa-desc">${desc}</span></li>`)
      .join("");
    const modelo = `<p class="capas-modelo${actual === "model" ? " capa--actual" : ""}"><span class="capa-nombre">Model (Mago)</span><span class="capa-desc">El objeto que viaja entre todas las capas</span></p>`;
    return `<nav class="capas" aria-label="Capa del proyecto"><ol>${items}</ol>${modelo}</nav>`;
  };

  /* ---------- Operación documentada (estilo referencia de API) ----------
     { id, titulo, metodo?, ruta?, firma?, descripcion, parametros?: [[nombre,tipo,desc]],
       retorna?, codigo }                                                    */
  D.operacion = function (o) {
    const cabecera = o.metodo
      ? `<p class="op-ruta">${D.metodo(o.metodo)}<code>${esc(o.ruta)}</code></p>`
      : "";
    const firma = o.firma ? `<p class="op-firma"><code>${esc(o.firma)}</code></p>` : "";
    const params = o.parametros && o.parametros.length
      ? `<h3>Parámetros</h3><dl class="parametros">${o.parametros
          .map(([n, t, d]) => `<div><dt><code>${esc(n)}</code><span class="tipo">${esc(t)}</span></dt><dd>${d}</dd></div>`)
          .join("")}</dl>`
      : "";
    const retorna = o.retorna ? `<h3>Devuelve</h3><div class="op-retorna">${o.retorna}</div>` : "";
    return `
<section class="operacion" id="${o.id}">
  <h2>${esc(o.titulo)}</h2>
  ${cabecera}${firma}
  <div class="op-descripcion">${o.descripcion}</div>
  ${params}${retorna}
  ${o.codigo || ""}
</section>`;
  };

  /* ---------- Autoevaluación (las respuestas se ocultan en modo prueba) ---------- */
  D.autoevaluacion = function (preguntas) {
    const items = preguntas
      .map((q, n) => {
        const resp = enPrueba()
          ? `<p class="respuesta-oculta">Respuesta oculta durante la evaluación.</p>`
          : `<details><summary>Ver respuesta</summary><div>${q.r}</div></details>`;
        return `<li><p>${q.p}</p>${resp}</li>`;
      })
      .join("");
    return `<ol class="autoevaluacion">${items}</ol>`;
  };

  /* ---------- Árbol de archivos ---------- */
  D.arbol = function (texto) {
    return `<pre class="arbol">${esc(limpiar(texto))}</pre>`;
  };

  /* ---------- Tarjetas de enlace ---------- */
  D.enlaces = function (lista) {
    return `<ul class="enlaces">${lista
      .map((e) => `<li><a href="#${e.id}"><span class="enlace-titulo">${esc(e.titulo)}</span><span class="enlace-desc">${esc(e.desc)}</span></a></li>`)
      .join("")}</ul>`;
  };

  /* ---------- Simulador (lo arranca js/simulador.js) ---------- */
  D.simulador = () => `<div class="sim" data-simulador></div>`;
})();
