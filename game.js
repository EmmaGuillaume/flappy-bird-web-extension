const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let bird = { x: 80, y: 250, w: 34, h: 24, vy: 0, gravity: 0.5, jump: -8 };
let pipes = [];
let score = 0;
let gameActive = true;
let frame = 0;

function drawBird() {
  // Corps de l'oiseau
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(bird.x + 17, bird.y + 12, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Bec
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.moveTo(bird.x + 25, bird.y + 12);
  ctx.lineTo(bird.x + 35, bird.y + 10);
  ctx.lineTo(bird.x + 35, bird.y + 14);
  ctx.closePath();
  ctx.fill();
  
  // Oeil
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(bird.x + 22, bird.y + 10, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipe(pipe) {
  // Tuyaux principaux
  ctx.fillStyle = '#5CB85C';
  ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
  ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.w, canvas.height);
  
  // Bordures des tuyaux
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 3;
  ctx.strokeRect(pipe.x, 0, pipe.w, pipe.top);
  ctx.strokeRect(pipe.x, pipe.top + pipe.gap, pipe.w, canvas.height);
  
  // Embouts des tuyaux
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(pipe.x, pipe.top - 25, pipe.w, 25);
  ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.w, 25);
}

function createPipe() {
  const gap = 150;
  const minTop = 50;
  const maxTop = canvas.height - gap - 50;
  const top = Math.random() * (maxTop - minTop) + minTop;
  
  pipes.push({ x: canvas.width, w: 60, top: top, gap: gap, scored: false });
}

function updateBird() {
  bird.vy += bird.gravity;
  bird.y += bird.vy;
  
  // Collision avec le haut ou le bas
  if (bird.y + bird.h > canvas.height || bird.y < 0) {
    endGame();
  }
}

function updatePipes() {
  pipes.forEach((pipe, i) => {
    pipe.x -= 3;
    
    // Supprimer les tuyaux hors écran
    if (pipe.x + pipe.w < 0) {
      pipes.splice(i, 1);
    }
    
    // Incrémenter le score
    if (!pipe.scored && pipe.x + pipe.w < bird.x) {
      score++;
      scoreEl.textContent = score;
      pipe.scored = true;
    }
    
    // Collision avec les tuyaux
    if (bird.x + bird.w > pipe.x && bird.x < pipe.x + pipe.w) {
      if (bird.y < pipe.top || bird.y + bird.h > pipe.top + pipe.gap) {
        endGame();
      }
    }
  });
}

function endGame() {
  gameActive = false;
  finalScoreEl.textContent = score;
  gameOverEl.style.display = 'block';
}

function restartGame() {
  bird = { x: 80, y: 250, w: 34, h: 24, vy: 0, gravity: 0.5, jump: -8 };
  pipes = [];
  score = 0;
  scoreEl.textContent = '0';
  gameActive = true;
  frame = 0;
  gameOverEl.style.display = 'none';
  gameLoop();
}

function gameLoop() {
  if (!gameActive) return;
  
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fond
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Créer de nouveaux tuyaux
  frame++;
  if (frame % 90 === 0) {
    createPipe();
  }
  
  // Mettre à jour le jeu
  updateBird();
  updatePipes();
  
  // Dessiner
  pipes.forEach(drawPipe);
  drawBird();
  
  requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('click', () => {
  if (gameActive) {
    bird.vy = bird.jump;
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && gameActive) {
    e.preventDefault();
    bird.vy = bird.jump;
  }
});

restartBtn.addEventListener('click', restartGame);

// Démarrer le jeu
gameLoop();