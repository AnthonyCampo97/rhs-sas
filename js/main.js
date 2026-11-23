/* ==========================================================================
   RHS SAS · comportamiento del sitio
   Menú móvil, contadores, eventos para Google Tag Manager y formulario.
   ========================================================================== */
(function () {
  "use strict";

  var d = document;
  var cfg = window.RHS_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dataLayer = window.dataLayer || [];

  /* ---------- Modo local ----------
     En el dominio publicado las páginas se abren sin extensión (/contacto).
     Al abrir el sitio con doble clic o con Live Server esas rutas no existen,
     por lo que aquí se agrega ".html" a los enlaces internos solo en modo local. */
  var enLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (enLocal) {
    d.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^(https?:|mailto:|tel:|\/\/|\/|#)/.test(h)) { return; }
      var i = h.indexOf("#");
      var ruta = i === -1 ? h : h.slice(0, i);
      var ancla = i === -1 ? "" : h.slice(i);
      if (ruta === "") { return; }
      if (ruta === "." || ruta === "./") { ruta = "./index.html"; }
      else if (!/\.[a-z0-9]+$/i.test(ruta)) { ruta += ".html"; }
      a.setAttribute("href", ruta + ancla);
    });
  }

  function track(evento, datos) {
    var carga = { event: evento };
    if (datos) { for (var k in datos) { carga[k] = datos[k]; } }
    window.dataLayer.push(carga);
  }

  /* ---------- Menú móvil y submenú ---------- */
  var toggle = d.querySelector(".nav-toggle");
  var menu = d.getElementById("menu");

  function cerrarMenu() {
    if (!menu) { return; }
    menu.classList.remove("open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var abierto = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(abierto));
      toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
  }

  d.querySelectorAll(".sub-toggle").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var item = boton.parentElement;
      var abierto = item.classList.toggle("open");
      boton.setAttribute("aria-expanded", String(abierto));
    });
  });

  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarMenu();
      d.querySelectorAll(".has-sub.open").forEach(function (li) {
        li.classList.remove("open");
        li.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
      });
    }
  });

  // Cerrar el menú al seguir un enlace ancla dentro de la misma página
  if (menu) {
    menu.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a && a.getAttribute("href") && a.getAttribute("href").indexOf("#") !== -1) { cerrarMenu(); }
    });
  }

  /* ---------- Contadores de cifras ---------- */
  var contadores = d.querySelectorAll("[data-count]");

  function animar(el) {
    var meta = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(meta)) { return; }
    if (reduceMotion) { el.textContent = meta.toLocaleString("es-CO"); return; }
    var inicio = null;
    var duracion = 1400;
    function paso(t) {
      if (inicio === null) { inicio = t; }
      var p = Math.min((t - inicio) / duracion, 1);
      var suave = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(meta * suave).toLocaleString("es-CO");
      if (p < 1) { window.requestAnimationFrame(paso); }
    }
    window.requestAnimationFrame(paso);
  }

  if (contadores.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { animar(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Eventos para Google Tag Manager ---------- */
  d.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) { return; }
    var href = a.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) {
      track("click_telefono", { ubicacion: a.getAttribute("data-pos") || "enlace" });
    } else if (href.indexOf("wa.me") !== -1) {
      track("click_whatsapp", { ubicacion: a.getAttribute("data-pos") || "enlace" });
    } else if (a.hasAttribute("data-cta")) {
      track("click_cotizar", { ubicacion: a.getAttribute("data-cta") });
    }
  });

  /* ---------- Formulario de contacto ---------- */
  var form = d.getElementById("form-contacto");
  var estado = d.getElementById("form-estado");

  function mostrar(texto, clase) {
    if (!estado) { return; }
    estado.textContent = texto;
    estado.className = "form-status " + (clase || "");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var datos = {};
      new FormData(form).forEach(function (valor, clave) { datos[clave] = String(valor).trim(); });
      if (datos.empresa_web) { return; } // campo trampa para robots

      var boton = form.querySelector("button[type=submit]");
      if (boton) { boton.disabled = true; }

      if (cfg.formEndpoint) {
        mostrar("Enviando solicitud…", "");
        fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(datos)
        }).then(function (r) {
          if (!r.ok) { throw new Error("estado " + r.status); }
          form.reset();
          mostrar("Solicitud enviada. Le responderemos en el menor tiempo posible.", "ok");
          track("generate_lead", { metodo: "formulario" });
        }).catch(function () {
          mostrar("No fue posible enviar el formulario. Llame al +57 310 3585827 o escriba a rhs.rhs.sas@gmail.com.", "err");
        }).then(function () { if (boton) { boton.disabled = false; } });
        return;
      }

      // Sin servicio de formularios configurado: se redacta la solicitud en WhatsApp
      var lineas = [
        "Hola, soy " + datos.nombre + " " + datos.apellido + ".",
        "Servicio de interés: " + (datos.servicio || "no especificado"),
        "Teléfono: " + datos.telefono,
        "Correo: " + datos.email,
        "",
        datos.mensaje
      ];
      var url = "https://wa.me/" + (cfg.whatsapp || "573103585827") + "?text=" + encodeURIComponent(lineas.join("\n"));
      track("generate_lead", { metodo: "whatsapp_formulario" });
      window.open(url, "_blank", "noopener");
      mostrar("Se abrió WhatsApp con su solicitud. Presione enviar para completarla.", "ok");
      if (boton) { boton.disabled = false; }
    });
  }
})();
