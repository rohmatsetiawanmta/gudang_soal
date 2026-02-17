import { Plus, Loader2, Sparkles, Eye } from "lucide-react";
import { InlineMath } from "react-katex";

export default function EntryForm({
  activeTab,
  formData,
  setFormData,
  relations,
  isSubmitting,
  onSubmit,
}) {
  const renderMath = (text) => {
    if (!text)
      return (
        <span className="text-slate-300 italic text-xs">Preview soal...</span>
      );
    return text
      .split(/(\$.*?\$)/g)
      .map((part, i) =>
        part.startsWith("$") ? (
          <InlineMath key={i} math={part.slice(1, -1)} />
        ) : (
          part
        )
      );
  };

  return (
    <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-28">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" /> New Entry
      </h3>
      <form
        onSubmit={onSubmit}
        className={
          activeTab === "questions"
            ? "grid grid-cols-1 md:grid-cols-2 gap-8"
            : "space-y-5"
        }
      >
        {/* Render field dinamis berdasarkan activeTab */}
        <div className="space-y-5">
          {activeTab !== "questions" ? (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-4 bg-slate-100/50 rounded-2xl text-sm font-mono text-slate-400"
                  value={formData.slug || ""}
                  readOnly
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-black tracking-widest">
                  AUTO
                </span>
              </div>
              {/* Dropdown Relasi */}
              {activeTab === "grades" && (
                <select
                  className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold"
                  onChange={(e) =>
                    setFormData({ ...formData, level_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Jenjang</option>
                  {relations.levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <select
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold"
                onChange={(e) =>
                  setFormData({ ...formData, subtopic_id: e.target.value })
                }
                required
              >
                <option value="">Pilih Subtopik</option>
                {relations.subtopics.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <textarea
                rows="4"
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none"
                placeholder="Isi soal..."
                onChange={(e) =>
                  setFormData({ ...formData, question_text: e.target.value })
                }
                required
              ></textarea>
              <div className="p-4 bg-blue-50/50 rounded-2xl min-h-[80px] text-sm leading-relaxed">
                {renderMath(formData.question_text)}
              </div>
            </div>
          )}
        </div>
        {/* Bagian khusus untuk input Opsi Soal jika activeTab === 'questions' */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            {formData.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Opsi ${opt.label}`}
                className="w-full p-3 bg-slate-50 rounded-xl text-sm"
                onChange={(e) => {
                  const n = [...formData.options];
                  n[i].text = e.target.value;
                  setFormData({ ...formData, options: n });
                }}
              />
            ))}
            <input
              type="text"
              placeholder="Kunci Jawaban"
              className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold"
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              required
            />
          </div>
        )}
        <button
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all flex justify-center gap-2 shadow-xl shadow-slate-200 lg:col-span-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}{" "}
          Commit Change
        </button>
      </form>
    </section>
  );
}
