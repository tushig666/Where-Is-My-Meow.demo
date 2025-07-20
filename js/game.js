// --- ADVANCED MODES BREAK/BONUS FEATURE ---
let extremeBreakTriggered = false;
let impossibleBreakTriggered = false;
let godBreakTriggered = false;
const EXTREME_BREAK_SCORE = 250; // First break triggers at this score
const IMPOSSIBLE_BREAK_SCORE = 900;
const GOD_BREAK_SCORE = 1200;
const EXTREME_BREAK_DURATION = 5000; // ms
const IMPOSSIBLE_BREAK_DURATION = 4000; // ms
const GOD_BREAK_DURATION = 3000; // ms
let lastExtremeBreakScore = 0;
let lastImpossibleBreakScore = 0;
let lastGodBreakScore = 0;
let lastExtremeBonusScore = 0;
let lastImpossibleBonusScore = 0;
let lastGodBonusScore = 0;
let lastBreakTime = 0;
const EXTREME_BREAK_INTERVAL = 150; // pts between breaks
const IMPOSSIBLE_BREAK_INTERVAL = 120;
const GOD_BREAK_INTERVAL = 100;
const EXTREME_BONUS_INTERVAL = 100; // pts between +10s
const IMPOSSIBLE_BONUS_INTERVAL = 80;
const GOD_BONUS_INTERVAL = 60;
const EXTREME_BONUS_TIME = 10; // seconds to add
const IMPOSSIBLE_BONUS_TIME = 8;
const GOD_BONUS_TIME = 6;
const EXTREME_BREAK_COOLDOWN = 15 * 1000; // 15s cooldown between breaks (ms)
const IMPOSSIBLE_BREAK_COOLDOWN = 12 * 1000;
const GOD_BREAK_COOLDOWN = 10 * 1000;

// Create break bar overlay
let breakBarOverlay = null;
function showExtremeBreakBar() {
  if (!breakBarOverlay) {
    breakBarOverlay = document.createElement('div');
    breakBarOverlay.id = 'break-bar-overlay';
    breakBarOverlay.innerHTML = `
      <div class="break-bar-title">Little break!</div>
      <div class="break-bar-outer">
        <div class="break-bar-inner"></div>
      </div>
    `;
    document.body.appendChild(breakBarOverlay);
  } else {
    breakBarOverlay.style.display = '';
  }
  // Animate bar
  const bar = breakBarOverlay.querySelector('.break-bar-inner');
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = `width ${EXTREME_BREAK_DURATION}ms linear`;
    bar.style.width = '100%';
  }, 50);
}
function hideExtremeBreakBar() {
  if (breakBarOverlay) breakBarOverlay.style.display = 'none';
}

