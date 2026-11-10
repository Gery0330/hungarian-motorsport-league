# HML – Design system

A Hungarian Motorsport League weboldal megújításának döntései. Minden szín, betű, térköz és lekerekítés az `assets/css/style.css` elején lévő CSS-változókból jön. Új elemnél ezeket használd, ne egyedi értékeket.

---

## 1. Forrás: ui-ux-pro-max skill

| Keresés | Találat | Döntés |
|---|---|---|
| `--design-system "motorsport racing league esports community"` | Pattern: *Feature-Rich Showcase*, Style: *Minimalism*, lila neon paletta, Russo One + Chakra Petch | A **pattern** átvéve (Hero → kártyák → közösség → CTA). A lila paletta **elvetve**: nem illik a liga piros–fehér–zöld logójához. |
| `--domain product "sports league events"` | *Sports Team/Club*: Vibrant & Block-based + Motion-Driven, másodlagos: **Dark Mode (OLED)**, „Team colors + Energetic accents” | **Stílus: Dark Mode (OLED)**, mérsékelt mozgással, csapatszínekkel. |
| `--domain color "sports racing motorsport"` | *Sports Team/Club*: Primary `#DC2626`, „Team red + championship gold” | **Paletta**: csapatpiros `#DC2626` + bajnoki arany, kiegészítve a logó zöldjével. |
| `--domain typography "sports racing bold condensed"` | *Sports/Fitness*: **Barlow Condensed + Barlow** | **Betűpár**: Barlow Condensed (címsor), Barlow (szöveg). Egy család két változata, tehát egységes. |
| `--domain style "sports team esports dark"` | Dark Mode (OLED): „minimal glow, high contrast text, visible focus” | A régi neon „glow”, pulzálás és 1,1×-es nagyítás helyett visszafogott árnyékok és vékony keretek. |

Motion dial: 4/10 (Standard). Rövid, 150–300 ms-os átmenetek, finom görgetési beúszás, `prefers-reduced-motion` esetén semmi mozgás.

## 2. Színek (tokenek)

A sötét mód az alapértelmezett, a világos módot a fejléc gombja kapcsolja. A választás a `localStorage` `hml-theme` kulcsában marad meg.

| Token | Sötét | Világos | Használat | Kontraszt |
|---|---|---|---|---|
| `--bg` | `#0B0C10` | `#F7F7F8` | oldal háttere | – |
| `--bg-2` | `#111318` | `#EEEFF2` | váltakozó szekciók | – |
| `--surface` | `#16181F` | `#FFFFFF` | kártyák | – |
| `--text` | `#F3F4F6` | `#111318` | szöveg | 17,8:1 / 17,4:1 |
| `--muted` | `#A3A8B4` | `#4B5160` | másodlagos szöveg | 8,2:1 / 7,4:1 |
| `--red` | `#DC2626` | `#DC2626` | elsődleges gomb háttere, fehér szöveggel | 4,8:1 |
| `--red-text` | `#F87171` | `#B91C1C` | piros szöveg, linkek | 7,1:1 / 6,5:1 |
| `--gold` | `#F2C14E` | `#8A5A00` | bajnoki kiemelés (Hall of Fame) | 11,6:1 / 5,9:1 |
| `--green` | `#34D27B` | `#15803D` | logó zöldje, „közelgő” jelzés | 9,9:1 / 5,0:1 |
| `--discord` | `#4752C4` | `#4752C4` | Discord gomb, fehér szöveggel | 6,4:1 |

A régi `#ff1e00` piros fehér szöveggel csak 3,9:1 kontrasztot ad, ezért lecseréltem. Az Instagram-gomb (`#C13584`) fehér szöveggel 5,1:1.

A **trikolór csík** (piros–fehér–zöld) a logóból jön: a fejléc alján, a hero alatt és a lábléc tetején jelenik meg.

## 3. Tipográfia

- **Címsor:** `--font-display: "Barlow Condensed"`, 600/700, nagybetűs, enyhe betűközzel.
- **Szöveg:** `--font-body: "Barlow"`, 400/500/600, 17 px, sormagasság 1,6.
- Helyi `woff2` fájlok vannak az `assets/fonts/` mappában, `font-display: swap`. A `latin` és a `latin-ext` készlet `unicode-range` szerint töltődik. **Ellenőrizve:** az á é í ó ö **ő** ú ü **ű** és nagybetűs párjaik mind megvannak.
- Skála: `--fs-display` (hero, max. 112 px), `--fs-h1` (max. 72 px), `--fs-h2` (max. 52 px), `--fs-h3` 24 px, `--fs-body` 17 px, `--fs-small` 14 px, `--fs-eyebrow` 13 px.
- A visszaszámláló és a pontszámok `font-variant-numeric: tabular-nums` beállítással jelennek meg, így nem ugrálnak a számok.

## 4. Térköz, lekerekítés, árnyék

