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
