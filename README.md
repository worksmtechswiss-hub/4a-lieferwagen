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

### Fuhrpark

Aktuell 4× **Mercedes Sprinter 316 CDI** mit Möbelkoffer (ab CHF 150/Tag). Ein weiteres
Fahrzeug kommt als zusätzlicher Eintrag ins `fleet`-Array; die Karten rendern automatisch.

Auf der Karte stehen bewusst nur belegte Angaben (Innenhöhe, Flügeltüren, Rückfahrkamera,
Anhängerkupplung, Handschaltung). **Laderaum in m³, Nutzlast, Länge und Verbrauch fehlen
noch** — sobald die Werte vorliegen, als weitere `specs`-Einträge ergänzen.

## Fotos einsetzen

Foto ablegen unter:

```
assets/img/sprinter-316.jpg
```

Mehr ist nicht nötig — Hero-Band und Fahrzeugkarte greifen automatisch darauf zu.
Fehlt die Datei, entfernt sich das `<img>` selbst (`onerror`) und die graue
Platzhalterfläche bleibt sichtbar. Die Seite bleibt also in jedem Fall heil.

Ein anderer Pfad pro Fahrzeug: Feld `photo` im `fleet`-Eintrag in `assets/js/main.js`.
Empfehlung: Querformat, mind. 1600 px breit, unter ~400 KB (JPG).

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
