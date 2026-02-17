import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { BookOpen, CheckCircle2, HelpCircle } from "lucide-react";

export default function QuestionCard({ question }) {
  // Fungsi untuk merender teks yang mengandung LaTeX
  // Asumsi: rumus diapit oleh $...$
  const renderContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        const formula = part.slice(1, -1);
        return <InlineMath key={index} math={formula} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          Level {question.difficulty_level || 1}
        </span>
        <span className="text-slate-400 text-xs flex items-center gap-1">
          <BookOpen size={12} />
          {question.source || "Latihan"}
        </span>
      </div>

      <div className="text-slate-800 leading-relaxed mb-6">
        {renderContent(question.question_text)}
      </div>

      {/* Pilihan Jawaban */}
      {question.options && (
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                {opt.label || String.fromCharCode(65 + idx)}
              </div>
              <div className="text-sm text-slate-700">
                {renderContent(opt.text)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end gap-3">
        <button className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
          <HelpCircle size={14} /> Lihat Pembahasan
        </button>
      </div>
    </div>
  );
}
