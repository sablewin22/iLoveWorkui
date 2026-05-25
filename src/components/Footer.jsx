import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Briefcase className="w-5 h-5 text-accent" />
          <span className="font-title font-semibold text-lg">iLoveWork</span>
        </div>
        <p className="text-light/50 text-sm mb-1">
          Projeto Acadêmico A2
        </p>
        <p className="text-light/40 text-xs">
          Grupo: Alicia Pizoni, Giovanna Couto, Julia Cereja, Rebeca Bertozzi, Sabrina Azulay
        </p>
      </div>
    </footer>
  );
}
