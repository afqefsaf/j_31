/* ------------------ ЭКРАНЫ ------------------ */
const screens = {
  lock: document.getElementById("screen-lock"),
  flash: document.getElementById("screen-flash"),
  play: document.getElementById("screen-play"),
  game: document.getElementById("screen-game")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ------------------ ПАРОЛЬ ------------------ */
document.getElementById("enterBtn").onclick = () => {
  const val = document.getElementById("password").value;
  if (val === "3101") {
    showScreen("flash");
    setTimeout(() => showScreen("play"), 2500);
  } else {
    document.getElementById("error").innerText = "ACCESS DENIED";
  }
};

/* ------------------ PLAY ------------------ */
const music = document.getElementById("music");

document.getElementById("playBtn").onclick = () => {
  showScreen("game");
  music.volume = 0.7;
  
  // Безопасный запуск музыки
  music.play().catch(() => {
    // на случай, если браузер блокирует звук, попробуем через таймаут
    setTimeout(() => music.play(), 100);
  });

  startGame();
};

/* ------------------ УПРАВЛЕНИЕ ------------------ */
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

document.querySelectorAll("#controls button").forEach(btn => {
  const dir = btn.dataset.dir;
  const map = {
    up: ["ArrowUp","w"],
    down: ["ArrowDown","s"],
    left: ["ArrowLeft","a"],
    right: ["ArrowRight","d"]
  };

  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    map[dir].forEach(k => keys[k] = true);
  });

  btn.addEventListener("touchend", e => {
    e.preventDefault();
    map[dir].forEach(k => keys[k] = false);
  });
});

/* ------------------ ИГРА ------------------ */
function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let player = { x: 150, y: 110, r: 5 };
  let drops = [];
  let alive = true;

  function spawnDrop() {
    drops.push({
      x: Math.random() * canvas.width,
      y: -10,
      v: 1.5 + Math.random() * 1.5
    });
  }

  function update() {
    if (!alive) return;

    if (keys["ArrowLeft"] || keys["a"]) player.x -= 3;
    if (keys["ArrowRight"] || keys["d"]) player.x += 3;
    if (keys["ArrowUp"] || keys["w"]) player.y -= 3;
    if (keys["ArrowDown"] || keys["s"]) player.y += 3;

    player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));
    player.y = Math.max(player.r, Math.min(canvas.height - player.r, player.y));

    drops.forEach(d => d.y += d.v);
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    /* slugcat-seed */
    ctx.fillStyle = "#e6f0f0";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();

    /* rain */
    ctx.fillStyle = "#6f8f8f";
    drops.forEach(d => {
      ctx.fillRect(d.x, d.y, 2, 10);

      if (
        d.x > player.x - player.r &&
        d.x < player.x + player.r &&
        d.y > player.y - player.r &&
        d.y < player.y + player.r
      ) {
        alive = false;
        ctx.fillStyle = "#cfd6d6";
        ctx.font = "14px monospace";
        ctx.fillText("THE RAIN TOOK YOU", 70, 120);
      }
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  setInterval(spawnDrop, 700);
  loop();
}
