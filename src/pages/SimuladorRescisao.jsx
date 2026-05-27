import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator } from "lucide-react";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";
import RequiredField from "../components/RequiredField";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const motivosRescisao = [
  "Dispensa sem justa causa",
  "Dispensa com justa causa",
  "Pedido de demissão",
  "Rescisão indireta",
  "Acordo entre as partes",
  "Término de contrato por prazo determinado",
];

export default function SimuladorRescisao() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    salario: "",
    dataAdmissao: "",
    dataDemissao: "",
    motivo: "",
    avisoPrevio: "false",
    tipoContrato: "CLT",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFormValid = form.salario && form.dataAdmissao && form.dataDemissao && form.motivo;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    if (!form.salario || !form.dataAdmissao || !form.dataDemissao || !form.motivo) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const userContent = `Salário: ${form.salario}\nData de Admissão: ${form.dataAdmissao}\nData de Demissão: ${form.dataDemissao}\nMotivo: ${form.motivo}\nAviso Prévio: ${form.avisoPrevio === "true" ? "Sim" : "Não"}\nTipo de Contrato: ${form.tipoContrato}`;

    const systemPrompt = "Você é um especialista em direito trabalhista e cálculos rescisórios. Calcule os valores estimados de rescisão conforme a CLT. Use APENAS tópicos com \"-\" e **negrito**. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

    try {
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
        <Calculator className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Simulador de Rescisão Trabalhista</h1>
      </div>
      <p className="text-light/60 mb-8">Preencha os dados para calcular os valores estimados da rescisão trabalhista.</p>

      <div className="card-surface mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredField label="Salário bruto" tip="Salário base do trabalhador" />
            <input value={form.salario} onChange={update("salario")} placeholder="Ex: R$ 3.000,00" className="input-field" />
          </div>
          <div>
            <RequiredField label="Tipo de contrato" tip="Regime de contratação" />
            <select value={form.tipoContrato} onChange={update("tipoContrato")} className="input-field">
              <option value="CLT">CLT</option>
              <option value="Estágio">Estágio</option>
              <option value="Temporário">Temporário</option>
            </select>
          </div>
          <div>
            <RequiredField label="Data de admissão" tip="Data de início do contrato" />
            <input type="date" value={form.dataAdmissao} onChange={update("dataAdmissao")} className="input-field" />
          </div>
          <div>
            <RequiredField label="Data de demissão" tip="Data do desligamento" />
            <input type="date" value={form.dataDemissao} onChange={update("dataDemissao")} className="input-field" />
          </div>
          <div>
            <RequiredField label="Motivo da rescisão" tip="Motivo do desligamento" />
            <select value={form.motivo} onChange={update("motivo")} className="input-field">
              <option value="">Selecione...</option>
              {motivosRescisao.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-light/80 mb-1">Aviso prévio</label>
            <select value={form.avisoPrevio} onChange={update("avisoPrevio")} className="input-field">
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button onClick={handleSubmit} disabled={!isFormValid || loading} className="btn-accent w-full mt-4">
          {loading ? "Calculando..." : "Calcular Rescisão"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && (
        <ResultBox content={result} onNewAnalysis={() => { setResult(null); setForm({ salario: "", dataAdmissao: "", dataDemissao: "", motivo: "", avisoPrevio: "false", tipoContrato: "CLT" }); setError(null); }} />
      )}
    </div>
  );
}
