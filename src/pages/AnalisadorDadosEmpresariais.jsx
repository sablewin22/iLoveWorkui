import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, CheckCircle, X } from "lucide-react";
import TabToggle from "../components/TabToggle";
import FileUpload from "../components/FileUpload";
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

export default function AnalisadorDadosEmpresariais() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upload");
  const [text, setText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileContent = (content, fileName) => {
    if (content === null && fileName) {
      setError("Não foi possível extrair o texto do arquivo. Tente usar a aba 'Colar texto'.");
      return;
    }
    setText(content);
    setUploadedFile({ name: fileName, content });
    setError(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setText("");
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = "Você é um especialista em análise empresarial e inteligência de negócios. Analise os dados empresariais fornecidos e produza um relatório estratégico. Organize os dados em categorias, identifique padrões, inconsistências e gere insights. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

    try {
      const res = await callClaude(systemPrompt, text);
      setResult(cleanResult(res));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setText("");
    setUploadedFile(null);
    setError(null);
    setTab("upload");
  };

  return (
    <div className="tool-container pt-24">
      <button onClick={() => navigate("/")} className="btn-ghost flex items-center gap-2 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para Home
      </button>

      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Analisador de Dados Empresariais</h1>
      </div>
      <p className="text-light/60 mb-8">Faça upload de um arquivo ou cole dados, relatórios ou informações empresariais para receber uma análise estratégica com insights, riscos e oportunidades.</p>

      <div className="space-y-4 mb-8">
        <TabToggle activeTab={tab} onTabChange={setTab} />

        {tab === "upload" ? (
          uploadedFile ? (
            <div className="border-2 border-green-400/30 bg-green-50 rounded-xl p-8 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-green-700 font-medium text-base">Upload realizado com sucesso!</p>
              <p className="text-green-600 text-sm mt-1">{uploadedFile.name}</p>
              <button onClick={handleRemoveFile} className="mt-3 text-sm text-green-600 hover:text-green-800 underline inline-flex items-center gap-1">
                <X className="w-3 h-3" /> Remover arquivo
              </button>
            </div>
          ) : (
            <FileUpload onFileContent={handleFileContent} />
          )
        ) : (
          <TextInput value={text} onChange={setText} placeholder="Cole os dados empresariais aqui (financeiros, operacionais, indicadores...)" />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Analisando..." : "Analisar Dados"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={handleNewAnalysis} />}
    </div>
  );
}