function triggerExtremeBreak(callback) {
  gameActive = false;
  clearTimeout(catTimeout);
  clearInterval(timerInterval);
  showExtremeBreakBar();
  if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.2;
  setTimeout(() => {
    hideExtremeBreakBar();
    if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.5;
    // Add 15 seconds after break (was 30)
    timeLeft += 15;
    timerEl.textContent = timeLeft;
    gameActive = true;
    spawnCatLoop();
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
    if (callback) callback();
  }, EXTREME_BREAK_DURATION);
}
// Click the Cat! Neon - Advanced Game Logic
// Author: Portfolio Piece
// --- CONFIG ---
const GAME_TIME = 30;
const HARD_MODE_TIME = 15;
const HARD_MODE_SCORE = 100;
const EXTREME_MODE_SCORE = 200;
const IMPOSSIBLE_MODE_SCORE = 800;
const GOD_MODE_SCORE = 1100;
const CAT_TYPES = [
  {
    name: 'white',
    points: 10,
    img: 'img/cat-white.png',
    sound: 'meow-white',
    class: 'white',
    rarity: 0.5 // 50%
  },
  {
    name: 'cream',
    points: 5,
    img: 'img/cat-cream.png',
    sound: 'meow-cream',
    class: 'cream',
    rarity: 0.25 // 25%
  },
  {
    name: 'golden',
    points: 15,
    img: 'img/cat-golden.png',
    sound: 'meow-golden',
    class: 'golden',
    rarity: 0.15 // 15%
  },
  {
    name: 'pink',
    points: 20,
    img: 'img/cat-pink.png',
    sound: 'meow-pink',
    class: 'pink',
    rarity: 0.08 // 8%
  },
  {
    name: 'king',
    points: 30,
    img: 'img/cat-king.png',
    sound: 'meow-king',
    class: 'king',
    rarity: 0.02 // 2%
  }
];
const CAT_SPAWN_BASE = 1100; // ms
const CAT_SPAWN_HARD = 800; // ms
const CAT_SPAWN_EXTREME = 600; // ms
const CAT_SPAWN_IMPOSSIBLE = 475; // ms
const CAT_SPAWN_GOD = 350; // ms
const CAT_LIFETIME_BASE = 1200; // ms
const CAT_LIFETIME_HARD = 950; // ms
const CAT_LIFETIME_EXTREME = 700; // ms
const CAT_LIFETIME_IMPOSSIBLE = 600; // ms
const CAT_LIFETIME_GOD = 450; // ms

// --- DOM ELEMENTS ---
const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const finalHighscoreEl = document.getElementById('final-highscore');
const playAgainBtn = document.getElementById('play-again');
const bgMusic = document.getElementById('bg-music');
const gameoverSound = document.getElementById('gameover-sound');

// --- STATE ---
let score = 0;
let highscore = 0;
let timeLeft = GAME_TIME;
let timerInterval = null;
let catTimeout = null;
let hardMode = false;
let extremeMode = false;
let impossibleMode = false;
let godMode = false;
let gameActive = false;

// --- SOUND CONTROL STATE ---
let themeEnabled = true;
let soundsEnabled = true;

// --- SOUND CONTROL LOGIC ---
function updateSoundButtons() {
  const themeBtn = document.getElementById('toggle-theme');
  const soundsBtn = document.getElementById('toggle-sounds');
  if (themeBtn) themeBtn.classList.toggle('active', themeEnabled);
  if (soundsBtn) soundsBtn.classList.toggle('active', soundsEnabled);
  if (themeBtn) themeBtn.innerHTML = themeEnabled ? '🎵' : '🔇';
  if (soundsBtn) soundsBtn.innerHTML = soundsEnabled ? '🔊' : '🔈';
}

function setThemeMusic(enabled) {
  themeEnabled = enabled;
  if (bgMusic) {
    bgMusic.muted = !themeEnabled;
    if (!themeEnabled) {
      bgMusic.pause();
    } else if (!isGameOver) {
      bgMusic.play().catch(()=>{});
    }
  }
  updateSoundButtons();
}

function setSounds(enabled) {
  soundsEnabled = enabled;
  // Mute/unmute all sound effects
  const soundIds = ['meow-white','meow-cream','meow-golden','meow-pink','meow-king','gameover-sound','levelup-sound'];
  soundIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.muted = !soundsEnabled;
  });
  updateSoundButtons();
}

document.addEventListener('DOMContentLoaded', () => {
  // Sound control buttons
  const themeBtn = document.getElementById('toggle-theme');
  const soundsBtn = document.getElementById('toggle-sounds');
  if (themeBtn) themeBtn.onclick = () => setThemeMusic(!themeEnabled);
  if (soundsBtn) soundsBtn.onclick = () => setSounds(!soundsEnabled);
  updateSoundButtons();
});

