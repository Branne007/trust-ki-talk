# trust-ki-talk

Die Anmeldeseite für den TRUST KI-Talk. Eine einzige Datei, `index.html`,
mit allem darin: Markup, Stil, Skript. Dazu `css/`, `fonts/`, `bilder/`.

## Veröffentlichung — bitte zuerst lesen

**Live unter `https://ki-talk.trust-unternehmer.de`. Was in `main` steht,
ist live.** Am 23.09.2026 geprüft: Die Live-Seite trug exakt den Stand des
letzten Commits (9ff182d, 07.09.). Ein `git push` veröffentlicht sofort,
ohne weiteren Schritt.

Welcher Dienst das ausliefert, ist hier nicht hinterlegt — es gibt keine
`vercel.json` und kein `.vercel`. Vermutlich Vercel, verbunden mit
`github.com/Branne007/trust-ki-talk`, aber das ist nicht belegt.

**Folge: kein halbfertiger Stand in `main`.** Erst prüfen, dann committen,
dann pushen. Ein Push ist hier kein Zwischenschritt, sondern der Deploy.

## Wie diese Seite mit dem Worker spricht

`window.TALK_CONFIG.workerUrl` zeigt auf `sprint-mail.thb-ad8.workers.dev`.
Der Worker liegt in einem anderen Repo:
`~/Projekte/web/trust-strategie-sprint/worker/worker.js`.

Seit v1.8 (23.09.2026) schreibt er jede Anmeldung nach Encharge und
antwortet mit `status`:

| `status` | Bedeutung |
|---|---|
| `gesichert` | Datensatz steht, Bestätigungsmail ist raus |
| `gesichert-ohne-mail` | Datensatz steht, die Mail ging nicht raus |
| `nicht-gesichert` | nichts gespeichert |

**Ein fehlender oder unlesbarer `status` ist kein Erfolg.** Nicht aus dem
Ausbleiben eines Fehlers auf Erfolg schließen — genau diese Annahme hat im
September auf der Bestätigungsseite falsche Erfolge gemeldet.

## Fallstricke

- **Terminformat `TT.MM.JJJJ`.** Das Formular schickt `termine` als
  kommagetrennte Zeichenkette (`"09.10.2026, 13.11.2026"` oder
  `"Alle Termine"`). Der Worker zerlegt genau diese Schreibweise und bildet
  daraus die Tags `KI-Talk-JJJJ-MM-TT` bzw. `KI-Talk-Alle`. Am 23.09. am
  echten Encharge gemessen. **Nicht auf ISO umstellen**, ohne den Worker
  gleichzeitig zu ändern — sonst tragen alle Anmeldungen
  `KI-Talk-Termin-unklar`.
- **Zwei getrennte Einwilligungen.** Das Pflichthäkchen `consent` betrifft
  die Veranstaltung. Ein Newsletter-Häkchen ist etwas anderes: optional,
  nie vorangekreuzt, und es löst über den Worker die Double-Opt-in-Strecke
  mit einer zweiten Mail aus. Die beiden dürfen nicht zusammengelegt werden.
- **`Double-Opt-in` entsteht nie hier.** Das Tag entsteht ausschließlich im
  Worker, in `doiEintragen()`, nach geprüfter Signatur. Ebenso
  `einwilligungAm`.
- **„Alle Termine" ist vorangekreuzt.** Bewusste Entscheidung, Stand
  23.09.2026, soll nach dem 09.10. neu bewertet werden.
- **Stil der Datei: ES5.** Durchgehend `var` und `function`, keine
  Pfeilfunktionen, kein `const`, keine Abhängigkeiten, keine Bündelung.
  Das bleibt so.
- Termine bis 15.01.2027 und weiter stehen fest verdrahtet im Markup. Wer
  Termine ändert, muss auch die Termin-Seite im Website-Repo anfassen.
