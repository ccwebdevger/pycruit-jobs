(function () {
  var ZIEL = 'https://ccpycruit.app.n8n.cloud/webhook/pycruit-bewerbung';
  var MAX = 8 * 1024 * 1024;
  var f = document.getElementById('bewerbung');
  if (!f) return;
  var start = Date.now();
  var msg = document.getElementById('bw-msg');
  var btn = f.querySelector('button[type=submit]');
  function zeige(t, ok) { msg.className = 'msg ' + (ok ? 'ok' : 'err'); msg.textContent = t; msg.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    var datei = f.querySelector('input[type=file]');
    if (datei && datei.files[0]) {
      var d = datei.files[0];
      if (d.size > MAX) { zeige('Die Datei ist größer als 8 MB. Bitte laden Sie eine kleinere Datei hoch oder senden Sie die Bewerbung ohne Lebenslauf.', false); return; }
      if (!/\.(pdf|docx?)$/i.test(d.name)) { zeige('Bitte laden Sie den Lebenslauf als PDF- oder Word-Datei hoch.', false); return; }
    }
    var fd = new FormData(f);
    fd.append('dauer', String(Math.round((Date.now() - start) / 1000)));
    fd.append('seite', location.pathname);
    btn.disabled = true; var alt = btn.textContent; btn.textContent = 'Wird gesendet …';
    fetch(ZIEL, { method: 'POST', body: fd })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        if (x.ok && x.j && x.j.ok) {
          f.reset();
          f.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
          zeige('Danke! Ihre Bewerbung ist bei uns angekommen. Sie bekommen gleich eine Bestätigung per E-Mail. Wir melden uns innerhalb von zwei Werktagen persönlich bei Ihnen.', true);
          btn.textContent = 'Gesendet';
        } else {
          zeige((x.j && x.j.fehler) || 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie uns an kontakt@pycruit.de.', false);
          btn.disabled = false; btn.textContent = alt;
        }
      })
      .catch(function () {
        zeige('Die Verbindung hat nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie uns an kontakt@pycruit.de.', false);
        btn.disabled = false; btn.textContent = alt;
      });
  });
})();