// --- UTILS ---
function getRandomCatType() {
  let r = Math.random();
  let acc = 0;
  // King cat rarity increases with each mode
  if (godMode) {
    let godTypes = CAT_TYPES.map(cat =>
      cat.class === 'king' ? { ...cat, rarity: 0.35 } : { ...cat, rarity: cat.rarity * 0.65 }
    );
    let acc2 = 0;
    for (const cat of godTypes) {
      acc2 += cat.rarity;
      if (r < acc2) return cat;
    }
    return godTypes[0];
  } else if (impossibleMode) {
    let impTypes = CAT_TYPES.map(cat =>
      cat.class === 'king' ? { ...cat, rarity: 0.25 } : { ...cat, rarity: cat.rarity * 0.75 }
    );
    let acc2 = 0;
    for (const cat of impTypes) {
      acc2 += cat.rarity;
      if (r < acc2) return cat;
    }
    return impTypes[0];
  } else if (extremeMode) {
    let extremeTypes = CAT_TYPES.map(cat =>
      cat.class === 'king' ? { ...cat, rarity: 0.18 } : { ...cat, rarity: cat.rarity * 0.82 }
    );
    let acc2 = 0;
    for (const cat of extremeTypes) {
      acc2 += cat.rarity;
      if (r < acc2) return cat;
    }
    return extremeTypes[0];
  }
  for (const cat of CAT_TYPES) {
    acc += cat.rarity;
    if (r < acc) return cat;
  }
  return CAT_TYPES[0];
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCatSize(cat) {
  if (cat.class === 'cream') return window.innerWidth < 700 ? 40 : 60;
  if (cat.class === 'king') return window.innerWidth < 700 ? 60 : 110;
  return window.innerWidth < 700 ? 60 : 100;
}

// --- GAME LOGIC ---
function startGame() {
  score = 0;
  timeLeft = GAME_TIME;
  hardMode = false;
  extremeMode = false;
  gameActive = true;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  gameOverScreen.classList.add('hidden');
  document.body.classList.remove('hard-mode', 'extreme-mode');
  // DO NOT play bgMusic here; only on first load or Play Again
  spawnCatLoop();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  clearTimeout(catTimeout);
  removeAllCats();
  finalScoreEl.textContent = score;
  // Highscore logic
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('cat_highscore', highscore);
  }
  finalHighscoreEl.textContent = highscore;
  gameOverScreen.classList.remove('hidden');
  // Pause bg music ONLY during game over
  if (bgMusic) {
    bgMusic.pause();
    bgMusicStarted = false;
  }
  isGameOver = true;
  playSoundEffect('gameover-sound');
}

function removeAllCats() {
  document.querySelectorAll('.cat').forEach(el => el.remove());
}

function spawnCatLoop() {
  if (!gameActive) return;
  spawnCat();
  let spawnRate = CAT_SPAWN_BASE;
  if (godMode) {
    spawnRate = CAT_SPAWN_GOD;
  } else if (impossibleMode) {
    spawnRate = CAT_SPAWN_IMPOSSIBLE;
  } else if (extremeMode) {
    spawnRate = CAT_SPAWN_EXTREME;
  } else if (hardMode) {
    spawnRate = CAT_SPAWN_HARD;
  }
  catTimeout = setTimeout(spawnCatLoop, spawnRate);
}

