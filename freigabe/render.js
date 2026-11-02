// Seitenbau für jobs.pycruit.de. Derselbe Code steckt im n8n-Knoten "Seiten bauen".
const BASIS = 'https://jobs.pycruit.de';
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (n) => Number(n).toLocaleString('de-DE');
const liste = (a) => '<ul class="list">' + (a || []).filter(Boolean).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
const kopf = (titel, beschr, pfad, extra) => '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>' + esc(titel) + '</title><meta name="description" content="' + esc(beschr) + '">'
  + '<link rel="canonical" href="' + BASIS + pfad + '">'
  + '<meta property="og:type" content="website"><meta property="og:site_name" content="pycruit"><meta property="og:title" content="' + esc(titel) + '"><meta property="og:description" content="' + esc(beschr) + '"><meta property="og:url" content="' + BASIS + pfad + '"><meta property="og:image" content="' + BASIS + '/assets/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
  + '<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png"><link rel="icon" type="image/png" sizes="180x180" href="/assets/favicon.png"><link rel="apple-touch-icon" href="/assets/favicon.png">'
  + '<link rel="stylesheet" href="/assets/style.css">' + (extra || '') + '</head><body>'
  + '<header class="top"><div class="wrap"><a href="/" aria-label="Alle Stellen"><img src="/assets/logo.png" alt="pycruit" width="82" height="36"></a><nav><a href="/">Alle Stellen</a><a href="https://pycruit.de/" target="_blank" rel="noopener">Über pycruit</a></nav></div></header>';
const fuss = '<footer class="foot"><a href="https://pycruit.de/" aria-label="pycruit Startseite"><img src="/assets/logo.png" alt="pycruit" width="110" height="48"></a><p>© ' + new Date().getFullYear() + ' pycruit GmbH</p><nav><a href="/">Alle Stellen</a><a href="https://pycruit.de/impressum">Impressum</a><a href="/datenschutz/">Datenschutz für Bewerber</a><a href="https://pycruit.de/impressum#datenschutz">Datenschutzerklärung</a></nav></footer>';
const IC = {
  ort: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  zeit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  haus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
  eur: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>'
};
function gehaltText(j) { return (j.gehalt_zeigen && j.gehalt_von) ? eur(j.gehalt_von) + (j.gehalt_bis && j.gehalt_bis > j.gehalt_von ? ' bis ' + eur(j.gehalt_bis) : '') + ' Euro brutto im Jahr' : ''; }

