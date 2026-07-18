/* =========================================================
   4A Lieferwagen — Interaktion & Inhaltsdaten
   Die Listen unten sind der einzige Ort, an dem Fahrzeuge,
   Vorteile, Einsatzzwecke und FAQ gepflegt werden.
   ========================================================= */

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
  { icon: 'truck',          title: 'Umzüge' },
  { icon: 'sofa',           title: 'Möbeltransport' },
  { icon: 'building-2',     title: 'Firmenlieferungen' },
  { icon: 'shopping-cart',  title: 'Grosseinkäufe' },
  { icon: 'party-popper',   title: 'Veranstaltungen' },
  { icon: 'hammer',         title: 'Handwerker' },
  { icon: 'store',          title: 'Marktbeschicker' },
  { icon: 'graduation-cap', title: 'Studenten' },
  { icon: 'package',        title: 'Sperrige Güter' },
  { icon: 'route',          title: 'Fernumzüge' }
];

const faq = [
  { q: 'Welchen Führerausweis brauche ich?', a: 'Für alle unsere Lieferwagen bis 3.5 t genügt der Führerausweis der Kategorie B.' },
  { q: 'Ist eine Kaution erforderlich?', a: 'Ja, bei der Abholung wird eine Kaution hinterlegt und nach der Rückgabe vollständig zurückerstattet.' },
  { q: 'Was ist im Mietpreis enthalten?', a: 'Vollkasko ohne Selbstbehalt sowie unbegrenzte Kilometer innerhalb der Schweiz.' },
  { q: 'Wann kann ich abholen und zurückgeben?', a: 'Abholung und Rückgabe vereinbaren wir individuell mit Ihnen — melden Sie sich einfach mit Ihrem Wunschtermin.' }
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Rendering ---------- */

function renderFleet() {
  document.getElementById('fleetList').innerHTML = fleet.map((v) => `
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
          <a class="btn btn--primary" href="#top">Jetzt anfragen <i data-lucide="arrow-right" aria-hidden="true"></i></a>
          <p class="vehicle__stock"><i data-lucide="check-circle-2" aria-hidden="true"></i>${esc(v.count)} Fahrzeuge verfügbar</p>
        </div>
      </div>
    </article>
  `).join('');
}

function renderBenefits() {
  document.getElementById('benefitList').innerHTML = benefits.map((b) => `
    <article class="benefit">
      <div class="benefit__icon"><i data-lucide="${esc(b.icon)}" aria-hidden="true"></i></div>
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.desc)}</p>
    </article>
  `).join('');
}

function renderStats() {
  document.getElementById('statList').innerHTML = stats.map((s) => `
    <div class="stat">
      <span class="stat__icon"><i data-lucide="${esc(s.icon)}" aria-hidden="true"></i></span>
      <p class="stat__value">${esc(s.v)}</p>
      <p class="stat__label">${esc(s.l)}</p>
    </div>
  `).join('');
}

function renderUseCases() {
  document.getElementById('usecaseList').innerHTML = useCases.map((u) => `
    <li><i data-lucide="${esc(u.icon)}" aria-hidden="true"></i>${esc(u.title)}</li>
  `).join('');
}

function renderFaq() {
  document.getElementById('faqList').innerHTML = faq.map((it, i) => `
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

  // Erstes Item offen (wie im Design)
  if (buttons[0]) open(buttons[0]);

  // Offene Panels an Höhenänderungen (Resize) anpassen
  window.addEventListener('resize', () => {
    buttons.filter((b) => b.getAttribute('aria-expanded') === 'true').forEach(open);
  });
}

// Mobile Navigation
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

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
  const pickup = document.getElementById('pickupDate');
  const ret = document.getElementById('returnDate');
  const error = document.getElementById('searchError');

  // Vergangene Daten ausschliessen
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
    document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
  });
}

// Lead-Formular: Validierung → Erfolgs-Panel
function initSellForm() {
  const form = document.getElementById('sellForm');
  const body = document.getElementById('sellFormBody');
  const success = document.getElementById('sellSuccess');
  const error = document.getElementById('sellError');
  const reset = document.getElementById('sellReset');

  const required = ['sellName', 'sellPhone', 'sellBrand'].map((id) => document.getElementById(id));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.hidden = true;
    required.forEach((f) => f.removeAttribute('aria-invalid'));

    const empty = required.find((f) => !f.value.trim());
    if (empty) {
      error.textContent = 'Bitte Name, Telefon und Marke ausfüllen.';
      error.hidden = false;
      empty.setAttribute('aria-invalid', 'true');
      empty.focus();
      return;
    }

    // Produktion: hier an die Lead-/Mail-API senden (fetch POST).
    body.hidden = true;
    success.hidden = false;
    success.focus();
  });

  reset.addEventListener('click', () => {
    form.reset();
    success.hidden = true;
    body.hidden = false;
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

renderFleet();
renderBenefits();
renderStats();
renderUseCases();
renderFaq();
initFaq();
initNav();
initSearch();
initSellForm();
drawIcons();
