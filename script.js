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
  { section: "Ingresos", label: "¿Qué porcentaje de tus ingresos depende de tu fuente principal?", name: "dependencia_fuente", type: "select", help: "Esta respuesta permite medir el riesgo de depender de una sola entrada.", options: ["A. Menos del 40%", "B. Entre 40% y 60%", "C. Entre 61% y 80%", "D. Más del 80%"] },
  { section: "Ingresos", label: "¿Cuántas horas trabajas aproximadamente al mes?", name: "horas_trabajadas", type: "number", min: 1, max: 500, help: "Incluye el tiempo que dedicas a tu actividad principal y a generar tus ingresos actuales." },
  { section: "Ingresos", label: "¿Cuántas horas semanales podrías dedicar de forma realista a generar ingresos adicionales?", name: "horas_adicionales", type: "select", options: ["A. Ninguna por ahora", "B. Entre 1 y 5 horas", "C. Entre 6 y 10 horas", "D. Más de 10 horas"] },

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
  { section: "Deuda", label: "¿Cómo ha sido tu puntualidad en el pago de las deudas durante los últimos 6 meses?", name: "historial_pago", type: "select", options: ["A. Siempre pago a tiempo", "B. Casi siempre pago a tiempo", "C. He tenido algunos atrasos", "D. Tengo atrasos frecuentes"] },
  { section: "Deuda", label: "¿Conoces la tasa de interés de tu deuda principal?", name: "conoce_tasa", type: "select", help: "No buscamos evaluarte por memorizar una cifra, sino por conocer el costo de tu obligación.", options: ["A. Sí, la conozco con claridad", "B. Tengo una idea aproximada", "C. No la conozco"] },
  { section: "Deuda", label: "¿Para qué fue utilizada principalmente tu deuda actual?", name: "uso_deuda", type: "select", options: ["A. Inversión o actividad productiva", "B. Vivienda, educación o activo necesario", "C. Emergencia o necesidad puntual", "D. Consumo no esencial", "E. Cubrir gastos mensuales recurrentes"] },

  { section: "Ahorro y emergencia", label: "¿Cuánto dinero tienes ahorrado actualmente?", name: "ahorro", type: "number" },
  { section: "Ahorro y emergencia", label: "¿Qué porcentaje aproximado de tu ingreso logras ahorrar actualmente?", name: "porcentaje_ahorro", type: "piggy", help: "Selecciona el rango más cercano. La alcancía se llenará según tu capacidad de ahorro." },
  { section: "Ahorro y emergencia", label: "¿Qué sucede normalmente cuando logras ahorrar dinero?", name: "conducta_ahorro", type: "select", options: ["A. Lo mantengo", "B. Lo uso eventualmente", "C. Termino gastándolo"] },
  { section: "Ahorro y emergencia", label: "¿Dónde mantienes principalmente tu dinero ahorrado?", name: "lugar_ahorro", type: "select", options: ["A. Cuenta bancaria", "B. Efectivo", "C. Billetera digital", "D. Inversión", "E. No tengo ahorro"] },
  { section: "Ahorro y emergencia", label: "¿Cuánto dinero tienes disponible actualmente como fondo de emergencia?", name: "fondo_emergencia", type: "number" },
  { section: "Ahorro y emergencia", label: "Si dejaras de recibir ingresos hoy, ¿cuántos meses podrías sostener tus gastos?", name: "meses_cobertura", type: "select", options: ["A. Menos de 1 mes", "B. Entre 1 y 2 meses", "C. Entre 3 y 5 meses", "D. 6 meses o más"] },
  { section: "Ahorro y emergencia", label: "¿En cuántos de los últimos 6 meses lograste separar dinero para ahorrar?", name: "meses_ahorro_6", type: "select", help: "Esto mide la consistencia del hábito, no solamente el monto acumulado.", options: ["A. En ninguno", "B. En 1 o 2 meses", "C. En 3 o 4 meses", "D. En 5 o 6 meses"] },

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
    answers.historial_pago = "No aplica";
    answers.conoce_tasa = "No aplica";
    answers.uso_deuda = "No aplica";
    current = questions.findIndex(item => item.section === "Ahorro y emergencia");
  } else {
    current++;
  }

  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  saveCurrent();
  const currentQuestion = questions[current];
  const noDebt = String(answers.tiene_deuda || "").startsWith("A. No");

  if (noDebt && currentQuestion.section === "Ahorro y emergencia") {
    current = questions.findIndex(item => item.name === "tiene_deuda");
  } else {
    current = Math.max(0, current - 1);
  }

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
  const evaluation = CrowdCapitalScoring.evaluateAssessment(answers);
  const enrichedScenario = getConjugatedScenario(evaluation);

  result.classList.remove("hidden");
  result.innerHTML = renderProfessionalReport(evaluation, enrichedScenario);
  result.scrollIntoView({ behavior: "smooth" });
}

