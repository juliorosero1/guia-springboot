/* =========================================================================
   APLICACIÓN: navegación por #hash, temario lateral, índice de la página,
   copiar código, pestañas, tema claro/oscuro y modo prueba.
   No hace falta tocar este archivo para agregar clases nuevas.
   ========================================================================= */
(function () {
  "use strict";

  const CFG = window.CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = D.esc;

  /* ---------- Numeración de temas (1.1, 1.2...) ---------- */
  TEMARIO.forEach((u, ui) => {
    u.nombre = u.referencia ? u.unidad : `Unidad ${ui + 1}: ${u.unidad}`;
    let n = 0;
    u.temas.forEach((c) => {
      if (u.referencia) c.etiqueta = "Ref.";
      else if (c.ejercicio) c.etiqueta = "Ej.";
      else c.etiqueta = `${ui + 1}.${++n}`;
    });
  });

  /* ---------- Temario en lista plana (para anterior/siguiente) ---------- */
  const entradas = [{ id: "inicio", titulo: "Inicio" }];
  TEMARIO.forEach((u) =>
    u.temas.forEach((c) => {
      if (c.hijos) c.hijos.forEach((h) => entradas.push({ ...h, padre: c, unidad: u }));
      else entradas.push({ ...c, unidad: u });
    })
  );
  const buscarEntrada = (id) => entradas.find((e) => e.id === id);
  const disponible = (id) => Docs.existe(id);

  /* ---------- Marca ---------- */
  $("#marca-sigla").textContent = CFG.marca || "";
  $("#marca-curso").textContent = CFG.curso || "";

  /* ---------- Modo prueba ---------- */
  if (CFG.modoPrueba) {
    document.documentElement.dataset.modo = "prueba";
    const b = $("#banner-prueba");
    b.hidden = false;
    b.textContent = CFG.mensajePrueba || "Modo evaluación activo.";
  }

  /* ---------- Tema claro / oscuro ---------- */
  const botonTema = $("#btn-tema");
  const temaActual = () =>
    document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const pintarBotonTema = () => {
    const oscuro = temaActual() === "dark";
    botonTema.setAttribute("aria-label", oscuro ? "Usar tema claro" : "Usar tema oscuro");
    botonTema.dataset.oscuro = oscuro;
  };
  botonTema.addEventListener("click", () => {
    const nuevo = temaActual() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try { localStorage.setItem("tema", nuevo); } catch (e) { /* sin almacenamiento */ }
    pintarBotonTema();
  });
  pintarBotonTema();

  /* ---------- Temario lateral ---------- */
  const contTemario = $("#temario");
  function pintarTemario() {
    contTemario.innerHTML =
      `<a class="item item--inicio" href="#inicio" data-id="inicio">Inicio</a>` +
      TEMARIO.map((u) => {
        const clases = u.temas.map((c) => {
          const libre = disponible(c.id);
          const estado = libre ? "" : `<span class="item-estado">Próximamente</span>`;
          const clase = [
            "item",
            libre ? "" : "item--pendiente",
            c.ejercicio ? "item--ejercicio" : ""
          ].join(" ").trim();
          let html = `<a class="${clase}" href="#${c.id}" data-id="${c.id}" data-buscar="${esc((c.titulo + " " + (c.subtemas || []).join(" ")).toLowerCase())}">
              <span class="item-sem">${c.etiqueta}</span>
              <span class="item-texto"><span class="item-titulo">${esc(c.titulo)}</span>${estado}</span>
            </a>`;
          if (c.hijos) {
            html += `<div class="subitems" data-grupo="${c.id}">${c.hijos
              .filter((h) => h.id !== c.id)
              .map((h) => `<a class="subitem" href="#${h.id}" data-id="${h.id}" data-buscar="${esc(h.titulo.toLowerCase())}">${esc(h.titulo)}</a>`)
              .join("")}</div>`;
          }
          return html;
        }).join("");
        return `<section class="unidad"><h2 class="unidad-titulo">${esc(u.nombre)}</h2>${clases}</section>`;
      }).join("");
  }
  pintarTemario();

  // Buscador del temario
  $("#buscar").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$("[data-buscar]", contTemario).forEach((a) => {
      a.classList.toggle("oculto", q && !a.dataset.buscar.includes(q));
    });
    $$(".unidad", contTemario).forEach((s) => {
      const visibles = $$("[data-buscar]:not(.oculto)", s).length;
      s.classList.toggle("oculto", !!q && visibles === 0);
    });
    $$(".subitems", contTemario).forEach((g) => g.classList.toggle("abierto", !!q));
  });

  // Menú en móvil
  const lateral = $("#lateral");
  const botonMenu = $("#btn-menu");
  const cerrarMenu = () => { document.body.classList.remove("menu-abierto"); botonMenu.setAttribute("aria-expanded", "false"); };
  botonMenu.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });
  $("#velo").addEventListener("click", cerrarMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  /* ---------- Render de páginas ---------- */
  const main = $("#contenido");
  const indice = $("#indice");

  function slug(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function paginaPendiente(c) {
    const subtemas = (c.subtemas || []).map((t) => `<li>${esc(t)}</li>`).join("");
    return {
      titulo: c.titulo,
      resumen: "Esta sección se publicará cuando lleguemos a este tema.",
      render: () => `
        <h2>Lo que veremos</h2>
        <ul class="lista-temas">${subtemas}</ul>
        ${D.nota("info", "Mientras tanto", `<p>Repasa los temas disponibles en el temario. Cada tema nuevo se apoya en los anteriores.</p>`)}
      `
    };
  }

  function navegacionInferior(id) {
    const visibles = entradas.filter((e) => disponible(e.id) && !(e.padre && e.id === e.padre.id && false));
    // Evita duplicar la entrada del grupo y su "Visión general" (mismo id)
    const unicos = visibles.filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i);
    const i = unicos.findIndex((e) => e.id === id);
    if (i < 0) return "";
    const ant = unicos[i - 1];
    const sig = unicos[i + 1];
    const enlace = (e, tipo) =>
      e ? `<a class="pie-${tipo}" href="#${e.id}"><span class="pie-rotulo">${tipo === "ant" ? "Anterior" : "Siguiente"}</span><span class="pie-titulo">${esc(e.padre ? e.padre.titulo + ": " + e.titulo : e.titulo)}</span></a>` : "<span></span>";
    return `<nav class="pie-nav" aria-label="Páginas">${enlace(ant, "ant")}${enlace(sig, "sig")}</nav>`;
  }

  function construirIndice() {
    const hs = $$("#contenido .cuerpo h2");
    if (hs.length < 2) { indice.innerHTML = ""; return; }
    indice.innerHTML = `<p class="indice-titulo">En esta página</p><ul>${hs
      .map((h) => {
        if (!h.id) h.id = slug(h.textContent);
        return `<li><a href="#${location.hash.slice(1)}" data-ir="${h.id}">${esc(h.textContent)}</a></li>`;
      })
      .join("")}</ul>`;
    // Resalta la sección visible
    if (window.IntersectionObserver) {
      const enlaces = $$("[data-ir]", indice);
      const obs = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            enlaces.forEach((a) => a.classList.toggle("activo", a.dataset.ir === en.target.id));
          }
        });
      }, { rootMargin: "0px 0px -70% 0px" });
      hs.forEach((h) => obs.observe(h));
    }
  }

  function resaltarCodigo() {
    if (!window.hljs) return;
    $$("#contenido pre code").forEach((b) => {
      try { hljs.highlightElement(b); } catch (e) { /* lenguaje no cargado */ }
    });
  }

  function marcarTemario(id) {
    $$("#temario [data-id]").forEach((a) => {
      const activo = a.dataset.id === id;
      a.classList.toggle("activo", activo);
      if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const e = buscarEntrada(id);
    $$("#temario .subitems").forEach((g) => {
      g.classList.toggle("abierto", !!(e && e.padre && e.padre.id === g.dataset.grupo));
    });
  }

  function render() {
    let id = decodeURIComponent(location.hash.slice(1)) || "inicio";
    const entrada = buscarEntrada(id);
    let def = Docs.pagina(id);
    if (!def && entrada) def = paginaPendiente(entrada);
    if (!def) { id = "inicio"; def = Docs.pagina("inicio"); }

    D._reiniciar();
    const e = buscarEntrada(id) || {};
    const migas = [];
    if (e.unidad) migas.push(esc(e.unidad.nombre));
    if (e.padre) migas.push(esc(e.padre.titulo));
    const meta = [];
    if (e.etiqueta && !e.padre && e.etiqueta !== "Ref.") meta.push(`Tema ${e.etiqueta}`);
    const pendiente = !Docs.existe(id);

    main.innerHTML = `
      <article class="pagina${pendiente ? " pagina--pendiente" : ""}${def.portada ? " pagina--portada" : ""}">
        ${def.portada ? "" : `<header class="pagina-cabecera">
          ${migas.length ? `<p class="migas">${migas.join('<span aria-hidden="true"> / </span>')}</p>` : ""}
          <h1>${esc(def.titulo)}</h1>
          ${meta.length ? `<p class="pagina-meta">${meta.map((m) => `<span>${m}</span>`).join("")}${pendiente ? '<span class="pill">Próximamente</span>' : ""}</p>` : ""}
          ${def.resumen ? `<p class="resumen">${def.resumen}</p>` : ""}
          ${def.capa ? D.capas(def.capa) : ""}
        </header>`}
        <div class="cuerpo">${def.render()}</div>
        ${navegacionInferior(id)}
      </article>`;

    document.title = `${def.titulo} | ${CFG.curso || "Back End"}${CFG.marca ? " | " + CFG.marca : ""}`;
    marcarTemario(id);
    resaltarCodigo();
    construirIndice();
    if (window.Simulador) $$("[data-simulador]").forEach((n) => Simulador.montar(n));
    window.scrollTo(0, 0);
    cerrarMenu();
  }

  /* ---------- Eventos delegados: copiar, pestañas, índice ---------- */
  document.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("[data-copiar]");
    if (btn) {
      const texto = D._codigo(Number(btn.dataset.copiar)) || "";
      let ok = false;
      try { await navigator.clipboard.writeText(texto); ok = true; }
      catch (e) {
        const ta = document.createElement("textarea");
        ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
        ta.remove();
      }
      btn.textContent = ok ? "Copiado" : "No se pudo copiar";
      btn.classList.toggle("ok", ok);
      setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("ok"); }, 1600);
      return;
    }

    const tab = ev.target.closest('.pestanas-lista [role="tab"]');
    if (tab) { activarPestana(tab); return; }

    const ir = ev.target.closest("[data-ir]");
    if (ir) {
      ev.preventDefault();
      const destino = document.getElementById(ir.dataset.ir);
      if (destino) {
        destino.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        destino.setAttribute("tabindex", "-1");
        destino.focus({ preventScroll: true });
      }
    }
  });

  function activarPestana(tab) {
    const lista = tab.parentElement;
    const cont = lista.parentElement;
    $$('[role="tab"]', lista).forEach((t) => {
      const sel = t === tab;
      t.setAttribute("aria-selected", String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !sel;
    });
    void cont;
  }

  // Teclado en pestañas (flechas)
  document.addEventListener("keydown", (ev) => {
    const tab = ev.target.closest && ev.target.closest('.pestanas-lista [role="tab"]');
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) return;
    const tabs = $$('[role="tab"]', tab.parentElement);
    let i = tabs.indexOf(tab);
    if (ev.key === "ArrowRight") i = (i + 1) % tabs.length;
    if (ev.key === "ArrowLeft") i = (i - 1 + tabs.length) % tabs.length;
    if (ev.key === "Home") i = 0;
    if (ev.key === "End") i = tabs.length - 1;
    ev.preventDefault();
    tabs[i].focus();
    activarPestana(tabs[i]);
  });

  window.addEventListener("hashchange", render);
  render();
})();
