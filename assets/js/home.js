/* HML – főoldal: háttér-diavetítés, következő verseny visszaszámlálóval (Supabase),
   rejtett gyorsbillentyűk az admin felületekhez. */
(function () {
  "use strict";
  var HML = window.HML;

  /* ---------- Háttér-diavetítés: áttűnés + lassú zoom (zoom csak ha a mozgás engedélyezett) ----------
     Csak az első kép töltődik be azonnal, a többi az oldal betöltése után, egyenként.
     Magától megáll, ha a hero nem látszik vagy a lap háttérben van; adatspórolás esetén nem indul. */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var bars = Array.prototype.slice.call(document.querySelectorAll(".hero-progress span"));
  var heroEl = document.querySelector(".hero");
  var saveData = navigator.connection && navigator.connection.saveData;
  var SLIDE_MS = 6500;

  if (slides.length > 1 && heroEl && !saveData) {
    var cur = 0, slideTimer = null, inView = true;
    var isStopped = function () { return !inView || document.hidden; };

    var load = function (img) {
      if (!img || img.getAttribute("srcset") || !img.getAttribute("data-srcset")) return;
      img.setAttribute("srcset", img.getAttribute("data-srcset"));
      img.setAttribute("src", img.getAttribute("data-src"));
    };
    var ready = function (img) { return img.complete && img.naturalWidth > 0; };
    var markBars = function () {
      bars.forEach(function (b, i) {
        b.classList.toggle("is-done", i < cur);
        b.classList.remove("is-active");
      });
      var b = bars[cur];
      if (b) { void b.offsetWidth; b.classList.add("is-active"); }
    };

    var show = function (n) {
      var next = slides[n];
      load(next);
      if (!ready(next)) {
        // Még töltődik: megvárjuk, addig marad az aktuális kép.
        next.addEventListener("load", function () { show(n); }, { once: true });
        return;
      }
      slides[cur].classList.remove("is-active");
      next.classList.add("is-active");
      cur = n;
      load(slides[(n + 1) % slides.length]); // a következőt előre betöltjük
      markBars();
      schedule();
    };
    var schedule = function () {
      clearTimeout(slideTimer);
      if (!isStopped()) slideTimer = setTimeout(function () { show((cur + 1) % slides.length); }, SLIDE_MS);
    };
    var refresh = function () {
      var stopped = isStopped();
      if (stopped === heroEl.classList.contains("is-paused")) return;
      heroEl.classList.toggle("is-paused", stopped);
      if (!stopped) markBars(); // visszatéréskor a sáv újraindul
      schedule();
    };

    document.addEventListener("visibilitychange", refresh);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; refresh(); }).observe(heroEl);
    }
    var start = function () { load(slides[1]); markBars(); schedule(); };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
  } else if (heroEl) {
    heroEl.classList.add("is-static");
  }

  /* ---------- Következő verseny ---------- */
  var mainBox = document.getElementById("race-main");
  var listBox = document.getElementById("race-list");
  var LEAGUE_NAMES = { "LMU": "Le Mans Ultimate" };
  var races = null, loadError = false, timer = null;

  function unitHTML(id, label) {
    return '<div class="countdown-unit"><span class="countdown-num" id="cd-' + id + '">00</span><span class="countdown-label">' + label + "</span></div>";
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function renderEmpty() {
    mainBox.innerHTML =
      '<div class="empty-state"><svg class="icon" aria-hidden="true"><use href="#i-flag"/></svg>' +
      '<p class="race-track">' + HML.t("Nincs verseny", "No race scheduled") + "</p>" +
      "<p>" + (loadError
        ? HML.t("A versenynaptár most nem érhető el. A friss időpontokat a Discord szerveren találod.", "The race calendar is unavailable right now. Find the latest schedule on our Discord server.")
        : HML.t("Jelenleg nincs kiírt verseny. Az új időpontokat a Discord szerveren jelentjük be.", "There is no race scheduled right now. New dates are announced on our Discord server.")) + "</p>" +
      '<a class="btn btn--discord" href="https://discord.gg/mRB24ZRwFr" target="_blank" rel="noopener">Discord <svg class="icon icon--sm" aria-hidden="true"><use href="#i-external"/></svg></a></div>';
    listBox.hidden = true;
  }

  function render() {
    if (timer) { clearInterval(timer); timer = null; }
    mainBox.setAttribute("aria-busy", "false");
    if (!races || !races.length) { renderEmpty(); return; }
    var race = races[0];
    var when = new Date(race.race_time);
    mainBox.innerHTML =
      "<div>" +
        '<span class="race-league"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-flag"/></svg>' + HML.escape(LEAGUE_NAMES[race.league] || race.league) + "</span>" +
        '<p class="race-track"><svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>' + HML.escape(race.track) + "</p>" +
        '<p class="race-when"><time datetime="' + HML.escape(when.toISOString()) + '">' + HML.escape(HML.formatDate(when, true)) + "</time></p>" +
      "</div>" +
      '<div id="countdown-wrap">' +
        '<div class="countdown" aria-hidden="true">' +
          unitHTML("d", HML.t("nap", "days")) + unitHTML("h", HML.t("óra", "hrs")) + unitHTML("m", HML.t("perc", "min")) + unitHTML("s", HML.t("mp", "sec")) +
        "</div><p class=\"sr-only\" id=\"cd-sr\"></p>" +
      "</div>";

    var rest = races.slice(1);
    if (rest.length) {
      listBox.hidden = false;
      listBox.innerHTML = "<h3>" + HML.t("További versenyek", "Upcoming races") + "</h3><ol>" + rest.map(function (r) {
        var d = new Date(r.race_time);
        return '<li><span class="rl-name">' + HML.escape(r.track) + '<span class="rl-league">' + HML.escape(LEAGUE_NAMES[r.league] || r.league) + "</span></span>" +
          '<time datetime="' + HML.escape(d.toISOString()) + '">' + HML.escape(HML.formatDate(d, true)) + "</time></li>";
      }).join("") + "</ol>";
    } else {
      listBox.hidden = true;
    }
    startCountdown(when);
  }

  function startCountdown(when) {
    var lastMinute = -1;
    function tick() {
      var diff = when - new Date();
      var wrap = document.getElementById("countdown-wrap");
      if (!wrap) return;
      if (diff <= 0) {
        wrap.innerHTML = '<a class="live-badge" href="live.html"><span class="live-dot" aria-hidden="true"></span>LIVE</a>';
        clearInterval(timer); timer = null;
        return;
      }
      var days = Math.floor(diff / 86400000), hours = Math.floor(diff / 3600000) % 24,
          minutes = Math.floor(diff / 60000) % 60, seconds = Math.floor(diff / 1000) % 60;
      document.getElementById("cd-d").textContent = pad(days);
      document.getElementById("cd-h").textContent = pad(hours);
      document.getElementById("cd-m").textContent = pad(minutes);
      document.getElementById("cd-s").textContent = pad(seconds);
      wrap.querySelector(".countdown").classList.toggle("is-soon", diff <= 5 * 60 * 1000);
      if (minutes !== lastMinute) { // képernyőolvasónak percenként elég
        lastMinute = minutes;
        document.getElementById("cd-sr").textContent = HML.t("Rajtig hátravan: ", "Time to start: ") +
          days + " " + HML.t("nap", "days") + ", " + hours + " " + HML.t("óra", "hours") + ", " + minutes + " " + HML.t("perc", "minutes") + ".";
      }
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  async function loadNextRace() {
    if (!mainBox || !listBox) return;
    if (!window.supabaseClient) { loadError = true; races = []; render(); return; }
    try {
      var res = await window.supabaseClient.from("races").select("*")
        .gt("race_time", new Date().toISOString())
        .order("race_time", { ascending: true }).limit(5);
      if (res.error) throw res.error;
      races = res.data || [];
    } catch (err) {
      console.error(err);
      loadError = true;
      races = [];
    }
    render();
  }
  loadNextRace();
  document.addEventListener("hml:lang", function () { if (races) render(); });

  /* ---------- Rejtett gyorsbillentyűk (eredeti működés) ---------- */
  document.addEventListener("keydown", function (e) {
    if (!e.ctrlKey || !e.shiftKey) return;
    var k = e.key.toLowerCase();
    if (k === "a") window.location.href = "admin/admin.html";
    if (k === "h") window.location.href = "admin/league-manager.html";
  });
})();