function spawnCat() {
  // Pick a random cat type
  const cat = getRandomCatType();
  const size = getCatSize(cat);
  const maxLeft = window.innerWidth - size;
  const maxTop = window.innerHeight - size;
  let left, top;
  let tries = 0;
  // Avoid spawning over timer, score, sound controls (top UI)
  do {
    left = getRandomInt(0, maxLeft);
    top = getRandomInt(0, maxTop);
    tries++;
    // Get bounding rects for UI elements
    const timerRect = timerEl.getBoundingClientRect();
    const scoreRect = scoreEl.getBoundingClientRect();
    const themeBtn = document.getElementById('toggle-theme');
    const soundsBtn = document.getElementById('toggle-sounds');
    const themeRect = themeBtn ? themeBtn.getBoundingClientRect() : {left:-1000,top:-1000,right:-1000,bottom:-1000};
    const soundsRect = soundsBtn ? soundsBtn.getBoundingClientRect() : {left:-1000,top:-1000,right:-1000,bottom:-1000};
    // Cat bounding box
    const catBox = {left, right:left+size, top, bottom:top+size};
    // Helper: check overlap
    function overlaps(a, b) {
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }
    // If overlaps any UI, try again
    if (
      overlaps(catBox, timerRect) ||
      overlaps(catBox, scoreRect) ||
      overlaps(catBox, themeRect) ||
      overlaps(catBox, soundsRect)
    ) {
      continue;
    } else {
      break;
    }
  } while (tries < 20);
  // Create cat element
  const catEl = document.createElement('img');
  catEl.src = cat.img;
  catEl.className = `cat ${cat.class}`;
  catEl.style.left = left + 'px';
  catEl.style.top = top + 'px';
  catEl.style.width = size + 'px';
  catEl.style.height = size + 'px';
  catEl.setAttribute('alt', cat.name + ' cat');
  // Animation is handled by CSS class
  // Click/tap event
  catEl.addEventListener('pointerdown', e => onCatClick(cat, catEl, e));
  gameArea.appendChild(catEl);
  // Remove after lifetime
  let lifetime = CAT_LIFETIME_BASE;
  if (godMode) {
    lifetime = CAT_LIFETIME_GOD;
  } else if (impossibleMode) {
    lifetime = CAT_LIFETIME_IMPOSSIBLE;
  } else if (extremeMode) {
    lifetime = CAT_LIFETIME_EXTREME;
  } else if (hardMode) {
    lifetime = CAT_LIFETIME_HARD;
  }
  setTimeout(() => catEl.remove(), lifetime);
}

function playSoundEffect(id) {
  if (!soundsEnabled) return;
  const el = document.getElementById(id);
  if (el) {
    // For effects, always clone and play so they overlap
    try {
      const clone = el.cloneNode(true);
      clone.volume = el.volume;
      clone.muted = false; // Always unmute for effect
      clone.play();
    } catch (e) {
      // fallback: try to play original
      try { el.muted = false; el.currentTime = 0; el.play(); } catch (e2) {}
    }
  }
}

