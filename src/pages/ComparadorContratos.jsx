import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GitCompare, CheckCircle } from "lucide-react";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";
import { validateContent } from "../services/validateContent";

const systemPrompt = "Você é um especialista em análise documental. Compare as duas versões do contrato. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ComparadorContratos() {
  const navigate = useNavigate();
  const [versaoAntiga, setVersaoAntiga] = useState("");
  const [versaoNova, setVersaoNova] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState(null);
  const [oldUploaded, setOldUploaded] = useState(false);
  const [newUploaded, setNewUploaded] = useState(false);

  const handleSubmit = async () => {
    if (!versaoAntiga.trim() || !versaoNova.trim()) return;
    for (const t of [versaoAntiga, versaoNova]) {
      const v = validateContent(t, "contrato");
      if (v) { setValidation(v); return; }
    }
    setValidation(null);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const userContent = `VERSÃO ANTERIOR:\n${versaoAntiga}\n\nVERSÃO NOVA:\n${versaoNova}`;
      const res = await callClaude(systemPrompt, userContent);
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
        <GitCompare className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Comparador de Contratos</h1>
      </div>
      <p className="text-light/60 mb-8">Compare duas versões de um contrato e descubra todas as mudanças.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-light/80">Versão Anterior</label>
          <FileUpload onFileContent={(content, fileName) => {
            if (content === "" || (content === null && fileName)) return;
            setVersaoAntiga(content);
            setOldUploaded(true);
          }} />
          {oldUploaded && (
            <div className="flex items-center gap-2 text-green-600 text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Upload realizado</span>
              <button onClick={() => { setVersaoAntiga(""); setOldUploaded(false); }} className="text-red-500 hover:text-red-700 underline ml-auto">Remover</button>
            </div>
          )}
          <TextInput value={versaoAntiga} onChange={(v) => { setVersaoAntiga(v); if (!v) setOldUploaded(false); }} placeholder="Ou cole o texto aqui..." />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-light/80">Versão Nova</label>
          <FileUpload onFileContent={(content, fileName) => {
            if (content === "" || (content === null && fileName)) return;
            setVersaoNova(content);
            setNewUploaded(true);
          }} />
          {newUploaded && (
            <div className="flex items-center gap-2 text-green-600 text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Upload realizado</span>
              <button onClick={() => { setVersaoNova(""); setNewUploaded(false); }} className="text-red-500 hover:text-red-700 underline ml-auto">Remover</button>
            </div>
          )}
          <TextInput value={versaoNova} onChange={(v) => { setVersaoNova(v); if (!v) setNewUploaded(false); }} placeholder="Ou cole o texto aqui..." />
        </div>
      </div>

      {validation && (
        <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <span dangerouslySetInnerHTML={{ __html: validation.message }} />
          {validation.suggestionPath && (
            <button onClick={() => navigate(validation.suggestionPath)} className="underline font-medium ml-1">Ir para ferramenta</button>
          )}
        </p>
      )}
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button onClick={handleSubmit} disabled={!versaoAntiga.trim() || !versaoNova.trim() || loading} className="btn-accent w-full mb-8">
        {loading ? "Comparando..." : "Comparar Contratos"}
      </button>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setVersaoAntiga(""); setVersaoNova(""); setOldUploaded(false); setNewUploaded(false); setError(null); setValidation(null); }} />}
    </div>
  );
}
