/* Schreibt die Inhalte, die main.js im Browser erzeugt, fest ins HTML.

   Grund: Navigation, Fuhrpark, Einsatzzwecke und FAQ existierten nur im
   JavaScript — im ausgelieferten Quelltext standen fast leere Seiten ohne
   einen einzigen internen Link. Suchmaschinen mussten die Seite erst
   rendern, um ueberhaupt zu sehen, dass es Unterseiten gibt.

   main.js bleibt die einzige Quelle der Inhalte: das Skript wird hier
   ausgefuehrt, nur gegen ein minimales Dokument-Objekt, das die erzeugten
   Fragmente einsammelt statt sie anzuzeigen. Nach jeder Aenderung an den
   Daten in main.js erneut laufen lassen:

     node tools/prerender.mjs
*/
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const script = readFileSync(join(root, 'assets/js/main.js'), 'utf8')

const CONTAINERS = [
  'siteHeader', 'siteFooter', 'fleetList', 'benefitList',
  'statList', 'usecaseList', 'usecaseCards', 'faqList',
]

// main.js gegen ein Mini-Dokument laufen lassen und einsammeln, was es
// in welchen Container schreiben wuerde.
function render(pageKey, presentIds) {
  const captured = {}
  const stub = (id) => ({
    id,
    dataset: {},
    set innerHTML(v) { captured[id] = { ...(captured[id] || {}), html: v } },
    get innerHTML() { return (captured[id] || {}).html || '' },
    set className(v) { captured[id] = { ...(captured[id] || {}), cls: v } },
    get className() { return (captured[id] || {}).cls || '' },
    children: [],
    addEventListener() {},
    querySelectorAll: () => [],
    appendChild() {},
  })
  const document = {
    body: { dataset: { page: pageKey } },
    getElementById: (id) => (presentIds.has(id) ? stub(id) : null),
    querySelectorAll: () => [],
    addEventListener() {},
  }
  // Kein IntersectionObserver und kein lucide im Sandkasten: die
  // Interaktions-Initialisierer steigen dadurch sofort wieder aus.
  const window = { addEventListener() {}, matchMedia: () => ({ matches: false }) }
  vm.runInNewContext(script, { document, window, setTimeout() {}, console })
  return captured
}

// Container <tag … id="X" …> … </tag> finden. Gleichnamige Tags im Inneren
// werden mitgezaehlt — sonst trifft der Ersatz beim zweiten Lauf (der
// Container ist dann nicht mehr leer) das falsche Schlusstag und zerlegt
// die Seite.
function findContainer(html, id) {
  const open = new RegExp('<([a-z]+)([^>]*\\bid="' + id + '"[^>]*)>')
  const m = html.match(open)
  if (!m) return null
  const tag = m[1]
  const innerStart = m.index + m[0].length
  const step = new RegExp('<(/?)' + tag + '(\\s[^>]*)?>', 'g')
  step.lastIndex = innerStart
  let depth = 1, hit
  while ((hit = step.exec(html))) {
    depth += hit[1] ? -1 : 1
    if (depth === 0) {
      return {
        openTag: m[0], tagName: tag, attrs: m[2],
        start: m.index, innerStart, innerEnd: hit.index,
        end: hit.index + hit[0].length, closeTag: hit[0],
      }
    }
  }
  return null
}

let touched = 0
for (const file of readdirSync(root).filter((f) => f.endsWith('.html'))) {
  let html = readFileSync(join(root, file), 'utf8')
  const pageKey = (html.match(/<body[^>]*data-page="([^"]*)"/) || [, ''])[1]
  const present = new Set(CONTAINERS.filter((id) => html.includes('id="' + id + '"')))
  if (!present.size) continue

  const out = render(pageKey, present)
  const written = []
  for (const id of present) {
    const piece = out[id]
    if (!piece || !piece.html) continue
    const c = findContainer(html, id)
    if (!c) { console.warn('  ! ' + file + ': Container ' + id + ' nicht gefunden'); continue }
    // Klassen, die main.js per className setzt, fest ins Markup uebernehmen.
    let open = c.openTag
    if (piece.cls && !/\bclass="/.test(c.attrs)) {
      open = '<' + c.tagName + c.attrs + ' class="' + piece.cls + '">'
    }
    html = html.slice(0, c.start) + open + piece.html + c.closeTag + html.slice(c.end)
    written.push(id)
  }
  if (written.length) {
    writeFileSync(join(root, file), html)
    touched++
    console.log('  ' + file.padEnd(20) + written.join(', '))
  }
}
console.log('\nFertig: ' + touched + ' Seite(n) mit festem Inhalt geschrieben.')
