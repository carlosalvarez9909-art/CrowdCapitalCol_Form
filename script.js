const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const formPanel = document.getElementById("formPanel");
const form = document.getElementById("diagnosticForm");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

let current = 0;
let answers = {};
let particles = [];
let mouse = { x: 0, y: 0, active: false };

const questions = [
  { section: "Identificacion", label: "Nombre completo", name: "nombre", type: "text" },
  { section: "Identificacion", label: "Correo electronico", name: "email", type: "email" },
  { section: "Identificación", label: "¿Cuál es tu edad?", name: "edad", type: "number", help: "Este dato nos ayuda a interpretar tu etapa financiera actual y proyectar prioridades realistas." },
  { section: "Identificacion", label: "Para orientarte correctamente, ¿cuál es tu perfil financiero principal?", name: "perfil", type: "select", options: ["Empleado", "Independiente", "Empresario", "Emprendedor", "Estudiante"] },
  { section: "Identificacion", label: "Tienes personas que dependan economicamente de ti?", name: "dependientes", type: "select", options: ["No", "Si, 1 persona", "Si, 2 personas", "Si, 3 o mas"] },
  { section: "Claridad financiera", label: "Tienes un objetivo financiero definido actualmente?", name: "objetivo_definido", type: "select", options: ["A. Si, claro y medible", "B. Tengo una idea general", "C. No lo tengo definido"] },
  { section: "Claridad financiera", label: "Define tu objetivo financiero principal", name: "objetivo", type: "text" },

  { section: "Ingresos", label: "Ingreso recibido en tu mes mas reciente", name: "ingreso_1", type: "number" },
  { section: "Ingresos", label: "Ingreso del mes inmediatamente anterior", name: "ingreso_2", type: "number" },
  { section: "Ingresos", label: "Ingreso del tercer mes mas reciente", name: "ingreso_3", type: "number" },
  { section: "Ingresos", label: "El ingreso reportado corresponde a:", name: "tipo_ingreso", type: "select", options: ["A. Ingreso fijo", "B. Ingreso variable", "C. Ingreso mixto", "D. Ingreso ocasional"] },
  { section: "Ingresos", label: "Como evolucionaron tus ingresos en los ultimos 6 meses?", name: "evolucion_ingresos", type: "select", options: ["A. Han aumentado", "B. Se mantienen estables", "C. Han disminuido", "D. Son impredecibles"] },
  { section: "Ingresos", label: "Cuantas fuentes de ingreso activas tienes?", name: "fuentes_ingreso", type: "select", options: ["A. 1", "B. 2", "C. 3", "D. 4", "E. 5 o mas"] },
  { section: "Ingresos", label: "En un mes bueno, cual suele ser tu ingreso aproximado?", name: "ingreso_bueno", type: "number" },
  { section: "Ingresos", label: "En un mes bajo, cual suele ser tu ingreso aproximado?", name: "ingreso_bajo", type: "number" },
  { section: "Ingresos", label: "Que tan predecibles son tus ingresos?", name: "predictibilidad", type: "range", min: 1, max: 5 },

  { section: "Gastos", label: "Total de gastos en el mes mas reciente", name: "gasto_1", type: "number" },
  { section: "Gastos", label: "Total de gastos del mes inmediatamente anterior", name: "gasto_2", type: "number" },
  { section: "Gastos", label: "Total de gastos del tercer mes mas reciente", name: "gasto_3", type: "number" },
  { section: "Gastos", label: "En que tipo de gastos sientes que mas dinero se va sin darte cuenta?", name: "gasto_fuga", type: "select", options: ["A. Comida fuera de casa", "B. Transporte", "C. Compras impulsivas", "D. Entretenimiento", "E. Suscripciones", "F. Otro"] },
  { section: "Gastos", label: "Que gasto realizas con mayor frecuencia aunque sea pequeno?", name: "gasto_frecuente", type: "text" },
  { section: "Gastos", label: "Que gasto podrias reducir desde hoy?", name: "gasto_reducible", type: "text" },
  { section: "Gastos", label: "Cuanto dinero mensual podrias reducir sin afectar tu calidad de vida?", name: "monto_reducible", type: "number" },
  { section: "Gastos", label: "Porcentaje de gastos fijos obligatorios", name: "gastos_fijos", type: "range", min: 0, max: 100 },
  { section: "Gastos", label: "Porcentaje de gastos no planificados", name: "gastos_no_planificados", type: "range", min: 0, max: 100 },

  { section: "Deuda", label: "Tienes deudas o utilizas credito actualmente?", name: "tiene_deuda", type: "select", options: ["A. No", "B. Si, bajo control", "C. Si, me preocupa", "D. Si, esta creciendo"] },
  { section: "Deuda", label: "Cuanto pagas mensualmente en cuotas de deuda?", name: "pago_deuda", type: "number" },
  { section: "Deuda", label: "Saldo total pendiente de tus deudas", name: "saldo_deuda", type: "number" },
  { section: "Deuda", label: "Clasifica tu deuda principal", name: "tipo_deuda", type: "select", options: ["A. Tarjeta de credito", "B. Libre inversion", "C. Vehiculo", "D. Hipoteca", "E. Prestamo informal", "F. No aplica"] },
  { section: "Deuda", label: "Has usado credito para cubrir gastos basicos en los ultimos 6 meses?", name: "credito_basicos", type: "select", options: ["A. Nunca", "B. Una vez", "C. Varias veces", "D. Frecuentemente"] },

  { section: "Ahorro y emergencia", label: "Cuanto dinero tienes ahorrado actualmente?", name: "ahorro", type: "number" },
  { section: "Ahorro y emergencia", label: "Que porcentaje de tu ingreso logras ahorrar?", name: "porcentaje_ahorro", type: "range", min: 0, max: 100 },
  { section: "Ahorro y emergencia", label: "Que sucede normalmente cuando logras ahorrar?", name: "conducta_ahorro", type: "select", options: ["A. Lo mantengo", "B. Lo uso eventualmente", "C. Termino gastandolo"] },
  { section: "Ahorro y emergencia", label: "Donde mantienes principalmente tu dinero ahorrado?", name: "lugar_ahorro", type: "select", options: ["A. Cuenta bancaria", "B. Efectivo", "C. Billetera digital", "D. Inversion", "E. No tengo ahorro"] },
  { section: "Ahorro y emergencia", label: "Dinero disponible como fondo de emergencia", name: "fondo_emergencia", type: "number" },
  { section: "Ahorro y emergencia", label: "Si dejaras de recibir ingresos hoy, cuantos meses podrias sostener tus gastos?", name: "meses_cobertura", type: "range", min: 0, max: 12 },

  { section: "Comportamiento financiero", label: "Cuando tienes dinero disponible, que haces primero?", name: "prioridad_dinero", type: "select", options: ["A. Ahorro", "B. Pago deudas", "C. Gasto en necesidades", "D. Gasto en gustos", "E. Invierto"] },
  { section: "Comportamiento financiero", label: "Cuando surge un gasto inesperado normalmente:", name: "gasto_inesperado", type: "select", options: ["A. Uso ahorro", "B. Ajusto otros gastos", "C. Me endeudo", "D. Me genera estres y no se como cubrirlo"] },
  { section: "Comportamiento financiero", label: "Si tus ingresos disminuyeran 20%, que tan facil seria ajustar tus gastos?", name: "ajuste_20", type: "range", min: 1, max: 5 },
  { section: "Comportamiento financiero", label: "Que tan seguido tomas decisiones financieras sin analizarlas?", name: "decisiones_impulsivas", type: "range", min: 1, max: 5 },
  { section: "Comportamiento financiero", label: "Que tan impulsivo te consideras para comprar?", name: "impulsividad", type: "range", min: 1, max: 5 },
  { section: "Comportamiento financiero", label: "Nivel de educacion financiera", name: "educacion", type: "select", options: ["A. Bajo", "B. Medio", "C. Alto"] },
  { section: "Comportamiento financiero", label: "Que ha limitado mas tu crecimiento financiero?", name: "limitantes", type: "multi", options: ["Ingresos insuficientes", "Gastos desordenados", "Deudas", "Falta de estrategia", "Falta de disciplina", "Falta de conocimiento financiero"] }
];

