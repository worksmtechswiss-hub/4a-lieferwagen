/* =========================================================
   4A Lieferwagen — Daten, gemeinsames Chrome (Header/Footer) & Interaktion
   Ein Skript für alle Seiten. Renderer/Interaktionen laufen nur, wenn der
   passende Container auf der Seite vorhanden ist (Guards).
   Die aktive Seite steht in <body data-page="…">.
   ========================================================= */

/* ---------- Inhaltsdaten ---------- */

/* Fuhrpark. Weitere Fahrzeuge: einfach einen weiteren Eintrag ergänzen.
   `photo` ist der Pfad zum Foto — fehlt die Datei, zeigt die Karte den
   Platzhalter aus `photoAlt` an. */
const fleet = [
  {
    name: 'Mercedes Sprinter 316 CDI',
    klass: 'Möbelkoffer',
    price: '150',
    count: 4,
    best: 'Möbelkoffer mit Flügeltüren und 2.40 m Innenhöhe — ab Werk sind die Aufbauten tiefer. So transportieren Sie Schränke stehend.',
    specs: [
      { icon: 'arrow-up-down', text: '2.40 m Innenhöhe' },
      { icon: 'door-open',     text: 'Flügeltüren' },
      { icon: 'video',         text: 'Rückfahrkamera' },
      { icon: 'link',          text: 'Anhängerkupplung' },
      { icon: 'settings',      text: 'Handschaltung' }
    ],
    photo: 'assets/img/slml.webp',
    photoAlt: 'Mercedes Sprinter 316 CDI mit Möbelkoffer-Aufbau'
  }
];

const benefits = [
  { icon: 'clock',        title: 'Flexible Zeiten',     desc: 'Abholung und Rückgabe vereinbaren wir individuell — abgestimmt auf Ihre Termine.' },
  { icon: 'receipt',      title: 'Transparente Preise', desc: 'Keine versteckten Kosten. Sie wissen von Anfang an genau, was Sie zahlen.' },
  { icon: 'shield-check', title: 'Vollkasko inklusive', desc: 'Jede Miete beinhaltet eine umfassende Versicherung — ganz ohne Selbstbehalt.' }
];

/* Nur belegbare Fakten — die neue Firma hat noch keine Vermietungszahlen
   oder Bewertungen. */
const stats = [
  { icon: 'arrow-up-down', v: '2.40 m', l: 'Innenhöhe Möbelkoffer' },
  { icon: 'shield-check',  v: 'CHF 0',  l: 'Selbstbehalt' },
  { icon: 'truck',         v: '4',      l: 'Fahrzeuge im Fuhrpark' }
];

const useCases = [
  { icon: 'truck',          title: 'Umzüge',            desc: 'Vom WG-Zimmer bis zur Wohnung — mit 2.40 m Innenhöhe passen auch hohe Schränke stehend hinein.' },
  { icon: 'sofa',           title: 'Möbeltransport',    desc: 'Sofa, Schrank oder Bett sicher von A nach B, dank ebener Ladefläche und Flügeltüren.' },
  { icon: 'building-2',     title: 'Firmenlieferungen', desc: 'Zuverlässig für Waren, Material und regelmässige Touren — auch spontan buchbar.' },
  { icon: 'shopping-cart',  title: 'Grosseinkäufe',     desc: 'Möbelhaus, Baumarkt, Gartencenter: Sperriges bringen Sie in einer Fahrt nach Hause.' },
  { icon: 'party-popper',   title: 'Veranstaltungen',   desc: 'Equipment, Deko und Getränke für Fest, Markt oder Vereinsanlass an einem Stück transportieren.' },
  { icon: 'hammer',         title: 'Handwerker',        desc: 'Werkzeug und Material für die Baustelle — der Möbelkoffer schützt die Ladung vor Wetter.' },
  { icon: 'store',          title: 'Marktbeschicker',   desc: 'Stände, Ware und Ausstattung kompakt und trocken zum Marktplatz bringen.' },
  { icon: 'graduation-cap', title: 'Studenten',         desc: 'Der günstige Weg für den Zügeltag — einfach Termin vereinbaren und losfahren.' },
  { icon: 'package',        title: 'Sperrige Güter',    desc: 'Velos, Sportgeräte oder Instrumente: hoher, breiter Laderaum für Ausser­gewöhnliches.' },
  { icon: 'route',          title: 'Fernumzüge',        desc: 'Unbegrenzte Kilometer innerhalb der Schweiz — auch für die weite Strecke.' }
];

