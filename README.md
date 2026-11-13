# 4A Lieferwagen — Website

Website von **4A Lieferwagen**, Lieferwagen-Vermietung in Winterthur (Privat- und
Geschäftskunden), plus Ankauf von Lieferwagen. Ziel: Mietanfragen und Anrufe, sekundär
Ankauf-Leads.

Statische Website: kein Build-Schritt, keine Abhängigkeiten ausser drei CDN-Assets
(Google Fonts «Montserrat», Lucide Icons, Google Analytics).

## Projekt auf einen Blick

| | |
|---|---|
| Domain | https://4a-lieferwagen.ch/ (ohne www, saubere URLs ohne `.html`) |
| Betreiberin | **Gerber Transport GmbH**, St. Gallerstrasse 182, CH-8404 Winterthur, UID CHE-223.057.928 — 4A Lieferwagen ist eine Marke davon (Schwesterseite: gerber-transport.ch) |
| Telefon | 044 240 41 42 (`+41442404142`, gleiche Nummer wie Gerber Transport) |
| E-Mail | info@gerber-transport.ch |
| Repo | `worksmtechswiss-hub/4a-lieferwagen`, Branch `main` |
| Hosting | Netlify, Projekt `4alieferwagen` (Site-ID `d148b47a-6bdf-443c-ae94-6a6848c11b24`), Deploy automatisch bei Push auf `main` |
| Analytics | GA4 `G-HS18XFXVM7` (Property 563736788, Konto «SM Tech Kunden»), im SEO-Dashboard zugeordnet |
| Search Console | Domain-Property `sc-domain:4a-lieferwagen.ch` — dem Dashboard-Konto fehlt noch die Berechtigung |
| Formulare | Formspree (Pro-Konto) → E-Mail an info@gerber-transport.ch (bewusst **nicht** ins SEO-Dashboard) |

Die Angaben zur Firma stammen aus dem Impressum von gerber-transport.ch. Ändern sie sich,
müssen `impressum.html`, `datenschutz.html`, `CONTACT` in `assets/js/main.js` und das
JSON-LD in `index.html` angepasst werden.

## Lokal starten

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Struktur

```
index.html              Startseite (alle Abschnitte, JSON-LD AutoRental)
fuhrpark.html           Fuhrpark
einsatzzwecke.html      Einsatzzwecke
preise.html             Preise
verkaufen.html          Fahrzeug verkaufen (Ankauf-Formular)
faq.html                FAQ (JSON-LD FAQPage)
kontakt.html            Kontakt (Adresse, Karte, Kontaktformular #anfrage)
impressum.html          Impressum (Gerber Transport GmbH)
datenschutz.html        Datenschutzerklärung (DSG, GA4 mit Widerspruch)
assets/css/styles.css   Design-Tokens + Styles, responsive ab 1080/900/560px
assets/js/main.js       Inhaltsdaten, Header/Footer, Formulare, Interaktion
assets/js/ga.js         Google Analytics 4 + Widerspruch (Opt-out)
ratgeber.html           Ratgeber-Übersicht (+ ratgeber-*.html, erzeugt)
tools/build-ratgeber.mjs baut den Ratgeber aus tools/ratgeber/*.mjs
tools/prerender.mjs     schreibt die von main.js erzeugten Inhalte fest ins HTML
```

## Inhalte und Navigation pflegen

Fahrzeuge, Vorteile, Stats, Einsatzzwecke, FAQ, Navigation (`NAV`), Fusszeile
(`FOOTER_COLS`, `LEGAL`) und Kontaktdaten (`CONTACT`) stehen zuoberst in
`assets/js/main.js`. Nach jeder Änderung dort:

```bash
node tools/prerender.mjs
```

Das Skript führt `main.js` aus und schreibt Header, Footer, Fuhrpark, FAQ usw. fest in
alle `.html`-Dateien — so sehen Suchmaschinen und KI-Crawler alle Inhalte und internen
Links ohne JavaScript. Eine neue Seite braucht nur leere Platzhalter
`<header id="siteHeader" class="site-header"></header>` / `<footer id="siteFooter" class="footer"></footer>`
und `<body data-page="…">`.

### Fuhrpark

Aktuell 4× **Mercedes Sprinter 316 CDI** mit Möbelkoffer (ab CHF 150/Tag). **Laderaum in
m³, Nutzlast, Länge und Verbrauch fehlen noch** — sobald die Werte vorliegen, als weitere
`specs`-Einträge ergänzen.

## Formulare

Kontaktformular (`contactForm`) und Ankauf-Formular (`sellForm`) senden per `fetch` an
Formspree. Endpunkt: Konstante `FORMSPREE_ENDPOINT` in `assets/js/main.js` (`https://formspree.io/f/xyewybrz`, Formular «4a-lieferwagen.ch» im Formspree-Pro-Konto).

- Mitgeschickt werden `_subject`, `_source` (`4a-lieferwagen.ch`, zeigt im E-Mail die
  Herkunft), `_form`, `_page`, `_replyto` und ein Honeypot `_gotcha`.
