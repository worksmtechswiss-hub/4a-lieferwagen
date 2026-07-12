# 4A Lieferwagen — Landingpage

Marketing-Landingpage für **4A Lieferwagen**, eine Lieferwagen-Vermietung in Winterthur
(Privat- und Geschäftskunden). Ziel der Seite: Besucher zur Fahrzeug-Anfrage führen und
sekundär Ankauf-Leads sammeln.

Umgesetzt als statische Website — kein Build-Schritt, keine Abhängigkeiten ausser zwei CDN-Assets
(Google Fonts «Montserrat», Lucide Icons).

## Live

https://worksmtechswiss-hub.github.io/4a-lieferwagen/

## Lokal starten

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Struktur

```
index.html              Gesamte Seite (11 Sektionen, semantisches Markup)
assets/css/styles.css   Design-Tokens + Styles, responsive ab 1080/900/560px
assets/js/main.js       Inhaltsdaten + Interaktion
```

## Inhalte pflegen

Fahrzeuge, Vorteile, Stats, Einsatzzwecke und FAQ stehen als Listen zuoberst in
`assets/js/main.js` und werden von dort gerendert. Preise oder ein neues Fahrzeug ändert man
nur dort — nicht im HTML.

## Fotos einsetzen

Die Bildflächen (Hero-Band und je Fahrzeugkarte) sind aktuell Platzhalter (`.photo`).
Zum Ersetzen die Fotos unter `assets/img/` ablegen und den Platzhalter durch ein `<img>`
tauschen — die Stellen sind im Code kommentiert:

- Hero: `index.html`, `<div class="hero__photo photo" …>`
- Fahrzeuge: `assets/js/main.js`, in `renderFleet()`

## Was noch ans Backend muss

Der Prototyp hat kein Backend. Zwei Stellen sind vorbereitet und im Code markiert:

1. **Hero-Suchleiste** (`initSearch`) — validiert die Daten und scrollt zum Fuhrpark.
   Hier gehört die Verfügbarkeits-Abfrage hin.
2. **Ankauf-Formular** (`initSellForm`) — validiert Name/Telefon/Marke und zeigt das
   Erfolgs-Panel. Hier gehört ein `fetch`-POST an die Lead-/Mail-API hin.

## Design

Basiert auf dem Handoff «4A Lieferwagen — Landingpage (Variante B)» aus Claude Design.
Farben, Typografie, Abstände, Radien und Schatten sind als CSS-Variablen in `:root`
(`assets/css/styles.css`) hinterlegt. Animationen respektieren `prefers-reduced-motion`.
