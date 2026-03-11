// ============================================================
// Configuration — change these values to customize the site
// ============================================================
const BIRTHDAY = "2026-03-13"; // Format: YYYY-MM-DD

// ============================================================
// Initialize AOS (Animate On Scroll)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
    });

    initCountdown();
    initHeroHearts();
    initHeroConfetti();
    initSparkleCanvas();
    initFooterHearts();
    initGallery();
    initLightbox();
    initHeartGame();
});

// ============================================================
// Birthday Countdown
// ============================================================
function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const wrapper = document.getElementById("countdownWrapper");
    const celebration = document.getElementById("celebrationMessage");
    const lockedMessage = document.getElementById("lockedMessage");

    let unlocked = false;

    function update() {
        const now = new Date();
        const birthday = new Date(BIRTHDAY + "T00:00:00");

        const diff = birthday - now;

        if (diff <= 0) {
            // Birthday has passed or is today — unlock everything
            if (!unlocked) {
                unlocked = true;
                document.body.classList.remove("locked");
                wrapper.style.display = "none";
                lockedMessage.style.display = "none";
                celebration.style.display = "block";
                launchCelebrationConfetti();
            }
            return;
        }

        // Still counting down — lock the page
        if (!document.body.classList.contains("locked")) {
            document.body.classList.add("locked");
            lockedMessage.style.display = "";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
}

// ============================================================
// Sparkle Canvas — heart trail on mouse move (GPU-friendly)
// ============================================================
function initSparkleCanvas() {
    const canvas = document.getElementById("sparkleCanvas");
    const hero = document.getElementById("hero");
    const ctx = canvas.getContext("2d");
    const particles = [];
    const colors = ["#c47a82", "#c24c6a", "#d47856", "#a6797a", "#edcab8"];
    let animating = false;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawHeart(cx, cy, size, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy + size * 0.3);
        ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy + size * 0.3);
        ctx.bezierCurveTo(cx - size, cy + size * 0.75, cx, cy + size, cx, cy + size * 1.2);
        ctx.bezierCurveTo(cx, cy + size, cx + size, cy + size * 0.75, cx + size, cy + size * 0.3);
        ctx.bezierCurveTo(cx + size, cy, cx, cy, cx, cy + size * 0.3);
        ctx.fill();
        ctx.restore();
    }

    function spawn(x, y) {
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y + (Math.random() - 0.5) * 16,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -1 - Math.random() * 2,
                size: 4 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
            });
        }
        if (!animating) {
            animating = true;
            requestAnimationFrame(loop);
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            drawHeart(p.x, p.y, p.size, p.color, p.life);
        }
        if (particles.length > 0) {
            requestAnimationFrame(loop);
        } else {
            animating = false;
        }
    }

    let lastTime = 0;
    function onMove(cx, cy) {
        const now = performance.now();
        if (now - lastTime < 40) return;
        lastTime = now;
        const rect = hero.getBoundingClientRect();
        spawn(cx - rect.left, cy - rect.top);
    }

    hero.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
    hero.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
}

// ============================================================
// Hero Floating Hearts
// ============================================================
function initHeroHearts() {
    const container = document.getElementById("heartsContainer");
    const hearts = ["\u2764", "\u2665", "\u2661", "\uD83E\uDE77", "\uD83D\uDC95", "\uD83D\uDC96"];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 6 + "s";
        heart.style.animationDuration = 5 + Math.random() * 4 + "s";
        heart.style.fontSize = 0.8 + Math.random() * 1.5 + "rem";
        container.appendChild(heart);
    }
}

// ============================================================
// Hero Confetti on Load
// ============================================================
function initHeroConfetti() {
    const container = document.getElementById("confettiContainer");
    const colors = ["#c47a82", "#c24c6a", "#a6797a", "#d47856", "#e4cec9", "#edcab8", "#6c1e2b"];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 3 + "s";
        piece.style.animationDuration = 3 + Math.random() * 3 + "s";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        piece.style.width = 6 + Math.random() * 10 + "px";
        piece.style.height = 6 + Math.random() * 10 + "px";
        container.appendChild(piece);
    }
}

// ============================================================
// Celebration Confetti (when birthday arrives)
// ============================================================
function launchCelebrationConfetti() {
    const section = document.querySelector(".countdown-section");
    const container = document.createElement("div");
    container.className = "confetti-container";
    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    section.style.position = "relative";
    section.appendChild(container);

    const colors = ["#c47a82", "#c24c6a", "#a6797a", "#d47856", "#e4cec9", "#edcab8", "#6c1e2b", "#8d4432"];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + "s";
        piece.style.animationDuration = 3 + Math.random() * 4 + "s";
        piece.style.animationIterationCount = "infinite";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        piece.style.width = 6 + Math.random() * 10 + "px";
        piece.style.height = 6 + Math.random() * 10 + "px";
        container.appendChild(piece);
    }
}

// ============================================================
// Footer Floating Hearts
// ============================================================
function initFooterHearts() {
    const container = document.getElementById("footerHearts");
    const hearts = ["\u2764", "\u2665", "\uD83D\uDC95"];

    for (let i = 0; i < 12; i++) {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 6 + "s";
        heart.style.animationDuration = 5 + Math.random() * 4 + "s";
        heart.style.fontSize = 0.6 + Math.random() * 1 + "rem";
        container.appendChild(heart);
    }
}

// ============================================================
// Gallery — load images and handle placeholders
// ============================================================
function initGallery() {
    const polaroids = document.querySelectorAll(".polaroid-inner[data-src]");

    polaroids.forEach((inner) => {
        const src = inner.getAttribute("data-src");
        const img = new Image();

        img.onload = () => {
            inner.innerHTML = "";
            img.alt = "Photo souvenir";
            inner.appendChild(img);
        };

        // If the image fails to load, keep the placeholder
        img.onerror = () => {};

        img.src = src;
    });
}

