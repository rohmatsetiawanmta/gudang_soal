import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminHeader({ activeTab, status }) {
  return (
    <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-30 flex justify-between items-center h-[90px]">
      <div className="flex flex-col">
        {/* Menggunakan font-black dan tracking-tight sesuai visual utama */}
        <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
          Manage {activeTab.replace("_", " ")}
        </h2>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Eksplorasi materi berdasarkan ketersediaan soal di database.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {status?.msg && (
          <div
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold border shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {status.msg}
          </div>
        )}
        {/* Placeholder profil dengan gaya minimalis */}
        <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200">
          AD
        </div>
      </div>
    </header>
  );
}