function renderProfessionalReport(evaluation, enrichedScenario) {
  const metrics = evaluation.metrics;
  const blocks = evaluation.blockScores;
  const alertList = evaluation.alerts || [];
  const weakestBlock = Object.entries(blocks).sort((a, b) => a[1] - b[1])[0];
  const strongestBlock = Object.entries(blocks).sort((a, b) => b[1] - a[1])[0];

  const projection3 = getProjection(evaluation, 3);
  const projection6 = getProjection(evaluation, 6);
  const projection12 = getProjection(evaluation, 12);
  const projection24 = getProjection(evaluation, 24);

  const executiveSummary = buildExecutiveSummary(evaluation, enrichedScenario, weakestBlock, strongestBlock);
  const actionPlan = buildActionPlan(evaluation, enrichedScenario, weakestBlock);

  return `
    <section class="professional-report">

      <section class="report-cover">
        <div class="cover-left">
          <span class="brand-pill">CrowdCapital Col.</span>
          <h2>Espejo Financiero™</h2>
          <p>
            Diagnóstico financiero integral basado en ingresos, gastos, ahorro, deuda y comportamiento financiero.
          </p>
        </div>

        <div class="cover-score">
          <span>Índice de Construcción de Capital</span>
          <strong>${evaluation.totalScore}/100</strong>
          <small>${evaluation.classification}</small>
        </div>
      </section>

      <section class="report-section executive-section">
        <div class="section-number">01</div>
        <div>
          <h3>Resumen ejecutivo</h3>
          <p>${executiveSummary}</p>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">02</div>
        <div>
          <h3>Diagnóstico narrativo</h3>
          <p>
            Tu situación financiera actual se clasifica como <strong>${evaluation.classification}</strong>.
            El sistema identifica como área más sensible <strong>${blockLabel(weakestBlock[0])}</strong>,
            mientras que tu punto más sólido actualmente es <strong>${blockLabel(strongestBlock[0])}</strong>.
          </p>
          <p>
            Esto significa que tu realidad financiera no debe analizarse únicamente por el ingreso que recibes,
            sino por la forma en que ese ingreso se transforma en flujo libre, ahorro, estabilidad y capacidad futura de inversión.
          </p>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">03</div>
        <div>
          <h3>Radiografía numérica</h3>
          <div class="report-grid">
            ${metricCard("Ingreso promedio", money(metrics.incomeAverage), "Promedio de los últimos 3 meses reportados.")}
            ${metricCard("Gasto promedio", money(metrics.expenseAverage), "Promedio mensual de salida de dinero.")}
            ${metricCard("Flujo libre estimado", money(metrics.freeCashFlow), "Capital disponible después de gastos y deudas.")}
            ${metricCard("Capital recuperable", `${money(metrics.reducibleAmount)}/mes`, "Monto que podrías recuperar corrigiendo fugas.")}
            ${metricCard("Cobertura de emergencia", `${metrics.emergencyCoverage.toFixed(1)} meses`, "Tiempo estimado de resistencia sin nuevos ingresos.")}
            ${metricCard("Ingreso por hora", money(metrics.incomePerHour), "Productividad económica estimada.")}
          </div>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">04</div>
        <div>
          <h3>Hallazgos principales</h3>
          <div class="finding-list">
            ${renderFinding(`Bloque más débil: ${blockLabel(weakestBlock[0])}`, `Puntaje actual: ${weakestBlock[1]}/100.`)}
            ${renderFinding(`Bloque más fuerte: ${blockLabel(strongestBlock[0])}`, `Puntaje actual: ${strongestBlock[1]}/100.`)}
            ${renderFinding("Capital recuperable mensual", `El sistema estima una oportunidad de recuperación de ${money(metrics.reducibleAmount)} mensuales.`)}
            ${renderFinding("Flujo libre", metrics.freeCashFlow >= 0
              ? `Existe flujo positivo estimado de ${money(metrics.freeCashFlow)}.`
              : `Existe déficit estimado de ${money(Math.abs(metrics.freeCashFlow))} mensual.`
            )}
          </div>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">05</div>
        <div>
          <h3>Alertas críticas</h3>
          ${
            alertList.length
              ? `<div class="alert-list">${alertList.slice(0, 4).map(renderAlert).join("")}</div>`
              : `<p>No se detectaron alertas críticas con la información suministrada.</p>`
          }
        </div>
      </section>

      <section class="report-section scenario-current">
        <div class="section-number">06</div>
        <div>
          <h3>Escenario actual</h3>
          <span class="scenario-badge">${enrichedScenario.title}</span>
          <p>${enrichedScenario.summary}</p>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">07</div>
        <div>
          <h3>Escenario crítico próximo</h3>
          <p>
            Si no se corrigen las principales fugas, presiones o hábitos detectados, el escenario crítico podría reducir
            tu flujo mensual hasta <strong>${money(projection6?.critical?.monthlyFlow || 0)}</strong> en un horizonte aproximado de 6 meses.
          </p>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">08</div>
        <div>
          <h3>Escenario optimizado</h3>
          <p>
            Si se ejecutan ajustes sobre gastos reducibles, flujo libre, ahorro y hábitos financieros,
            el sistema proyecta una mejora acumulada potencial de
            <strong>${money(projection12?.optimized?.improvementVsCurrent || 0)}</strong> en 12 meses.
          </p>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">09</div>
        <div>
          <h3>Proyección a 3 meses</h3>
          ${renderProjection(projection3)}
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">10</div>
        <div>
          <h3>Proyección a 6 meses</h3>
          ${renderProjection(projection6)}
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">11</div>
        <div>
          <h3>Proyección a 12 meses y 2 años</h3>
          ${renderProjection(projection12)}
          ${renderProjection(projection24)}
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">12</div>
        <div>
          <h3>Resultado general y clasificación</h3>
          <div class="score-panel">
            <strong>${evaluation.totalScore}/100</strong>
            <span>${evaluation.classification}</span>
            <p>
              Este resultado representa una lectura integral del sistema financiero personal,
              combinando capacidad de ingreso, presión de gasto, resiliencia, deuda y comportamiento.
            </p>
          </div>
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">13</div>
        <div>
          <h3>Sub-scores por bloque</h3>
          <div class="block-score-grid">
            ${blockScore("Ingresos", blocks.ingresos)}
            ${blockScore("Gastos", blocks.gastos)}
            ${blockScore("Ahorro", blocks.ahorro)}
            ${blockScore("Deuda", blocks.deuda)}
            ${blockScore("Comportamiento", blocks.comportamiento)}
          </div>
        </div>
      </section>

      <section class="report-section service-section">
        <div class="section-number">14</div>
        <div>
          <h3>Servicio recomendado</h3>
          <p>
            Con base en el bloque más sensible, las alertas activas y el objetivo declarado,
            CrowdCapital recomienda iniciar con:
          </p>
          <div class="recommended-service">
            ${evaluation.service.primaryService}
          </div>
          ${
            evaluation.service.secondaryService
              ? `<p>Servicio complementario sugerido: <strong>${evaluation.service.secondaryService}</strong>.</p>`
              : ""
          }
        </div>
      </section>

      <section class="report-section">
        <div class="section-number">15</div>
        <div>
          <h3>Plan inicial de acción</h3>
          <div class="action-list">
            ${actionPlan.map((item, index) => `
              <div class="action-item">
                <span>${index + 1}</span>
                <p>${item}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="locked-section">
        <h3>Informe completo y herramientas bloqueadas</h3>
        <div class="blurred-preview">
          <p>✓ PDF profesional con diagnóstico completo.</p>
          <p>✓ Herramienta editable de control financiero.</p>
          <p>✓ Plan detallado por ingresos, gastos, ahorro, deuda y comportamiento.</p>
          <p>✓ Revisión con asesor financiero.</p>
          <p>✓ Recomendación personalizada del siguiente servicio CrowdCapital.</p>
        </div>
      </section>

      <section class="premium-cta">
        <h3>Desbloquea tu informe financiero completo</h3>
        <p>
          Recibe tu radiografía financiera completa, tus fugas de dinero, tus riesgos ocultos
          y la ruta inicial para recuperar control sobre tu capital.
        </p>

        <div class="cta-actions">
          <button type="button">Desbloquear informe completo</button>
          <button type="button" class="secondary-btn">Solicitar revisión con asesor</button>
        </div>

        <small>
          Información confidencial. CrowdCapital no promete resultados financieros, aprobación de créditos
          ni rentabilidades específicas. El diagnóstico entrega análisis, herramientas y rutas de decisión
          basadas en la información suministrada por el cliente.
        </small>
      </section>

      <section class="report-section disclaimer-section">
        <div class="section-number">16</div>
        <div>
          <h3>Disclaimer</h3>
          <p>
            Este informe tiene fines educativos, diagnósticos y de orientación financiera.
            Los resultados dependen de la veracidad, precisión y actualización de la información entregada.
            Las decisiones financieras finales son responsabilidad exclusiva del cliente.
          </p>
        </div>
      </section>

    </section>
  `;
}

function getConjugatedScenario(evaluation) {
  const m = evaluation.metrics;
  const b = evaluation.blockScores;
  const alerts = evaluation.alerts || [];

  const hasAlert = id => alerts.some(alert => alert.id === id);
  const flowPositive = m.freeCashFlow > 0;
  const flowNegative = m.freeCashFlow < 0;
  const lowDebt = b.deuda >= 75;
  const highDebt = b.deuda < 60 || m.debtPaymentRatio > 0.36;
  const goodSavings = b.ahorro >= 75 && m.emergencyCoverage >= 3;
  const lowEmergency = m.emergencyCoverage < 1.5;
  const highDependence = m.sourceDependency > 0.8;
  const highUnplanned = m.unplannedExpensePct > 0.25;
  const highImpulsivity = b.comportamiento < 60;
  const incomeBlocked = b.ingresos < 60 || highDependence;
  const reducibleHigh = m.reducibleAmount > 0 && m.reducibleRatio >= 0.08;
  const educationGood = b.comportamiento >= 65;

  if (flowNegative && hasAlert("credito_basicos") && hasAlert("deuda_creciente")) {
    return {
      id: "reestructuracion_urgente",
      title: "Reestructuración urgente",
      summary: "El flujo negativo, el uso de crédito para gastos básicos y la deuda en crecimiento indican riesgo crítico de deterioro financiero."
    };
  }

  if (flowPositive && goodSavings && lowDebt && b.comportamiento >= 75) {
    return {
      id: "estabilidad_real",
      title: "Estabilidad real",
      summary: "El cliente presenta flujo positivo, ahorro activo, deuda controlada y comportamiento financiero favorable. Existe una base sólida para avanzar."
    };
  }

  if (flowPositive && (lowEmergency || highDependence)) {
    return {
      id: "estabilidad_fragil",
      title: "Estabilidad frágil",
      summary: "Existe flujo positivo, pero la baja cobertura de emergencia o la dependencia de una fuente de ingreso hacen que la estabilidad sea vulnerable ante choques."
    };
  }

  if (b.ingresos >= 70 && highUnplanned) {
    return {
      id: "riesgo_desorden",
      title: "Riesgo de desorden",
      summary: "El problema principal no parece ser la generación de ingresos, sino la administración del gasto y la falta de control sobre salidas no planificadas."
    };
  }

  if (highDebt || hasAlert("deuda_creciente") || hasAlert("atrasos")) {
    return {
      id: "riesgo_deuda",
      title: "Riesgo de deuda",
      summary: "La deuda consume una parte relevante del ingreso y puede limitar la capacidad de ahorro, inversión y recuperación financiera."
    };
  }

  if (lowEmergency || b.ahorro < 60) {
    return {
      id: "riesgo_liquidez",
      title: "Riesgo de liquidez",
      summary: "La protección financiera es insuficiente. Un imprevisto podría romper la estabilidad actual y obligar al uso de crédito o ahorro no planificado."
    };
  }

  if (highImpulsivity && highUnplanned) {
    return {
      id: "riesgo_conductual",
      title: "Riesgo conductual",
      summary: "La impulsividad, el bajo análisis previo y las fugas de gasto pueden destruir avances financieros incluso cuando existe capacidad económica."
    };
  }

  if (incomeBlocked) {
    return {
      id: "crecimiento_bloqueado",
      title: "Crecimiento bloqueado",
      summary: "El ingreso se encuentra limitado por dependencia, estancamiento o baja diversificación. Se requiere estrategia para ampliar fuentes y productividad."
    };
  }

  if (reducibleHigh && !flowNegative) {
    return {
      id: "recuperacion_rapida",
      title: "Recuperación rápida",
      summary: "Existe una fuga reducible relevante y la deuda parece manejable. El cliente puede mejorar en 3 a 6 meses con ajustes concretos."
    };
  }

  if (m.emergencyCoverage < 1 && m.savingsRate < 0.05) {
    return {
      id: "blindaje_prioritario",
      title: "Blindaje prioritario",
      summary: "Antes de pensar en inversión o crecimiento, el cliente debe construir protección mínima, fondo de emergencia y reglas de ahorro automático."
    };
  }

  if (flowPositive && b.ahorro >= 65 && educationGood) {
    return {
      id: "optimizacion_patrimonial",
      title: "Optimización patrimonial",
      summary: "Existe una base para pasar del orden financiero a la optimización, inversión y construcción patrimonial progresiva."
    };
  }

  return {
    id: evaluation.scenario.id,
    title: evaluation.scenario.title,
    summary: evaluation.scenario.summary
  };
}

function buildExecutiveSummary(evaluation, scenario, weakestBlock, strongestBlock) {
  const m = evaluation.metrics;
  const b = evaluation.blockScores;

  if (b.gastos < 65 && b.comportamiento < 65 && m.freeCashFlow > 0) {
    return "Cliente con capacidad financiera, pero con fuga conductual. Puede mejorar rápido si organiza gastos, reduce decisiones impulsivas y convierte su flujo positivo en ahorro automático.";
  }

  if (b.ingresos >= 70 && b.gastos < 60) {
    return "El ingreso no es el principal problema. La oportunidad se encuentra en recuperar control sobre el gasto, reducir fugas y convertir el dinero disponible en estabilidad medible.";
  }

  if (b.deuda < 60) {
    return "La deuda representa la principal presión estructural. Antes de pensar en inversión o crecimiento, se debe recuperar flujo mensual y ordenar las obligaciones activas.";
  }

  if (b.ahorro < 60) {
    return "El cliente presenta vulnerabilidad frente a imprevistos. La prioridad debe ser construir un sistema de blindaje financiero antes de asumir nuevos riesgos.";
  }

  if (evaluation.totalScore >= 80) {
    return "El cliente presenta una base financiera saludable. El siguiente paso no es solo controlar, sino optimizar, proteger y preparar una ruta de inversión responsable.";
  }

  return `El diagnóstico ubica al cliente en un escenario de ${scenario.title.toLowerCase()}. El bloque más débil es ${blockLabel(weakestBlock[0])}, mientras que la mayor fortaleza se encuentra en ${blockLabel(strongestBlock[0])}.`;
}

function buildActionPlan(evaluation, scenario, weakestBlock) {
  const m = evaluation.metrics;
  const plan = [];

  if (m.freeCashFlow < 0) {
    plan.push("Detener el déficit mensual identificando gastos reducibles y evitando financiar gastos básicos con crédito.");
  } else {
    plan.push("Separar el flujo libre estimado antes de que sea absorbido por gastos no planificados.");
  }

  if (weakestBlock[0] === "gastos") {
    plan.push("Crear un presupuesto mensual con límite por categorías y control de gastos no planificados.");
  }

  if (weakestBlock[0] === "ahorro") {
    plan.push("Definir un aporte automático mínimo al fondo de emergencia hasta cubrir al menos 1 mes de gastos.");
  }

  if (weakestBlock[0] === "deuda") {
    plan.push("Ordenar todas las deudas por saldo, cuota, tasa y urgencia para definir una ruta de salida.");
  }

  if (weakestBlock[0] === "comportamiento") {
    plan.push("Aplicar una regla de espera antes de compras no esenciales y registrar gastos impulsivos durante 30 días.");
  }

  if (weakestBlock[0] === "ingresos") {
    plan.push("Evaluar nuevas fuentes de ingreso o aumento de productividad por hora trabajada.");
  }

  plan.push(`Iniciar con el servicio recomendado: ${evaluation.service.primaryService}.`);

  return plan.slice(0, 5);
}

function getProjection(evaluation, months) {
  return evaluation.projections.find(item => item.months === months);
}

function renderProjection(projection) {
  if (!projection) return `<p>Proyección no disponible.</p>`;

  return `
    <div class="projection-grid">
      <div class="projection-card">
        <span>Escenario actual</span>
        <strong>${money(projection.current.monthlyFlow)}</strong>
        <small>Flujo mensual estimado</small>
      </div>

      <div class="projection-card">
        <span>Escenario crítico</span>
        <strong>${money(projection.critical.monthlyFlow)}</strong>
        <small>Con caída o presión adicional</small>
      </div>

      <div class="projection-card">
        <span>Escenario optimizado</span>
        <strong>${money(projection.optimized.monthlyFlow)}</strong>
        <small>Con ajustes y recuperación de flujo</small>
      </div>

      <div class="projection-card">
        <span>Mejora acumulada</span>
        <strong>${money(projection.optimized.improvementVsCurrent)}</strong>
        <small>Potencial vs escenario actual</small>
      </div>
    </div>
  `;
}

function metricCard(title, value, description) {
  return `
    <div class="metric-card pro-card">
      <span>${title}</span>
      <strong>${value}</strong>
      <p>${description}</p>
    </div>
  `;
}

function renderFinding(title, text) {
  return `
    <div class="finding-item">
      <strong>${title}</strong>
      <p>${text}</p>
    </div>
  `;
}

function renderAlert(alert) {
  return `
    <div class="alert-card ${severityClass(alert.severity)}">
      <strong>${alert.title}</strong>
      <p>${alert.narrative}</p>
      <small>Horizonte estimado: ${alert.horizon} meses</small>
    </div>
  `;
}

function blockScore(label, score) {
  return `
    <div class="block-score">
      <div>
        <span>${label}</span>
        <strong>${score}/100</strong>
      </div>
      <div class="score-bar">
        <div style="width:${score}%"></div>
      </div>
    </div>
  `;
}

function severityClass(severity) {
  if (severity >= 3) return "severity-high";
  if (severity === 2) return "severity-medium";
  return "severity-low";
}

function blockLabel(block) {
  return {
    ingresos: "Ingresos",
    gastos: "Gastos",
    ahorro: "Ahorro y resiliencia",
    deuda: "Deuda",
    comportamiento: "Comportamiento financiero"
  }[block] || block;
}

function money(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
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
