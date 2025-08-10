const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const trackSelect = document.getElementById('track-select');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const progressHandle = document.getElementById('progress-handle');
const colorPicker = document.getElementById('color-picker');
const playerBox = document.querySelector('.player');

const lyricsPrev = document.getElementById('lyrics-prev');
const lyricsCurrent = document.getElementById('lyrics-current');
const lyricsNext = document.getElementById('lyrics-next');

let lyricsData = [];
let currentLineIndex = 0;
let animationTimeout;

const tracks = {
  ma3lish: {
    mp3: 'mp3/ma3lish.mp3',
    lrc: 'lrc/ma3lish.lrc'
  },
  poweroverme: {
    mp3: 'mp3/poweroverme.mp3',
    lrc: 'lrc/poweroverme.lrc'
  },
  jeverdientbeter: {
    mp3: 'mp3/jeverdientbeter.mp3',
    lrc: 'lrc/jeverdientbeter.lrc'
  },
  buckethat: {
    mp3: 'mp3/buckethat.mp3',
    lrc: 'lrc/buckethat.lrc'
  },
  mulala: {
    mp3: 'mp3/mulala.mp3',
    lrc: 'lrc/mulala.lrc'
  }
};

// Functie om tijd te formatteren mm:ss
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Laad audio + lrc
async function loadTrack(trackKey) {
  clearTimeout(animationTimeout);
  currentLineIndex = 0;
  lyricsData = [];
  lyricsPrev.textContent = '';
  lyricsCurrent.textContent = '';
  lyricsNext.textContent = '';

  audio.src = tracks[trackKey].mp3;
  await audio.load();

  // Duration ophalen en tonen
  audio.addEventListener('loadedmetadata', () => {
    durationElem.textContent = formatTime(audio.duration);
  }, {once: true});

  // LRC inladen
  fetch(tracks[trackKey].lrc)
    .then(res => res.text())
    .then(parseLRC)
    .then(() => {
      displayLyrics(0);
    })
    .catch(() => {
      lyricsPrev.textContent = '';
      lyricsCurrent.textContent = 'Geen lyrics gevonden';
      lyricsNext.textContent = '';
    });
}

// Parseer LRC bestand naar array met tijd + tekst
function parseLRC(lrcText) {
  lyricsData = [];
  const lines = lrcText.split('\n');
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

  for (const line of lines) {
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      const min = parseInt(timeMatch[1]);
      const sec = parseInt(timeMatch[2]);
      const ms = timeMatch[3] ? parseInt(timeMatch[3].padEnd(3, '0')) : 0;
      const time = min * 60 + sec + ms / 1000;

      const text = line.replace(timeRegex, '').trim();
      lyricsData.push({ time, text });
    }
  }
  // Sorteer op tijd
  lyricsData.sort((a, b) => a.time - b.time);
}

// Toon 3 regels lyrics: vorige, huidige, volgende
function displayLyrics(index) {
  if (lyricsData.length === 0) {
    lyricsPrev.textContent = '';
    lyricsCurrent.textContent = '';
    lyricsNext.textContent = '';
    return;
  }

  lyricsPrev.textContent = lyricsData[index - 1] ? lyricsData[index - 1].text : '';
  lyricsCurrent.textContent = lyricsData[index].text;
  lyricsNext.textContent = lyricsData[index + 1] ? lyricsData[index + 1].text : '';
}

// Update lyrics afhankelijk van tijd
function updateLyrics() {
  const currentTime = audio.currentTime;

  // Zoek welke lyric er bij deze tijd hoort
  for (let i = 0; i < lyricsData.length; i++) {
    if (currentTime >= lyricsData[i].time && (i === lyricsData.length -1 || currentTime < lyricsData[i+1].time)) {
      if (currentLineIndex !== i) {
        currentLineIndex = i;
        displayLyrics(currentLineIndex);
      }
      break;
    }
  }
}

// Update progress bar
function updateProgress() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
  progressHandle.style.left = percent + '%';

  currentTimeElem.textContent = formatTime(audio.currentTime);
}

// Play/Pauze knop
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶️';
  }
});

// Track veranderen
trackSelect.addEventListener('change', () => {
  loadTrack(trackSelect.value);
  audio.pause();
  playPauseBtn.textContent = '▶️';
});

// Progress bar klikken
progressContainer.addEventListener('click', e => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});

// Audio events
audio.addEventListener('timeupdate', () => {
  updateProgress();
  updateLyrics();
});

audio.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶️';
});

// Kleurenkiezer event
colorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  // Pas lyrics current glow kleur aan
  lyricsCurrent.style.color = color;
  lyricsCurrent.style.textShadow = `0 0 8px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`;

  // Pas progress bar kleur aan
  progress.style.backgroundColor = color;
  progressHandle.style.backgroundColor = color;

  // Pas glow van container schaduw aan
  playerBox.style.boxShadow = `0 0 15px ${color}`;
});

// Init: laad standaard track en kleur
window.addEventListener('DOMContentLoaded', () => {
  loadTrack(trackSelect.value);
  colorPicker.dispatchEvent(new Event('input')); // trigger kleurenkiezer update
});
