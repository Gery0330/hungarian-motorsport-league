# Hírfal – valódi Instagram-posztok megjelenítése

A hírfal a **Hírek** oldalon (`hirek.html`) és a főoldal „Hírek” szekciójában jelenik meg. **Csak valódi Instagram-tartalmat mutat**, kitalált bejegyzés nincs benne. A beállítás egyetlen fájlban van (a weboldal fő mappájához képest):

```
assets/data/posts.js
```

Amíg nincs semmi beállítva, a hírfal helyén egy „Kövess minket az Instagramon!” kártya látszik, rajta a profil linkjével. Ilyenkor az oldal az Instagram szerverét egyáltalán nem hívja meg.

> **Miért nem tölti le magától a posztokat?** Az Instagram csak a fiók tulajdonosának engedélyével (hozzáférési tokennel) adja ki a posztokat. Ezt a tokent egy statikus weboldal kódjába **nem szabad** beletenni, mert minden látogató kiolvashatná. Ezért vagy egy widget-szolgáltató tárolja a tokent (A), vagy te adod meg a posztok linkjeit (B).

---

## A) Automatikus: widget-szolgáltató (ajánlott)

A profil legfrissebb posztjai maguktól jelennek meg, új posztnál nincs teendőd.

1. Regisztrálj egy ilyen szolgáltatónál: **Behold** (behold.so), **LightWidget** (lightwidget.com) vagy **SnapWidget** (snapwidget.com).
   > **Fontos:** a weboldal HTTPS-en fut. A **LightWidget ingyenes csomagja nem működik HTTPS-en**: a posztok helyett egy „Upgrade now!” reklám jelenik meg (kipróbálva, 2026. 11. 10.). LightWidgetnél tehát a fizetős HTTPS-kiegészítő kell.
   >
   > **Behold:** a kódban `<behold-widget feed-id="AZONOSITO">` szerepel. Ilyenkor ezt írd be: `window.HML_INSTAGRAM_WIDGET = "behold:AZONOSITO";`
2. Jelentkezz be ott a **hml_motorsport** Instagram-fiókkal, és hozz létre egy rácsos (grid) widgetet. Ajánlott: 3 oszlop, 6–9 kép.
3. Válaszd az **iframe** beágyazást, és másold ki a kódból az `src="..."` részben lévő címet. Ha egyszerűbb, a teljes `<iframe ...>` sort is bemásolhatod az idézőjelek közé, mert az oldal kiveszi belőle a címet. A `//cdn...` kezdetű címet is elfogadja. LightWidget esetén a widget magassága automatikusan igazodik.
4. Az `assets/data/posts.js` fájlban írd be ide:

```js
window.HML_INSTAGRAM_WIDGET = "https://cdn.lightwidget.com/widgets/AZONOSITO.html";
```

Mentés után a főoldalon és a Hírek oldalon is a widget jelenik meg. A magasságot a `hirek.html`/`index.html` hírfal-elemén egy `data-height="720"` attribútummal állíthatod. Kikapcsolás: tedd vissza üresre (`""`).

## B) Kézi: posztok linkjei, hivatalos Instagram-beágyazással

Nem kell regisztrálni, de minden új posztnál fel kell venned a linket.

1. Instagramon nyisd meg a posztot → **⋯** menü → **Link másolása**.
2. Az `assets/data/posts.js` fájlban illeszd be a listába, **a legújabbat legfelülre**, idézőjelek közé és vesszővel a végén:

```js
window.HML_INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/LEGUJABB123/",
  "https://www.instagram.com/p/KORABBI456/",
  "https://www.instagram.com/reel/VIDEO789/",
];
```

A főoldal az első 3, a Hírek oldal az összes posztot mutatja, az Instagram saját megjelenítésével (kép vagy videó, felirat, kedvelések, „Megtekintés az Instagramon”). Posztok (`/p/`) és reelek (`/reel/`) is mehetnek. Ha egy link hibás, az oldal kihagyja, és a böngésző konzoljában (F12) figyelmeztet.

> Ha a widget-cím (A) is meg van adva, az élvez elsőbbséget, és a lista nem számít.

---

## Adatvédelem

Bármelyik mód bekapcsolásakor a látogató böngészője kapcsolatba lép az Instagrammal (Meta) vagy a widget-szolgáltatóval, amely IP-címet és sütiket kezelhet. Erről az **Adatkezelési tájékoztató** „Közösségi média” része már tartalmaz egy bekezdést. Widget használatakor érdemes ott a szolgáltató nevét is feltüntetni.
