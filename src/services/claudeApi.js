const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function callApi(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro na API (${res.status})`);
  }
  return res.json();
}

export async function callClaude(systemPrompt, userContent, replacements = {}) {
  const modeMap = {
    curriculo: "curriculo",
    contratual: "contrato",
    "redija um contrato": "criar_contrato",
    compliance: "diretrizes",
    "compare as duas": "comparar_contratos",
    corporativa: "gerar_email",
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

export function isDemoMode() {
  return false;
}
