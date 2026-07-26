# Barlow Condensed lokal einbinden

Die Schrift wird bewusst **nicht** über das Google-CDN geladen, sondern liegt
auf deinem eigenen Server. Grund: Beim Laden von `fonts.googleapis.com` geht die
IP-Adresse jedes Besuchers an Google in die USA. Das LG München I hat das 2022
für unzulässig erklärt (Az. 3 O 17493/20), und es wurde vielfach abgemahnt.

## Schritt 1 · Dateien holen

Gehe auf **google-webfonts-helper**:
https://gwfh.mranftl.com/fonts/barlow-condensed?subsets=latin

Einstellungen:

| Feld | Wert |
|---|---|
| Charsets | `latin` |
| Styles | `regular` (400), `500`, `700` |
| Copy CSS | Variante *Modern Browsers* |

Dann **Download files** klicken. Du bekommst ein ZIP.

## Schritt 2 · Dateien ablegen

Aus dem ZIP nur die drei `.woff2`-Dateien in diesen Ordner (`fonts/`) kopieren:

```
fonts/barlow-condensed-v12-latin-regular.woff2
fonts/barlow-condensed-v12-latin-500.woff2
fonts/barlow-condensed-v12-latin-700.woff2
```

## Schritt 3 · Versionsnummer prüfen

Die Ziffer im Dateinamen (`v12`) ändert sich, wenn Google die Schrift aktualisiert.
Falls deine Dateien anders heißen, passe die drei `src:`-Zeilen ganz oben in
`css/style.css` an die tatsächlichen Dateinamen an. Sonst greift stillschweigend
der Fallback Arial Narrow, und du merkst es erst, wenn die Seite anders aussieht.

## Schritt 4 · Kontrolle

Seite öffnen, Entwicklertools (F12), Reiter *Netzwerk*, Filter *Font*.
Es müssen drei `.woff2`-Dateien von deiner eigenen Domain geladen werden und
**keine** Anfrage an `fonts.googleapis.com` oder `fonts.gstatic.com` auftauchen.

## Lizenz

Barlow Condensed steht unter der SIL Open Font License 1.1. Kommerzielle Nutzung,
Selbsthosting und Einbettung sind ausdrücklich erlaubt. Die Datei `OFL.txt` aus dem
ZIP bitte mit in diesen Ordner legen.
