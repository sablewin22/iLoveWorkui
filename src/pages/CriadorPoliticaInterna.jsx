import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude, callClaudeEdit } from "../services/claudeApi";
import RequiredField from "../components/RequiredField";
import ErrorAlert from "../components/ErrorAlert";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CriadorPoliticaInterna() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomePolitica: "",
    empresa: "",
    setor: "",
    objetivo: "",
    regras: "",
    responsaveis: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [lastContent, setLastContent] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nomePolitica || !form.empresa || !form.objetivo) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const userContent = `Nome da Política: ${form.nomePolitica}\nEmpresa: ${form.empresa}\nSetor: ${form.setor}\nObjetivo: ${form.objetivo}\nRegras sugeridas: ${form.regras}\nResponsáveis: ${form.responsaveis}`;
    setLastContent(userContent);

    const systemPrompt = "Você é um especialista em gestão empresarial e criação de políticas internas. Crie um documento de política interna personalizado. Adapte a linguagem ao perfil da empresa. Estruture regras claras e defina responsabilidades. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

    try {
      const res = await callClaude(systemPrompt, userContent);
      setResult(cleanResult(res));
    } catch (e) {
      setError(e.message);
      setSuggestions(e.suggestions || []);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (previousResult, editInstruction) => {
    if (editInstruction === "__RESTORE__") { setResult(previousResult); return; }
    const res = await callClaudeEdit("Você é um especialista em gestão empresarial e criação de políticas internas. Crie um documento de política interna personalizado. Adapte a linguagem ao perfil da empresa. Estruture regras claras e defina responsabilidades. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.", lastContent, previousResult, editInstruction);
    setResult(cleanResult(res));
  };

  const isFormValid = form.nomePolitica && form.empresa && form.objetivo;

  return (
    <div className="tool-container pt-24">
      <button onClick={() => navigate("/")} className="btn-ghost flex items-center gap-2 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para Home
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Building2 className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Criador de Política Interna</h1>
      </div>
      <p className="text-light/60 mb-8">Preencha os dados para criar uma política interna personalizada para sua empresa.</p>

      <div className="card-surface mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredField label="Nome da Política" tip="Ex: Política de Home Office, Código de Conduta..." />
            <input value={form.nomePolitica} onChange={update("nomePolitica")} placeholder="Ex: Política de Home Office" className="input-field" />
          </div>
          <div>
            <RequiredField label="Nome da Empresa" tip="Sua empresa ou organização" />
            <input value={form.empresa} onChange={update("empresa")} placeholder="Nome da empresa" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light/80 mb-1">Setor / Departamento</label>
            <input value={form.setor} onChange={update("setor")} placeholder="Ex: RH, TI, Administrativo" className="input-field" />
          </div>
          <div>
            <RequiredField label="Objetivo da Política" tip="Qual problema ou regra essa política visa estabelecer" />
            <input value={form.objetivo} onChange={update("objetivo")} placeholder="Ex: Regular o trabalho remoto" className="input-field" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-light/80 mb-1">Principais regras a considerar</label>
          <textarea
            value={form.regras}
            onChange={update("regras")}
            placeholder="Descreva regras ou diretrizes que devem ser incluídas..."
            rows={3}
            className="input-field resize-y"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-light/80 mb-1">Responsáveis pela aplicação</label>
          <input value={form.responsaveis} onChange={update("responsaveis")} placeholder="Ex: Gestores, RH, Compliance" className="input-field" />
        </div>

        <ErrorAlert message={error} suggestions={suggestions} />

        <button onClick={handleSubmit} disabled={!isFormValid || loading} className="btn-accent w-full mt-4">
          {loading ? "Criando Política..." : "Criar Política Interna"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && (
        <ResultBox content={result} onNewAnalysis={() => { setResult(null); setForm({ nomePolitica: "", empresa: "", setor: "", objetivo: "", regras: "", responsaveis: "" }); setError(null); }} onEdit={handleEdit} />
      )}
    </div>
  );
}
