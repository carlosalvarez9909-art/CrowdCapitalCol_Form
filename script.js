const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let mouse = { x: null, y: null, active: false };

const startBtn = document.getElementById("startBtn");
const formPanel = document.getElementById("formPanel");
const steps = Array.from(document.querySelectorAll(".step"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");
const form = document.getElementById("diagnosticForm");
const result = document.getElementById("result");

let currentStep = 0;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(95, Math.floor((width * height) / 15000));
  particles = Array.from({ length: count }, (_, index) => {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      baseSize: 1.2 + depth * 3.2,
      size: 1.2 + depth * 3.2,
      speedX: (Math.random() - 0.5) * (0.18 + depth * 0.32),
      speedY: (Math.random() - 0.5) * (0.18 + depth * 0.32),
      depth,
      alpha: 0.22 + depth * 0.58,
      pulse: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.55 ? 136 : 158
    };
  });
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    0,
    width * 0.5,
    height * 0.45,
    Math.max(width, height) * 0.72
  );

  gradient.addColorStop(0, "rgba(8, 38, 20, 0.88)");
  gradient.addColorStop(0.42, "rgba(3, 12, 7, 0.94)");
  gradient.addColorStop(1, "rgba(3, 5, 4, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawParticle(particle, time) {
  const pulse = Math.sin(time * 0.0018 + particle.pulse) * 0.45;
  const glowSize = particle.size * (6 + particle.depth * 8);

  ctx.beginPath();
  ctx.fillStyle = `hsla(${particle.hue}, 78%, 52%, ${particle.alpha * 0.10})`;
  ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = `hsla(${particle.hue}, 82%, 56%, ${particle.alpha})`;
  ctx.arc(particle.x, particle.y, Math.max(0.8, particle.size + pulse), 0, Math.PI * 2);
  ctx.fill();
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 115) {
        const opacity = (1 - distance / 115) * 0.10;
        ctx.strokeStyle = `rgba(32, 201, 51, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function updateParticle(particle) {
  particle.x += particle.speedX;
  particle.y += particle.speedY;

  if (mouse.active && mouse.x !== null && mouse.y !== null) {
    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 150;

    if (distance < radius) {
      const force = (radius - distance) / radius;
      particle.x += (dx / Math.max(distance, 1)) * force * (1.8 + particle.depth * 2.8);
      particle.y += (dy / Math.max(distance, 1)) * force * (1.8 + particle.depth * 2.8);
      particle.size = particle.baseSize + force * 2.8;
      particle.alpha = Math.min(0.95, particle.alpha + force * 0.04);
    } else {
      particle.size += (particle.baseSize - particle.size) * 0.04;
    }
  } else {
    particle.size += (particle.baseSize - particle.size) * 0.04;
  }

  if (particle.x < -20) particle.x = width + 20;
  if (particle.x > width + 20) particle.x = -20;
  if (particle.y < -20) particle.y = height + 20;
  if (particle.y > height + 20) particle.y = -20;
}

function animate(time) {
  drawBackground();

  particles.forEach((particle) => {
    updateParticle(particle);
    drawParticle(particle, time);
  });

  connectParticles();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

window.addEventListener("click", (event) => {
  for (let i = 0; i < 14; i++) {
    const depth = Math.random();
    particles.push({
      x: event.clientX,
      y: event.clientY,
      baseSize: 1.4 + depth * 3.5,
      size: 4 + depth * 4,
      speedX: (Math.random() - 0.5) * 4.2,
      speedY: (Math.random() - 0.5) * 4.2,
      depth,
      alpha: 0.55 + depth * 0.35,
      pulse: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? 136 : 158
    });
  }

  if (particles.length > 135) {
    particles.splice(0, particles.length - 135);
  }
});

startBtn.addEventListener("click", () => {
  document.querySelector(".hero").classList.add("hidden");
  formPanel.classList.remove("hidden");
  updateSteps();
});

function updateSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  stepLabel.textContent = `Paso ${currentStep + 1} de ${steps.length}`;
  progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

  prevBtn.classList.toggle("hidden", currentStep === 0);
  nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
  submitBtn.classList.toggle("hidden", currentStep !== steps.length - 1);
}

function validateCurrentStep() {
  const fields = Array.from(steps[currentStep].querySelectorAll("input, select"));
  return fields.every((field) => {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
    return true;
  });
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  currentStep += 1;
  updateSteps();
});

prevBtn.addEventListener("click", () => {
  currentStep -= 1;
  updateSteps();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const data = Object.fromEntries(new FormData(form).entries());

  const ingresos = Number(data.ingresos);
  const gastos = Number(data.gastos);
  const deudas = Number(data.deudas);
  const ahorro = Number(data.ahorro);
  const horas = Number(data.horas);

  const flujoLibre = ingresos - gastos;
  const ingresoHora = horas > 0 ? ingresos / horas : 0;
  const ratioGasto =
