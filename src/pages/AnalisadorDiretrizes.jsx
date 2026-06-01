import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import TabToggle from "../components/TabToggle";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { callClaude } from "../services/claudeApi";
import { validateContent } from "../services/validateContent";

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
  const [suggestions, setSuggestions] = useState([]);
  const [validation, setValidation] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileContent = (content, fileName) => {
    if (content === "") {
      setUploadedFile(null);
      setText("");
      setResult(null);
      setLoading(false);
      setError(null);
      setValidation(null);
      return;
    }
    if (content === null && fileName) {
      setError("Não foi possível extrair o texto do arquivo. Tente usar a aba 'Colar texto'.");
      return;
    }
    setError(null);
    const v = validateContent(content, "diretrizes");
    if (v) { setValidation(v); return; }
    setValidation(null);
    setText(content);
    setUploadedFile({ name: fileName, content });
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const v = validateContent(text, "diretrizes");
    if (v) { setValidation(v); return; }
    setValidation(null);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await callClaude(systemPrompt, text);
      setResult(cleanResult(res));
    } catch (e) {
      setError(e.message);
      setSuggestions(e.suggestions || []);
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
          <FileUpload onFileContent={handleFileContent} />
        ) : (
          <TextInput value={text} onChange={setText} placeholder="Cole o texto da política, regulamento ou manual aqui..." />
        )}

        {validation && (
          <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span dangerouslySetInnerHTML={{ __html: validation.message }} />
            {validation.suggestionPath && (
              <button onClick={() => navigate(validation.suggestionPath)} className="underline font-medium ml-1">Ir para ferramenta</button>
            )}
          </p>
        )}
        <ErrorAlert message={error} suggestions={suggestions} />

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Analisando..." : "Analisar Diretrizes"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setText(""); setUploadedFile(null); setError(null); setValidation(null); setTab("upload"); }} />}
    </div>
  );
}
