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
let mouse = { x: innerWidth / 2, y: innerHeight / 2, active: false };

const questions = [
  { section: "Identificación del cliente", label: "Nombre completo", name: "nombre", type: "text", textOnly: true, help: "Escribe tu nombre tal como quieres que aparezca en el informe." },
  { section: "Identificación del cliente", label: "Correo electrónico", name: "email", type: "email", help: "A este correo enviaremos la confirmación del diagnóstico." },
  { section: "Identificación del cliente", label: "¿Cuál es tu edad?", name: "edad", type: "number", min: 18, max: 90, help: "Este dato nos ayuda a interpretar tu etapa financiera y tus prioridades actuales." },
  { section: "Identificación del cliente", label: "Para orientarte correctamente, ¿cuál es tu perfil financiero principal?", name: "perfil", type: "select", help: "Selecciona la opción que mejor describe tu fuente principal de ingresos hoy.", options: ["A. Empleado", "B. Independiente", "C. Empresario", "D. Emprendedor", "E. Estudiante"] },
  { section: "Identificación del cliente", label: "¿Tienes personas que dependan económicamente de ti?", name: "dependientes", type: "select", options: ["A. No", "B. Sí, 1 persona", "C. Sí, 2 personas", "D. Sí, 3 o más personas"] },

  { section: "Claridad financiera", label: "¿Tienes un objetivo financiero definido actualmente?", name: "objetivo_definido", type: "select", help: "Un objetivo claro permite medir si tus decisiones actuales te acercan o te alejan de lo que quieres lograr.", options: ["A. Sí, claro y medible", "B. Tengo una idea general", "C. No lo tengo definido"] },
  { section: "Claridad financiera", label: "Define tu objetivo financiero principal", name: "objetivo", type: "text", help: "Ejemplo: salir de deudas, organizar mis gastos, ahorrar para vivienda, crear empresa o invertir mejor." },

  { section: "Ingresos", label: "Ingresa el total de ingresos recibidos en tu mes más reciente", name: "ingreso_1", type: "number" },
  { section: "Ingresos", label: "Ingresa el total de ingresos del mes inmediatamente anterior", name: "ingreso_2", type: "number" },
  { section: "Ingresos", label: "Ingresa el total de ingresos del tercer mes más reciente", name: "ingreso_3", type: "number" },
  { section: "Ingresos", label: "El ingreso que reportaste corresponde a:", name: "tipo_ingreso", type: "select", options: ["A. Ingreso fijo", "B. Ingreso variable", "C. Ingreso mixto", "D. Ingreso ocasional"] },
  { section: "Ingresos", label: "¿Cuál situación describe mejor tu evolución de ingresos en los últimos 6 meses?", name: "evolucion_ingresos", type: "select", options: ["A. Han aumentado", "B. Se han mantenido estables", "C. Han disminuido", "D. Son impredecibles"] },
  { section: "Ingresos", label: "¿Cuántas fuentes de ingreso activas tienes actualmente?", name: "fuentes_ingreso", type: "select", options: ["A. 1 fuente", "B. 2 fuentes", "C. 3 fuentes", "D. 4 fuentes", "E. 5 o más fuentes"] },
  { section: "Ingresos", label: "En un mes bueno, ¿cuál suele ser tu ingreso aproximado?", name: "ingreso_bueno", type: "number" },
  { section: "Ingresos", label: "En un mes bajo, ¿cuál suele ser tu ingreso aproximado?", name: "ingreso_bajo", type: "number" },
  { section: "Ingresos", label: "¿Qué tan predecibles son tus ingresos?", name: "predictibilidad", type: "rating", help: "1 significa muy impredecibles. 5 significa estables y fáciles de proyectar." },

  { section: "Gastos", label: "¿Cuál fue el total de tus gastos en el mes más reciente?", name: "gasto_1", type: "number" },
  { section: "Gastos", label: "¿Cuál fue el total de tus gastos en el mes inmediatamente anterior?", name: "gasto_2", type: "number" },
  { section: "Gastos", label: "¿Cuál fue el total de tus gastos en el tercer mes más reciente?", name: "gasto_3", type: "number" },
  { section: "Gastos", label: "¿En qué tipo de gastos sientes que más dinero se te va sin darte cuenta?", name: "gasto_fuga", type: "select", options: ["A. Comida fuera de casa", "B. Transporte", "C. Compras impulsivas", "D. Entretenimiento", "E. Suscripciones", "F. Otro"] },
  { section: "Gastos", label: "¿Qué gasto realizas con mayor frecuencia durante el mes, aunque sea de montos pequeños?", name: "gasto_frecuente", type: "select", options: ["A. Snacks, café o antojos", "B. Transporte frecuente", "C. Compras por impulso", "D. Domicilios", "E. Entretenimiento", "F. Otro"] },
  { section: "Gastos", label: "¿Qué gasto podrías reducir desde hoy sin afectar tu vida básica?", name: "gasto_reducible", type: "select", options: ["A. Comida fuera de casa", "B. Compras no necesarias", "C. Suscripciones", "D. Salidas y entretenimiento", "E. Transporte", "F. No identifico uno todavía"] },
  { section: "Gastos", label: "¿Cuánto dinero mensual podrías reducir sin afectar tu calidad de vida?", name: "monto_reducible", type: "select", options: ["A. Nada por ahora", "B. Menos de $100.000", "C. Entre $100.000 y $300.000", "D. Entre $300.000 y $700.000", "E. Más de $700.000"] },
  { section: "Gastos", label: "Del total de tus gastos mensuales, ¿qué parte corresponde a gastos fijos obligatorios?", name: "gastos_fijos", type: "select", options: ["A. Menos del 30%", "B. Entre 30% y 50%", "C. Entre 51% y 70%", "D. Más del 70%"] },
  { section: "Gastos", label: "Del total de tus gastos mensuales, ¿qué parte corresponde a gastos no planificados?", name: "gastos_no_planificados", type: "select", options: ["A. Menos del 10%", "B. Entre 10% y 25%", "C. Entre 26% y 40%", "D. Más del 40%"] },

  { section: "Deuda", label: "¿Tienes deudas o utilizas crédito actualmente?", name: "tiene_deuda", type: "select", help: "Si respondes que no tienes deudas, saltaremos automáticamente esta sección.", options: ["A. No", "B. Sí, pero está bajo control", "C. Sí, me preocupa", "D. Sí, está creciendo"] },
  { section: "Deuda", label: "¿Cuánto pagas mensualmente en cuotas de deuda?", name: "pago_deuda", type: "number" },
  { section: "Deuda", label: "¿Cuál es el saldo total pendiente de tus deudas?", name: "saldo_deuda", type: "number" },
  { section: "Deuda", label: "Clasifica tu deuda principal", name: "tipo_deuda", type: "select", options: ["A. Tarjeta de crédito", "B. Crédito de libre inversión", "C. Crédito de vehículo", "D. Hipoteca", "E. Préstamo informal", "F. Otra"] },
  { section: "Deuda", label: "En los últimos 6 meses, ¿has usado crédito para cubrir gastos básicos?", name: "credito_basicos", type: "select", options: ["A. Nunca", "B. Una vez", "C. Varias veces", "D. Frecuentemente"] },

  { section: "Ahorro y emergencia", label: "¿Cuánto dinero tienes ahorrado actualmente?", name: "ahorro", type: "number" },
  { section: "Ahorro y emergencia", label: "¿Qué porcentaje aproximado de tu ingreso logras ahorrar actualmente?", name: "porcentaje_ahorro", type: "piggy", help: "Selecciona el rango más cercano. La alcancía se llenará según tu capacidad de ahorro." },
  { section: "Ahorro y emergencia", label: "¿Qué sucede normalmente cuando logras ahorrar dinero?", name: "conducta_ahorro", type: "select", options: ["A. Lo mantengo", "B. Lo uso eventualmente", "C. Termino gastándolo"] },
  { section: "Ahorro y emergencia", label: "¿Dónde mantienes principalmente tu dinero ahorrado?", name: "lugar_ahorro", type: "select", options: ["A. Cuenta bancaria", "B. Efectivo", "C. Billetera digital", "D. Inversión", "E. No tengo ahorro"] },
  { section: "Ahorro y emergencia", label: "¿Cuánto dinero tienes disponible actualmente como fondo de emergencia?", name: "fondo_emergencia", type: "number" },
  { section: "Ahorro y emergencia", label: "Si dejaras de recibir ingresos hoy, ¿cuántos meses podrías sostener tus gastos?", name: "meses_cobertura", type: "select", options: ["A. Menos de 1 mes", "B. Entre 1 y 2 meses", "C. Entre 3 y 5 meses", "D. 6 meses o más"] },

  { section: "Comportamiento financiero", label: "Cuando tienes dinero disponible, ¿qué haces primero?", name: "prioridad_dinero", type: "select", options: ["A. Ahorro", "B. Pago deudas", "C. Cubro necesidades", "D. Gasto en gustos", "E. Invierto"] },
  { section: "Comportamiento financiero", label: "Cuando surge un gasto inesperado normalmente:", name: "gasto_inesperado", type: "select", options: ["A. Uso ahorro", "B. Ajusto otros gastos", "C. Me endeudo o uso crédito", "D. Me genera estrés y no sé cómo cubrirlo"] },
  { section: "Comportamiento financiero", label: "Si tus ingresos disminuyeran 20%, ¿qué tan fácil sería ajustar tus gastos?", name: "ajuste_20", type: "rating", help: "1 sería muy difícil. 5 sería fácil y controlable." },
  { section: "Comportamiento financiero", label: "¿Qué tan seguido tomas decisiones financieras sin analizarlas?", name: "decisiones_impulsivas", type: "rating", help: "1 casi nunca. 5 muy frecuentemente." },
  { section: "Comportamiento financiero", label: "¿Qué tan impulsivo te consideras para comprar?", name: "impulsividad", type: "rating", help: "1 muy controlado. 5 muy impulsivo." },
  { section: "Comportamiento financiero", label: "Nivel de educación financiera", name: "educacion", type: "select", options: ["A. Bajo", "B. Medio", "C. Alto"] },
  { section: "Comportamiento financiero", label: "¿Qué crees que más ha limitado tu crecimiento financiero hasta ahora?", name: "limitantes", type: "multi", help: "Puedes seleccionar más de una opción si aplica.", options: ["Ingresos insuficientes", "Gastos desordenados", "Deudas", "Falta de estrategia", "Falta de disciplina", "Falta de conocimiento financiero"] }
];