const faq = [
  { q: 'Welchen Führerausweis brauche ich?', a: 'Für alle unsere Lieferwagen bis 3.5 t genügt der Führerausweis der Kategorie B.' },
  { q: 'Ist eine Kaution erforderlich?', a: 'Ja, bei der Abholung wird eine Kaution hinterlegt und nach der Rückgabe vollständig zurückerstattet.' },
  { q: 'Was ist im Mietpreis enthalten?', a: 'Vollkasko ohne Selbstbehalt sowie unbegrenzte Kilometer innerhalb der Schweiz.' },
  { q: 'Wann kann ich abholen und zurückgeben?', a: 'Abholung und Rückgabe vereinbaren wir individuell mit Ihnen — melden Sie sich einfach mit Ihrem Wunschtermin.' },
  { q: 'Wie viel kostet die Miete?', a: 'Die Tagesmiete beginnt bei CHF 150 inklusive Vollkasko ohne Selbstbehalt. Für Ihren konkreten Zeitraum erstellen wir Ihnen gerne eine unverbindliche Offerte.' },
  { q: 'Kann ich Möbel stehend transportieren?', a: 'Ja. Der Möbelkoffer bietet 2.40 m Innenhöhe — die Aufbauten sind ab Werk tiefer, sodass auch hohe Schränke aufrecht Platz finden.' }
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Gemeinsames Chrome: Header & Footer ---------- */

const NAV = [
  { key: 'fuhrpark',      label: 'Fuhrpark',           href: 'fuhrpark.html' },
  { key: 'einsatzzwecke', label: 'Einsatzzwecke',      href: 'einsatzzwecke.html' },
  { key: 'preise',        label: 'Preise',             href: 'preise.html' },
  { key: 'verkaufen',     label: 'Fahrzeug verkaufen', href: 'verkaufen.html' },
  { key: 'faq',           label: 'FAQ',                href: 'faq.html' },
  { key: 'kontakt',       label: 'Kontakt',            href: 'kontakt.html' }
];

const FOOTER_COLS = [
  { title: 'Angebot', links: [
    { label: 'Fuhrpark', href: 'fuhrpark.html' },
    { label: 'Preise', href: 'preise.html' },
    { label: 'Einsatzzwecke', href: 'einsatzzwecke.html' }
  ] },
  { title: 'Service', links: [
    { label: 'Fahrzeug verkaufen', href: 'verkaufen.html' },
    { label: 'Häufige Fragen', href: 'faq.html' },
    { label: 'Kontakt', href: 'kontakt.html' }
  ] },
  { title: 'Standort', links: [
    { label: 'St. Gallerstrasse 182', href: 'kontakt.html' },
    { label: '8404 Winterthur', href: 'kontakt.html' },
    { label: 'info@4a-lieferwagen.ch', href: 'mailto:info@4a-lieferwagen.ch' }
  ] }
];

function renderChrome() {
  const active = document.body.dataset.page || '';
  const isHome = active === 'home';
  const home = isHome ? '#top' : 'index.html';
  const cta = isHome ? '#top' : 'index.html#top';

  const links = NAV.map((n) =>
    `<li><a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
  ).join('');

  const header = document.getElementById('siteHeader');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <nav class="nav container" aria-label="Hauptnavigation">
        <a class="brand" href="${home}">
          <span class="brand__mark" aria-hidden="true">4A</span>
          <span class="brand__text">
            <span class="brand__name">4A Lieferwagen</span>
            <span class="brand__eyebrow">Winterthur</span>
          </span>
        </a>
        <button class="nav__burger" type="button" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Menü öffnen">
          <i data-lucide="menu"></i>
        </button>
        <div class="nav__menu" id="navMenu">
          <ul class="nav__links">${links}</ul>
          <div class="nav__actions">
            <a class="btn btn--primary btn--glow" href="${cta}">Verfügbarkeit prüfen</a>
          </div>
        </div>
      </nav>`;
  }

  const footer = document.getElementById('siteFooter');
  if (footer) {
    footer.className = 'footer';
    const cols = FOOTER_COLS.map((c) => `
      <div>
        <h3>${esc(c.title)}</h3>
        <ul>${c.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`).join('');
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div>
            <a class="brand brand--light" href="${home}">
              <span class="brand__mark" aria-hidden="true">4A</span>
              <span class="brand__name">4A Lieferwagen</span>
            </a>
            <p class="footer__about">Lieferwagen mieten in Winterthur — flexibel, fair und unkompliziert. Für Privat und Gewerbe.</p>
          </div>
          ${cols}
        </div>
        <div class="footer__bottom">
          <p>© 2026 4A Lieferwagen · Winterthur</p>
          <p>Made in Switzerland</p>
        </div>
      </div>`;
  }
}

/* ---------- Rendering (nur wenn Container vorhanden) ---------- */

function renderFleet() {
  const el = document.getElementById('fleetList');
  if (!el) return;
  el.innerHTML = fleet.map((v) => `
    <article class="vehicle">
      <div class="vehicle__media photo" data-photo="Foto ${esc(v.name)}">
        <img src="${esc(v.photo)}" alt="${esc(v.photoAlt)}" loading="lazy" onerror="this.remove()">
        <span class="vehicle__class">${esc(v.klass)}</span>
      </div>
      <div class="vehicle__body">
        <div class="vehicle__top">
          <div>
            <h3 class="vehicle__name">${esc(v.name)}</h3>
            <p class="vehicle__best">${esc(v.best)}</p>
          </div>
          <p class="vehicle__price">
            <small>ab</small> <b>CHF ${esc(v.price)}</b>
            <span>pro Tag</span>
          </p>
        </div>
        <ul class="vehicle__specs">
          ${v.specs.map((s) => `<li><i data-lucide="${esc(s.icon)}" aria-hidden="true"></i>${esc(s.text)}</li>`).join('')}
        </ul>
        <div class="vehicle__actions">
          <a class="btn btn--primary" href="${document.body.dataset.page === 'home' ? '#top' : 'index.html#top'}">Jetzt anfragen <i data-lucide="arrow-right" aria-hidden="true"></i></a>
          <p class="vehicle__stock"><i data-lucide="check-circle-2" aria-hidden="true"></i>${esc(v.count)} Fahrzeuge verfügbar</p>
        </div>
      </div>
    </article>
  `).join('');
}

function renderBenefits() {
  const el = document.getElementById('benefitList');
  if (!el) return;
  el.innerHTML = benefits.map((b) => `
    <article class="benefit">
      <div class="benefit__icon"><i data-lucide="${esc(b.icon)}" aria-hidden="true"></i></div>
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.desc)}</p>
    </article>
  `).join('');
}

function renderStats() {
  const el = document.getElementById('statList');
  if (!el) return;
  el.innerHTML = stats.map((s) => `
    <div class="stat">
      <span class="stat__icon"><i data-lucide="${esc(s.icon)}" aria-hidden="true"></i></span>
      <p class="stat__value">${esc(s.v)}</p>
      <p class="stat__label">${esc(s.l)}</p>
    </div>
  `).join('');
}

/* Einsatzzwecke: kompakte Pills (Startseite) ODER Detailkarten (Unterseite),
   je nach Container. */
function renderUseCases() {
  const pills = document.getElementById('usecaseList');
  if (pills) {
    pills.innerHTML = useCases.map((u) => `
      <li><i data-lucide="${esc(u.icon)}" aria-hidden="true"></i>${esc(u.title)}</li>
    `).join('');
  }
  const cards = document.getElementById('usecaseCards');
  if (cards) {
    cards.innerHTML = useCases.map((u) => `
      <article class="usecase">
        <div class="usecase__icon"><i data-lucide="${esc(u.icon)}" aria-hidden="true"></i></div>
        <h3>${esc(u.title)}</h3>
        <p>${esc(u.desc)}</p>
      </article>
    `).join('');
  }
}

function renderFaq() {
  const el = document.getElementById('faqList');
  if (!el) return;
  el.innerHTML = faq.map((it, i) => `
    <div class="faq__item">
      <h3 style="margin:0">
        <button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
          <span>${esc(it.q)}</span>
          <span class="faq__chevron"><i data-lucide="chevron-down" aria-hidden="true"></i></span>
        </button>
      </h3>
      <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <p>${esc(it.a)}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- Interaktion ---------- */

// FAQ: single-open Accordion
function initFaq() {
  const buttons = Array.from(document.querySelectorAll('.faq__q'));
  if (!buttons.length) return;

  const close = (btn) => {
    btn.setAttribute('aria-expanded', 'false');
    document.getElementById(btn.getAttribute('aria-controls')).style.maxHeight = null;
  };
  const open = (btn) => {
    btn.setAttribute('aria-expanded', 'true');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    panel.style.maxHeight = panel.scrollHeight + 'px';
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      buttons.forEach(close);
      if (!isOpen) open(btn);
    });
  });

  open(buttons[0]);

  window.addEventListener('resize', () => {
    buttons.filter((b) => b.getAttribute('aria-expanded') === 'true').forEach(open);
  });
}