function stellenSeite(j) {
  const pfad = '/stellen/' + j.slug + '/';
  const geh = gehaltText(j);
  const beschrKurz = (j.titel + ' in ' + j.ort + '. ' + (j.einleitung || '')).slice(0, 155);
  const descHtml = '<p>' + esc(j.einleitung) + '</p><p>' + esc(j.ueber_unternehmen) + '</p><h3>Ihre Aufgaben</h3>' + liste(j.aufgaben) + '<h3>Ihr Profil</h3>' + liste(j.profil) + '<h3>Das bietet das Unternehmen</h3>' + liste(j.angebot);
  const ld = {
    '@context': 'https://schema.org', '@type': 'JobPosting',
    title: j.titel, description: descHtml, datePosted: j.datum, validThrough: j.gueltig_bis,
    employmentType: j.arbeitszeit === 'Teilzeit' ? 'PART_TIME' : 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: 'confidential' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.ort, postalCode: j.plz || undefined, addressRegion: j.region || undefined, addressCountry: 'DE' } },
    identifier: { '@type': 'PropertyValue', name: 'pycruit', value: j.slug },
    directApply: true, url: BASIS + pfad
  };
  if (j.gehalt_zeigen && j.gehalt_von) ld.baseSalary = { '@type': 'MonetaryAmount', currency: 'EUR', value: { '@type': 'QuantitativeValue', minValue: Number(j.gehalt_von), maxValue: Number(j.gehalt_bis || j.gehalt_von), unitText: 'YEAR' } };
  const json = JSON.stringify(ld).replace(/</g, '\\u003c');
  const facts = '<ul class="facts"><li>' + IC.ort + esc(j.ort) + '</li><li>' + IC.zeit + esc(j.arbeitszeit || 'Vollzeit') + ', Festanstellung</li>'
    + (j.homeoffice ? '<li>' + IC.haus + 'Homeoffice: ' + esc(j.homeoffice) + '</li>' : '') + (geh ? '<li>' + IC.eur + esc(geh) + '</li>' : '') + '</ul>';
  return kopf(j.titel + ' in ' + j.ort + ' | pycruit', beschrKurz, pfad, '<script type="application/ld+json">' + json + '</script>')
    + '<div class="hero"><div class="wrap"><span class="eyebrow">Stelle vermittelt von pycruit</span><h1>' + esc(j.titel) + '</h1><p>' + esc(j.einleitung) + '</p>' + facts
    + '<div class="cta"><a class="btn" href="#bewerben">Jetzt bewerben</a><small>Dauert etwa zwei Minuten. Ein Lebenslauf ist kein Muss.</small></div></div></div>'
    + '<main class="wrap">'
    + '<section><h2>Das Unternehmen</h2><p style="margin:0;color:var(--tx2)">' + esc(j.ueber_unternehmen) + '</p></section>'
    + '<section><h2>Ihre Aufgaben</h2>' + liste(j.aufgaben) + '</section>'
    + '<section><h2>Ihr Profil</h2>' + liste(j.profil) + '</section>'
    + '<section><h2>Das bietet das Unternehmen</h2>' + liste(j.angebot) + '</section>'
    + '<section><h2>So geht es weiter</h2><div class="steps"><div><i>1</i><b>Kurz bewerben</b><span>Name, E-Mail und ein paar Angaben reichen.</span></div><div><i>2</i><b>Gespräch mit uns</b><span>Wir rufen Sie an und erzählen Ihnen alles zur Stelle und zum Unternehmen.</span></div><div><i>3</i><b>Sie entscheiden</b><span>Ihre Unterlagen gehen erst an das Unternehmen, wenn Sie zustimmen.</span></div></div></section>'
    + '<section id="bewerben"><form class="form" id="bewerbung" novalidate>'
    + '<h2>Jetzt bewerben</h2><p class="sub">Für: <b>' + esc(j.titel) + '</b>, ' + esc(j.ort) + '</p>'
    + '<input type="hidden" name="stelle" value="' + esc(j.slug) + '"><div class="hp" aria-hidden="true"><label>Firma<input type="text" name="firma" tabindex="-1" autocomplete="off"></label></div>'
    + '<div class="grid">'
    + '<div><label for="bw-vn">Vorname</label><input id="bw-vn" type="text" name="vorname" required autocomplete="given-name"></div>'
    + '<div><label for="bw-nn">Nachname</label><input id="bw-nn" type="text" name="nachname" required autocomplete="family-name"></div>'
    + '<div><label for="bw-em">E-Mail</label><input id="bw-em" type="email" name="email" required autocomplete="email"></div>'
    + '<div><label for="bw-tel">Telefon <span class="opt">(optional)</span></label><input id="bw-tel" type="tel" name="telefon" autocomplete="tel"></div>'
    + '<div><label for="bw-ab">Wann könnten Sie wechseln?</label><select id="bw-ab" name="wechsel"><option value="">Bitte wählen</option><option>Sofort</option><option>In 1 bis 3 Monaten</option><option>In 3 bis 6 Monaten</option><option>Später, ich schaue mich um</option></select></div>'
    + '<div><label for="bw-geh">Gehaltsvorstellung <span class="opt">(optional)</span></label><input id="bw-geh" type="text" name="gehalt" placeholder="z. B. 70.000 Euro brutto im Jahr"></div>'
    + '<div class="full"><label for="bw-cv">Lebenslauf <span class="opt">(optional, PDF oder Word, bis 8 MB)</span></label><div class="file"><input id="bw-cv" type="file" name="lebenslauf" accept=".pdf,.doc,.docx,application/pdf"></div></div>'
    + '<div class="full"><label for="bw-txt">Was sollten wir noch wissen? <span class="opt">(optional)</span></label><textarea id="bw-txt" name="nachricht" placeholder="Zum Beispiel Ihr Link zu LinkedIn oder Xing oder was Ihnen bei einem Wechsel wichtig ist."></textarea></div>'
    + '<div class="full"><label class="chk"><input type="checkbox" name="pool" value="ja"><span>Sie dürfen mich auch für andere passende Stellen ansprechen. Meine Daten werden dafür bis zu zwölf Monate gespeichert, ich kann das jederzeit widerrufen.</span></label></div>'
    + '</div>'
    + '<p class="legal">Mit dem Absenden schicken Sie uns Ihre Bewerbung. Ihre Unterlagen gehen erst an das Unternehmen, wenn Sie zustimmen. Mehr dazu im <a href="/datenschutz/">Datenschutzhinweis für Bewerber</a>.</p>'
    + '<div class="cta"><button class="btn" type="submit">Bewerbung senden</button></div><div class="msg" id="bw-msg" role="status" aria-live="polite"></div>'
    + '</form></section>'
    + '<section><div class="note"><b>Über pycruit:</b> Wir sind eine Personalvermittlung aus Berlin mit über zehn Jahren Recruiting-Praxis. Für Sie als Bewerberin oder Bewerber ist unsere Vermittlung kostenlos.</div></section>'
    + '</main>' + fuss + '<script src="/assets/bewerbung.js" defer></script></body></html>';
}