function renderQuestion() {
  const q = questions[current];
  let html = `<div class="step"><h2>${q.section}</h2><label>${q.label}</label>`;

  if (q.help) html += `<p class="question-help">${q.help}</p>`;

  if (["text", "email", "number"].includes(q.type)) {
    const pattern = q.textOnly ? `pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+" title="Escribe solo texto, sin números."` : "";
    const min = q.min ? `min="${q.min}"` : "";
    const max = q.max ? `max="${q.max}"` : "";
    html += `<input type="${q.type}" name="${q.name}" required ${pattern} ${min} ${max} value="${answers[q.name] || ""}">`;
  }

  if (q.type === "select") {
    html += `<select name="${q.name}" required><option value="">Selecciona una opción</option>`;
    q.options.forEach(option => {
      html += `<option value="${option}" ${answers[q.name] === option ? "selected" : ""}>${option}</option>`;
    });
    html += `</select>`;
  }

  if (q.type === "rating") {
    html += `<div class="rating-row">`;
    for (let i = 1; i <= 5; i++) {
      html += `<button type="button" class="rating-btn ${answers[q.name] == i ? "active" : ""}" data-value="${i}">${i}</button>`;
    }
    html += `</div><div class="rating-scale"><span>Bajo</span><span>Alto</span></div>`;
  }

  if (q.type === "piggy") {
    const value = Number(answers[q.name] || 0);
    html += `
      <select name="${q.name}" required>
        <option value="">Selecciona una opción</option>
        <option value="0" ${value === 0 ? "selected" : ""}>0% - No estoy ahorrando</option>
        <option value="5" ${value === 5 ? "selected" : ""}>1% a 5% - Ahorro mínimo</option>
        <option value="10" ${value === 10 ? "selected" : ""}>6% a 10% - Ahorro inicial</option>
        <option value="20" ${value === 20 ? "selected" : ""}>11% a 20% - Buen hábito</option>
        <option value="30" ${value === 30 ? "selected" : ""}>Más de 20% - Excelente capacidad</option>
      </select>
      <div class="piggy-box">
        <div class="piggy-title">Medidor de ahorro</div>
        <div class="piggy"><div class="piggy-fill" style="width:${Math.min(value, 30) / 30 * 100}%"></div></div>
        <div class="piggy-value">${value}%</div>
      </div>
    `;
  }

  if (q.type === "multi") {
    html += `<div class="multi-grid">`;
    q.options.forEach(option => {
      const checked = Array.isArray(answers[q.name]) && answers[q.name].includes(option) ? "checked" : "";
      html += `<label class="option"><input type="checkbox" name="${q.name}" value="${option}" ${checked}> ${option}</label>`;
    });
    html += `</div>`;
  }

  html += `</div>`;

  form.querySelectorAll(".step").forEach(element => element.remove());
  form.insertAdjacentHTML("afterbegin", html);

  form.querySelectorAll(".rating-btn").forEach(button => {
    button.addEventListener("click", () => {
      answers[q.name] = button.dataset.value;
      burstParticles(12);
      renderQuestion();
    });
  });

  const piggySelect = q.type === "piggy" ? form.querySelector(`[name="${q.name}"]`) : null;
  if (piggySelect) {
    piggySelect.addEventListener("change", () => {
      answers[q.name] = piggySelect.value;
      burstParticles(10);
      renderQuestion();
    });
  }

  stepLabel.textContent = `Pregunta ${current + 1} de ${questions.length}`;
  progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  prevBtn.classList.toggle("hidden", current === 0);
  nextBtn.classList.toggle("hidden", current === questions.length - 1);
  submitBtn.classList.toggle("hidden", current !== questions.length - 1);
}

