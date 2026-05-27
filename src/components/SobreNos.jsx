import { useState } from "react";
import { Info, X } from "lucide-react";

export default function SobreNos() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3.5 right-4 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-light/60 hover:text-light hover:bg-white/5 transition-colors whitespace-nowrap border border-black/5 hover:border-black/10"
        aria-label="Sobre nós"
      >
        <Info className="w-3.5 h-3.5" />
        Sobre nós
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setOpen(false)} />
          <div className="fixed right-4 top-20 z-40 w-80 bg-white border border-black/10 rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title font-semibold text-lg text-light">Sobre o iLoveWork</h3>
              <button onClick={() => setOpen(false)} className="text-light/40 hover:text-light transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-light/70 leading-relaxed">
              <p>
                O <strong className="text-light">iLoveWork</strong> foi criado para facilitar o uso de documentos profissionais, tornando processos mais rápidos, organizados e acessíveis para estudantes, profissionais e empresas.
              </p>
              <p>
                A plataforma utiliza <strong className="text-light">inteligência artificial</strong> para apoiar a criação, análise e melhoria de documentos como currículos, contratos, relatórios e outros arquivos do dia a dia.
              </p>
              <p>
                Nosso objetivo é transformar tarefas complexas em soluções simples, oferecendo uma experiência intuitiva, prática e eficiente, com foco em produtividade, qualidade e acessibilidade.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