- Térközök: `--space-1` … `--space-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96 px. A szekciók közötti hely: `--section-y` = `clamp(64px, 8vw, 120px)`.
- Lekerekítések: `--radius-sm` 6, `--radius` 10, `--radius-lg` 16, `--radius-xl` 24, `--radius-pill` 999.
- Árnyékok: `--shadow-1` (kártya), `--shadow-2` (hover, modál). Neon glow nincs.
- Rács: 1200 px-es tartalomszélesség, oldalt legalább 16 px margó, a rácsok `auto-fit`/`minmax` szerint törnek.

## 5. 21st.dev referenciák

A 21st.dev kódletöltési kerete elfogyott (ingyenes csomag, napi 2 letöltés). Ezért az alábbi komponensek **előnézete alapján** saját, keretrendszer nélküli HTML/CSS/JS készült, a fenti tokenekhez igazítva:

| 21st.dev komponens | Hol használtam |
|---|---|
| *Navbar* (designali-in) – lebegő, üveghatású fejléc | minden oldal fejléce, mobilmenü |
| *Gallery Grid Skeleton* (felipemenezes098) – betöltési csempék | hírfal és következő verseny betöltése |
| *Countdown Timer* (anubra266) – tabulált számjegyek | következő verseny visszaszámlálója |
| *Accordion* (ddoemonn) – billentyűzettel kezelhető, lenyíló panel | impresszum / elérhetőségek |

## 6. UX szabályok (a skill alapján)

- Az ikonok **SVG-k** (Lucide-stílus), emoji nincs. A dekoratív ikonok `aria-hidden="true"`, az ikon-gombokon `aria-label` van.
- Minden kattintható elem legalább **44×44 px**, és látható `:focus-visible` keretet kap.
- A hover állapotok 150–250 ms-os átmenettel működnek, ugrálás és 1,1×-es nagyítás nélkül.
- A görgetési beúszás `IntersectionObserver`-rel működik, `prefers-reduced-motion` esetén kikapcsol. A háttérvideó ilyenkor nem indul, és van szüneteltető gombja.
- A képek WebP formátumúak, `width`/`height` attribútumot kapnak, a hajtás alattiak `loading="lazy"` beállítással töltődnek. Így nincs elugró elrendezés.
- A teljes képernyős „LOADING” takaró, az oldalváltási fekete átmenet és a részecske-animáció kikerült: késleltették a tartalmat, és terhelték a processzort.
- Az adatbázisból érkező szövegek escape-elve kerülnek a HTML-be (XSS ellen).
- Az impresszum adatai csak kattintásra jelennek meg (`<details>` + szinkronizált `aria-expanded`). JavaScript nélkül is működik.

## 7. Ellenőrzőlista

Headless Edge + axe-core 4.10 (WCAG 2.0–2.2 A/AA és best practice), 8 oldal, sötét és világos mód.

| Ellenőrzés (ui-ux-pro-max Pre-Delivery Checklist) | Eredmény |
|---|---|
| Nincs emoji ikonként, csak SVG | ✅ minden 🏆 🏁 🔴 ✔ ▶ SVG ikonra cserélve |
| Kattintható elemeken pointer kurzor és hover állapot (150–300 ms) | ✅ |
| Kontraszt ≥ 4,5:1 mindkét módban | ✅ axe: **0 hiba** mind a 8 oldalon, sötét és világos módban |
| Látható fókusz, logikus Tab-sorrend | ✅ ugrólink → logó → menü → nyelv → téma → tartalom |
| Mobilmenü | ✅ fókuszcsapda, Esc bezárja, a háttér `inert` |
| Érintési célok ≥ 44 px | ✅ (a szövegközi linkek kivételével) |
| `prefers-reduced-motion` | ✅ nincs beúszás és nincs videó, minden azonnal látszik |
| Reszponzív: 360, 390, 768, 844 fekvő, 1024, 1440, 1920 px és 200% betűméret | ✅ nincs vízszintes görgetés |
| Világos/sötét mód megjegyezve (`hml-theme`), nyelv megjegyezve (`lang`) | ✅ oldalak között is megmarad |
| Impresszum kattintásra (`details` + `aria-expanded`) | ✅ alapból rejtve, Enter/Space/kattintás nyitja; JS nélkül is működik |
| Hírfal: csak valódi Instagram-tartalom | ✅ Behold-widget (feed: `qHcOBnxD5vYtTgd8T3mg`) a @hml_motorsport posztjaival, ellenőrizve `file://` és webszerver alatt, asztalon és mobilon, mindkét témában. Ha nincs beállítva, „Kövess minket” kártya jelenik meg. |
| Képek: WebP, lazy, méretezve (nincs CLS) | ✅ ~105 MB helyett ~1,5 MB pályakép; a videó 22 MB helyett 6,7 MB, és csak asztali gépen töltődik |
| Konzol | ✅ nincs saját hiba (lásd lent) |

**Ismert, nem a megújításból eredő hibák:**
- A Supabase-ben **nincs `standings` tábla** (HTTP 404). A League Manager (`admin/league-manager.html`) ebbe a táblába írna. A naptár oldalak kérésre törölve lettek, a ligakártyák csak hover-effektet kapnak.
- A YouTube API-kulcs a `assets/js/live.js` fájlban a böngésző számára látható. A Google Cloud Console-ban érdemes HTTP-hivatkozóra (`hungarianmotorsportleague.com`) korlátozni.
- A belső oldalak (`admin/admin.html`, `admin/league-manager.html`, `admin/profile.html`) tartalmához nem nyúltam, csak az `admin/` mappába kerültek, és a config útvonala frissült. Elérés a főoldalon: Ctrl+Shift+A, illetve Ctrl+Shift+H.
