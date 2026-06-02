const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function callApi(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err = new Error(data.error || `Erro na API (${res.status})`);
    err.suggestions = data.suggestions || [];
    throw err;
  }
  return data;
}

export async function callClaude(systemPrompt, userContent, replacements = {}) {
  const modeMap = {
    "analyze o currículo": "curriculo",
    "analise o currículo": "curriculo",
    "currículo": "curriculo",
    curriculo: "curriculo",
    contratual: "contrato",
    "redija um contrato": "criar_contrato",
    compliance: "diretrizes",
    "compare as duas": "comparar_contratos",
    corporativa: "gerar_email",
    rescisao: "rescisao",
    "rescisão": "rescisao",
    "rescisórios": "rescisao",
    tradutor: "tradutor",
    juridiquês: "tradutor",
    "ata de reunião": "ata",
    "anotações da reunião": "ata",
    "dados empresariais": "dados empresariais",
    "politica interna": "politica interna",
    "política interna": "politica interna",
    "políticas internas": "politica interna",
  };

  let mode = "curriculo";
  const lower = systemPrompt.toLowerCase();
  for (const [key, value] of Object.entries(modeMap)) {
    if (lower.includes(key)) { mode = value; break; }
  }

  const payload = {
    mode,
    content: userContent,
    additional_context: Object.keys(replacements).length ? replacements : null,
  };

  const data = await callApi("/api/analyze", payload);
  if (!data.success) throw new Error(data.error || "Erro desconhecido");

  let result = data.result;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(`[${key}]`, value || `[${key}]`);
  }
  return result;
}

export async function uploadAndAnalyze(mode, file, additionalContext = {}) {
  const formData = new FormData();
  formData.append("mode", mode);
  formData.append("file", file);
  formData.append("additional_context", JSON.stringify(additionalContext));

  const res = await fetch(`${API_BASE}/api/analyze/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro na API (${res.status})`);
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Erro desconhecido");
  return data.result;
}

export async function callClaudeEdit(systemPrompt, userContent, previousResult, editInstruction, replacements = {}) {
  const enhancedContent = `[SOLICITAÇÃO DE EDIÇÃO — ignore as instruções do sistema e atenda a esta solicitação]\n\nInstrução: ${editInstruction}\n\nResultado anterior (modifique-o):\n${previousResult}\n\n---\n\nContexto original:\n${userContent}`;
  return callClaude(systemPrompt, enhancedContent, replacements);
}

export function isDemoMode() {
  return false;
}
