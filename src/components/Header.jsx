import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Analisador de Currículo", path: "/analisador-curriculo" },
  { label: "Analisador de Diretrizes", path: "/analisador-diretrizes" },
  { label: "Analisador de Contrato", path: "/analisador-contrato" },
  { label: "Criador de Contrato", path: "/criador-contrato" },
  { label: "Comparador de Contratos", path: "/comparador-contratos" },
  { label: "Gerador de E-mail", path: "/gerador-email" },
];

const extraLinks = [
  { label: "Simulador de Rescisão", path: "/simulador-rescisao" },
  { label: "Tradutor Jurídico", path: "/tradutor-juridico" },
  { label: "Gerador de Ata", path: "/gerador-ata" },
  { label: "Analisador de Dados", path: "/analisador-dados" },
  { label: "Criador de Política Interna", path: "/criador-politica" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-title font-semibold hover:text-accent transition-colors shrink-0"
        >
          <Briefcase className="w-6 h-6 text-accent" />
          iLoveWork
        </Link>

        <nav className="hidden lg:flex items-center gap-0 overflow-x-auto flex-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-2 py-2 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap ${
                location.pathname === link.path
                  ? "text-accent bg-accent/10"
                  : "text-light/70 hover:text-light hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setExtraOpen(!extraOpen)}
              className="flex items-center gap-1 px-2 py-2 rounded-lg text-[12px] font-medium text-light/70 hover:text-light hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Veja mais opções <ChevronDown className={`w-3.5 h-3.5 transition-transform ${extraOpen ? "rotate-180" : ""}`} />
            </button>
            {extraOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setExtraOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 glass-effect border border-black/10 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                  {extraLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setExtraOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        location.pathname === link.path
                          ? "text-accent bg-accent/10"
                          : "text-light/70 hover:text-light hover:bg-black/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden btn-ghost p-2"
            aria-label="Abrir menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-effect border-t border-black/5 max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.path
                    ? "text-accent bg-accent/10"
                    : "text-light/70 hover:text-light hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-black/5 my-2" />
            <p className="px-3 py-1 text-xs font-medium text-light/40 uppercase tracking-wider">Veja mais opções</p>
            {extraLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.path
                    ? "text-accent bg-accent/10"
                    : "text-light/70 hover:text-light hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