function saveCurrent() {
  const q = questions[current];

  if (q.type === "rating") return Boolean(answers[q.name]);

  if (q.type === "multi") {
    answers[q.name] = [...form.querySelectorAll(`input[name="${q.name}"]:checked`)].map(input => input.value);
    return answers[q.name].length > 0;
  }

  const field = form.querySelector(`[name="${q.name}"]`);
  if (!field || !field.checkValidity()) {
    field?.reportValidity();
    return false;
  }

  answers[q.name] = field.value;
  return true;
}

startBtn.addEventListener("click", () => {
  document.querySelector(".hero").classList.add("hidden");
  formPanel.classList.remove("hidden");
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (!saveCurrent()) return;

  const q = questions[current];
  if (q.name === "tiene_deuda" && answers.tiene_deuda.startsWith("A. No")) {
    answers.pago_deuda = 0;
    answers.saldo_deuda = 0;
    answers.tipo_deuda = "No aplica";
    answers.credito_basicos = "No aplica";
    current = questions.findIndex(item => item.section === "Ahorro y emergencia");
  } else {
    current++;
  }

  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  saveCurrent();
  current = Math.max(0, current - 1);
  renderQuestion();
});

form.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (current < questions.length - 1) nextBtn.click();
  }
});

form.addEventListener("submit", event => {
  event.preventDefault();
  if (current !== questions.length - 1) return;
  if (!saveCurrent()) return;
  showPreReport();
});