function onCatClick(cat, catEl, e) {
  if (!gameActive) return;
  // Score logic
  score += cat.points;
  scoreEl.textContent = score;
  // Play sound
  playSoundEffect(cat.sound);
  // Floating +points
  showFloatingPlus(cat.points, e.clientX, e.clientY, cat.class);
  // Special effects
  if (cat.class === 'king') {
    // King cat: shake
    gameArea.classList.add('shake');
    setTimeout(() => gameArea.classList.remove('shake'), 600);
  }
  // Remove cat
  catEl.remove();

  // --- MODE TRANSITIONS ---
  if (!hardMode && score >= HARD_MODE_SCORE) {
    enterHardMode();
  } else if (!extremeMode && score >= EXTREME_MODE_SCORE) {
    enterExtremeMode();
  } else if (!impossibleMode && score >= IMPOSSIBLE_MODE_SCORE) {
    enterImpossibleMode();
  } else if (!godMode && score >= GOD_MODE_SCORE) {
    enterGodMode();
  }

  // --- BONUS/BREAK LOGIC FOR ALL ADVANCED MODES ---
  let now = Date.now();
  // God mode
  if (godMode) {
    // Bonus time
    if (score - lastGodBonusScore >= GOD_BONUS_INTERVAL) {
      let bonuses = Math.floor((score - lastGodBonusScore) / GOD_BONUS_INTERVAL);
      timeLeft += GOD_BONUS_TIME * bonuses;
      timerEl.textContent = timeLeft;
      lastGodBonusScore += GOD_BONUS_INTERVAL * bonuses;
    }
    // Break every GOD_BREAK_INTERVAL pts, with cooldown
    if (
      score - lastGodBreakScore >= GOD_BREAK_INTERVAL &&
      (now - lastBreakTime > GOD_BREAK_COOLDOWN)
    ) {
      lastGodBreakScore += GOD_BREAK_INTERVAL * Math.floor((score - lastGodBreakScore) / GOD_BREAK_INTERVAL);
      lastBreakTime = now;
      triggerAdvancedBreak('god');
      return;
    }
    // First break at GOD_BREAK_SCORE
    if (!godBreakTriggered && score >= GOD_BREAK_SCORE) {
      godBreakTriggered = true;
      triggerAdvancedBreak('god');
      return;
    }
  } else if (impossibleMode) {
    // Bonus time
    if (score - lastImpossibleBonusScore >= IMPOSSIBLE_BONUS_INTERVAL) {
      let bonuses = Math.floor((score - lastImpossibleBonusScore) / IMPOSSIBLE_BONUS_INTERVAL);
      timeLeft += IMPOSSIBLE_BONUS_TIME * bonuses;
      timerEl.textContent = timeLeft;
      lastImpossibleBonusScore += IMPOSSIBLE_BONUS_INTERVAL * bonuses;
    }
    // Break every IMPOSSIBLE_BREAK_INTERVAL pts, with cooldown
    if (
      score - lastImpossibleBreakScore >= IMPOSSIBLE_BREAK_INTERVAL &&
      (now - lastBreakTime > IMPOSSIBLE_BREAK_COOLDOWN)
    ) {
      lastImpossibleBreakScore += IMPOSSIBLE_BREAK_INTERVAL * Math.floor((score - lastImpossibleBreakScore) / IMPOSSIBLE_BREAK_INTERVAL);
      lastBreakTime = now;
      triggerAdvancedBreak('impossible');
      return;
    }
    // First break at IMPOSSIBLE_BREAK_SCORE
    if (!impossibleBreakTriggered && score >= IMPOSSIBLE_BREAK_SCORE) {
      impossibleBreakTriggered = true;
      triggerAdvancedBreak('impossible');
      return;
    }
  } else if (extremeMode) {
    // Bonus time
    if (score - lastExtremeBonusScore >= EXTREME_BONUS_INTERVAL) {
      let bonuses = Math.floor((score - lastExtremeBonusScore) / EXTREME_BONUS_INTERVAL);
      timeLeft += EXTREME_BONUS_TIME * bonuses;
      timerEl.textContent = timeLeft;
      lastExtremeBonusScore += EXTREME_BONUS_INTERVAL * bonuses;
    }
    // Break every EXTREME_BREAK_INTERVAL pts, with cooldown
    if (
      score - lastExtremeBreakScore >= EXTREME_BREAK_INTERVAL &&
      (now - lastBreakTime > EXTREME_BREAK_COOLDOWN)
    ) {
      lastExtremeBreakScore += EXTREME_BREAK_INTERVAL * Math.floor((score - lastExtremeBreakScore) / EXTREME_BREAK_INTERVAL);
      lastBreakTime = now;
      triggerExtremeBreak();
      return;
    }
    // First break at EXTREME_BREAK_SCORE
    if (!extremeBreakTriggered && score >= EXTREME_BREAK_SCORE) {
      extremeBreakTriggered = true;
      triggerExtremeBreak();
      return;
    }
  }
  checkLevelUp();
}

