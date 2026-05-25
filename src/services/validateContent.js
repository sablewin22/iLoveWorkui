const rules = {
  curriculo: {
    matches: ["currículo", "curriculo", "experiência", "experiencia", "formação", "formacao", "graduação", "graduacao", "cargo", "habilidade"],
    mismatches: ["cláusula", "clausula", "foro", "rescisão", "rescisao", "vigência", "vigencia", "contratante", "contratado"],
    suggestion: "Analisador de Contrato",
    suggestionPath: "/analisador-contrato",
  },
  contrato: {
    matches: ["cláusula", "clausula", "contratante", "contratado", "foro", "rescisão", "rescisao", "vigência", "vigencia"],
    mismatches: ["currículo", "curriculo", "habilidade", "cargo", "graduação", "graduacao"],
    suggestion: "Analisador de Currículo",
    suggestionPath: "/analisador-curriculo",
  },
};

function score(text, wordList) {
  const lower = text.toLowerCase();
  return wordList.filter((w) => lower.includes(w)).length;
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

  const matchScore = score(text, rule.matches);
  const mismatchScore = score(text, rule.mismatches);

  if (mismatchScore > matchScore && mismatchScore >= 2) {
    return {
      type: "warning",
      message: `O texto informado parece não ser compatível com esta ferramenta. Talvez você queira usar o <strong>${rule.suggestion}</strong>?`,
      suggestionPath: rule.suggestionPath,
    };
  }

  return null;
}
