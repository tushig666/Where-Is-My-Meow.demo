// Click the Cat! - Main Game Logic
// Author: Portfolio Piece
// Uses: Modern JS, Animations, Sound, localStorage

// --- CONFIG ---
const GAME_TIME = 30; // seconds
const CAT_SIZE = 90; // px (desktop), will scale on mobile
const GOLDEN_CHANCE = 0.18; // 18% chance for golden cat
const GOLDEN_SCORE = 5;
const NORMAL_SCORE = 1;
const CAT_IMAGES = [
  'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.png',
  'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.png',
  'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.png',
  'https://cdn.pixabay.com/photo/2016/03/27/19/40/cat-1285634_1280.png',
  'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.png',
];
const GOLDEN_CAT_IMAGE = 'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.png'; // Use a yellowish cat

// --- DOM ELEMENTS ---
const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const highscoreEl = document.getElementById('highscore');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const finalHighscoreEl = document.getElementById('final-highscore');
const playAgainBtn = document.getElementById('play-again');
const catSound = document.getElementById('cat-sound');
const goldenSound = document.getElementById('golden-sound');
const gameoverSound = document.getElementById('gameover-sound');

// --- GAME STATE ---
let score = 0;
let highscore = 0;
let timeLeft = GAME_TIME;
let timerInterval = null;
let catEl = null;
let isGolden = false;
let gameActive = false;

// --- UTILS ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomCatImage() {
  return CAT_IMAGES[getRandomInt(0, CAT_IMAGES.length - 1)];
}
function isMobile() {
  return window.innerWidth < 700;
}
function getCatSize() {
  return isMobile() ? 60 : CAT_SIZE;
}

// --- GAME LOGIC ---
function startGame() {
  score = 0;
  timeLeft = GAME_TIME;
  gameActive = true;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  gameOverScreen.classList.add('hidden');
  spawnCat();
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
  removeCat();
  finalScoreEl.textContent = score;
  // Highscore logic
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('cat_highscore', highscore);
  }
  finalHighscoreEl.textContent = highscore;
  highscoreEl.textContent = highscore;
  gameOverScreen.classList.remove('hidden');
  gameoverSound.currentTime = 0;
  gameoverSound.play();
  // Fun effect
  gameArea.classList.add('shake');
  setTimeout(() => gameArea.classList.remove('shake'), 600);
}

function removeCat() {
  if (catEl && catEl.parentNode) {
    catEl.parentNode.removeChild(catEl);
    catEl = null;
  }
}

function spawnCat() {
  removeCat();
  // Decide if golden cat
  isGolden = Math.random() < GOLDEN_CHANCE;
  const imgSrc = isGolden ? GOLDEN_CAT_IMAGE : getRandomCatImage();
  const size = getCatSize();
  catEl = document.createElement('img');
  catEl.src = imgSrc;
  catEl.className = 'cat' + (isGolden ? ' golden' : '');
  catEl.style.width = size + 'px';
  catEl.style.height = size + 'px';
  // Random position across the whole viewport
  const maxLeft = window.innerWidth - size;
  const maxTop = window.innerHeight - size;
  const left = getRandomInt(0, maxLeft);
  const top = getRandomInt(0, maxTop);
  catEl.style.left = left + 'px';
  catEl.style.top = top + 'px';
  // Animate in
  catEl.style.opacity = 0;
  catEl.style.transform = 'scale(0.7) rotate(-12deg)';
  setTimeout(() => {
    if (catEl) {
      catEl.style.transition = 'opacity 0.18s, transform 0.22s cubic-bezier(.68,-0.55,.27,1.55)';
      catEl.style.opacity = 1;
      catEl.style.transform = 'scale(1) rotate(0deg)';
    }
  }, 30);
  // Click/tap event
  catEl.addEventListener('pointerdown', onCatClick);
  gameArea.appendChild(catEl);
}

function onCatClick(e) {
  if (!gameActive) return;
  // Score
  const add = isGolden ? GOLDEN_SCORE : NORMAL_SCORE;
  score += add;
  scoreEl.textContent = score;
  // Sound
  if (isGolden) {
    goldenSound.currentTime = 0;
    goldenSound.play();
    // Glow effect
    gameArea.style.boxShadow = '0 0 32px 8px var(--gold)';
    setTimeout(() => gameArea.style.boxShadow = '', 400);
  } else {
    catSound.currentTime = 0;
    catSound.play();
  }
  // Floating +1/+5
  showFloatingPlus(add, e.clientX, e.clientY, isGolden);
  // Animate out
  if (catEl) {
    catEl.style.transition = 'opacity 0.13s, transform 0.18s cubic-bezier(.68,-0.55,.27,1.55)';
    catEl.style.opacity = 0;
    catEl.style.transform = 'scale(0.7) rotate(12deg)';
  }
  setTimeout(spawnCat, 180);
}

function showFloatingPlus(amount, x, y, golden) {
  // Convert page coords to gameArea coords
  const areaRect = gameArea.getBoundingClientRect();
  const plus = document.createElement('div');
  plus.className = 'floating-plus' + (golden ? ' golden' : '');
  plus.textContent = `+${amount}`;
  plus.style.left = (x - areaRect.left - 10) + 'px';
  plus.style.top = (y - areaRect.top - 30) + 'px';
  gameArea.appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

// --- INIT ---
function loadHighscore() {
  highscore = parseInt(localStorage.getItem('cat_highscore') || '0', 10);
  highscoreEl.textContent = highscore;
}

playAgainBtn.addEventListener('click', startGame);
window.addEventListener('resize', () => {
  if (gameActive && catEl) spawnCat();
});

document.addEventListener('DOMContentLoaded', () => {
  loadHighscore();
  startGame();
});

// --- Fun: Screen shake effect ---
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