- Das Erfolgs-Panel erscheint erst nach Bestätigung durch Formspree; bei einem Fehler
  steht Telefon und E-Mail im Hinweis.
- **Solange `FORMSPREE_ENDPOINT` leer ist**, öffnen die Formulare das E-Mail-Programm mit
  der ausgefüllten Anfrage (kein vorgetäuschter Erfolg).
- Die Hero-Suche (Abhol-/Rückgabedatum) ist keine Buchung: Sie leitet auf
  `kontakt.html?von=…&bis=…#anfrage` und füllt Nachricht sowie die Felder
  `abholung`/`rueckgabe` vor.
- Anfragen gehen nur per E-Mail an info@gerber-transport.ch; es gibt keinen Webhook ins
  SEO-Dashboard (Entscheid November 2026).

## Ratgeber

Sechs Artikel (ein Artikel pro Monat, Juni–November 2026) plus Übersicht `ratgeber.html`.
Quelle der Inhalte: `tools/ratgeber/*.mjs` (Titel, Datum, Lead, Text, FAQ, verwandte Artikel).
Daraus erzeugt `tools/build-ratgeber.mjs` die Seiten `ratgeber-<slug>.html`, die Übersicht
und den Ratgeber-Block in `sitemap.xml` (JSON-LD: BlogPosting, FAQPage, BreadcrumbList).

```bash
node tools/build-ratgeber.mjs && node tools/prerender.mjs
```

Titelbilder: `assets/img/ratgeber/<slug>.webp` (1200×675, 16:9). Fehlt ein Bild, zeigt die
Seite einen Farbverlauf mit Bildbeschreibung. In den Artikeln keine Preise, Kautionen oder
Fahrzeugdaten, die nicht auf der Website bestätigt sind. Rechtliche Angaben stützen sich auf
SVG/VRV und die Stadt Winterthur — vor Änderungen erneut prüfen. `llms.txt` listet alle Seiten.

## Analytics und Datenschutz

GA4 lädt ohne Einwilligungs-Banner (Entscheid für Schweizer Kundenseiten): Information und
Widerspruch stehen in `datenschutz.html` (Link mit `data-ga-optout`, Schlüssel
`4a-ga-optout` im localStorage, IP gekürzt). Ereignisse: `page_view`, `click_phone`,
`click_email`, `generate_lead` (nur nach erfolgreichem Formspree-Versand).

Die Datenschutzerklärung nennt alle Drittdienste: Netlify, Formspree, Google Analytics,
Google Fonts, Google Maps, Lucide über unpkg. Kommt ein Dienst dazu, dort ergänzen.

## Fotos

Aktuell ein einziges Foto: `assets/img/slml.webp` (Hero und Fahrzeugkarte), freigestellt
mit transparentem Hintergrund — ein Ersatz sollte ebenfalls freigestellt sein. Für die
Unterseiten fehlen echte Fotos der Fahrzeuge (aussen, Laderaum, Rampe, Kabine).

## SEO/GEO-Plan (Stand November 2026)

Erledigt (Etappe 1): funktionierende Formulare, Telefon in Kopf/Fusszeile/JSON-LD,
Impressum, Datenschutz, GA4, Header/Footer fest im HTML.

Offen (Etappe 2, wartet auf Angaben der Kundin):

- Angebot bestätigen: Preise, Kaution, Mindestalter, Halbtag/Wochenende/Woche,
  Hebebühne/Rampe, Fahrer über Gerber Transport.
- Startseite und Unterseiten auf 800–1500 Wörter ausbauen; neue Seiten zu
  Zügelwagen/Umzugswagen, Möbeltransport selber machen, Wochenende, Vergleich mit
  Baumarkt-/Möbelhaus-Vermietung, Führerausweis B bis 3.5 t, Ankauf «Lieferwagen
  verkaufen Schweiz»; Ortsseiten nur mit echtem Bezug.
- Google-Unternehmensprofil, Bewertungen, Einträge local.ch/search.ch, `llms.txt`,
  Link von gerber-transport.ch.
- Suchnachfrage (Google-Vorschläge CH): lieferwagen/transporter/sprinter mieten
  winterthur (+ günstig, Töss, Hebebühne, mit Fahrer, Wochenende, Kosten),
  zügelwagen/umzugswagen/möbelkoffer mieten, lieferwagen fahren ausweis.

## Design

Basiert auf dem Handoff «4A Lieferwagen — Landingpage (Variante B)» aus Claude Design.
Farben, Typografie, Abstände, Radien und Schatten sind CSS-Variablen in `:root`
(`assets/css/styles.css`). Animationen respektieren `prefers-reduced-motion`.

**Farbwelt: Blau-Violett.** `--accent-bright` (#7C4DFF) ist die Leitfarbe für CTAs, Links
und Akzente auf hellem Grund. Auf dunklem Grund (Hero, Footer) `--accent-soft` (#8E7CFF)
oder `--accent-glow` (#B39DFF) verwenden, sonst reisst der WCAG-Kontrast.
