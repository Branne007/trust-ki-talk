/* ============================================================
   ki-talk-stufe · Cloudflare Worker
   Merkt sich, wie weit die Materialseite eines KI-Talks
   freigeschaltet ist.

   GET  /stufe?talk=2026-11            → {"talk":"2026-11","stufe":3}
   POST /stufe?talk=2026-11            Body {"stufe":4}
        Header Authorization: Bearer <MODERATOR_KEY>

   Speicher: KV-Namespace, Bindung STUFEN (wrangler.toml)
   Schlüssel: Secret MODERATOR_KEY (wrangler secret put)
   Ohne Eintrag gilt Stufe 0. Nach dem Talk Stufe 99 = alles offen.
   Hinweis: KV liefert neue Werte an anderen Standorten mit bis zu
   rund 60 Sekunden Verzögerung. Für die Seite ist das unkritisch.
   ============================================================ */

var ERLAUBT = [
  'https://ki-talk.trust-unternehmer.de',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

function antwort(daten, status, cors) {
  return new Response(JSON.stringify(daten), {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors)
  });
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var origin = request.headers.get('Origin') || '';
    var cors = {
      'Access-Control-Allow-Origin': ERLAUBT.indexOf(origin) !== -1 ? origin : ERLAUBT[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname !== '/stufe') {
      return antwort({ fehler: 'nicht gefunden' }, 404, cors);
    }

    var talk = url.searchParams.get('talk') || '';
    if (!/^\d{4}-\d{2}$/.test(talk)) {
      return antwort({ fehler: 'talk fehlt oder falsch (JJJJ-MM)' }, 400, cors);
    }
    var schluessel = 'stufe:' + talk;

    if (request.method === 'GET') {
      var wert = await env.STUFEN.get(schluessel);
      var stufe = wert === null ? 0 : parseInt(wert, 10) || 0;
      return antwort({ talk: talk, stufe: stufe }, 200, cors);
    }

    if (request.method === 'POST') {
      var auth = request.headers.get('Authorization') || '';
      if (!env.MODERATOR_KEY || auth !== 'Bearer ' + env.MODERATOR_KEY) {
        return antwort({ fehler: 'nicht berechtigt' }, 401, cors);
      }
      var daten;
      try { daten = await request.json(); } catch (e) {
        return antwort({ fehler: 'kein JSON' }, 400, cors);
      }
      var neu = Math.max(0, Math.min(99, parseInt(daten.stufe, 10) || 0));
      await env.STUFEN.put(schluessel, String(neu));
      return antwort({ talk: talk, stufe: neu }, 200, cors);
    }

    return antwort({ fehler: 'Methode nicht erlaubt' }, 405, cors);
  }
};