// ============================================================
// Lightbox
// ============================================================
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");

    // Open lightbox when clicking a polaroid that has an image loaded
    document.querySelectorAll(".polaroid").forEach((polaroid) => {
        polaroid.addEventListener("click", () => {
            const img = polaroid.querySelector(".polaroid-inner img");
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener("click", closeLightbox);

    lightboxImg.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}

// ============================================================
// Heart Catch Mini-Game
// ============================================================
function initHeartGame() {
    const HEARTS_TO_WIN = 10;
    const GAME_DURATION_MS = 20000; // 20 seconds
    const SPAWN_INTERVAL_MS = 600;  // new heart every 0.6s
    const FALL_DURATION_MIN = 2000; // fastest fall (ms)
    const FALL_DURATION_MAX = 3500; // slowest fall (ms)

    const gameWrapper = document.getElementById("gameWrapper");
    const letterWrapper = document.getElementById("letterWrapper");
    const gameField = document.getElementById("gameField");
    const gameStartBtn = document.getElementById("gameStartBtn");
    const scoreEl = document.getElementById("gameScore");
    const targetEl = document.getElementById("gameTarget");
    const progressFill = document.getElementById("gameProgressFill");

    const heartEmojis = ["\u2764\uFE0F", "\uD83D\uDC96", "\uD83D\uDC95", "\uD83D\uDC97", "\uD83E\uDE77", "\u2665"];

    let score = 0;
    let gameRunning = false;
    let spawnTimer = null;
    let gameTimer = null;

    targetEl.textContent = HEARTS_TO_WIN;

    gameStartBtn.addEventListener("click", startGame);

    function startGame() {
        score = 0;
        scoreEl.textContent = "0";
        progressFill.style.width = "0%";
        gameStartBtn.classList.add("hidden");
        gameField.innerHTML = "";
        gameRunning = true;

        // Spawn hearts at interval
        spawnTimer = setInterval(spawnHeart, SPAWN_INTERVAL_MS);

        // End game after duration
        gameTimer = setTimeout(() => {
            endGame(false);
        }, GAME_DURATION_MS);
    }

    function spawnHeart() {
        if (!gameRunning) return;

        const heart = document.createElement("span");
        heart.className = "game-heart";
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Random horizontal position (leave margin for heart width)
        const fieldWidth = gameField.offsetWidth;
        const x = Math.random() * (fieldWidth - 40);
        heart.style.left = x + "px";
        heart.style.top = "-40px";

        // Random fall duration
        const fallDuration = FALL_DURATION_MIN + Math.random() * (FALL_DURATION_MAX - FALL_DURATION_MIN);
        heart.style.animationDuration = fallDuration + "ms";

        // Click/tap to catch
        heart.addEventListener("click", (e) => {
            e.stopPropagation();
            if (heart.classList.contains("caught")) return;
            catchHeart(heart);
        });

        // Touch support
        heart.addEventListener("touchstart", (e) => {
            e.preventDefault();
            if (heart.classList.contains("caught")) return;
            catchHeart(heart);
        }, { passive: false });

        // Remove when animation ends (missed)
        heart.addEventListener("animationend", () => {
            if (!heart.classList.contains("caught")) {
                heart.classList.add("missed");
                heart.remove();
            }
        });

        gameField.appendChild(heart);
    }

    function catchHeart(heart) {
        heart.classList.add("caught");
        score++;
        scoreEl.textContent = score;
        progressFill.style.width = Math.min((score / HEARTS_TO_WIN) * 100, 100) + "%";

        // Show +1 popup
        const popup = document.createElement("span");
        popup.className = "game-score-popup";
        popup.textContent = "+1";
        const rect = heart.getBoundingClientRect();
        const fieldRect = gameField.getBoundingClientRect();
        popup.style.left = (rect.left - fieldRect.left + rect.width / 2) + "px";
        popup.style.top = (rect.top - fieldRect.top) + "px";
        gameField.appendChild(popup);
        popup.addEventListener("animationend", () => popup.remove());

        // Remove heart after caught animation
        setTimeout(() => heart.remove(), 400);

        // Check win
        if (score >= HEARTS_TO_WIN) {
            endGame(true);
        }
    }

    function endGame(won) {
        gameRunning = false;
        clearInterval(spawnTimer);
        clearTimeout(gameTimer);

        // Clear remaining hearts
        gameField.querySelectorAll(".game-heart:not(.caught)").forEach((h) => h.remove());

        if (won) {
            // Show win message
            const winMsg = document.createElement("div");
            winMsg.className = "game-win-message";
            winMsg.innerHTML = "<h3>Bravo !</h3><p>Tu as gagn\u00E9 ! Voici ta lettre...</p>";
            gameField.appendChild(winMsg);

            // Reveal the letter after a short delay
            setTimeout(() => {
                gameWrapper.classList.add("hidden");
                letterWrapper.style.display = "";
                letterWrapper.classList.add("revealing");
            }, 1800);
        } else {
            // Time's up — let them retry
            const winMsg = document.createElement("div");
            winMsg.className = "game-win-message";
            winMsg.innerHTML = "<h3>Temps \u00E9coul\u00E9 !</h3><p>" + score + " / " + HEARTS_TO_WIN + " \u2014 Encore un essai ?</p>";
            gameField.appendChild(winMsg);

            setTimeout(() => {
                gameField.innerHTML = "";
                gameStartBtn.classList.remove("hidden");
                gameStartBtn.textContent = "Rejouer";
                score = 0;
                scoreEl.textContent = "0";
                progressFill.style.width = "0%";
            }, 2000);
        }
    }
}