function showFloatingPlus(amount, x, y, catClass) {
  const plus = document.createElement('div');
  plus.className = 'floating-plus ' + catClass;
  plus.textContent = `+${amount}`;
  plus.style.left = (x - 20) + 'px';
  plus.style.top = (y - 40) + 'px';
  gameArea.appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

function enterHardMode() {
  hardMode = true;
  timeLeft += HARD_MODE_TIME;
  timerEl.textContent = timeLeft;
  document.body.classList.add('hard-mode');
  document.body.classList.remove('extreme-mode', 'impossible-mode', 'god-mode');
  // Play levelup sound
  playSoundEffect('levelup-sound');
}

function enterExtremeMode() {
  extremeMode = true;
  impossibleMode = false;
  godMode = false;
  document.body.classList.remove('hard-mode', 'impossible-mode', 'god-mode');
  document.body.classList.add('extreme-mode');
  extremeBreakTriggered = false;
  lastExtremeBreakScore = score;
  lastExtremeBonusScore = score;
  lastBreakTime = Date.now();
  // Add time for extreme mode
  timeLeft += HARD_MODE_TIME;
  timerEl.textContent = timeLeft;
  // Play levelup sound
  playSoundEffect('levelup-sound');
}

function enterImpossibleMode() {
  impossibleMode = true;
  extremeMode = false;
  godMode = false;
  document.body.classList.remove('hard-mode', 'extreme-mode', 'god-mode');
  document.body.classList.add('impossible-mode');
  impossibleBreakTriggered = false;
  lastImpossibleBreakScore = score;
  lastImpossibleBonusScore = score;
  lastBreakTime = Date.now();
  // Add time for impossible mode
  timeLeft += HARD_MODE_TIME;
  timerEl.textContent = timeLeft;
  playSoundEffect('levelup-sound');
}

function enterGodMode() {
  godMode = true;
  impossibleMode = false;
  extremeMode = false;
  document.body.classList.remove('hard-mode', 'extreme-mode', 'impossible-mode');
  document.body.classList.add('god-mode');
  godBreakTriggered = false;
  lastGodBreakScore = score;
  lastGodBonusScore = score;
  lastBreakTime = Date.now();
  // Add time for god mode
  timeLeft += HARD_MODE_TIME;
  timerEl.textContent = timeLeft;
  playSoundEffect('levelup-sound');
}
// --- ADVANCED BREAK BAR ---
function triggerAdvancedBreak(mode) {
  gameActive = false;
  clearTimeout(catTimeout);
  clearInterval(timerInterval);
  let duration = EXTREME_BREAK_DURATION;
  let title = 'Little break!';
  if (mode === 'impossible') {
    duration = IMPOSSIBLE_BREAK_DURATION;
    title = 'Impossible break!';
  } else if (mode === 'god') {
    duration = GOD_BREAK_DURATION;
    title = 'God break!';
  }
  if (!breakBarOverlay) {
    breakBarOverlay = document.createElement('div');
    breakBarOverlay.id = 'break-bar-overlay';
    breakBarOverlay.innerHTML = `
      <div class="break-bar-title">${title}</div>
      <div class="break-bar-outer">
        <div class="break-bar-inner"></div>
      </div>
    `;
    document.body.appendChild(breakBarOverlay);
  } else {
    breakBarOverlay.querySelector('.break-bar-title').textContent = title;
    breakBarOverlay.style.display = '';
  }
  // Animate bar
  const bar = breakBarOverlay.querySelector('.break-bar-inner');
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = `width ${duration}ms linear`;
    bar.style.width = '100%';
  }, 50);
  if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.2;
  setTimeout(() => {
    hideExtremeBreakBar();
    if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.5;
    // Add 30 seconds after break
    timeLeft += 30;
    timerEl.textContent = timeLeft;
    gameActive = true;
    spawnCatLoop();
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }, duration);
}

// --- INIT ---
function loadHighscore() {
  highscore = parseInt(localStorage.getItem('cat_highscore') || '0', 10);
  const introHighscore = document.getElementById('intro-highscore');
  if (introHighscore) introHighscore.textContent = highscore;
}

function hideIntroAndStart() {
  const intro = document.getElementById('intro');
  if (intro) {
    intro.style.transition = 'opacity 0.7s';
    intro.style.opacity = 0;
    setTimeout(() => {
      intro.style.display = 'none';
      startGame();
    }, 700);
  } else {
    startGame();
  }
}