// Mobile Navigation
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
    toggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
    drawIcons();
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      drawIcons();
    }
  });
}

// Hero-Suche: Datumsplausibilität prüfen, dann zum Fuhrpark
function initSearch() {
  const form = document.getElementById('searchForm');
  if (!form) return;
  const pickup = document.getElementById('pickupDate');
  const ret = document.getElementById('returnDate');
  const error = document.getElementById('searchError');

  const today = new Date().toISOString().split('T')[0];
  pickup.min = today;
  ret.min = today;
  pickup.addEventListener('change', () => { ret.min = pickup.value || today; });

  const fail = (msg, field) => {
    error.textContent = msg;
    error.hidden = false;
    field.setAttribute('aria-invalid', 'true');
    field.focus();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.hidden = true;
    [pickup, ret].forEach((f) => f.removeAttribute('aria-invalid'));

    if (!pickup.value) return fail('Bitte ein Abholdatum wählen.', pickup);
    if (!ret.value) return fail('Bitte ein Rückgabedatum wählen.', ret);
    if (ret.value < pickup.value) return fail('Die Rückgabe muss nach der Abholung liegen.', ret);

    // Produktion: hier die Verfügbarkeits-API abfragen und Resultate anzeigen.
    const target = document.getElementById('fleet');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* Lead-/Kontaktformular: Validierung → Erfolgs-Panel.
   Konvention: zu Formular-Id X gehören X+'Body', X+'Success', X+'Error', X+'Reset'.
   `required` = Liste von Feld-Ids, `msg` = Fehlermeldung bei leeren Pflichtfeldern.
   Kein Backend: hier gehört später ein fetch-POST an die Lead-/Mail-API hin. */
function initLeadForm(formId, required, msg) {
  const form = document.getElementById(formId);
  if (!form) return;
  const body = document.getElementById(formId + 'Body');
  const success = document.getElementById(formId + 'Success');
  const error = document.getElementById(formId + 'Error');
  const reset = document.getElementById(formId + 'Reset');
  const fields = required.map((id) => document.getElementById(id));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.hidden = true;
    fields.forEach((f) => f.removeAttribute('aria-invalid'));

    const empty = fields.find((f) => !f.value.trim());
    if (empty) {
      error.textContent = msg;
      error.hidden = false;
      empty.setAttribute('aria-invalid', 'true');
      empty.focus();
      return;
    }

    body.hidden = true;
    success.hidden = false;
    success.focus();
  });

  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      success.hidden = true;
      body.hidden = false;
    });
  }
}

