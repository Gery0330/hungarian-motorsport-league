/* HML – főoldal: háttérvideó, következő verseny visszaszámlálóval (Supabase),
   rejtett gyorsbillentyűk az admin felületekhez. */
(function () {
  "use strict";
  var HML = window.HML;

  /* ---------- Háttérvideó: csak nagy kijelzőn, mozgáscsökkentés és adatspórolás nélkül ---------- */
  var video = document.querySelector(".hero-media video");
  var videoBtn = document.querySelector(".video-toggle");
  var saveData = navigator.connection && navigator.connection.saveData;
  function setVideoLabel(paused) {
    if (!videoBtn) return;
    videoBtn.setAttribute("aria-pressed", String(paused));
    videoBtn.setAttribute("aria-label", paused ? HML.t("Háttérvideó lejátszása", "Play background video") : HML.t("Háttérvideó szüneteltetése", "Pause background video"));
  }
  if (video && !HML.reduceMotion.matches && !saveData && window.matchMedia("(min-width: 768px)").matches) {
    video.src = video.getAttribute("data-src");
    video.addEventListener("playing", function () { video.classList.add("is-ready"); if (videoBtn) videoBtn.hidden = false; setVideoLabel(false); }, { once: true });
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* automatikus lejátszás tiltva: marad az állókép */ });
    if (videoBtn) {
      videoBtn.addEventListener("click", function () {
        if (video.paused) { video.play(); setVideoLabel(false); } else { video.pause(); setVideoLabel(true); }
      });
      document.addEventListener("hml:lang", function () { setVideoLabel(video.paused); });
    }
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
