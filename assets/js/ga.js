/* Google Analytics 4 (G-HS18XFXVM7).
   Kein Einwilligungs-Banner: Information und Widerspruch in der
   Datenschutzerklärung (datenschutz.html, Link mit data-ga-optout).
   Wer widerspricht, bekommt GA in diesem Browser nicht mehr geladen. */
(function () {
  var ID = 'G-HS18XFXVM7', OPT = '4a-ga-optout';
  var out = false;
  try { out = localStorage.getItem(OPT) === '1'; } catch (e) {}

  if (out) {
    window['ga-disable-' + ID] = true;
  } else {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);

    // Anrufe und E-Mails als Ereignisse (Formulare melden generate_lead in main.js).
    document.addEventListener('click', function (e) {
      var l = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="mailto:"]');
      if (l) window.gtag('event', l.href.indexOf('tel:') === 0 ? 'click_phone' : 'click_email', { link_url: l.href, page_path: location.pathname });
    }, true);
  }

  function clearGa() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (!/^_ga/.test(n)) return;
      ['', ';domain=.' + host, ';domain=' + location.hostname].forEach(function (d) {
        document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + d;
      });
    });
  }

  function label(a, state) {
    a.textContent = out ? 'Google Analytics wieder aktivieren' : 'Google Analytics in diesem Browser deaktivieren';
    if (state) state.textContent = out ? 'Google Analytics ist in diesem Browser deaktiviert.' : 'Google Analytics ist aktiv.';
  }

  function bind() {
    document.querySelectorAll('[data-ga-optout]').forEach(function (a) {
      var state = document.getElementById('gaState');
      label(a, state);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        out = !out;
        try { if (out) localStorage.setItem(OPT, '1'); else localStorage.removeItem(OPT); } catch (x) {}
        if (out) { window['ga-disable-' + ID] = true; clearGa(); label(a, state); }
        else location.reload();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