function uebersicht(jobs) {
  const items = jobs.length ? '<ul class="jobs">' + jobs.map((j) => '<li><a href="/stellen/' + esc(j.slug) + '/"><b>' + esc(j.titel) + '</b><span>' + esc(j.ort) + ' · ' + esc(j.arbeitszeit || 'Vollzeit') + (j.homeoffice ? ' · Homeoffice ' + esc(j.homeoffice) : '') + (gehaltText(j) ? ' · ' + esc(gehaltText(j)) : '') + '</span></a></li>').join('') + '</ul>'
    : '<div class="empty">Gerade ist keine Stelle ausgeschrieben. Schauen Sie bald wieder vorbei oder schreiben Sie uns an <a href="mailto:kontakt@pycruit.de">kontakt@pycruit.de</a>.</div>';
  return kopf('Offene Stellen | pycruit', 'Offene Stellen, die pycruit für Unternehmen besetzt. Kurz bewerben, persönlich beraten werden.', '/')
    + '<div class="hero"><div class="wrap"><span class="eyebrow">Offene Stellen</span><h1>Ihr nächster Job, persönlich vermittelt.</h1><p>Wir besetzen diese Stellen für Unternehmen, die wir in der Anzeige noch nicht nennen. Im Gespräch erfahren Sie alles. Für Sie ist das kostenlos.</p></div></div>'
    + '<main class="wrap"><section>' + items + '</section></main>' + fuss + '</body></html>';
}

function sitemap(jobs) {
  const u = (loc, last) => '<url><loc>' + BASIS + loc + '</loc>' + (last ? '<lastmod>' + last.slice(0, 10) + '</lastmod>' : '') + '</url>';
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + u('/', jobs.length ? jobs.map((j) => j.datum).sort().pop() : '') + jobs.map((j) => u('/stellen/' + j.slug + '/', j.datum)).join('') + u('/datenschutz/', '') + '</urlset>\n';
}
if (typeof module !== 'undefined') module.exports = { stellenSeite, uebersicht, sitemap };
