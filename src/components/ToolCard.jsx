import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ icon: Icon, title, description, path, index, color }) {
  return (
    <Link
      to={path}
      className="card-surface toolcard-hover group animate-slideUp"
      style={{ animationDelay: `${index * 80}ms`, "--card-color": color }}
    >
      <div className="w-12 h-12 rounded-xl toolcard-icon-bg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="toolcard-title font-sub font-semibold text-lg mb-2">
        {title}
      </h3>
      <p className="text-light/60 text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center gap-1 text-sm font-medium" style={{ color }}>
        <span>Acessar</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}