/* Scroll-Reveal: Inhaltsblöcke unterhalb des ersten Viewports blenden beim
   Reinscrollen sanft ein. Bereits sichtbare Elemente werden NICHT versteckt
   (kein Flash). Respektiert prefers-reduced-motion. */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const selector = [
    '.section__head', '.vehicle', '.benefit', '.usecase', '.step',
    '.price-card', '.stat', '.faq__item', '.split__copy', '.lead-form',
    '.price-note', '.cta__inner', '.location > div', '.usecases li'
  ].map((s) => 'main ' + s).join(', ');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  const stagger = new Map();
  document.querySelectorAll(selector).forEach((el) => {
    // Bereits (fast) sichtbare Elemente sofort belassen — kein Verstecken, kein Flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add('reveal');
    const p = el.parentElement;
    const i = stagger.get(p) || 0;
    stagger.set(p, i + 1);
    if (i) el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
    io.observe(el);
  });
}

/* ---------- Icons ---------- */

function drawIcons() {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  } else {
    setTimeout(drawIcons, 120);
  }
}

/* ---------- Start ---------- */

renderChrome();
renderFleet();
renderBenefits();
renderStats();
renderUseCases();
renderFaq();
initFaq();
initNav();
initSearch();
initLeadForm('sellForm', ['sellName', 'sellPhone', 'sellBrand'], 'Bitte Name, Telefon und Marke ausfüllen.');
initLeadForm('contactForm', ['contactName', 'contactEmail', 'contactMessage'], 'Bitte Name, E-Mail und Nachricht ausfüllen.');
initReveal();
drawIcons();
