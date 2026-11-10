/* HML – élő közvetítés: 30 másodpercenként ellenőrzi, hogy a YouTube csatorna élőben van-e.
   FIGYELEM: a YouTube API-kulcs a böngészőben látható. A Google Cloud Console-ban
   korlátozd a kulcsot erre a domainre (HTTP-hivatkozó) és csak a YouTube Data API-ra. */
(function () {
  "use strict";
  var HML = window.HML;
  var API_KEY = "AIzaSyDIW-PRqPEd1etpQQX-1PGphP8U1uET6Hc";
  var CHANNEL_ID = "UCJAnYRXk3HpfmXItsvMCxtQ";

  var frame = document.getElementById("liveFrame");
  var offline = document.getElementById("offlineBox");
  var hud = document.getElementById("liveHud");
  var viewerEl = document.getElementById("viewerCount");
  var liveBtn = document.getElementById("liveBtn");
  var pill = document.getElementById("liveTitle");
  var state = "checking";

  function setPill() {
    pill.classList.toggle("is-live", state === "live");
    pill.innerHTML = state === "live"
      ? '<span class="live-dot" aria-hidden="true"></span>LIVE NOW'
      : state === "offline" ? "OFFLINE" : HML.t("Ellenőrzés…", "Checking…");
  }
  setPill();
  document.addEventListener("hml:lang", setPill);

  async function checkLive() {
    try {
      var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + CHANNEL_ID + "&eventType=live&type=video&key=" + API_KEY;
      var data = await (await fetch(url)).json();
      if (data.items && data.items.length > 0) {
        var videoId = data.items[0].id.videoId;
        var embed = "https://www.youtube.com/embed/" + encodeURIComponent(videoId);
        liveBtn.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(videoId);
        liveBtn.hidden = false;
        if (frame.getAttribute("src") !== embed) frame.src = embed;
        frame.hidden = false;
        offline.hidden = true;
        state = "live"; setPill();
        var stats = await (await fetch("https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=" + encodeURIComponent(videoId) + "&key=" + API_KEY)).json();
        var viewers = stats.items && stats.items[0] && stats.items[0].liveStreamingDetails ? stats.items[0].liveStreamingDetails.concurrentViewers || 0 : 0;
        viewerEl.textContent = Number(viewers).toLocaleString(HML.locale());
        hud.hidden = false;
      } else {
        frame.hidden = true;
        if (frame.getAttribute("src")) frame.removeAttribute("src");
        offline.hidden = false;
        liveBtn.hidden = true;
        hud.hidden = true;
        state = "offline"; setPill();
      }
    } catch (err) {
      console.error("Live check error:", err);
      state = "offline"; setPill();
    }
  }
  checkLive();
  setInterval(checkLive, 30000);
})();
