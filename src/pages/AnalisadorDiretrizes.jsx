import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, CheckCircle, X } from "lucide-react";
import TabToggle from "../components/TabToggle";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";

const systemPrompt = "Você é um especialista em compliance. Analise o documento (política interna, regulamento ou manual). Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function AnalisadorDiretrizes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upload");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

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
        <ClipboardCheck className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Analisador de Diretrizes</h1>
      </div>
      <p className="text-light/60 mb-8">Analise políticas internas, regulamentos e manuais com recomendações de compliance.</p>

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
          <TextInput value={text} onChange={setText} placeholder="Cole o texto da política, regulamento ou manual aqui..." />
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Analisando..." : "Analisar Diretrizes"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setText(""); setUploadedFile(null); setError(null); setTab("upload"); }} />}
    </div>
  );
}
