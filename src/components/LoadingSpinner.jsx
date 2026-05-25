import { Brain } from "lucide-react";

const messages = [
  "Analisando documentos...",
  "Consultando IA...",
  "Processando informações...",
  "Quase lá...",
  "Revisando detalhes...",
];

export default function LoadingSpinner() {
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-black/5 flex items-center justify-center">
          <Brain className="w-7 h-7 text-accent animate-pulse" />
        </div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>
      <div className="flex items-center gap-1 mt-6">
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse-dot" />
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse-dot delay-200" />
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse-dot delay-400" />
      </div>
      <p className="text-light/60 text-sm mt-3">{message}</p>
    </div>
  );
}
