import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import TabToggle from "../components/TabToggle";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import ResultBox from "../components/ResultBox";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { callClaude } from "../services/claudeApi";
import { validateContent } from "../services/validateContent";

const systemPrompt = "Você é um especialista em recrutamento. Analise o currículo e forneça: (1) Pontos fortes, (2) Gaps e pontos fracos, (3) Sugestões de melhoria, (4) Avaliação da formatação, (5) Nota 0-10. Use apenas \"-\" e **negrito** para essa análise. Ao final, gere uma **Versão Melhorada do Currículo** formatada como um currículo profissional EXATAMENTE no modelo abaixo, usando ## para títulos de seção, ### para subseções, \"-\" para cada item, e **negrito** para destaques:\n\n## Dados Pessoais\n- **Nome:** ...\n- **Telefone:** ...\n- **E-mail:** ...\n\n## Resumo Profissional\n- ...\n\n## Experiência\n### Nome da Empresa | Cargo\n- ...\n- ...\n\n## Formação\n### Curso — Instituição\n- Período: ...\n\n## Habilidades\n- ...\n- ...\n\n## Idiomas\n- ...\n\nMantenha TODAS as informações do original sem resumir ou omitir nada. Use verbos de ação fortes, destaque realizações quantificáveis, corrija formatação. A versão melhorada deve ser TÃO OU MAIS detalhada que o original. REGRAS: Períodos com sobreposição de datas NÃO são gaps — múltiplos empregos simultâneos são normais. Currículos acadêmicos com múltiplos idiomas (títulos, publicações, referências) é NORMAL e NUNCA deve ser apontado como fraqueza. Benchmark NOTA 10: Matheus Cavalcanti Pestana — Doutor em Ciência Política (UERJ/IESP), Professor FGV, 3 livros, 7 artigos, 4 projetos, 9 disciplinas, gestão editorial, 3 prêmios, 5 idiomas. Seja justo. NUNCA use \"---\" ou \"////\" ou \"===\" ou \"***\". Responda em português brasileiro.";

function cleanResult(text) {
  return text
    .split("\n")
    .filter(line => !/^[-*_=/]{3,}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function AnalisadorCurriculo() {
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
    const v = validateContent(content, "curriculo");
    if (v) { setValidation(v); return; }
    setValidation(null);
    setText(content);
    setUploadedFile({ name: fileName, content });
  };

  const handleTextChange = (v) => { setText(v); const check = validateContent(v, "curriculo"); setValidation(check && check.type === "warning" ? check : null); };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const v = validateContent(text, "curriculo");
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
        <Search className="w-6 h-6 text-accent" />
        <h1 className="font-title font-semibold text-3xl">Analisador de Currículo</h1>
      </div>
      <p className="text-light/60 mb-8">Cole o currículo ou faça upload para receber uma análise completa com pontos fortes, gaps e nota geral.</p>

      <div className="space-y-4 mb-8">
        <TabToggle activeTab={tab} onTabChange={setTab} />

        {tab === "upload" ? (
          <FileUpload onFileContent={handleFileContent} />
        ) : (
          <TextInput value={text} onChange={handleTextChange} placeholder="Cole o texto do currículo aqui..." />
        )}

        {validation && (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span dangerouslySetInnerHTML={{ __html: validation.message }} />
            {validation.suggestionPath && (
              <button onClick={() => navigate(validation.suggestionPath)} className="underline font-medium ml-1">Ir para ferramenta</button>
            )}
          </p>
        )}
        <ErrorAlert message={error} suggestions={suggestions} />

        <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-accent w-full">
          {loading ? "Analisando..." : "Analisar Currículo"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {result && <ResultBox content={result} onNewAnalysis={() => { setResult(null); setText(""); setUploadedFile(null); setError(null); setValidation(null); setTab("upload"); }} />}
    </div>
  );
}
