/* HML – Instagram-hírfal.
   Forrás (assets/data/posts.js):
     1) window.HML_INSTAGRAM_WIDGET – automatikus widget (Behold / LightWidget / SnapWidget iframe-címe)
     2) window.HML_INSTAGRAM_POSTS  – Instagram-bejegyzések linkjei → hivatalos Instagram-beágyazás
   Ha egyik sincs megadva, csak a „Követés Instagramon” felhívás látszik (nincs kitalált tartalom).
   Az Instagram szerverét az oldal csak akkor hívja meg, ha valamelyik be van állítva. */
(function () {
  "use strict";
  var HML = window.HML;
  var grids = document.querySelectorAll("[data-news-grid]");
  if (!grids.length) return;

  var PROFILE = "https://www.instagram.com/hml_motorsport/";
  var widgetUrl = String(window.HML_INSTAGRAM_WIDGET || "").trim();
  // Behold: "behold:FEED_ID" vagy a teljes kód (feed-id="...") – ez nem iframe, hanem saját elem.
  var beholdMatch = widgetUrl.match(/^behold:([A-Za-z0-9_-]+)$/i) || widgetUrl.match(/feed-id=["']?([A-Za-z0-9_-]+)/i);
  var beholdId = beholdMatch ? beholdMatch[1] : "";
  if (beholdId) widgetUrl = "";
  // A szolgáltatók kódjában gyakran „//cdn...” kezdetű cím van – kiegészítjük https-re.
  if (/^\/\//.test(widgetUrl)) widgetUrl = "https:" + widgetUrl;
  // Ha valaki a teljes <iframe ...> kódot másolta be, kivesszük belőle a címet.
  var srcMatch = widgetUrl.match(/src=["']([^"']+)["']/i);
  if (srcMatch) widgetUrl = (/^\/\//.test(srcMatch[1]) ? "https:" : "") + srcMatch[1];
  var isLightWidget = /(^https:\/\/)([a-z0-9-]+\.)*lightwidget\.com\//i.test(widgetUrl);
  var POST_RE = /^https:\/\/(www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
  var posts = (Array.isArray(window.HML_INSTAGRAM_POSTS) ? window.HML_INSTAGRAM_POSTS : [])
    .map(function (u) { return String(u || "").trim(); })
    .filter(function (u) {
      var ok = POST_RE.test(u);
      if (u && !ok) console.warn("HML hírfal: nem Instagram-bejegyzés link, kihagyva:", u);
      return ok;
    })
    .map(function (u) { return u.match(POST_RE)[0].replace(/\/?$/, "/"); });

  function emptyState() {
    return '<div class="card insta-empty">' +
      '<span class="badge-icon"><svg class="icon icon--lg" aria-hidden="true"><use href="#i-instagram"/></svg></span>' +
      "<div><h3>" + HML.t("Kövess minket az Instagramon!", "Follow us on Instagram!") + "</h3>" +
      "<p>" + HML.t("A legfrissebb képeink, videóink és eredményeink az Instagram-oldalunkon jelennek meg.", "Our latest photos, videos and results are posted on our Instagram page.") + "</p></div>" +
      '<a class="btn btn--instagram" href="' + PROFILE + '" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="#i-instagram"/></svg>@hml_motorsport' +
      '<span class="sr-only">' + HML.t("(új lapon nyílik)", "(opens in a new tab)") + "</span></a></div>";
  }

  function postHTML(url) {
    // Az Instagram embed.js ezt a blokkot cseréli le a bejegyzés hivatalos megjelenítésére.
    return '<div class="insta-item">' +
      '<blockquote class="instagram-media" data-instgrm-permalink="' + HML.escape(url) + '?utm_source=ig_embed" data-instgrm-version="14">' +
        '<a class="insta-fallback" href="' + HML.escape(url) + '" target="_blank" rel="noopener">' +
          '<svg class="icon icon--lg" aria-hidden="true"><use href="#i-instagram"/></svg>' +
          "<span>" + HML.t("Bejegyzés betöltése… Ha nem jelenik meg, kattints ide a megnyitásához.", "Loading post… If it does not appear, click here to open it.") + "</span>" +
        "</a></blockquote></div>";
  }

  var embedLoaded = false;
  function loadEmbedScript() {
    if (window.instgrm && window.instgrm.Embeds) { window.instgrm.Embeds.process(); return; }
    if (embedLoaded) return;
    embedLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = function () { if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process(); };
    document.body.appendChild(s);
  }

  function render() {
    grids.forEach(function (grid) {
      grid.setAttribute("aria-busy", "false");
      var limit = parseInt(grid.getAttribute("data-limit"), 10) || 0;

      if (beholdId) {
        grid.className = "insta-widget insta-widget--behold";
        var el = document.createElement("behold-widget");
        el.setAttribute("feed-id", beholdId);
        grid.innerHTML = "";
        grid.appendChild(el);
        if (!document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
          var bs = document.createElement("script");
          bs.type = "module";
          bs.src = "https://w.behold.so/widget.js";
          document.head.appendChild(bs);
        }
        return;
      }

      if (/^https:\/\//i.test(widgetUrl)) {
        grid.className = "insta-widget";
        var frame = document.createElement("iframe");
        frame.className = "insta-frame";
        frame.src = widgetUrl;
        frame.title = HML.t("HML Instagram-hírfolyam", "HML Instagram feed");
        frame.loading = "lazy";
        frame.style.height = (grid.getAttribute("data-height") || (limit ? "440" : "720")) + "px";
        grid.innerHTML = "";
        grid.appendChild(frame);
        if (isLightWidget) {
          // A LightWidget saját szkriptje a tartalomhoz igazítja a magasságot.
          frame.classList.add("lightwidget-widget");
          frame.setAttribute("scrolling", "no");
          if (!document.querySelector('script[src*="lightwidget.com/widgets/lightwidget.js"]')) {
            var lw = document.createElement("script");
            lw.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
            lw.async = true;
            document.body.appendChild(lw);
          }
        }
        return;
      }

      if (posts.length) {
        grid.className = "insta-grid";
        grid.innerHTML = (limit ? posts.slice(0, limit) : posts).map(postHTML).join("");
        loadEmbedScript();
        return;
      }

      grid.className = "insta-grid insta-grid--empty";
      grid.innerHTML = emptyState();
      // Üres állapotban a kártya már tartalmazza a „Követés” gombot – az alsó sávot elrejtjük.
      var footer = grid.parentElement && grid.parentElement.querySelector(".news-footer");
      if (footer) footer.hidden = true;
    });
  }

  render();
  // Nyelvváltáskor csak az üres állapot szövegét frissítjük (a beágyazásokat nem töltjük újra).
  document.addEventListener("hml:lang", function () {
    if (!widgetUrl && !posts.length) render();
  });
})();
