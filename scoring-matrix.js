(function (root) {
  "use strict";

  const BLOCK_WEIGHTS = {
    ingresos: 0.1875,
    gastos: 0.1875,
    ahorro: 0.1875,
    deuda: 0.1875,
    comportamiento: 0.25
  };

  const QUESTION_MATRIX = [
    { id: 1, key: "nombre", block: "contexto", role: ["identificacion", "narrativa"], scored: false },
    { id: 2, key: "email", block: "contexto", role: ["entrega", "seguimiento"], scored: false },
    { id: 3, key: "edad", block: "contexto", role: ["segmentacion", "narrativa"], scored: false },
    { id: 4, key: "perfil", block: "ingresos", role: ["calidad_ingreso", "segmentacion"], scored: true },
    { id: 5, key: "dependientes", block: "contexto", role: ["presion_familiar", "meta_emergencia"], scored: false },
    { id: 6, key: "objetivo_definido", block: "comportamiento", role: ["claridad", "narrativa"], scored: true },
    { id: 7, key: "objetivo", block: "contexto", role: ["personalizacion", "servicio"], scored: false },
    { id: 8, key: "ingreso_1", block: "ingresos", role: ["promedio", "tendencia", "variabilidad"], scored: true },
    { id: 9, key: "ingreso_2", block: "ingresos", role: ["promedio", "variabilidad"], scored: true },
    { id: 10, key: "ingreso_3", block: "ingresos", role: ["promedio", "tendencia", "variabilidad"], scored: true },
    { id: 11, key: "tipo_ingreso", block: "ingresos", role: ["calidad_ingreso"], scored: true },
    { id: 12, key: "evolucion_ingresos", block: "ingresos", role: ["tendencia", "alerta"], scored: true },
    { id: 13, key: "fuentes_ingreso", block: "ingresos", role: ["diversificacion"], scored: true },
    { id: 14, key: "ingreso_bueno", block: "ingresos", role: ["techo_ingreso", "variabilidad"], scored: true },
    { id: 15, key: "ingreso_bajo", block: "ingresos", role: ["piso_ingreso", "riesgo"], scored: true },
    { id: 16, key: "predictibilidad", block: "ingresos", role: ["estabilidad_percibida"], scored: true },
    { id: 17, key: "gasto_1", block: "gastos", role: ["promedio", "presion"], scored: true },
    { id: 18, key: "gasto_2", block: "gastos", role: ["promedio", "variabilidad"], scored: true },
    { id: 19, key: "gasto_3", block: "gastos", role: ["promedio", "variabilidad"], scored: true },
    { id: 20, key: "gasto_fuga", block: "gastos", role: ["causa", "narrativa"], scored: false },
    { id: 21, key: "gasto_frecuente", block: "gastos", role: ["microfuga", "narrativa"], scored: false },
    { id: 22, key: "gasto_reducible", block: "gastos", role: ["conciencia", "accion"], scored: true },
    { id: 23, key: "monto_reducible", block: "gastos", role: ["fuga_reducible", "proyeccion"], scored: true },
    { id: 24, key: "gastos_fijos", block: "gastos", role: ["rigidez"], scored: true },
    { id: 25, key: "gastos_no_planificados", block: "gastos", role: ["desorden", "comportamiento"], scored: true },
    { id: 26, key: "tiene_deuda", block: "deuda", role: ["activador", "estado"], scored: true },
    { id: 27, key: "pago_deuda", block: "deuda", role: ["ratio_deuda_ingreso"], scored: true },
    { id: 28, key: "saldo_deuda", block: "deuda", role: ["saldo_deuda_ingreso"], scored: true },
    { id: 29, key: "tipo_deuda", block: "deuda", role: ["calidad_deuda"], scored: true },
    { id: 30, key: "credito_basicos", block: "deuda", role: ["fragilidad", "alerta"], scored: true },
    { id: 31, key: "ahorro", block: "ahorro", role: ["capital_disponible"], scored: true },
    { id: 32, key: "porcentaje_ahorro", block: "ahorro", role: ["tasa_ahorro"], scored: true },
    { id: 33, key: "conducta_ahorro", block: "ahorro", role: ["conservacion", "comportamiento"], scored: true },
    { id: 34, key: "lugar_ahorro", block: "ahorro", role: ["liquidez"], scored: true },
    { id: 35, key: "fondo_emergencia", block: "ahorro", role: ["cobertura_real"], scored: true },
    { id: 36, key: "meses_cobertura", block: "ahorro", role: ["cobertura_percibida", "brecha_percepcion"], scored: true },
    { id: 37, key: "prioridad_dinero", block: "comportamiento", role: ["prioridad"], scored: true },
    { id: 38, key: "gasto_inesperado", block: "comportamiento", role: ["resiliencia", "alerta"], scored: true },
    { id: 39, key: "ajuste_20", block: "comportamiento", role: ["flexibilidad"], scored: true },
    { id: 40, key: "decisiones_impulsivas", block: "comportamiento", role: ["analisis_decisiones"], scored: true },
    { id: 41, key: "impulsividad", block: "comportamiento", role: ["consumo_emocional"], scored: true },
    { id: 42, key: "educacion", block: "comportamiento", role: ["conocimiento"], scored: true },
    { id: 43, key: "limitantes", block: "comportamiento", role: ["causa_raiz", "servicio", "narrativa"], scored: true },
    { id: 44, key: "dependencia_fuente", block: "ingresos", role: ["concentracion", "alerta"], scored: true },
    { id: 45, key: "horas_trabajadas", block: "ingresos", role: ["productividad"], scored: true },
    { id: 46, key: "horas_adicionales", block: "ingresos", role: ["potencial_crecimiento", "proyeccion"], scored: true },
    { id: 47, key: "meses_ahorro_6", block: "ahorro", role: ["consistencia"], scored: true },
    { id: 48, key: "historial_pago", block: "deuda", role: ["puntualidad", "alerta"], scored: true },
    { id: 49, key: "conoce_tasa", block: "deuda", role: ["conciencia_costo"], scored: true },
    { id: 50, key: "uso_deuda", block: "deuda", role: ["calidad_deuda", "narrativa"], scored: true }
  ];

  const OPTION_SCORES = {
    perfil: { A: 90, B: 65, C: 75, D: 55, E: 40 },
    objetivo_definido: { A: 100, B: 60, C: 20 },
    tipo_ingreso: { A: 95, B: 55, C: 80, D: 35 },
    evolucion_ingresos: { A: 100, B: 80, C: 30, D: 20 },
    fuentes_ingreso: { A: 45, B: 70, C: 85, D: 95, E: 100 },
    gasto_reducible: { A: 85, B: 85, C: 90, D: 85, E: 75, F: 25 },
    tiene_deuda: { A: 100, B: 75, C: 35, D: 10 },
    tipo_deuda: { A: 35, B: 45, C: 65, D: 80, E: 20, F: 45 },
    credito_basicos: { A: 100, B: 65, C: 25, D: 0 },
    conducta_ahorro: { A: 100, B: 60, C: 20 },
    lugar_ahorro: { A: 90, B: 55, C: 80, D: 65, E: 0 },
    prioridad_dinero: { A: 95, B: 90, C: 75, D: 25, E: 85 },
    gasto_inesperado: { A: 100, B: 75, C: 25, D: 5 },
    educacion: { A: 35, B: 70, C: 100 },
    historial_pago: { A: 100, B: 80, C: 40, D: 5 },
    conoce_tasa: { A: 100, B: 65, C: 20 },
    uso_deuda: { A: 100, B: 80, C: 55, D: 25, E: 0 }
  };

  const LIMITATION_SCORES = {
    "Ingresos insuficientes": 55,
    "Gastos desordenados": 35,
    "Deudas": 25,
    "Falta de estrategia": 45,
    "Falta de disciplina": 20,
    "Falta de conocimiento financiero": 40
  };

  const SERVICES = {
    ingresos: "Diagnóstico financiero y estrategia de generación de ingresos",
    gastos: "Organización financiera y control de flujo de caja",
    ahorro: "Blindaje financiero y construcción de fondo de emergencia",
    deuda: "Plan de deuda y recuperación de flujo",
    comportamiento: "Educación financiera y acompañamiento de hábitos"
  };

  function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }

  function numberOf(data, key) {
    const parsed = Number(data[key]);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function answerCode(value) {
    const match = String(value || "").trim().match(/^([A-Z])\./i);
    return match ? match[1].toUpperCase() : "";
  }

  function optionScore(key, value, fallback = 50) {
    return OPTION_SCORES[key]?.[answerCode(value)] ?? fallback;
  }

  function average(values) {
    const numbers = values.map(Number).filter(Number.isFinite);
    return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
  }

  function standardDeviation(values) {
    const numbers = values.map(Number).filter(Number.isFinite);
    if (numbers.length < 2) return 0;
    const mean = average(numbers);
    const variance = average(numbers.map(value => (value - mean) ** 2));
    return Math.sqrt(variance);
  }

  function weightedAverage(items) {
    const valid = items.filter(item => Number.isFinite(item.score) && item.weight > 0);
    const totalWeight = valid.reduce((sum, item) => sum + item.weight, 0);
    if (!totalWeight) return 0;
    return valid.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
  }

  function scoreLowerRatio(ratio, excellent, acceptable, vulnerable, critical) {
    if (ratio <= excellent) return 100;
    if (ratio <= acceptable) return 80;
    if (ratio <= vulnerable) return 55;
    if (ratio <= critical) return 25;
    return 0;
  }

  function scoreHigherRatio(ratio, critical, vulnerable, acceptable, excellent) {
    if (ratio >= excellent) return 100;
    if (ratio >= acceptable) return 80;
    if (ratio >= vulnerable) return 55;
    if (ratio >= critical) return 25;
    return 0;
  }

  function scoreRating(value, reverse = false) {
    const rating = clamp(Number(value) || 1, 1, 5);
    const score = ((rating - 1) / 4) * 100;
    return reverse ? 100 - score : score;
  }

  function rangeValue(value, mapping) {
    return mapping[answerCode(value)] ?? 0;
  }

  function classification(score) {
    if (score <= 40) return "Crítico";
    if (score <= 60) return "Vulnerable";
    if (score <= 75) return "Estable";
    if (score <= 90) return "Saludable";
    return "Óptimo";
  }

  function dependentsCount(value) {
    return rangeValue(value, { A: 0, B: 1, C: 2, D: 3 });
  }

  function buildMetrics(data) {
    const incomes = [numberOf(data, "ingreso_1"), numberOf(data, "ingreso_2"), numberOf(data, "ingreso_3")];
    const expenses = [numberOf(data, "gasto_1"), numberOf(data, "gasto_2"), numberOf(data, "gasto_3")];
    const incomeAverage = average(incomes);
    const expenseAverage = average(expenses);
    const incomeDeviation = standardDeviation(incomes);
    const incomeVariability = incomeAverage > 0 ? incomeDeviation / incomeAverage : 1;
    const incomeTrend = incomes[2] > 0 ? (incomes[0] - incomes[2]) / incomes[2] : 0;
    const goodIncome = numberOf(data, "ingreso_bueno");
    const lowIncome = numberOf(data, "ingreso_bajo");
    const incomeRange = goodIncome > 0 ? lowIncome / goodIncome : 0;
    const hoursWorked = numberOf(data, "horas_trabajadas");
    const incomePerHour = hoursWorked > 0 ? incomeAverage / hoursWorked : 0;
    const additionalHoursWeekly = rangeValue(data.horas_adicionales, { A: 0, B: 3, C: 8, D: 12 });
    const extraIncomePotential = incomePerHour * additionalHoursWeekly * 4.33 * 0.25;
    const sourceDependency = rangeValue(data.dependencia_fuente, { A: 0.3, B: 0.5, C: 0.7, D: 0.9 });

    const debtPayment = numberOf(data, "pago_deuda");
    const debtBalance = numberOf(data, "saldo_deuda");
    const freeCashFlow = incomeAverage - expenseAverage - debtPayment;
    const expensePressure = incomeAverage > 0 ? expenseAverage / incomeAverage : 1;
    const fixedExpensePct = rangeValue(data.gastos_fijos, { A: 0.2, B: 0.4, C: 0.6, D: 0.8 });
    const unplannedExpensePct = rangeValue(data.gastos_no_planificados, { A: 0.05, B: 0.175, C: 0.33, D: 0.5 });
    const reducibleAmount = rangeValue(data.monto_reducible, { A: 0, B: 50000, C: 200000, D: 500000, E: 800000 });
    const reducibleRatio = expenseAverage > 0 ? reducibleAmount / expenseAverage : 0;

    const savings = numberOf(data, "ahorro");
    const savingsRate = numberOf(data, "porcentaje_ahorro") / 100;
    const emergencyFund = numberOf(data, "fondo_emergencia");
    const emergencyCoverage = expenseAverage > 0 ? emergencyFund / expenseAverage : 0;
    const perceivedCoverage = rangeValue(data.meses_cobertura, { A: 0.5, B: 1.5, C: 4, D: 6 });
    const savingsConsistency = rangeValue(data.meses_ahorro_6, { A: 0, B: 1.5 / 6, C: 3.5 / 6, D: 5.5 / 6 });
    const capitalizationRate = incomeAverage > 0 ? freeCashFlow / incomeAverage : -1;

    const debtPaymentRatio = incomeAverage > 0 ? debtPayment / incomeAverage : debtPayment > 0 ? 1 : 0;
    const debtBalanceRatio = incomeAverage > 0 ? debtBalance / incomeAverage : debtBalance > 0 ? 12 : 0;
    const targetEmergencyMonths = 3 + dependentsCount(data.dependientes) * 0.5;
    const targetEmergencyFund = expenseAverage * targetEmergencyMonths;
    const emergencyGap = Math.max(0, targetEmergencyFund - emergencyFund);

    return {
      incomeAverage,
      expenseAverage,
      incomeDeviation,
      incomeVariability,
      incomeTrend,
      incomeRange,
      sourceDependency,
      hoursWorked,
      incomePerHour,
      additionalHoursWeekly,
      extraIncomePotential,
      expensePressure,
      fixedExpensePct,
      unplannedExpensePct,
      reducibleAmount,
      reducibleRatio,
      debtPayment,
      debtBalance,
      debtPaymentRatio,
      debtBalanceRatio,
      freeCashFlow,
      savings,
      savingsRate,
      capitalizationRate,
      emergencyFund,
      emergencyCoverage,
      perceivedCoverage,
      coveragePerceptionGap: perceivedCoverage - emergencyCoverage,
      savingsConsistency,
      targetEmergencyMonths,
      targetEmergencyFund,
      emergencyGap
    };
  }

  function buildBlockScores(data, metrics) {
    const incomeVariabilityScore = scoreLowerRatio(metrics.incomeVariability, 0.05, 0.12, 0.25, 0.4);
    const incomeTrendScore = metrics.incomeTrend >= 0.1 ? 100 : metrics.incomeTrend >= 0 ? 80 : metrics.incomeTrend >= -0.1 ? 50 : 15;
    const dependencyScore = scoreLowerRatio(metrics.sourceDependency, 0.4, 0.6, 0.8, 0.9);
    const productivityScore = metrics.hoursWorked > 0 ? clamp(50 + scoreRating(data.predictibilidad) * 0.25 + (metrics.incomePerHour > 0 ? 25 : 0)) : 20;
    const qualityScore = average([optionScore("perfil", data.perfil), optionScore("tipo_ingreso", data.tipo_ingreso)]);
    const potentialScore = metrics.additionalHoursWeekly === 0 ? 45 : metrics.extraIncomePotential > metrics.incomeAverage * 0.1 ? 100 : 70;
    const predictabilityScore = scoreRating(data.predictibilidad);

    const expensePressureScore = scoreLowerRatio(metrics.expensePressure, 0.5, 0.65, 0.8, 1);
    const fixedPressureScore = scoreLowerRatio(metrics.fixedExpensePct, 0.3, 0.5, 0.7, 0.8);
    const unplannedScore = scoreLowerRatio(metrics.unplannedExpensePct, 0.1, 0.25, 0.4, 0.5);
    const reducibleScore = metrics.reducibleRatio >= 0.15 ? 100 : metrics.reducibleRatio >= 0.08 ? 80 : metrics.reducibleAmount > 0 ? 60 : 30;
    const awarenessScore = optionScore("gasto_reducible", data.gasto_reducible);
    const flexibilityScore = scoreRating(data.ajuste_20);

    const savingsRateScore = scoreHigherRatio(metrics.savingsRate, 0.01, 0.05, 0.1, 0.2);
    const capitalizationScore = scoreHigherRatio(metrics.capitalizationRate, 0, 0.05, 0.1, 0.2);
    const coverageScore = scoreHigherRatio(metrics.emergencyCoverage, 0.5, 1, 3, 6);
    const consistencyScore = clamp(metrics.savingsConsistency * 100);
    const conservationScore = optionScore("conducta_ahorro", data.conducta_ahorro);
    const liquidityScore = optionScore("lugar_ahorro", data.lugar_ahorro);

    const noDebt = String(data.tiene_deuda || "").startsWith("A.");
    const debtStatusScore = optionScore("tiene_deuda", data.tiene_deuda);
    const debtPaymentScore = noDebt ? 100 : scoreLowerRatio(metrics.debtPaymentRatio, 0.1, 0.2, 0.36, 0.5);
    const debtBalanceScore = noDebt ? 100 : scoreLowerRatio(metrics.debtBalanceRatio, 1, 3, 6, 12);
    const debtQualityScore = noDebt ? 100 : average([optionScore("tipo_deuda", data.tipo_deuda), optionScore("uso_deuda", data.uso_deuda)]);
    const basicCreditScore = noDebt ? 100 : optionScore("credito_basicos", data.credito_basicos);
    const paymentHistoryScore = noDebt ? 100 : optionScore("historial_pago", data.historial_pago);
    const rateAwarenessScore = noDebt ? 100 : optionScore("conoce_tasa", data.conoce_tasa);

    const objectiveScore = optionScore("objetivo_definido", data.objetivo_definido);
    const priorityScore = optionScore("prioridad_dinero", data.prioridad_dinero);
    const unexpectedScore = optionScore("gasto_inesperado", data.gasto_inesperado);
    const adjustmentScore = scoreRating(data.ajuste_20);
    const analysisScore = scoreRating(data.decisiones_impulsivas, true);
    const impulsivityScore = scoreRating(data.impulsividad, true);
    const educationScore = optionScore("educacion", data.educacion);
    const limitations = Array.isArray(data.limitantes) ? data.limitantes : [];
    const limitationScore = limitations.length ? average(limitations.map(item => LIMITATION_SCORES[item] ?? 50)) : 50;

    const blocks = {
      ingresos: weightedAverage([
        { score: incomeVariabilityScore, weight: 0.2 },
        { score: incomeTrendScore, weight: 0.15 },
        { score: dependencyScore, weight: 0.15 },
        { score: productivityScore, weight: 0.15 },
        { score: qualityScore, weight: 0.15 },
        { score: predictabilityScore, weight: 0.1 },
        { score: potentialScore, weight: 0.1 }
      ]),
      gastos: weightedAverage([
        { score: expensePressureScore, weight: 0.25 },
        { score: fixedPressureScore, weight: 0.2 },
        { score: unplannedScore, weight: 0.15 },
        { score: reducibleScore, weight: 0.15 },
        { score: awarenessScore, weight: 0.15 },
        { score: flexibilityScore, weight: 0.1 }
      ]),
      ahorro: weightedAverage([
        { score: savingsRateScore, weight: 0.2 },
        { score: capitalizationScore, weight: 0.2 },
        { score: coverageScore, weight: 0.25 },
        { score: consistencyScore, weight: 0.15 },
        { score: conservationScore, weight: 0.1 },
        { score: liquidityScore, weight: 0.1 }
      ]),
      deuda: weightedAverage([
        { score: debtPaymentScore, weight: 0.25 },
        { score: debtBalanceScore, weight: 0.15 },
        { score: debtStatusScore, weight: 0.1 },
        { score: debtQualityScore, weight: 0.1 },
        { score: basicCreditScore, weight: 0.15 },
        { score: paymentHistoryScore, weight: 0.15 },
        { score: rateAwarenessScore, weight: 0.1 }
      ]),
      comportamiento: weightedAverage([
        { score: objectiveScore, weight: 0.12 },
        { score: priorityScore, weight: 0.12 },
        { score: unexpectedScore, weight: 0.15 },
        { score: adjustmentScore, weight: 0.12 },
        { score: analysisScore, weight: 0.15 },
        { score: impulsivityScore, weight: 0.14 },
        { score: educationScore, weight: 0.1 },
        { score: limitationScore, weight: 0.1 }
      ])
    };

    Object.keys(blocks).forEach(key => {
      blocks[key] = Math.round(clamp(blocks[key]));
    });

    return {
      blocks,
      components: {
        ingresos: { incomeVariabilityScore, incomeTrendScore, dependencyScore, productivityScore, qualityScore, predictabilityScore, potentialScore },
        gastos: { expensePressureScore, fixedPressureScore, unplannedScore, reducibleScore, awarenessScore, flexibilityScore },
        ahorro: { savingsRateScore, capitalizationScore, coverageScore, consistencyScore, conservationScore, liquidityScore },
        deuda: { debtPaymentScore, debtBalanceScore, debtStatusScore, debtQualityScore, basicCreditScore, paymentHistoryScore, rateAwarenessScore },
        comportamiento: { objectiveScore, priorityScore, unexpectedScore, adjustmentScore, analysisScore, impulsivityScore, educationScore, limitationScore }
      }
    };
  }

  function buildAlerts(data, metrics) {
    const alerts = [];
    const add = (id, block, severity, title, narrative, horizon) => alerts.push({ id, block, severity, title, narrative, horizon });

    if (metrics.freeCashFlow < 0) add("flujo_negativo", "gastos", 3, "Déficit mensual", "Los gastos y obligaciones superan el ingreso promedio. Si continúa, el faltante puede trasladarse a deuda o consumir el ahorro disponible.", 3);
    if (String(data.credito_basicos || "").startsWith("C") || String(data.credito_basicos || "").startsWith("D")) add("credito_basicos", "deuda", 3, "Crédito para gastos básicos", "El crédito está financiando operación cotidiana, una señal de fragilidad que puede acelerar el endeudamiento.", 3);
    if (String(data.tiene_deuda || "").startsWith("D")) add("deuda_creciente", "deuda", 3, "Deuda en crecimiento", "La deuda está aumentando y puede absorber progresivamente el flujo libre.", 3);
    if (metrics.emergencyCoverage < 1) add("cobertura_critica", "ahorro", 3, "Cobertura menor a un mes", "Un choque de ingreso o gasto inesperado podría romper la estabilidad financiera inmediata.", 3);
    else if (metrics.emergencyCoverage < 3) add("cobertura_baja", "ahorro", 2, "Fondo de emergencia insuficiente", "La protección existe, pero todavía no cubre un rango prudente de varios meses.", 6);
    if (metrics.expensePressure > 0.8) add("presion_gasto", "gastos", 2, "Alta presión de gasto", "Más del 80% del ingreso se consume antes de construir ahorro o patrimonio.", 6);
    if (metrics.fixedExpensePct > 0.7) add("rigidez_gasto", "gastos", 2, "Estructura de gasto rígida", "La alta proporción de compromisos fijos limita la capacidad de reacción.", 6);
    if (metrics.unplannedExpensePct > 0.4) add("gasto_no_planificado", "comportamiento", 2, "Gasto no planificado elevado", "La falta de planeación está reduciendo la eficiencia del ingreso.", 6);
    if (metrics.sourceDependency > 0.8) add("dependencia_ingreso", "ingresos", 2, "Alta dependencia de una fuente", "Una interrupción de la fuente principal tendría un impacto directo y elevado.", 6);
    if (String(data.historial_pago || "").startsWith("C") || String(data.historial_pago || "").startsWith("D")) add("atrasos", "deuda", 3, "Riesgo por atrasos", "Los retrasos pueden elevar costos, deteriorar el historial y prolongar la salida de deuda.", 3);
    if (Number(data.impulsividad) >= 4 || Number(data.decisiones_impulsivas) >= 4) add("impulsividad", "comportamiento", 2, "Impulsividad financiera", "Las decisiones rápidas pueden neutralizar mejoras de ingreso y ahorro.", 6);
    if (String(data.evolucion_ingresos || "").startsWith("C") && metrics.incomeTrend < 0) add("ingreso_descendente", "ingresos", 2, "Ingreso en descenso", "La tendencia reciente reduce el margen para sostener obligaciones actuales.", 6);

    return alerts.sort((a, b) => b.severity - a.severity);
  }

  function buildStrengths(data, metrics, blocks) {
    const strengths = [];
    if (blocks.ingresos >= 76) strengths.push("Tus ingresos muestran una base relativamente estable y aprovechable.");
    if (blocks.gastos >= 76) strengths.push("Tu estructura de gastos conserva un margen razonable de control.");
    if (blocks.ahorro >= 76) strengths.push("Tu ahorro y resiliencia ofrecen una base de protección financiera.");
    if (blocks.deuda >= 76) strengths.push("La deuda no representa actualmente la principal presión financiera.");
    if (blocks.comportamiento >= 76) strengths.push("Tus hábitos y decisiones favorecen la continuidad del progreso financiero.");
    if (metrics.reducibleAmount > 0) strengths.push(`Ya identificaste aproximadamente ${formatMoney(metrics.reducibleAmount)} mensuales que podrían reasignarse.`);
    if (String(data.objetivo_definido || "").startsWith("A")) strengths.push("Tienes un objetivo financiero claro, lo cual facilita convertir acciones en resultados medibles.");
    return strengths.slice(0, 5);
  }

  function buildFindings(data, metrics, blocks) {
    const findings = [];
    findings.push(`Tu ingreso promedio estimado es ${formatMoney(metrics.incomeAverage)} y tu gasto promedio es ${formatMoney(metrics.expenseAverage)}.`);

    if (metrics.freeCashFlow >= 0) {
      findings.push(`Después de gastos y cuotas de deuda quedan aproximadamente ${formatMoney(metrics.freeCashFlow)} mensuales antes de otros usos del dinero.`);
    } else {
      findings.push(`Existe un déficit estimado de ${formatMoney(Math.abs(metrics.freeCashFlow))} al mes, lo que explica una posible presión sobre ahorro o crédito.`);
    }

    if (data.gasto_fuga) findings.push(`La fuga de dinero que más reconoces está asociada a: ${stripCode(data.gasto_fuga)}.`);
    if (data.gasto_frecuente) findings.push(`El gasto pequeño más repetido está relacionado con: ${stripCode(data.gasto_frecuente)}.`);
    if (data.limitantes?.length) findings.push(`Las causas que identificas como barreras son: ${data.limitantes.join(", ")}.`);
    if (Math.abs(metrics.coveragePerceptionGap) >= 1) findings.push("Existe una diferencia relevante entre la cobertura de emergencia percibida y la calculada con tus cifras.");

    const weakest = Object.entries(blocks).sort((a, b) => a[1] - b[1])[0];
    findings.push(`El bloque que requiere mayor atención es ${blockLabel(weakest[0])}, con ${weakest[1]} puntos.`);
    return findings;
  }

  function buildProjections(data, metrics) {
    const horizons = [3, 6, 12, 24];
    const criticalDrop = clamp(Math.max(0.2, metrics.incomeVariability), 0.2, 0.35);
    const currentMonthly = metrics.freeCashFlow;
    const optimizedMonthly = currentMonthly + metrics.reducibleAmount + metrics.extraIncomePotential;
    const criticalMonthly = metrics.incomeAverage * (1 - criticalDrop) - metrics.expenseAverage - metrics.debtPayment;
    const debtAcceleration = metrics.debtBalance > 0 ? Math.max(0, optimizedMonthly - currentMonthly) * 0.5 : 0;

    return horizons.map(months => ({
      months,
      current: {
        monthlyFlow: roundMoney(currentMonthly),
        accumulatedBalance: roundMoney(Math.max(0, metrics.savings + currentMonthly * months)),
        estimatedDebt: roundMoney(Math.max(0, metrics.debtBalance - metrics.debtPayment * months))
      },
      critical: {
        incomeDropPct: Math.round(criticalDrop * 100),
        monthlyFlow: roundMoney(criticalMonthly),
        accumulatedBalance: roundMoney(Math.max(0, metrics.savings + criticalMonthly * months)),
        estimatedDebt: roundMoney(Math.max(0, metrics.debtBalance - Math.max(0, metrics.debtPayment + Math.min(0, criticalMonthly)) * months))
      },
      optimized: {
        monthlyFlow: roundMoney(optimizedMonthly),
        accumulatedBalance: roundMoney(Math.max(0, metrics.savings + optimizedMonthly * months)),
        estimatedDebt: roundMoney(Math.max(0, metrics.debtBalance - (metrics.debtPayment + debtAcceleration) * months)),
        improvementVsCurrent: roundMoney((optimizedMonthly - currentMonthly) * months)
      }
    }));
  }

  function determineScenario(blocks, alerts, metrics) {
    const highAlerts = alerts.filter(alert => alert.severity === 3);
    if (metrics.freeCashFlow < 0 && highAlerts.length >= 2) return { id: "reestructuracion_urgente", title: "Reestructuración urgente", summary: "El flujo negativo coincide con alertas críticas. La prioridad es detener el deterioro antes de buscar crecimiento." };
    if (metrics.freeCashFlow >= 0 && blocks.gastos < 61 && blocks.comportamiento < 61) return { id: "riesgo_desorden", title: "Capacidad con desorden", summary: "Existe capacidad económica, pero los hábitos y la estructura de gasto están limitando el resultado." };
    if (blocks.deuda < 61) return { id: "riesgo_deuda", title: "Presión de deuda", summary: "Las obligaciones están reduciendo la libertad financiera y requieren una ruta de salida priorizada." };
    if (blocks.ahorro < 61 && metrics.emergencyCoverage < 3) return { id: "blindaje_prioritario", title: "Blindaje prioritario", summary: "La principal vulnerabilidad está en la falta de protección frente a imprevistos o pérdida de ingreso." };
    if (blocks.ingresos < 61) return { id: "crecimiento_bloqueado", title: "Crecimiento bloqueado", summary: "La estabilidad y diversificación de ingresos son la principal restricción del progreso." };
    if (Math.min(...Object.values(blocks)) >= 76) return { id: "optimizacion_patrimonial", title: "Optimización patrimonial", summary: "La base financiera permite avanzar hacia protección, inversión y crecimiento patrimonial." };
    if (metrics.reducibleAmount > 0 && Math.min(...Object.values(blocks)) >= 61) return { id: "recuperacion_rapida", title: "Optimización de corto plazo", summary: "Hay una base estable y oportunidades concretas para liberar flujo en los próximos meses." };
    return { id: "estabilidad_fragil", title: "Estabilidad frágil", summary: "La situación es funcional, pero uno o más bloques podrían deteriorarse ante un choque financiero." };
  }

  function recommendService(data, blocks, alerts) {
    const priorities = Object.fromEntries(Object.keys(BLOCK_WEIGHTS).map(block => [block, (100 - blocks[block]) * BLOCK_WEIGHTS[block]]));

    alerts.forEach(alert => {
      priorities[alert.block] = (priorities[alert.block] || 0) + alert.severity * 6;
    });

    const objective = String(data.objetivo || "").toLowerCase();
    if (objective.match(/deuda|cr[eé]dito|obligaci[oó]n/)) priorities.deuda += 12;
    if (objective.match(/ahorr|emergencia|vivienda|protecci[oó]n/)) priorities.ahorro += 12;
    if (objective.match(/ingreso|empresa|emprend|negocio|ganar/)) priorities.ingresos += 12;
    if (objective.match(/organizar|gasto|presupuesto|control/)) priorities.gastos += 12;
    if (objective.match(/disciplina|h[aá]bito|educaci[oó]n|aprender/)) priorities.comportamiento += 12;

    const ranked = Object.entries(priorities).sort((a, b) => b[1] - a[1]);
    const primary = ranked[0][0];
    const secondary = ranked[1][1] >= ranked[0][1] * 0.75 ? ranked[1][0] : null;

    return {
      primaryBlock: primary,
      primaryService: SERVICES[primary],
      secondaryBlock: secondary,
      secondaryService: secondary ? SERVICES[secondary] : null,
      priorities: Object.fromEntries(ranked.map(([key, value]) => [key, Math.round(value * 10) / 10])),
      rationale: `La recomendación combina el bloque más débil, las alertas activas y el objetivo declarado por el cliente.`
    };
  }

  function buildDatabaseRecord(data, evaluation) {
    return {
      created_at: new Date().toISOString(),
      name: data.nombre || "",
      email: data.email || "",
      age: numberOf(data, "edad"),
      profile: data.perfil || "",
      financial_goal: data.objetivo || "",
      total_score: evaluation.totalScore,
      financial_level: evaluation.classification,
      income_score: evaluation.blockScores.ingresos,
      expense_score: evaluation.blockScores.gastos,
      savings_score: evaluation.blockScores.ahorro,
      debt_score: evaluation.blockScores.deuda,
      behavior_score: evaluation.blockScores.comportamiento,
      average_income: roundMoney(evaluation.metrics.incomeAverage),
      average_expenses: roundMoney(evaluation.metrics.expenseAverage),
      free_cash_flow: roundMoney(evaluation.metrics.freeCashFlow),
      debt_payment_ratio: roundDecimal(evaluation.metrics.debtPaymentRatio),
      debt_balance_ratio: roundDecimal(evaluation.metrics.debtBalanceRatio),
      savings_rate: roundDecimal(evaluation.metrics.savingsRate),
      emergency_coverage_months: roundDecimal(evaluation.metrics.emergencyCoverage),
      income_variability: roundDecimal(evaluation.metrics.incomeVariability),
      income_per_hour: roundMoney(evaluation.metrics.incomePerHour),
      reducible_monthly_amount: roundMoney(evaluation.metrics.reducibleAmount),
      scenario_id: evaluation.scenario.id,
      scenario_title: evaluation.scenario.title,
      critical_alerts: evaluation.alerts.map(alert => alert.id).join("|"),
      recommended_service: evaluation.service.primaryService,
      secondary_service: evaluation.service.secondaryService || "",
      projections_json: JSON.stringify(evaluation.projections),
      answers_json: JSON.stringify(data)
    };
  }

  function evaluateAssessment(data) {
    const metrics = buildMetrics(data);
    const scoring = buildBlockScores(data, metrics);
    const totalScore = Math.round(weightedAverage(
      Object.entries(BLOCK_WEIGHTS).map(([block, weight]) => ({ score: scoring.blocks[block], weight }))
    ));
    const alerts = buildAlerts(data, metrics);
    const scenario = determineScenario(scoring.blocks, alerts, metrics);
    const service = recommendService(data, scoring.blocks, alerts);
    const evaluation = {
      totalScore,
      classification: classification(totalScore),
      blockScores: scoring.blocks,
      componentScores: scoring.components,
      metrics,
      alerts,
      strengths: buildStrengths(data, metrics, scoring.blocks),
      findings: buildFindings(data, metrics, scoring.blocks),
      projections: buildProjections(data, metrics),
      scenario,
      service
    };
    evaluation.databaseRecord = buildDatabaseRecord(data, evaluation);
    return evaluation;
  }

  function stripCode(value) {
    return String(value || "").replace(/^[A-Z]\.\s*/i, "");
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

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  }

  function roundMoney(value) {
    return Math.round(Number(value) || 0);
  }

  function roundDecimal(value) {
    return Math.round((Number(value) || 0) * 10000) / 10000;
  }

  const api = {
    BLOCK_WEIGHTS,
    QUESTION_MATRIX,
    evaluateAssessment,
    classification
  };

  root.CrowdCapitalScoring = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
