import {
  Layers,
  Hash,
  BookMarked,
  GitMerge,
  GraduationCap,
  Database,
  FileText,
  ArrowLeft,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

const MENU_SECTIONS = [
  {
    title: "Structure",
    items: [
      { id: "levels", label: "Levels", icon: <Layers size={18} /> },
      { id: "grades", label: "Grades", icon: <Hash size={18} /> },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { id: "subjects", label: "Subjects", icon: <BookMarked size={18} /> },
      { id: "subtopics", label: "Sub-Topics", icon: <GitMerge size={18} /> },
    ],
  },
  {
    title: "Competition",
    items: [
      {
        id: "exam_categories",
        label: "Exam Categories",
        icon: <GraduationCap size={18} />,
      },
      {
        id: "exam_sections",
        label: "Exam Sections",
        icon: <Database size={18} />,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        id: "questions",
        label: "Manage Questions",
        icon: <FileText size={18} />,
      },
    ],
  },
];

export default function AdminSidebar({ activeTab, setActiveTab, onBack }) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col font-sans">
      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-slate-900">
          <div className="bg-blue-600 p-2 rounded-2xl text-white shadow-xl shadow-blue-100">
            <Database size={24} />
          </div>
          <span>Console</span>
        </div>
      </div>

      <nav className="flex-1 p-5 space-y-8 overflow-y-auto">
        {MENU_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={
                        activeTab === item.id
                          ? "text-blue-600"
                          : "text-slate-300"
                      }
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  {activeTab === item.id && (
                    <ChevronRight size={16} className="text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-3 p-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          <ArrowLeft size={16} /> Exit Admin
        </button>
      </div>
    </aside>
  );
}
