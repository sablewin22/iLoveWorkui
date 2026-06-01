import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";
import RequiredField from "../components/RequiredField";
import ErrorAlert from "../components/ErrorAlert";

const tiposEmail = [
  "Solicitação",
  "Agradecimento",
  "Reclamação",
  "Proposta Comercial",
  "Follow-up",
  "Demissão",
  "Negociação",
  "Outro",
];

const tons = ["Formal", "Semi-formal", "Assertivo", "Empático"];

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function GeradorEmail() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ tipo: "", contexto: "", tom: "", destinatario: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    if (!form.tipo || !form.contexto || !form.tom || !form.destinatario) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = `Você é especialista em comunicação corporativa. Redija um e-mail profissional completo baseado nas informações abaixo. Escreva o e-mail por inteiro (Assunto, Saudação, Corpo, Fechamento, Assinatura) em um único bloco pronto para usar. Não divida em seções ou tópicos. Tom: ${form.tom}. Destinatário: ${form.destinatario}. Contexto: ${form.contexto}. NUNCA use "---" ou "////" ou "===" ou "***". Responda em português brasileiro.`;

    try {
      const res = await callClaude(systemPrompt, `Tipo: ${form.tipo}\n\nContexto: ${form.contexto}`, {
        "Nome do Destinatário": form.destinatario,
      });
      setResult(cleanResult(res));
    } catch (e) {
      setError(e.message);
      setSuggestions(e.suggestions || []);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.tipo && form.contexto && form.tom && form.destinatario;

  return (
    <div className="tool-container pt-24">
      <button onClick={() => navigate("/")} className="btn-ghost flex items-center gap-2 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para Home
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Mail className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Gerador de E-mail Profissional</h1>
      </div>
      <p className="text-light/60 mb-8">Crie e-mails corporativos eficazes para qualquer situação profissional.</p>

      <div className="card-surface mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredField label="Tipo de E-mail" tip="Escolha a categoria que melhor descreve seu e-mail" />
            <select value={form.tipo} onChange={update("tipo")} className="input-field">
              <option value="">Selecione...</option>
              {tiposEmail.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <RequiredField label="Tom" tip="Selecione o tom adequado para a situação e destinatário" />
            <select value={form.tom} onChange={update("tom")} className="input-field">
              <option value="">Selecione...</option>
              {tons.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <RequiredField label="Destinatário" tip="Para quem o e-mail será enviado (ex: meu chefe, cliente)" />
            <input value={form.destinatario} onChange={update("destinatario")} placeholder="Ex: meu chefe, cliente potencial" className="input-field" />
          </div>
        </div>

        <div className="mt-4">
          <RequiredField label="Contexto / Situação" tip="Explique a situação em detalhes para gerar um e-mail personalizado" />
          <textarea
            value={form.contexto}
            onChange={update("contexto")}
            placeholder="Descreva a situação em detalhes..."
            rows={4}
            className="input-field resize-y"
          />
        </div>

        <ErrorAlert message={error} suggestions={suggestions} />

        <button onClick={handleSubmit} disabled={!isFormValid || loading} className="btn-accent w-full mt-4">
          {loading ? "Gerando..." : "Gerar E-mail"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setForm({ tipo: "", contexto: "", tom: "", destinatario: "" }); setError(null); }} />}
    </div>
  );
}
