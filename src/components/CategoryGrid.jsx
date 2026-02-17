import { ChevronRight, Loader2 } from "lucide-react";

export default function CategoryGrid({
  loading,
  categories,
  activeTab,
  onSelect,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm">Menghubungkan ke database...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500">
        Belum ada data untuk kategori ini.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left flex justify-between items-center cursor-pointer"
        >
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
              {activeTab === "school"
                ? item.levels?.name
                : item.exam_categories?.name}
            </p>
            <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
              {item.name}
            </h3>
          </div>
          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
          />
        </button>
      ))}
    </div>
  );
}
