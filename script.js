/* ---------- ЭКРАНЫ ---------- */
const screens = {
  lock: document.getElementById("screen-lock"),
  flash: document.getElementById("screen-flash"),
  play: document.getElementById("screen-play"),
  game: document.getElementById("screen-game")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = "none");
  screens[name].style.display = "block";
}

/* стартовый экран */
showScreen("lock");

/* ---------- ПАРОЛЬ ---------- */
document.getElementById("enterBtn").onclick = () => {
  const val = document.getElementById("password").value;
  if (val === "3101") {
    showScreen("flash");
    setTimeout(() => showScreen("play"), 2500);
  } else {
    document.getElementById("error").innerText = "ACCESS DENIED";
  }
};

/* ---------- Web Audio API ---------- */
let audioCtx;
let track;

async function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const response = await fetch("was_wollen_wir_trinken.mp3");
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    track = audioCtx.createBufferSource();
    track.buffer = audioBuffer;
    track.loop = true;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.7; // громкость
    track.connect(gainNode).connect(audioCtx.destination);

    track.start(0);
  }
}

/* ---------- PLAY ---------- */
document.getElementById("playBtn").onclick = async () => {
  showScreen("game");
  await startMusic(); // мгновенный старт музыки через Web Audio API
  startGame();
};

/* ---------- УПРАВЛЕНИЕ ---------- */
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

/* ---------- ИГРА ---------- */
function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let player = { x: 160, y: 120, r: 5 };
  let rain = [];
  let alive = true;

  function spawnRain() {
    rain.push({
      x: Math.random() * canvas.width,
      y: -10,
      v: 1.5 + Math.random()
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

    rain.forEach(r => r.y += r.v);
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // игрок
    ctx.fillStyle = "#e6f0f0";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();

    // дождь
    ctx.fillStyle = "#6f8f8f";
    rain.forEach(r => {
      ctx.fillRect(r.x, r.y, 2, 10);

      if (
        r.x > player.x - player.r &&
        r.x < player.x + player.r &&
        r.y > player.y - player.r &&
        r.y < player.y + player.r
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

  setInterval(spawnRain, 700);
  loop();
}
