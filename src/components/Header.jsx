import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Analisador de Currículo", path: "/analisador-curriculo" },
  { label: "Analisador de Diretrizes", path: "/analisador-diretrizes" },
  { label: "Analisador de Contrato", path: "/analisador-contrato" },
  { label: "Criador de Contrato", path: "/criador-contrato" },
  { label: "Comparador de Contratos", path: "/comparador-contratos" },
  { label: "Gerador de E-mail", path: "/gerador-email" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
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

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-accent bg-accent/10"
                  : "text-light/70 hover:text-light hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
          </div>
        </div>
      )}
    </header>
  );
}