function renderQuestion() {
  const q = questions[current];
  let html = `<div class="step active"><h2>${q.section}</h2><label>${q.label}</label>`;

  if (q.help) {
    html += `<p class="question-help">${q.help}</p>`;
  }

  if (["text", "email", "number"].includes(q.type)) {
    const pattern = q.textOnly ? `pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"` : "";
    const title = q.textOnly ? `title="Escribe solo texto, sin números."` : "";
    html += `<input type="${q.type}" name="${q.name}" required ${pattern} ${title} value="${answers[q.name] || ""}">`;
  }

  if (q.type === "select") {
    html += `<select name="${q.name}" required><option value="">Selecciona una opción</option>`;
    q.options.forEach(o => html += `<option value="${o}" ${answers[q.name] === o ? "selected" : ""}>${o}</option>`);
    html += `</select>`;
  }

  if (q.type === "range") {
    const value = answers[q.name] || q.min || 1;
    html += `
      <input class="score-range" type="range" name="${q.name}" min="${q.min || 1}" max="${q.max || 5}" value="${value}">
      <p class="range-value">Puntaje actual: <strong id="rangeScore">${value}</strong></p>
    `;
  }

  if (q.type === "multi") {
    q.options.forEach(o => {
      const checked = Array.isArray(answers[q.name]) && answers[q.name].includes(o) ? "checked" : "";
      html += `<label class="option"><input type="checkbox" name="${q.name}" value="${o}" ${checked}> ${o}</label>`;
    });
  }

  html += `</div>`;

  document.querySelectorAll(".step").forEach(el => el.remove());
  form.insertAdjacentHTML("afterbegin", html);

  const range = form.querySelector(".score-range");
  if (range) {
    range.addEventListener("input", () => {
      document.getElementById("rangeScore").textContent = range.value;
      answers[q.name] = range.value;
      burstParticles(10);
    });
  }

  stepLabel.textContent = `Pregunta ${current + 1} de ${questions.length}`;
  progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  prevBtn.classList.toggle("hidden", current === 0);
  nextBtn.classList.toggle("hidden", current === questions.length - 1);
  submitBtn.classList.toggle("hidden", current !== questions.length - 1);
}
function burstParticles(amount = 16) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: mouse.x || innerWidth / 2,
      y: mouse.y || innerHeight / 2,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      a: Math.random() * 0.5 + 0.35
    });
  }

  if (particles.length > 130) {
    particles.splice(0, particles.length - 130);
  }
}
function saveCurrent() {
  const q = questions[current];
  if (q.type === "multi") {
    answers[q.name] = [...form.querySelectorAll(`input[name="${q.name}"]:checked`)].map(i => i.value);
    return answers[q.name].length > 0;
  }

  const field = form.querySelector(`[name="${q.name}"]`);
  if (!field || !field.checkValidity()) {
    field.reportValidity();
    return false;
  }

  answers[q.name] = field.value;
  return true;
}

