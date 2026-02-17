import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ paths, onNavigate }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <button
        onClick={() => onNavigate("root")}
        className="hover:text-blue-600 transition-colors flex items-center gap-1"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Home</span>
      </button>

      {paths.map((path, index) => (
        <div key={path.id} className="flex items-center space-x-2">
          <ChevronRight size={14} className="text-slate-300" />
          <button
            onClick={() => onNavigate(path.type, path)}
            disabled={index === paths.length - 1}
            className={`transition-colors ${
              index === paths.length - 1
                ? "text-slate-900 font-semibold cursor-default"
                : "hover:text-blue-600"
            }`}
          >
            {path.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
