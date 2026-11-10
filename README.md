# Hungarian Motorsport League – weboldal

Megnyitás a gépen: kattints duplán az `index.html` fájlra. Élesben: https://hungarianmotorsportleague.com

## Mappaszerkezet

```
hungarian-motorsport-league/
├─ index.html            Főoldal (hero, következő verseny, ligák, hírek, közösség, nevezés)
├─ rolunk.html           Rólunk
├─ hirek.html            Hírfal (valódi Instagram-posztok)
├─ hall-of-fame.html     Bajnokok
├─ live.html             Élő közvetítés (YouTube)
├─ impresszum.html       Impresszum (adatok kattintásra)
├─ adatkezeles.html      Adatkezelési tájékoztató
│
├─ assets/               Minden, amit az oldalak betöltenek
│  ├─ css/style.css        az egyetlen stíluslap (design tokenek az elején)
│  ├─ js/                  site.js (közös), home.js, news.js, live.js, config.js (Supabase)
│  ├─ data/posts.js        ⇐ INSTAGRAM-HÍRFAL BEÁLLÍTÁSA (widget vagy posztlinkek)
│  ├─ fonts/               Barlow + Barlow Condensed (helyi woff2)
│  ├─ img/                 logó, ikonok, trófeák, csapatlogók, pályaképek (tracks/)
│  └─ media/               hero-videó (tömörített)
│
├─ admin/                Belső oldalak (nincsenek a menüben)
│  ├─ admin.html           versenyek / jelentkezések / hírek – Ctrl+Shift+A a főoldalon
│  ├─ league-manager.html  pilóták és pontok – Ctrl+Shift+H a főoldalon
│  └─ profile.html         befejezetlen profiloldal
│
├─ docs/                 Leírások (nem kellenek az oldal működéséhez)
│  ├─ HIRFAL.md            Instagram-posztok megjelenítése
│  └─ DESIGN.md            színek, betűk, térközök, ellenőrzőlista
│
├─ _archiv/              Régi, már NEM használt eredeti fájlok (nagy PNG/JPG, 22 MB-os videó)
│                          Feltöltéskor kihagyható; a ../hungarian-motorsport-league-backup mappában is megvannak.
│
├─ manifest.json         Telepíthető webapp beállítások
├─ sw.js                 Service worker (a gyökérben kell maradnia)
└─ CNAME                 Domain beállítás (a gyökérben kell maradnia)
```

## Gyakori teendők

| Teendő | Hol? |
|---|---|
| Instagram-posztok a Hírek oldalon | `assets/data/posts.js` – útmutató: `docs/HIRFAL.md` |
| Új bajnok a Hall of Fame-be | `hall-of-fame.html`, egy `<article class="card champion">` blokk lemásolásával |
| Színek, betűméretek | `assets/css/style.css` eleje (`:root` tokenek) |
| Versenyek, időpontok | `admin/admin.html` (Supabase) – a főoldal automatikusan mutatja |
