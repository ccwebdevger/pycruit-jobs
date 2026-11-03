/* Kandidatenprofil: gemeinsame Vorlage für Prüfseite (Browser) und PDF (n8n). */
var PROFIL_BASE = 'https://jobs.pycruit.de';
var PROFIL_TEAM = {
  '24260132': { name: 'Christian Czepeczauer', tel: '+49 162 26 77 665', mail: 'cc@pycruit.de', foto: '/assets/christian.jpg' },
  '24263740': { name: 'Tina Mater', tel: '+49 179 4239004', mail: 'tm@pycruit.de', foto: '' }
};
function profilHtml(p) {
  p = p || {};
  var e = function (x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var B = PROFIL_BASE;
  var o = PROFIL_TEAM[String(p.owner)] || PROFIL_TEAM['24260132'];
  var ini = function (n) { return String(n || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); };
  var bild = function (gross) { return o.foto ? '<img src="' + B + o.foto + '" alt="">' : '<span class="mini' + (gross ? ' g' : '') + '">' + ini(o.name) + '</span>'; };
  var f = p.fakten || {};
  var pill = function (b) { var c = b === 'erfüllt' ? 'ok' : b === 'teilweise' ? 'mid' : 'op'; return '<span class="pill ' + c + '">' + e(b || 'offen') + '</span>'; };
  var pass = p.passung || [];
  var zeilen = function (g, t) { var l = pass.filter(function (x) { return (x.gruppe || 'muss') === g && x.kriterium; }); return l.length ? '<tr><td class="lbl" colspan="3">' + t + '</td></tr>' + l.map(function (x) { return '<tr><td class="k">' + e(x.kriterium) + '</td><td class="s">' + pill(x.bewertung) + '</td><td>' + e(x.beleg) + '</td></tr>'; }).join('') : ''; };
  var datum = p.datum ? String(p.datum).split('-').reverse().join('.') : '';
  var gdatum = p.gespraech_am ? String(p.gespraech_am).split('-').reverse().join('.') : '';
  var foot = function (n) { return '<div class="foot"><span>Vertraulich. Nur für die Besetzung dieser Stelle, Weitergabe nicht gestattet.</span><span>pycruit GmbH · kontakt@pycruit.de · Seite ' + n + '/2</span></div>'; };
  var css = "@font-face{font-family:'Inter';font-weight:400;src:url(" + B + "/assets/fonts/inter-400.woff2)}@font-face{font-family:'Inter';font-weight:500;src:url(" + B + "/assets/fonts/inter-500.woff2)}@font-face{font-family:'Inter';font-weight:600;src:url(" + B + "/assets/fonts/inter-600.woff2)}@font-face{font-family:'Inter Tight';font-weight:800;src:url(" + B + "/assets/fonts/inter-tight-800.woff2)}"
    + "@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Inter,sans-serif;color:#191919;font-size:10pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}"
    + ".page{width:210mm;height:297mm;padding:0 0 14mm;position:relative;page-break-after:always;overflow:hidden;background:#fff}.page:last-child{page-break-after:auto}"
    + ".band{height:5mm;background:linear-gradient(90deg,#EE3934,#D2126C)}.head{display:flex;justify-content:space-between;align-items:center;padding:8mm 16mm 0}.head img{height:11mm}"
    + ".head .tag{font-size:8pt;font-weight:600;letter-spacing:.08em;color:#6B6B6B;text-transform:uppercase;text-align:right}.head .tag b{display:block;color:#D2126C;font-size:8.5pt}"
    + "h1,h2,h3{font-family:'Inter Tight',Inter,sans-serif;font-weight:800;margin:0;letter-spacing:-.01em}.hero{margin:7mm 16mm 0;display:flex;gap:7mm;align-items:flex-start}"
    + ".ava{flex:0 0 22mm;height:22mm;border-radius:50%;background:radial-gradient(100% 100% at 100% 0,#EE3934 0,#D2126C 100%);color:#fff;font-family:'Inter Tight';font-weight:800;font-size:20pt;display:flex;align-items:center;justify-content:center}"
    + ".hero h1{font-size:24pt;line-height:1.1}.hero .role{font-size:12pt;color:#3A3A3A;margin-top:1.5mm}.hero .for{display:inline-block;margin-top:3mm;font-size:8.5pt;font-weight:600;background:#FDE7F1;color:#A50E55;border-radius:999px;padding:1.2mm 3.5mm}"
    + ".facts{margin:6mm 16mm 0;display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}.fact{border:1px solid #ECECEE;border-radius:3.5mm;padding:3mm 3.5mm}.fact span{display:block;font-size:7.5pt;font-weight:600;letter-spacing:.06em;color:#6B6B6B;text-transform:uppercase}.fact b{display:block;font-size:10pt;margin-top:.8mm;line-height:1.3}"
    + ".sec{margin:6mm 16mm 0}.sec h2{font-size:12.5pt;margin-bottom:3mm;display:flex;align-items:center;gap:2.5mm}.sec h2::before{content:'';width:1.6mm;height:4.5mm;border-radius:1mm;background:#D2126C}"
    + ".box{background:#FAFAFA;border:1px solid #ECECEE;border-radius:4mm;padding:3.5mm 4.5mm}.box.pk{background:#FFF5FA;border-color:#F6C3DA}.box p{margin:0 0 2mm}.box p:last-child{margin:0}"
    + ".fit{width:100%;border-collapse:collapse}.fit td{padding:1.5mm 0;border-bottom:1px solid #F0F0F0;vertical-align:top}.fit tr:last-child td{border-bottom:0}.fit td.k{width:36%;font-weight:600;padding-right:3mm}.fit td.s{width:24mm}"
    + ".pill{display:inline-block;font-size:8pt;font-weight:600;border-radius:999px;padding:.8mm 2.8mm;white-space:nowrap}.ok{background:#E3F4EA;color:#1E8A50}.mid{background:#FBF0DA;color:#9A6400}.op{background:#F1EDF0;color:#6B6B6B}"
    + ".fit .lbl{font-size:7.5pt;font-weight:600;letter-spacing:.06em;color:#6B6B6B;text-transform:uppercase;padding-top:2.5mm}"
    + ".tl{position:relative;padding-left:7mm}.tl::before{content:'';position:absolute;left:1.6mm;top:2mm;bottom:2mm;width:.5mm;background:#F3C6DA}.st{position:relative;margin-bottom:4.5mm}"
    + ".st::before{content:'';position:absolute;left:-7mm;top:1.6mm;width:3.7mm;height:3.7mm;border-radius:50%;background:#fff;border:.8mm solid #D2126C}.st .z{font-size:8.5pt;font-weight:600;color:#D2126C}.st h3{font-size:11pt;margin:.5mm 0 .3mm}.st .f{font-size:9.5pt;color:#6B6B6B;margin-bottom:1.2mm}.st ul{margin:0;padding-left:4.5mm}.st li{margin:.6mm 0}"
    + ".two{display:grid;grid-template-columns:1fr 1fr;gap:6mm}.chips{display:flex;flex-wrap:wrap;gap:1.8mm}.chips span{font-size:9pt;border:1px solid #E4E4E4;border-radius:999px;padding:1mm 3mm;background:#fff}.chips span.top{border-color:#F3B6D2;background:#FDE7F1;color:#A50E55;font-weight:600}"
    + ".list{margin:0;padding:0;list-style:none}.list li{display:block;padding:1.5mm 0;border-bottom:1px solid #F0F0F0}.list li:last-child{border:0}.list li span{display:block;color:#6B6B6B;font-size:9pt}"
    + ".quote{font-size:10.5pt;line-height:1.55}.sig{display:flex;align-items:center;gap:3.5mm;margin-top:4mm;font-size:9pt;color:#3A3A3A}.sig img,.sig .mini{width:11mm;height:11mm;border-radius:50%;object-fit:cover;flex:0 0 11mm}"
    + ".mini{display:flex;align-items:center;justify-content:center;background:#FDE7F1;color:#A50E55;font-weight:700;font-size:9pt}"
    + ".foot{position:absolute;left:16mm;right:16mm;bottom:7mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#9A9A9A;border-top:1px solid #ECECEE;padding-top:2.5mm}";
  var werd = (p.werdegang || []).map(function (s) { return '<div class="st"><div class="z">' + e(s.zeit) + '</div><h3>' + e(s.titel) + '</h3>' + (s.firma ? '<div class="f">' + e(s.firma) + '</div>' : '') + ((s.punkte || []).length ? '<ul>' + s.punkte.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ul>' : '') + '</div>'; }).join('');
  var liste = function (l, a, b) { return (l || []).length ? '<ul class="list">' + l.map(function (x) { return '<li><b>' + e(x[a]) + '</b>' + (x[b] ? '<span>' + e(x[b]) + '</span>' : '') + '</li>'; }).join('') + '</ul>' : '<p style="color:#6B6B6B;margin:0">keine Angabe</p>'; };
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Kandidatenprofil ' + e(p.name) + '</title><style>' + css + '</style></head><body>'
    + '<div class="page"><div class="band"></div><div class="head"><img src="' + B + '/assets/logo.png" alt="pycruit"><div class="tag"><b>Kandidatenprofil</b>vertraulich · ' + e(p.kuerzel) + (datum ? ' · ' + datum : '') + '</div></div>'
    + '<div class="hero"><div class="ava">' + e(ini(p.name)) + '</div><div><h1>' + e(p.name) + '</h1><div class="role">' + e(p.rolle) + '</div><span class="for">für: ' + e(p.stelle) + '</span></div></div>'
    + '<div class="facts"><div class="fact"><span>Verfügbar</span><b>' + e(f.verfuegbar || 'offen') + '</b></div><div class="fact"><span>Gehaltswunsch</span><b>' + e(f.gehalt || 'offen') + '</b></div><div class="fact"><span>Wohnort</span><b>' + e(f.wohnort || 'offen') + '</b></div><div class="fact"><span>Arbeitsmodell</span><b>' + e(f.arbeitsmodell || 'offen') + '</b></div></div>'
    + '<div class="sec"><h2>Unsere Einschätzung</h2><div class="box pk"><p class="quote">' + e(p.einschaetzung) + '</p>'
    + ((p.wechselmotivation || p.offen) ? '<p>' + (p.wechselmotivation ? '<b>Wechselmotivation:</b> ' + e(p.wechselmotivation) : '') + (p.wechselmotivation && p.offen ? '<br>' : '') + (p.offen ? '<b>Offen:</b> ' + e(p.offen) : '') + '</p>' : '')
    + '<div class="sig">' + bild() + e(o.name) + ', pycruit' + (gdatum ? ' · Gespräch am ' + gdatum : '') + '</div></div></div>'
    + (pass.length ? '<div class="sec"><h2>Passung zur Stelle</h2><div class="box"><table class="fit">' + zeilen('muss', 'Muss-Kriterien') + zeilen('kann', 'Wünschenswert') + '</table></div></div>' : '')
    + foot(1) + '</div>'
    + '<div class="page"><div class="band"></div><div class="head"><img src="' + B + '/assets/logo.png" alt="pycruit"><div class="tag"><b>Kandidatenprofil</b>' + e(p.name) + ' · ' + e(p.kuerzel) + '</div></div>'
    + '<div class="sec"><h2>Beruflicher Werdegang</h2><div class="tl">' + (werd || '<p style="color:#6B6B6B">keine Angabe</p>') + '</div></div>'
    + '<div class="sec two"><div><h2>Ausbildung</h2><div class="box">' + liste(p.ausbildung, 'abschluss', 'ort_jahr') + '</div></div><div><h2>Sprachen</h2><div class="box">' + liste(p.sprachen, 'sprache', 'niveau') + '</div></div></div>'
    + ((p.kenntnisse || []).length ? '<div class="sec"><h2>Kenntnisse</h2><div class="chips">' + p.kenntnisse.map(function (k) { return '<span' + (k.top ? ' class="top"' : '') + '>' + e(k.name) + '</span>'; }).join('') + '</div></div>' : '')
    + '<div class="sec"><h2>Nächster Schritt</h2><div class="box"><p>' + e(p.naechster_schritt || 'Wir stimmen gern einen Termin für ein Kennenlernen mit Ihnen ab.') + '</p><div class="sig">' + bild() + e(o.name) + ' · ' + e(o.tel) + ' · ' + e(o.mail) + '</div></div></div>'
    + foot(2) + '</div></body></html>';
}
if (typeof module !== 'undefined') module.exports = { profilHtml: profilHtml };
