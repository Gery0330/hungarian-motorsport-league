/* =========================================================
   HML HÍRFAL – INSTAGRAM-BEÁLLÍTÁSOK
   Részletes útmutató: docs/HIRFAL.md

   A hírfal CSAK valódi Instagram-tartalmat mutat. Kétféleképpen töltheted fel:

   1) AUTOMATIKUS (ajánlott): egy widget-szolgáltató (pl. Behold, LightWidget, SnapWidget)
      a profil legfrissebb posztjait magától mutatja. Írd ide a widget iframe-címét.
      Ha ez meg van adva, a lenti lista nem számít.
   ========================================================= */
// LightWidget (ingyenes) nem működik HTTPS-en, ezért kikapcsolva: https://lightwidget.com/widgets/fe592b462e035f909dabc02492dd8cce.html
window.HML_INSTAGRAM_WIDGET = "behold:qHcOBnxD5vYtTgd8T3mg";

/* =========================================================
   2) KÉZI: másold ide az Instagram-bejegyzések linkjeit, a LEGÚJABBAT ELÖLRE.
      Instagramon: a poszt ⋯ menüje → „Link másolása”. Példa:
        "https://www.instagram.com/p/ABC123xyz/",
      A főoldal az első 3-at, a Hírek oldal az összeset mutatja,
      az Instagram hivatalos beágyazásával.
   ========================================================= */
window.HML_INSTAGRAM_POSTS = [

];