// --- Level select logic ---
let selectedLevel = 'normal';
const levelSelect = document.getElementById('level-select');
if (levelSelect) {
  levelSelect.addEventListener('change', e => {
    selectedLevel = e.target.value;
  });
}
const startBtn = document.getElementById('start-btn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    hideIntroAndStart();
  });
}

// --- Override startGame to use selectedLevel ---
const origStartGame = startGame;
startGame = function() {
  // Set mode based on selectedLevel
  hardMode = false;
  extremeMode = false;
  impossibleMode = false;
  godMode = false;
  document.body.classList.remove('hard-mode', 'extreme-mode', 'impossible-mode', 'god-mode');
  if (typeof selectedLevel !== 'undefined') {
    if (selectedLevel === 'normal') {
      // nothing
    } else if (selectedLevel === 'hard') {
      hardMode = true;
      document.body.classList.add('hard-mode');
    } else if (selectedLevel === 'extreme') {
      extremeMode = true;
      document.body.classList.add('extreme-mode');
      extremeBreakTriggered = false;
    } else if (selectedLevel === 'impossible') {
      impossibleMode = true;
      document.body.classList.add('impossible-mode');
      impossibleBreakTriggered = false;
    } else if (selectedLevel === 'god') {
      godMode = true;
      document.body.classList.add('god-mode');
      godBreakTriggered = false;
    }
  }
  origStartGame();
};

// --- Only auto-hide intro if no start button (fallback) ---
document.addEventListener('DOMContentLoaded', () => {
  loadHighscore();
  // Do not auto-start, wait for user to press Start
});

// --- Screen shake effect for king cat ---
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-8px, 4px); }
  40% { transform: translate(6px, -6px); }
  60% { transform: translate(-4px, 8px); }
  80% { transform: translate(8px, 2px); }
  100% { transform: translate(0, 0); }
}
#game-area.shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
`;
document.head.appendChild(style);

// --- BG music: always play except during game over or when user disables ---
let bgMusicStarted = false;
let isGameOver = false;
function tryPlayBgMusic() {
  if (bgMusic && themeEnabled && !isGameOver) {
    bgMusic.volume = 0.5;
    bgMusic.muted = false;
    if (bgMusic.paused) {
      bgMusic.play().catch(()=>{});
    }
    bgMusicStarted = true;
  }
}
// Always try to play bg music on load (may require user interaction in some browsers)
document.addEventListener('DOMContentLoaded', () => {
  tryPlayBgMusic();
  loadHighscore();
  // Do not auto-start, wait for user to press Start
});
window.addEventListener('click', tryPlayBgMusic);
window.addEventListener('touchstart', tryPlayBgMusic);

function setThemeMusic(enabled) {
  themeEnabled = enabled;
  if (bgMusic) {
    bgMusic.muted = !themeEnabled;
    if (!themeEnabled) {
      bgMusic.pause();
    } else if (!isGameOver) {
      bgMusic.play().catch(()=>{});
    }
  }
  updateSoundButtons();
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  clearTimeout(catTimeout);
  removeAllCats();
  finalScoreEl.textContent = score;
  // Highscore logic
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('cat_highscore', highscore);
  }
  finalHighscoreEl.textContent = highscore;
  gameOverScreen.classList.remove('hidden');
  // Pause bg music ONLY during game over
  if (bgMusic) {
    bgMusic.pause();
    bgMusicStarted = false;
  }
  isGameOver = true;
  playSoundEffect('gameover-sound');
}

if (playAgainBtn) {
  playAgainBtn.onclick = () => {
    // Reset intro screen and show it again
    const intro = document.getElementById('intro');
    if (intro) {
      intro.style.display = '';
      intro.style.opacity = 1;
      // Optionally reset level to previous or default
    }
    // Reset high score display
    loadHighscore();
    // Hide game over screen
    gameOverScreen.classList.add('hidden');
    // Resume bg music when game restarts
    setTimeout(() => {
      isGameOver = false;
      tryPlayBgMusic();
    }, 100);
  };
}
