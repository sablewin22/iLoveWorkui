import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileEdit } from "lucide-react";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { callClaude } from "../services/claudeApi";
import RequiredField from "../components/RequiredField";

const tiposContrato = [
  "Freelance",
  "CLT",
  "Locação de Imóvel",
  "Prestação de Serviços",
  "Parceria Comercial",
];

const parteALabels = {
  "Freelance": "Prestador de Serviços",
  "CLT": "Empregado",
  "Locação de Imóvel": "Locatário",
  "Prestação de Serviços": "Prestador",
  "Parceria Comercial": "Primeiro Parceiro",
};

const parteBLabels = {
  "Freelance": "Contratante",
  "CLT": "Empregador",
  "Locação de Imóvel": "Locador",
  "Prestação de Serviços": "Tomador",
  "Parceria Comercial": "Segundo Parceiro",
};

const foroTipos = ["CLT", "Locação de Imóvel"];

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CriadorContrato() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipo: "",
    parteA: "",
    parteB: "",
    objeto: "",
    valor: "",
    prazo: "",
    observacoes: "",
    incluirForo: false,
    foroLocal: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFormValid = form.tipo && form.parteA && form.parteB && form.objeto;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const updateCheckbox = (field) => (e) => setForm({ ...form, [field]: e.target.checked });

  const labelA = parteALabels[form.tipo] || "Parte A";
  const labelB = parteBLabels[form.tipo] || "Parte B";
  const mostraForo = foroTipos.includes(form.tipo);

  const handleSubmit = async () => {
    if (!form.tipo || !form.parteA || !form.parteB || !form.objeto) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const hoje = new Date().toLocaleDateString("pt-BR");
    let foroText = "";
    if (mostraForo && form.incluirForo && form.foroLocal.trim()) {
      foroText = `\nForo eleito: ${form.foroLocal.trim()}`;
    }
    const userContent = `Data: ${hoje}\nTipo: ${form.tipo}\n${labelA}: ${form.parteA}\n${labelB}: ${form.parteB}\nObjeto: ${form.objeto}\nValor: ${form.valor}\nPrazo: ${form.prazo}\nObservações: ${form.observacoes}${foroText}`;

    let systemPrompt = `Você é um advogado especialista. Redija um contrato profissional completo do tipo "${form.tipo}" com todas as cláusulas necessárias segundo a legislação brasileira. Use APENAS tópicos com "-" e **negrito**. NUNCA use "---" ou "////" ou "===" ou "***". A data fornecida é a data atual — use-a NO CONTRATO, não a substitua por espaços em branco ou underscores. Não invente informações não fornecidas — se algo não foi informado (como valor, prazo ou observações), deixe "___________________" para a pessoa preencher depois, mas NUNCA deixe a data em branco. Responda em português brasileiro.`;

    if (foroText) {
      systemPrompt += ` Inclua uma cláusula de eleição de foro para a comarca de ${form.foroLocal.trim()}.`;
    } else {
      systemPrompt += ` NÃO inclua cláusula de eleição de foro neste contrato.`;
    }

    try {
      const res = await callClaude(systemPrompt, userContent, {
        tipo: form.tipo,
        [labelA]: form.parteA,
        [labelB]: form.parteB,
        valor: form.valor,
        prazo: form.prazo,
      });
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
        <FileEdit className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Criador de Contrato</h1>
      </div>
      <p className="text-light/60 mb-8">Preencha os dados abaixo para gerar um contrato profissional completo.</p>

      <div className="card-surface mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredField label="Tipo de Contrato" tip="Selecione o tipo de contrato que deseja criar" />
            <select value={form.tipo} onChange={update("tipo")} className="input-field">
              <option value="">Selecione...</option>
              {tiposContrato.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <RequiredField label={labelA} tip={`Nome do(a) ${labelA.toLowerCase()}`} />
            <input value={form.parteA} onChange={update("parteA")} placeholder="Nome completo" className="input-field" />
          </div>
          <div>
            <RequiredField label={labelB} tip={`Nome do(a) ${labelB.toLowerCase()}`} />
            <input value={form.parteB} onChange={update("parteB")} placeholder="Nome completo" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light/80 mb-1">Valor e forma de pagamento</label>
            <input value={form.valor} onChange={update("valor")} placeholder="Ex: R$ 5.000,00 mensais" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light/80 mb-1">Prazo / Vigência</label>
            <input value={form.prazo} onChange={update("prazo")} placeholder="Ex: 12 meses" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light/80 mb-1">Outras observações</label>
            <input value={form.observacoes} onChange={update("observacoes")} placeholder="Opcional" className="input-field" />
          </div>
        </div>

        <div className="mt-4">
          <RequiredField label="Objeto do Contrato" tip="Descreva detalhadamente o propósito e escopo do contrato" />
          <textarea
            value={form.objeto}
            onChange={update("objeto")}
            placeholder="Descreva o objeto do contrato..."
            rows={3}
            className="input-field resize-y"
          />
        </div>

        {mostraForo && (
          <div className="mt-4 p-4 bg-black/[0.02] rounded-xl border border-black/5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.incluirForo}
                onChange={updateCheckbox("incluirForo")}
                className="w-4 h-4 rounded border-black/20 text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-light/80">Incluir cláusula de eleição de foro</span>
            </label>
            {form.incluirForo && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-light/80 mb-1">Comarca (Cidade / UF)</label>
                <input
                  value={form.foroLocal}
                  onChange={update("foroLocal")}
                  placeholder="Ex: São Paulo/SP"
                  className="input-field"
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button onClick={handleSubmit} disabled={!isFormValid || loading} className="btn-accent w-full mt-4">
          {loading ? "Gerando..." : "Gerar Contrato"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && (
        <div>
          <ResultBox content={result} onNewAnalysis={() => { setResult(null); setForm({ tipo: "", parteA: "", parteB: "", objeto: "", valor: "", prazo: "", observacoes: "", incluirForo: false, foroLocal: "" }); setError(null); }} />
        </div>
      )}
    </div>
  );
}
