import { Link } from "react-router-dom";

export default function ErrorAlert({ message, suggestions }) {
  if (!message) return null;

  return (
    <div className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
      <span>{message}</span>
      {suggestions && suggestions.length > 0 && (
        <Link to={suggestions[0].path} className="underline font-medium ml-1">
          Ir para ferramenta
        </Link>
      )}
    </div>
  );
}
