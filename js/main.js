/* =========================================================
   Ô PAIN DORÉ — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Année dans le footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav : fond au scroll + barre de progression ---- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 40);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Reveal au scroll (IntersectionObserver) ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Compteurs animés ---- */
  var counters = document.querySelectorAll(".stats__num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Logo : détoure le fond noir du PNG et l'affiche ---- */
  var logoImgs = document.querySelectorAll(".logo-img");
  var logoFallbacks = document.querySelectorAll(".logo-fallback");

  function revealLogo(src) {
    logoImgs.forEach(function (img) {
      if (src) img.src = src;
      img.hidden = false;
      requestAnimationFrame(function () { img.classList.add("is-in"); });
    });
    logoFallbacks.forEach(function (el) { el.style.display = "none"; });
  }

  if (logoImgs.length) {
    var probe = new Image();
    probe.onload = function () {
      // Détourage : le fond noir devient transparent, le doré reste (alpha = luminosité).
      try {
        var cv = document.createElement("canvas");
        cv.width = probe.naturalWidth;
        cv.height = probe.naturalHeight;
        var ctx = cv.getContext("2d");
        ctx.drawImage(probe, 0, 0);
        var im = ctx.getImageData(0, 0, cv.width, cv.height);
        var d = im.data, floor = 16, span = 255 - floor;
        for (var i = 0; i < d.length; i += 4) {
          var m = Math.max(d[i], d[i + 1], d[i + 2]);
          d[i + 3] = m <= floor ? 0 : Math.min(255, Math.round((m - floor) * (255 / span)));
        }
        ctx.putImageData(im, 0, 0);
        revealLogo(cv.toDataURL("image/png"));
      } catch (err) {
        // canvas indisponible : on affiche le PNG tel quel
        revealLogo(null);
      }
    };
    probe.onerror = function () { /* pas de fichier : on garde le repli texte */ };
    probe.src = logoImgs[0].getAttribute("src");
  }

  /* ---- Formulaire de commande / devis ---- */
  var form = document.getElementById("orderForm");
  var status = document.getElementById("orderStatus");
  var BAKERY_EMAIL = "maxdeleris@orange.fr"; // ← e-mail qui reçoit les demandes

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var ok = true;
      required.forEach(function (el) {
        var empty = !el.value.trim();
        el.classList.toggle("invalid", empty);
        if (empty) ok = false;
      });
      if (!ok) {
        setStatus("Merci de remplir les champs obligatoires (*).", "err");
        return;
      }

      var d = new FormData(form);
      var lines = [
        "Nouvelle demande depuis le site Ô Pain Doré",
        "--------------------------------------------",
        "Nom : " + (d.get("name") || ""),
        "Téléphone : " + (d.get("phone") || ""),
        "E-mail : " + (d.get("email") || "—"),
        "Type : " + (d.get("type") || ""),
        "Date souhaitée : " + (d.get("date") || "—"),
        "",
        "Demande :",
        d.get("message") || ""
      ];
      var subject = "Commande / Devis — " + (d.get("type") || "") + " — " + (d.get("name") || "");
      var mailto =
        "mailto:" + BAKERY_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      window.location.href = mailto;
      setStatus("Votre logiciel de messagerie s'ouvre pour finaliser l'envoi. Merci !", "ok");
      form.reset();
    });

    form.querySelectorAll("[required]").forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("invalid"); });
    });
  }
  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = "commande__status " + (type || "");
  }

  /* ---- Farine : dosage des 3 couches selon la position de scroll ----
     Plus on descend, plus la densité augmente : poussière → moyenne → généreuse.
     Les couches se relaient (fondu enchaîné) pour éviter une surbrillance
     qui rendrait le texte illisible. */
  var farine1 = document.querySelector(".farine--1");
  var farine2 = document.querySelector(".farine--2");
  var farine3 = document.querySelector(".farine--3");

  // Opacités maximales : farine assumée — la lisibilité est assurée
  // par le halo sombre appliqué aux textes posés sur le fond (voir style.css)
  var MAX_1 = 0.72, MAX_2 = 0.68, MAX_3 = 0.62;

  function seg(p, a, b) {
    return Math.min(1, Math.max(0, (p - a) / (b - a)));
  }

  function updateFarine() {
    if (!farine1) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY || document.documentElement.scrollTop) / h : 0;

    // chaque couche monte puis s'efface partiellement au profit de la suivante
    var o1 = seg(p, 0.20, 0.44) * (1 - 0.75 * seg(p, 0.48, 0.74));
    var o2 = seg(p, 0.44, 0.70) * (1 - 0.70 * seg(p, 0.72, 0.94));
    var o3 = seg(p, 0.68, 0.96);

    farine1.style.opacity = (o1 * MAX_1).toFixed(3);
    farine2.style.opacity = (o2 * MAX_2).toFixed(3);
    farine3.style.opacity = (o3 * MAX_3).toFixed(3);
  }
  window.addEventListener("scroll", updateFarine, { passive: true });
  window.addEventListener("resize", updateFarine);
  updateFarine();

  /* ---- Parallaxe douce sur le glow du hero ---- */
  var glow = document.querySelector(".hero__glow");
  if (glow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        glow.style.transform = "translateX(-50%) translateY(" + y * 0.25 + "px)";
      }
    }, { passive: true });
  }
})();
