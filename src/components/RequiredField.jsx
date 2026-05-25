import { Info } from "lucide-react";

export default function RequiredField({ label, tip }) {
  return (
    <label className="block text-sm font-medium text-light/80 mb-1">
      {label}
      <span className="relative group inline-flex items-center">
        <span className="text-accent ml-0.5 cursor-help">*</span>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="bg-white border border-black/10 text-light/90 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <Info className="w-3 h-3 inline mr-1 text-accent" />
            {tip}
          </div>
        </div>
      </span>
    </label>
  );
}
