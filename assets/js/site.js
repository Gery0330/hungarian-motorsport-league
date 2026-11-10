/* HML – közös szkript minden oldalra
   Téma (sötét/világos, megjegyezve), nyelv (HU/EN, megjegyezve), mobilmenü,
   fejléc árnyék, görgetési beúszás, süti-sáv, lenyíló panelek állapota. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function store(key, value) { try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; } }

  /* ---------- Segédfüggvények más szkripteknek ---------- */
  var HML = window.HML = window.HML || {};
  HML.reduceMotion = reduceMotion;
  HML.escape = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  HML.lang = store("lang") === "en" ? "en" : "hu";
  HML.t = function (hu, en) { return HML.lang === "en" ? en : hu; };
  HML.locale = function () { return HML.lang === "en" ? "en-GB" : "hu-HU"; };
  HML.formatDate = function (date, withTime) {
    var opts = { year: "numeric", month: "long", day: "numeric" };
    if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
    try { return new Intl.DateTimeFormat(HML.locale(), opts).format(date); } catch (e) { return date.toLocaleString(); }
  };

  /* ---------- Téma ---------- */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-pressed", String(theme === "light"));
      b.setAttribute("aria-label", theme === "dark"
        ? HML.t("Világos mód bekapcsolása", "Switch to light mode")
        : HML.t("Sötét mód bekapcsolása", "Switch to dark mode"));
    });
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0B0C10" : "#F7F7F8");
    if (persist) store("hml-theme", theme);
  }
  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
    });
  });

  /* ---------- Nyelv (HU / EN) ----------
     data-en: angol szöveg; a magyar eredetit az első váltáskor data-hu-ba mentjük.
     data-html: a fordítás saját, megbízható HTML-t tartalmaz (pl. <br>).
     data-en-label / data-hu-label: aria-label fordítása. */
  function applyLang(lang, persist) {
    HML.lang = lang;
    root.setAttribute("lang", lang);
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-hu")) el.setAttribute("data-hu", el.hasAttribute("data-html") ? el.innerHTML.trim() : el.textContent.trim());
      var text = el.getAttribute("data-" + lang);
      if (el.hasAttribute("data-html")) el.innerHTML = text; else el.textContent = text;
    });
    document.querySelectorAll("[data-en-label]").forEach(function (el) {
      if (!el.hasAttribute("data-hu-label")) el.setAttribute("data-hu-label", el.getAttribute("aria-label") || "");
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-label"));
    });
    document.querySelectorAll("[data-en-alt]").forEach(function (el) {
      if (!el.hasAttribute("data-hu-alt")) el.setAttribute("data-hu-alt", el.getAttribute("alt") || "");
      el.setAttribute("alt", el.getAttribute("data-" + lang + "-alt"));
    });
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.setAttribute("aria-label", lang === "hu" ? "Switch to English" : "Váltás magyar nyelvre");
      b.setAttribute("lang", lang === "hu" ? "en" : "hu");
      var on = b.querySelector(".lang-on"), off = b.querySelector(".lang-off");
      if (on && off) { on.textContent = lang.toUpperCase(); off.textContent = lang === "hu" ? "EN" : "HU"; }
    });
    if (persist) store("lang", lang);
    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
    document.dispatchEvent(new CustomEvent("hml:lang", { detail: lang }));
  }
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(HML.lang === "hu" ? "en" : "hu", true); });
  });
  applyLang(HML.lang, false);

  /* ---------- Mobilmenü (fókuszcsapda, Esc, háttér zárolása) ---------- */
  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var outside = [document.querySelector("main"), document.querySelector(".site-footer"), document.querySelector(".brand"), document.querySelector(".skip-link")];

  function setMenu(open, returnFocus) {
    if (!nav || !menuButton) return;
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? HML.t("Menü bezárása", "Close menu") : HML.t("Menü megnyitása", "Open menu"));
    outside.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var first = nav.querySelector("a"); if (first) setTimeout(function () { first.focus(); }, 60); }
    else if (returnFocus) menuButton.focus();
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () { setMenu(!nav.classList.contains("open"), true); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a") && nav.classList.contains("open")) setMenu(false, false); });
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("open")) return;
      if (e.key === "Escape") { e.preventDefault(); setMenu(false, true); return; }
      if (e.key === "Tab") {
        var items = [menuButton].concat(Array.prototype.slice.call(document.querySelectorAll(".header-actions button:not(.menu-toggle)")), Array.prototype.slice.call(nav.querySelectorAll("a")));
        var i = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    });
    window.matchMedia("(max-width: 960px)").addEventListener("change", function (m) {
      if (!m.matches && nav.classList.contains("open")) setMenu(false, false);
    });
  }

  /* ---------- Fejléc árnyék görgetéskor ---------- */
  var ticking = false;
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); ticking = false; }
  window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- Görgetési beúszás ---------- */
  HML.observeReveal = function (scope) {
    var items = (scope || document).querySelectorAll(".reveal:not(.in-view)");
    if (!("IntersectionObserver" in window) || reduceMotion.matches) { items.forEach(function (el) { el.classList.add("in-view"); }); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("in-view"); obs.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  };
  HML.observeReveal();

  /* ---------- Süti-sáv ---------- */
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    if (!store("cookieAccepted")) banner.hidden = false;
    var accept = banner.querySelector("button");
    if (accept) accept.addEventListener("click", function () { store("cookieAccepted", "yes"); banner.hidden = true; });
  }

  /* ---------- Lenyíló panelek: aria-expanded szinkron ---------- */
  document.querySelectorAll("details.disclosure").forEach(function (d) {
    var summary = d.querySelector("summary");
    if (!summary) return;
    var sync = function () { summary.setAttribute("aria-expanded", String(d.open)); };
    sync();
    d.addEventListener("toggle", sync);
  });

  /* ---------- Évszám a láblécben ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Service worker (csak webszerveren) ---------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && document.body.hasAttribute("data-sw")) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* nem kritikus */ });
  }
})();
