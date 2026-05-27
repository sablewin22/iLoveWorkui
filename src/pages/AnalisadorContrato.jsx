import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, CheckCircle, X } from "lucide-react";
import TabToggle from "../components/TabToggle";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";
import { validateContent } from "../services/validateContent";

const systemPrompt = "Você é um advogado especialista em direito contratual brasileiro. Analise o contrato a seguir e identifique: (1) Cláusulas abusivas ou ilegais, (2) Riscos para as partes envolvidas, (3) Pontos de atenção e ambiguidades, (4) O que está faltando que deveria constar, (5) Recomendação final sobre assinar ou não. Seja preciso e use linguagem acessível. Responda em português brasileiro.";

export default function AnalisadorContrato() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upload");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileContent = (content, fileName) => {
    if (content === null && fileName) {
      setError("Não foi possível extrair o texto do arquivo. Tente usar a aba 'Colar texto'.");
      return;
    }
    setText(content);
    setUploadedFile({ name: fileName, content });
    setError(null);
    setValidation(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setText("");
  };

  const handleTextChange = (v) => { setText(v); setValidation(null); };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const v = validateContent(text, "contrato");
    if (v) { setValidation(v); return; }
    setValidation(null);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await callClaude(systemPrompt, text);
      setResult(res);
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
        <Scale className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Analisador de Contrato</h1>
      </div>
      <p className="text-light/60 mb-8">Cole o texto do contrato para identificar cláusulas abusivas, riscos e receber uma recomendação final.</p>

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
          <TextInput value={text} onChange={handleTextChange} placeholder="Cole o texto do contrato aqui..." />
        )}

        {validation && (
          <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span dangerouslySetInnerHTML={{ __html: validation.message }} />
            {validation.suggestionPath && (
              <button onClick={() => navigate(validation.suggestionPath)} className="underline font-medium ml-1">Ir para ferramenta</button>
            )}
          </p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Analisando..." : "Analisar Contrato"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setText(""); setUploadedFile(null); setError(null); setValidation(null); setTab("upload"); }} />}
    </div>
  );
}
