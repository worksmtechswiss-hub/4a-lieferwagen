/* Baut den Ratgeber aus den Quelldateien in tools/ratgeber/*.mjs:
   - je Artikel eine Seite ratgeber-<slug>.html im Wurzelverzeichnis
   - die Übersicht ratgeber.html
   - die Ratgeber-Einträge in sitemap.xml

   Header und Footer setzt danach tools/prerender.mjs ein. Ablauf:

     node tools/build-ratgeber.mjs && node tools/prerender.mjs

   Neuer Artikel: Datei in tools/ratgeber/ anlegen (Aufbau wie die
   bestehenden), Titelbild unter assets/img/ratgeber/<slug>.webp ablegen.
   Fehlt das Bild noch, zeigt die Seite einen Farbverlauf als Platzhalter. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://4a-lieferwagen.ch'
const srcDir = join(root, 'tools/ratgeber')

const articles = []
for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(join(srcDir, f)).href)
  articles.push(mod.default)
}
// Neueste zuerst
articles.sort((a, b) => b.date.localeCompare(a.date))

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const strip = (s) => String(s).replace(/<[^>]+>/g, '')
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}. ${MONTHS[m - 1]} ${y}` }
const file = (a) => `ratgeber-${a.slug}.html`
const url = (a) => `${SITE}/ratgeber-${a.slug}`
const img = (a) => `assets/img/ratgeber/${a.slug}.webp`
const words = (a) => strip(a.lead + ' ' + a.body + ' ' + a.faq.map((x) => x.q + ' ' + x.a).join(' ')).split(/\s+/).filter(Boolean).length

const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%237C4DFF'/%3E%3Ctext x='32' y='44' font-family='Montserrat,Arial,sans-serif' font-size='30' font-weight='800' text-anchor='middle' fill='%23fff'%3E4A%3C/text%3E%3C/svg%3E`

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Gerber Transport GmbH',
  url: 'https://gerber-transport.ch/',
  brand: { '@type': 'Brand', name: '4A Lieferwagen' }
}

function head({ title, description, canonical, ogType, ogImage, ld }) {
  return `<!DOCTYPE html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#262457">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="de_CH">
<meta property="og:site_name" content="4A Lieferwagen">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
${ld.map((o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join('\n')}
</head>`
}

const TAIL = `
<footer id="siteFooter" class="footer"></footer>

<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
<script src="assets/js/ga.js"></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`

// Bestehenden Header/Footer einer Seite behalten, damit ein erneuter Lauf
// nicht leere Platzhalter hinterlässt, falls prerender danach nicht läuft.
function keepChrome(fname, html) {
  let old = ''
  try { old = readFileSync(join(root, fname), 'utf8') } catch { return html }
  for (const id of ['siteHeader', 'siteFooter']) {
    const re = new RegExp(`<(header|footer) id="${id}"[\\s\\S]*?</\\1>`)
    const m = old.match(re)
    if (m) html = html.replace(re, m[0])
  }
  return html
}

function card(a) {
  return `
      <a class="rg-card" href="${file(a)}">
        <span class="rg-card__media photo" data-photo="${esc(a.imageAlt)}"><img src="${img(a)}" alt="" loading="lazy" width="1200" height="675" onerror="this.remove()"></span>
        <span class="rg-card__body">
          <span class="rg-card__meta">${fmtDate(a.date)} · ${a.readMin ?? Math.max(3, Math.round(words(a) / 200))} Min. Lesezeit</span>
          <span class="rg-card__title">${esc(a.h1)}</span>
          <span class="rg-card__text">${esc(a.description)}</span>
        </span>
      </a>`
}

function articlePage(a) {
  const related = (a.related || []).map((s) => articles.find((x) => x.slug === s)).filter(Boolean)
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.h1,
      description: a.description,
      image: `${SITE}/${img(a)}`,
      datePublished: a.date,
      dateModified: a.modified || a.date,
      inLanguage: 'de-CH',
      mainEntityOfPage: url(a),
      wordCount: words(a),
      author: PUBLISHER,
      publisher: PUBLISHER,
      about: a.about || undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: a.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: strip(x.a) } }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Ratgeber', item: `${SITE}/ratgeber` },
        { '@type': 'ListItem', position: 3, name: a.crumb, item: url(a) }
      ]
    }
  ]
  const html = `${head({ title: a.title, description: a.description, canonical: url(a), ogType: 'article', ogImage: `${SITE}/${img(a)}`, ld })}
<body data-page="ratgeber">
<a class="skip-link" href="#content">Zum Inhalt springen</a>
<header id="siteHeader" class="site-header"></header>

<main id="content">

  <section class="page-head">
    <div class="page-head__inner">
      <p class="eyebrow">Ratgeber</p>
      <h1>${esc(a.h1)}</h1>
      <p>${a.lead}</p>
      <p class="rg-meta">Veröffentlicht am <time datetime="${a.date}">${fmtDate(a.date)}</time> · Gerber Transport GmbH, Winterthur</p>
    </div>
  </section>

  <nav class="crumbs" aria-label="Brotkrumen">
    <a href="index.html">Start</a> <span>›</span> <a href="ratgeber.html">Ratgeber</a> <span>›</span> ${esc(a.crumb)}
  </nav>

  <section class="section" style="padding-top:36px">
    <article class="container rg-article">
      <figure class="rg-hero photo" data-photo="${esc(a.imageAlt)}">
        <img src="${img(a)}" alt="${esc(a.imageAlt)}" width="1200" height="675" onerror="this.remove()">
      </figure>

      <aside class="rg-summary" aria-label="Das Wichtigste in Kürze">
        <h2>Das Wichtigste in Kürze</h2>
        <ul>${a.summary.map((s) => `\n          <li>${s}</li>`).join('')}
        </ul>
      </aside>

      <div class="rg-body">
${a.body.trim()}
      </div>

      <section class="rg-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Häufige Fragen</h2>${a.faq.map((x) => `
        <details>
          <summary>${esc(x.q)}</summary>
          <p>${x.a}</p>
        </details>`).join('')}
      </section>

      <div class="rg-cta">
        <h2>${esc(a.ctaTitle || 'Lieferwagen in Winterthur gesucht?')}</h2>
        <p>${a.ctaText || 'Mercedes Sprinter mit Möbelkoffer und 2.40 m Innenhöhe, Vollkasko ohne Selbstbehalt. Schreiben Sie uns Ihren Wunschtermin – wir melden uns mit einer Offerte.'}</p>
        <p class="rg-cta__actions">
          <a class="btn btn--primary" href="kontakt.html#anfrage">Lieferwagen anfragen</a>
          <a class="btn btn--ghost" href="tel:+41442404142">044 240 41 42</a>
        </p>
      </div>
${related.length ? `
      <nav class="rg-related" aria-label="Weitere Ratgeber-Artikel">
        <h2>Weiterlesen</h2>
        <ul>${related.map((r) => `\n          <li><a href="${file(r)}">${esc(r.h1)}</a></li>`).join('')}
        </ul>
      </nav>` : ''}

      <p class="rg-note">Dieser Artikel ersetzt keine Rechtsberatung. Massgebend sind die aktuellen Vorschriften von Bund, Kanton und Gemeinde sowie Ihr Mietvertrag.</p>
    </article>
  </section>

</main>
${TAIL}`
  return keepChrome(file(a), html)
}

function hubPage() {
  const description = 'Ratgeber von 4A Lieferwagen Winterthur: Führerausweis B, selber zügeln, Ladung sichern, Parkplatz sperren, Übergabe und Rückgabe des Mietlieferwagens.'
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Ratgeber – Lieferwagen mieten und selber zügeln',
      description,
      url: `${SITE}/ratgeber`,
      inLanguage: 'de-CH',
      publisher: PUBLISHER,
      hasPart: articles.map((a) => ({ '@type': 'BlogPosting', headline: a.h1, url: url(a), datePublished: a.date }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Ratgeber', item: `${SITE}/ratgeber` }
      ]
    }
  ]
  const html = `${head({ title: 'Ratgeber – Lieferwagen mieten und selber zügeln | 4A Lieferwagen Winterthur', description, canonical: `${SITE}/ratgeber`, ogType: 'website', ogImage: `${SITE}/assets/img/slml.webp`, ld })}
<body data-page="ratgeber">
<a class="skip-link" href="#content">Zum Inhalt springen</a>
<header id="siteHeader" class="site-header"></header>

<main id="content">

  <section class="page-head">
    <div class="page-head__inner">
      <p class="eyebrow">Ratgeber</p>
      <h1>Ratgeber: Lieferwagen mieten und selber zügeln</h1>
      <p>Praktisches Wissen für Ihren Transport – vom Führerausweis über die Ladungssicherung bis zur Rückgabe des Mietwagens.</p>
    </div>
  </section>

  <nav class="crumbs" aria-label="Brotkrumen">
    <a href="index.html">Start</a> <span>›</span> Ratgeber
  </nav>

  <section class="section" style="padding-top:36px">
    <div class="container">
      <div class="rg-grid">${articles.map(card).join('')}
      </div>
    </div>
  </section>

</main>
${TAIL}`
  return keepChrome('ratgeber.html', html)
}

for (const a of articles) {
  writeFileSync(join(root, file(a)), articlePage(a))
  console.log('  ' + file(a).padEnd(52) + words(a) + ' Wörter')
}
writeFileSync(join(root, 'ratgeber.html'), hubPage())
console.log('  ratgeber.html')

// Sitemap: Ratgeber-Block ersetzen bzw. vor </urlset> einfügen
const smPath = join(root, 'sitemap.xml')
let sm = readFileSync(smPath, 'utf8').replace(/\s*<!-- ratgeber:start -->[\s\S]*<!-- ratgeber:end -->/, '')
const newest = articles[0]?.date
const entries = [
  `  <url>\n    <loc>${SITE}/ratgeber</loc>\n    <lastmod>${newest}</lastmod>\n  </url>`,
  ...articles.map((a) => `  <url>\n    <loc>${url(a)}</loc>\n    <lastmod>${a.modified || a.date}</lastmod>\n  </url>`)
]
sm = sm.replace('</urlset>', `  <!-- ratgeber:start -->\n${entries.join('\n')}\n  <!-- ratgeber:end -->\n</urlset>`)
writeFileSync(smPath, sm)
console.log('  sitemap.xml (' + entries.length + ' Ratgeber-Einträge)')