startBtn.onclick = () => {
  document.querySelector(".hero").classList.add("hidden");
  formPanel.classList.remove("hidden");
  renderQuestion();
};

nextBtn.onclick = () => {
  if (!saveCurrent()) return;

  if (
    questions[current].name === "tiene_deuda" &&
    answers.tiene_deuda &&
    answers.tiene_deuda.includes("No")
  ) {
    const nextSection = questions.findIndex(q => q.section === "Ahorro y emergencia");
    current = nextSection;
  } else {
    current++;
  }

  renderQuestion();
};
};

prevBtn.onclick = () => {
  saveCurrent();
  current--;
  renderQuestion();
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (!saveCurrent()) return;

  const ingreso = promedio(["ingreso_1", "ingreso_2", "ingreso_3"]);
  const gasto = promedio(["gasto_1", "gasto_2", "gasto_3"]);
  const flujo = ingreso - gasto - numero("pago_deuda");
  const cobertura = gasto > 0 ? numero("fondo_emergencia") / gasto : 0;

  let score = 100;
  if (flujo <= 0) score -= 25;
  if (gasto / ingreso > 0.75) score -= 15;
  if (cobertura < 1) score -= 20;
  if (numero("saldo_deuda") / ingreso > 6) score -= 15;
  if (answers.objetivo_definido?.includes("No")) score -= 10;
  if (answers.gasto_inesperado?.includes("Me endeudo")) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const nivel = score <= 40 ? "Critico" : score <= 60 ? "Vulnerable" : score <= 75 ? "Estable" : score <= 90 ? "Saludable" : "Optimo";

  result.classList.remove("hidden");
  result.innerHTML = `
    <h2>Tu espejo financiero inicial</h2>
    <p><strong>Score general:</strong> ${score}/100</p>
    <p><strong>Nivel financiero:</strong> ${nivel}</p>
    <p><strong>Ingreso promedio:</strong> $${Math.round(ingreso).toLocaleString("es-CO")}</p>
    <p><strong>Gasto promedio:</strong> $${Math.round(gasto).toLocaleString("es-CO")}</p>
    <p><strong>Flujo libre estimado:</strong> $${Math.round(flujo).toLocaleString("es-CO")}</p>
    <p><strong>Cobertura de emergencia:</strong> ${cobertura.toFixed(1)} meses</p>
    <p>Este resultado muestra una primera lectura de tu realidad financiera. El informe completo profundiza riesgos, oportunidades y escenarios de mejora.</p>
  `;

  result.scrollIntoView({ behavior: "smooth" });
};

function numero(name) {
  return Number(answers[name] || 0);
}

function promedio(names) {
  return names.reduce((s, n) => s + numero(n), 0) / names.length;
}

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    a: Math.random() * 0.6 + 0.25
  }));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#030504";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (mouse.active && d < 140) {
      p.x += dx / d * 1.8;
      p.y += dy / d * 1.8;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(32, 201, 51, ${p.a})`;
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#20c933";
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(animate);
}

addEventListener("resize", resize);
addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
addEventListener("mouseleave", () => mouse.active = false);

resize();
animate();
