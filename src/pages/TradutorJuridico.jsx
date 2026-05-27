import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages } from "lucide-react";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function TradutorJuridico() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = "Você é um especialista em linguagem jurídica. Detecte automaticamente se o texto está em juridiquês ou linguagem comum e faça a conversão para o oposto. Mantenha o significado original. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

    try {
      const res = await callClaude(systemPrompt, text);
      setResult(cleanResult(res));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container pt-24">
      <button onClick={() => navigate("/")} className="btn-ghost flex items-center gap-2 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para Home
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Languages className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Tradutor Jurídico</h1>
      </div>
      <p className="text-light/60 mb-8">Cole um texto jurídico para simplificar ou um texto simples para converter em linguagem jurídica formal. A IA detecta automaticamente a direção.</p>

      <div className="space-y-4 mb-8">
        <TextInput value={text} onChange={setText} placeholder="Cole o texto aqui..." />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Traduzindo..." : "Traduzir"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setText(""); setError(null); }} />}
    </div>
  );
}