function showPreReport() {
  const ingreso = promedio(["ingreso_1", "ingreso_2", "ingreso_3"]);
  const gasto = promedio(["gasto_1", "gasto_2", "gasto_3"]);
  const pagoDeuda = numero("pago_deuda");
  const saldoDeuda = numero("saldo_deuda");
  const fondo = numero("fondo_emergencia");
  const flujo = ingreso - gasto - pagoDeuda;
  const cobertura = gasto > 0 ? fondo / gasto : 0;
  const deudaIngreso = ingreso > 0 ? saldoDeuda / ingreso : 0;
  const ahorroPct = numero("porcentaje_ahorro");

  let score = 100;
  if (flujo <= 0) score -= 25;
  if (ingreso > 0 && gasto / ingreso > 0.75) score -= 15;
  if (cobertura < 1) score -= 20;
  if (deudaIngreso > 6) score -= 15;
  if (answers.objetivo_definido?.startsWith("C")) score -= 10;
  if (answers.gasto_inesperado?.startsWith("C") || answers.gasto_inesperado?.startsWith("D")) score -= 10;
  if (ahorroPct < 5) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));
  const nivel = score <= 40 ? "Crítico" : score <= 60 ? "Vulnerable" : score <= 75 ? "Estable" : score <= 90 ? "Saludable" : "Óptimo";

  result.classList.remove("hidden");
  result.innerHTML = `
    <h2>Tu espejo financiero inicial</h2>
    <p>Este es un resumen preliminar. El informe completo incluirá lectura profesional, riesgos, oportunidades, escenarios y recomendaciones personalizadas.</p>

    <div class="metric-grid">
      <div class="metric-card"><span>Score general</span><strong>${score}/100</strong></div>
      <div class="metric-card"><span>Nivel financiero</span><strong>${nivel}</strong></div>
      <div class="metric-card"><span>Ingreso promedio</span><strong>$${Math.round(ingreso).toLocaleString("es-CO")}</strong></div>
      <div class="metric-card"><span>Gasto promedio</span><strong>$${Math.round(gasto).toLocaleString("es-CO")}</strong></div>
      <div class="metric-card"><span>Flujo libre estimado</span><strong>$${Math.round(flujo).toLocaleString("es-CO")}</strong></div>
      <div class="metric-card"><span>Cobertura de emergencia</span><strong>${cobertura.toFixed(1)} meses</strong></div>
    </div>

    <div class="payment-box">
      <h3>Desbloquear informe completo</h3>
      <p>El informe completo incluirá diagnóstico financiero, indicadores profesionales, escenario actual, escenario optimizado y próximos pasos recomendados.</p>
      <button type="button">Continuar a pago</button>
    </div>
  `;

  result.scrollIntoView({ behavior: "smooth" });
}

function numero(name) {
  return Number(answers[name] || 0);
}

function promedio(names) {
  return names.reduce((sum, name) => sum + numero(name), 0) / names.length;
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

  if (particles.length > 140) particles.splice(0, particles.length - 140);
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

  particles.forEach(particle => {
    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (mouse.active && distance < 140) {
      particle.x += (dx / Math.max(distance, 1)) * 1.8;
      particle.y += (dy / Math.max(distance, 1)) * 1.8;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(32, 201, 51, ${particle.a})`;
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#20c933";
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(animate);
}

addEventListener("resize", resize);
addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});
addEventListener("mouseleave", () => {
  mouse.active = false;
});

resize();
animate();
