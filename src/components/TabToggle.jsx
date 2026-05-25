import { Upload, Type } from "lucide-react";

export default function TabToggle({ activeTab, onTabChange }) {
  return (
    <div className="flex bg-secondary border border-black/5 rounded-xl p-1 w-fit">
      <button
        onClick={() => onTabChange("upload")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === "upload"
            ? "bg-accent text-white"
            : "text-light/60 hover:text-light"
        }`}
      >
        <Upload className="w-4 h-4" />
        Upload
      </button>
      <button
        onClick={() => onTabChange("text")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === "text"
            ? "bg-accent text-white"
            : "text-light/60 hover:text-light"
        }`}
      >
        <Type className="w-4 h-4" />
        Colar texto
      </button>
    </div>
  );
}
