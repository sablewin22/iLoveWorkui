import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GitCompare, CheckCircle, X, Upload, FileText, Loader2 } from "lucide-react";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";

const systemPrompt = "Você é um especialista em análise documental. Compare as duas versões do contrato. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const FileUploadInline = ({ label, onTextExtracted }) => {
  const [fileName, setFileName] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setExtracting(true);
    setError(null);
    const ext = file.name.split(".").pop().toLowerCase();
    try {
      let text = "";
      if (ext === "txt") {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else if (ext === "pdf") {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
      } else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer: file });
        text = result.value;
      }
      onTextExtracted(text);
      setExtracting(false);
    } catch {
      setError("Erro ao extrair texto.");
      setExtracting(false);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; handleFile(file); };
  const handleChange = (e) => { const file = e.target.files[0]; handleFile(file); };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-accent", "bg-accent/5"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-accent", "bg-accent/5"); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all border-black/10 hover:border-black/20"
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleChange} className="hidden" />
        {extracting ? (
          <div className="flex items-center justify-center gap-2 text-light/60">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span className="text-xs">Extraindo...</span>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-1.5 text-light/70">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium">{fileName}</span>
          </div>
        ) : (
          <div>
            <Upload className="w-5 h-5 mx-auto mb-1 text-light/40" />
            <p className="text-light/50 text-xs">Upload {label}</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function ComparadorContratos() {
  const navigate = useNavigate();
  const [versaoAntiga, setVersaoAntiga] = useState("");
  const [versaoNova, setVersaoNova] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oldUploaded, setOldUploaded] = useState(false);
  const [newUploaded, setNewUploaded] = useState(false);

  const handleSubmit = async () => {
    if (!versaoAntiga.trim() || !versaoNova.trim()) return;
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
          <FileUploadInline label="PDF, DOCX ou TXT" onTextExtracted={(t) => { setVersaoAntiga(t); setOldUploaded(true); }} />
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
          <FileUploadInline label="PDF, DOCX ou TXT" onTextExtracted={(t) => { setVersaoNova(t); setNewUploaded(true); }} />
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

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button onClick={handleSubmit} disabled={!versaoAntiga.trim() || !versaoNova.trim() || loading} className="btn-accent w-full mb-8">
        {loading ? "Comparando..." : "Comparar Contratos"}
      </button>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setVersaoAntiga(""); setVersaoNova(""); setOldUploaded(false); setNewUploaded(false); setError(null); }} />}
    </div>
  );
}
