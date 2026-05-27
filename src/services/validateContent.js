const rules = {
  curriculo: {
    matches: [
      "currículo", "curriculo", "experiência", "experiencia", "formação", "formacao",
      "graduação", "graduacao", "cargo", "habilidade", "competência", "competencia",
      "idioma", "resumo profissional", "formação acadêmica", "formacao academica",
    ],
    mismatches: [
      "cláusula", "clausula", "foro", "rescisão", "rescisao", "vigência", "vigencia",
      "contratante", "contratado", "faturamento", "receita", "lucro",
      "ata de reunião", "pauta", "compliance", "diretriz", "política interna",
    ],
    suggestion: "Analisador de Currículo",
    suggestionPath: "/analisador-curriculo",
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
      "ata de reunião", "pauta", "participante",
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
    if (s > bestScore) {
      bestScore = s;
      bestType = type;
    }
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

  const matchScore = score(lower, rule.matches);
  const mismatchScore = score(lower, rule.mismatches);

  if (mismatchScore > matchScore && mismatchScore >= 1) {
    const detectedType = findBestMatchingType(lower, toolId);
    const detectedRule = rules[detectedType];
    const target = detectedRule || rule;
    return {
      type: "warning",
      message: `O texto informado parece não ser compatível com esta ferramenta. Talvez você queira usar o <strong>${target.suggestion}</strong>?`,
      suggestionPath: target.suggestionPath,
    };
  }

  return null;
}
