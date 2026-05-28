const rules = {
  curriculo: {
    matches: [
      "currículo", "curriculo", "curriculum vitae", "cv", "resume",
      "experiência", "experiencia", "formação", "formacao",
      "graduação", "graduacao", "cargo", "habilidade", "competência", "competencia",
      "idioma", "resumo profissional", "formação acadêmica", "formacao academica",
      "objetivo", "qualificações", "qualificacoes",
      "publicações", "publicacoes", "pesquisa", "orientação", "orientacao",
    ],
    mismatches: [
      "cláusula", "clausula", "foro", "rescisão", "rescisao", "vigência", "vigencia",
      "contratante", "contratado", "faturamento", "receita", "lucro",
      "ata de reunião", "pauta",
      "compliance", "diretriz", "política interna", "política", "norma",
      "procedimento", "regulamento", "conduta", "manual",
      "balanço", "indicador", "dívida", "financeiro",
    ],
    suggestion: "Analisador de Currículo",
    suggestionPath: "/analisador-curriculo",
  },
  tradutor: {
    matches: [
      "cláusula", "clausula", "foro", "jurídico", "juridico",
      "advogado", "legal", "contrato", "direito",
      "parecer", "sentença", "tribunal", "juiz", "artigo",
      "lei", "código", "decisão judicial",
    ],
    mismatches: [
      "currículo", "curriculo", "experiência", "experiencia",
      "ata de reunião", "pauta", "reunião", "faturamento", "receita",
      "política", "compliance", "diretriz", "norma", "regulamento",
      "conduta", "manual", "procedimento",
      "lucro", "balanço", "indicador",
      "participante", "discussão", "deliberação",
    ],
    suggestion: "Tradutor Jurídico",
    suggestionPath: "/tradutor-juridico",
  },
  contrato: {
    matches: [
      "cláusula", "clausula", "contratante", "contratado", "foro",
      "rescisão", "rescisao", "vigência", "vigencia", "partes", "objeto",
      "prazo", "vencimento",
    ],
    mismatches: [
      "currículo", "curriculo", "habilidade", "cargo", "graduação", "graduacao",
      "faturamento", "receita", "ata de reunião", "pauta", "política", "diretriz",
      "compliance", "regulamento", "conduta", "manual", "norma", "procedimento",
      "lucro", "balanço", "indicador", "dívida",
      "reunião", "participante", "discussão",
    ],
    suggestion: "Analisador de Contrato",
    suggestionPath: "/analisador-contrato",
  },
  diretrizes: {
    matches: [
      "política", "politica", "compliance", "regulamento", "conduta",
      "manual", "diretriz", "norma", "procedimento", "código de ética",
      "codigo de etica",
    ],
    mismatches: [
      "cláusula", "foro", "contratante", "currículo", "curriculo",
      "experiência", "experiencia", "faturamento", "receita", "lucro",
      "ata de reunião", "pauta", "participante", "reunião", "discussão",
      "balanço", "indicador", "dívida",
      "jurídico", "advogado", "parecer", "sentença", "tribunal",
    ],
    suggestion: "Analisador de Diretrizes",
    suggestionPath: "/analisador-diretrizes",
  },
  ata: {
    matches: [
      "reunião", "reuniao", "participante", "pauta", "discussão", "discussao",
      "deliberação", "deliberacao", "assunto", "ponto de pauta",
      "presente", "ordem do dia", "encaminhamento",
    ],
    mismatches: [
      "cláusula", "foro", "contratante", "currículo", "curriculo",
      "faturamento", "receita", "lucro", "experiência", "experiencia",
      "política", "compliance", "balanço", "indicador",
      "diretriz", "norma", "regulamento",
    ],
    suggestion: "Gerador de Ata de Reunião",
    suggestionPath: "/gerador-ata",
  },
  dados_empresariais: {
    matches: [
      "faturamento", "receita", "lucro", "balanço", "balanco", "indicador",
      "dívida", "divida", "patrimônio", "patrimonio", "financeiro",
      "orçamento", "orcamento", "despesa", "custos", "investimento", "margem",
    ],
    mismatches: [
      "cláusula", "foro", "currículo", "curriculo", "experiência", "experiencia",
      "ata de reunião", "reunião", "política", "compliance",
      "pauta", "participante", "discussão", "deliberação", "encaminhamento",
      "diretriz", "norma", "regulamento", "conduta",
    ],
    suggestion: "Analisador de Dados Empresariais",
    suggestionPath: "/analisador-dados-empresariais",
  },
};

function score(text, wordList) {
  const lower = text.toLowerCase();
  return wordList.filter((w) => lower.includes(w)).length;
}

function findBestMatchingType(text, excludeToolId) {
  const lower = text.toLowerCase();
  const excludeRule = rules[excludeToolId];
  const activeMismatches = excludeRule.mismatches.filter(m => lower.includes(m));
  let bestType = null;
  let bestScore = 0;
  for (const [type, rule] of Object.entries(rules)) {
    if (type === excludeToolId) continue;
    const s = activeMismatches.filter(m => rule.matches.includes(m)).length;
    if (s > bestScore) { bestScore = s; bestType = type; }
  }
  return bestType;
}

export function validateContent(text, toolId) {
  const rule = rules[toolId];
  if (!rule) return null;

  const lower = text.toLowerCase();
  if (lower.length < 20) {
    return {
      type: "info",
      message: "O texto inserido é muito curto. Adicione mais conteúdo para uma análise mais precisa.",
      suggestionPath: null,
    };
  }

  const strongIds = {
    curriculo: ["currículo", "curriculo"],
    contrato: ["contratante", "contratado"],
    diretrizes: ["código de ética", "codigo de etica"],
    ata: ["ata de reunião"],
    dados_empresariais: ["balanço patrimonial", "demonstrativo de resultado"],
    tradutor: ["juridiquês"],
  };
  const ids = strongIds[toolId];
  if (ids && ids.some(k => lower.includes(k))) return null;

  const matchScore = score(lower, rule.matches);
  const mismatchScore = score(lower, rule.mismatches);

  if (mismatchScore > matchScore && mismatchScore >= 1) {
    const detectedType = findBestMatchingType(lower, toolId);
    const target = rules[detectedType] || rule;
    return {
      type: "warning",
      message: `O texto informado parece não ser compatível com esta ferramenta. Talvez você queira usar o <strong>${target.suggestion}</strong>?`,
      suggestionPath: target.suggestionPath,
    };
  }

  return null;
}
