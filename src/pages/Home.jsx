import { FileSearch, Scale, FileEdit, ClipboardCheck, GitCompare, Mail, Calculator, Languages, NotebookPen, BarChart3, Building2 } from "lucide-react";
import ToolCard from "../components/ToolCard";

const tools = [
  {
    icon: FileSearch,
    title: "Analisador de Currículo",
    description: "Analise currículos com IA e receba feedback detalhado sobre pontos fortes, gaps e sugestões de melhoria.",
    path: "/analisador-curriculo",
    color: "#EF4444",
  },
  {
    icon: ClipboardCheck,
    title: "Analisador de Diretrizes",
    description: "Analise políticas internas, regulamentos e manuais com recomendações de compliance.",
    path: "/analisador-diretrizes",
    color: "#EAB308",
  },
  {
    icon: Scale,
    title: "Analisador de Contrato",
    description: "Identifique cláusulas abusivas, riscos e ambiguidades em contratos com análise jurídica automatizada.",
    path: "/analisador-contrato",
    color: "#EC4899",
  },
  {
    icon: FileEdit,
    title: "Criador de Contrato",
    description: "Gere contratos profissionais completos com base nas informações fornecidas.",
    path: "/criador-contrato",
    color: "#A855F7",
  },
  {
    icon: GitCompare,
    title: "Comparador de Contratos",
    description: "Compare duas versões de um contrato e identifique mudanças críticas.",
    path: "/comparador-contratos",
    color: "#3B82F6",
  },
  {
    icon: Mail,
    title: "Gerador de E-mail Profissional",
    description: "Crie e-mails corporativos eficazes para qualquer situação profissional.",
    path: "/gerador-email",
    color: "#22C55E",
  },
  {
    icon: Calculator,
    title: "Simulador de Rescisão Trabalhista",
    description: "Calcule valores estimados de rescisão trabalhista com base no salário, tempo de empresa e motivo do desligamento.",
    path: "/simulador-rescisao",
    color: "#F59E0B",
  },
  {
    icon: Languages,
    title: "Tradutor Jurídico",
    description: "Converta textos jurídicos complexos em linguagem simples ou transforme linguagem comum em formato jurídico formal.",
    path: "/tradutor-juridico",
    color: "#8B5CF6",
  },
  {
    icon: NotebookPen,
    title: "Gerador de Ata de Reunião",
    description: "Transforme anotações e transcrições em atas profissionais organizadas com participantes, decisões e próximos passos.",
    path: "/gerador-ata",
    color: "#0EA5E9",
  },
  {
    icon: BarChart3,
    title: "Analisador de Dados Empresariais",
    description: "Analise informações empresariais para identificar padrões, tendências, riscos e oportunidades estratégicas.",
    path: "/analisador-dados",
    color: "#10B981",
  },
  {
    icon: Building2,
    title: "Criador de Política Interna",
    description: "Crie documentos internos personalizados para sua empresa com regras, responsabilidades e procedimentos.",
    path: "/criador-politica",
    color: "#F97316",
  },
];

const steps = [
  {
    number: "01",
    title: "Envie",
    desc: "Faça upload do documento ou cole o texto diretamente na ferramenta desejada.",
  },
  {
    number: "02",
    title: "Analise",
    desc: "Nossa IA processa o conteúdo com inteligência especializada para cada tipo de documento.",
  },
  {
    number: "03",
    title: "Obtenha resultados",
    desc: "Receba análises detalhadas, documentos prontos e recomendações acionáveis.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <h1 className="font-title font-semibold text-4xl md:text-6xl leading-tight mb-6 animate-fadeIn">
            Seus documentos profissionais{" "}
            <span className="text-accent">em um só lugar.</span>
          </h1>
          <p className="text-light/60 text-lg max-w-2xl mx-auto mb-8 animate-fadeIn">
            iLoveWork transforma a maneira como você lida com documentos profissionais.
            De currículos a contratos, deixe a IA fazer o trabalho pesado.
          </p>
          <a
            href="#ferramentas"
            className="btn-accent inline-block animate-fadeIn"
          >
            Explorar Ferramentas
          </a>
        </div>
      </section>

      <section id="ferramentas" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-title font-semibold text-3xl text-center mb-12">
            Ferramentas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <ToolCard key={tool.path} {...tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-title font-semibold text-3xl text-center mb-12">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center animate-slideUp" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-sub font-semibold text-2xl text-accent">{step.number}</span>
                </div>
                <h3 className="font-sub font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-light/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
