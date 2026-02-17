import { Trash2, Inbox, CheckCircle2, ListFilter } from "lucide-react";
import { InlineMath } from "react-katex";

export default function DataRepository({
  activeTab,
  data = [],
  loading,
  onDelete,
}) {
  const renderMath = (text) => {
    if (!text) return null;
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, i) =>
      part.startsWith("$") ? (
        <InlineMath key={i} math={part.slice(1, -1)} />
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium tracking-tight">
          Syncing Database...
        </p>
      </div>
    );
  }

  return (
    <section
      className={activeTab === "questions" ? "lg:col-span-1" : "lg:col-span-2"}
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ListFilter size={18} className="text-blue-600" />
          Data Terdaftar
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
          {data?.length || 0} Total Records
        </span>
      </div>

      {!data || data.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-[2.5rem] p-16 flex flex-col items-center text-center">
          <Inbox className="text-slate-300 mb-4" size={40} />
          <p className="text-slate-500 font-bold">Repository Kosong</p>
        </div>
      ) : activeTab === "questions" ? (
        /* View Khusus Soal */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
          {data.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all"
            >
              <button
                onClick={() => onDelete(q.id)}
                className="absolute top-5 right-5 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex gap-2 mb-4">
                <span className="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md uppercase tracking-tight">
                  {q.subtopics?.subjects?.name || "SUBJECT"}
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md uppercase tracking-tight">
                  {q.subtopics?.name || "SUBTOPIC"}
                </span>
              </div>
              <div className="text-sm text-slate-800 mb-4 leading-relaxed line-clamp-3 italic">
                {renderMath(q.question_text)}
              </div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <CheckCircle2 size={10} /> ANS: {q.correct_answer}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Kartu Kategori (Sama dengan Main Page) */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-200 flex justify-between items-center group hover:border-blue-500 hover:shadow-md transition-all cursor-default relative"
            >
              <div className="pr-12">
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-1.5 leading-none">
                  {item.levels?.name ||
                    item.subjects?.name ||
                    item.exam_categories?.name ||
                    "ROOT"}
                </p>
                <h4 className="font-bold text-slate-900 text-lg leading-tight">
                  {item.name}
                </h4>
                <code className="text-[9px] text-slate-300 font-mono italic mt-2 block">
                  /{item.slug}
                </code>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="absolute top-1/2 -translate-y-1/2 right-6 p-2.5 text-slate-100 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
