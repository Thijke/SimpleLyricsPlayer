
# Simple Lyrics Player 🎶

Een stijlvolle, simpele website om mp3’s met bijbehorende gesynchroniseerde lyrics (.lrc) af te spelen.  
Met een progress bar, kleurenkiezer en vloeiende lyrics animaties.

---


## Mappenstructuur

```
lyricswebsite/
├── index.html
├── style.css
├── script.js
├── mp3/
│   ├── ma3lish.mp3
│   ├── poweroverme.mp3
│   ├── jeverdientbeter.mp3
│   ├── buckethat.mp3
│   └── mulala.mp3
└── lrc/
    ├── ma3lish.lrc
    ├── poweroverme.lrc
    ├── jeverdientbeter.lrc
    ├── buckethat.lrc
    └── mulala.lrc
```

---

## Nieuwe nummers toevoegen

1. Voeg je mp3-bestand toe aan de `mp3/` map.  
2. Voeg het bijbehorende `.lrc` lyricsbestand toe aan de `lrc/` map, met dezelfde naam als de mp3 (maar dan `.lrc`).  
3. Open `script.js` en voeg in het `tracks` object je nummer toe, bijvoorbeeld:

```js
const tracks = {
  // bestaande nummers
  nieuwnummer: {
    mp3: 'mp3/nieuwnummer.mp3',
    lrc: 'lrc/nieuwnummer.lrc'
  }
};
```

4. Voeg in `index.html` binnen het `<select id="track-select">` element een optie toe:

```html
<option value="nieuwnummer">Nieuw Nummer</option>
```

---

## Hosting

- Upload de hele map naar een webserver of gebruik GitHub Pages (perfect voor statische sites).  
- Zorg dat de `mp3/` en `lrc/` mappen intact blijven en correct worden gehost.  
- Open `index.html` in een browser om de site te gebruiken.

---

## Vereisten

- Moderne browser met HTML5 audio-ondersteuning.  
- MP3-bestanden en correcte `.lrc` bestanden voor lyrics synchronisatie.

---

## Feedback / Issues

Heb je vragen, bugs of ideeën? Open een issue of stuur een bericht!

---

Enjoy de vibes!
