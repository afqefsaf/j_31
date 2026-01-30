/* ---------- ПАРОЛЬ ---------- */
function checkPassword() {
  const pass = document.getElementById("password").value;
  if (pass === "3101") {
    startExplosion();
  } else {
    document.getElementById("error").innerText = "Неверно.";
  }
}

/* ---------- ВЗРЫВ ---------- */
function startExplosion() {
  document.getElementById("lock").style.display = "none";
  const boom = document.getElementById("boom");
  boom.classList.remove("hidden");

  const music = document.getElementById("music");
  music.volume = 0.8;
  music.play();

  startParticles();

  setTimeout(() => {
    boom.classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    startGame();
  }, 3000);
}

/* ---------- ЧАСТИЦЫ ---------- */
function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 100
    });
  }

  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = "white";
      ctx.fillRect(p.x, p.y, 2, 2);
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0) requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- МИНИ-ИГРА (UNDERTALE-STYLE) ---------- */
function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let player = { x: 200, y: 150, size: 8 };
  let bullets = [];

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.x -= 10;
    if (e.key === "ArrowRight") player.x += 10;
    if (e.key === "ArrowUp") player.y -= 10;
    if (e.key === "ArrowDown") player.y += 10;
  });

  function spawnBullet() {
    bullets.push({
      x: Math.random() * canvas.width,
      y: 0,
      vy: 2 + Math.random() * 2
    });
  }

  function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // player (душа)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    bullets.forEach(b => {
      b.y += b.vy;
      ctx.fillStyle = "white";
      ctx.fillRect(b.x, b.y, 4, 8);

      if (
        b.x < player.x + player.size &&
        b.x + 4 > player.x &&
        b.y < player.y + player.size &&
        b.y + 8 > player.y
      ) {
        ctx.fillStyle = "white";
        ctx.font = "20px monospace";
        ctx.fillText("GAME OVER", 140, 150);
        return;
      }
    });

    bullets = bullets.filter(b => b.y < canvas.height);
    requestAnimationFrame(loop);
  }

  setInterval(spawnBullet, 700);
  loop();
}
