import { Link } from "react-router-dom";

export default function ErrorAlert({ message, suggestions }) {
  if (!message) return null;

  return (
    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
      <p>{message}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <Link
              key={i}
              to={s.path}
              className="inline-block px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
            >
              {s.label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
