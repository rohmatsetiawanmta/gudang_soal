import {
  Book,
  GraduationCap,
  Trophy,
  LayoutDashboard,
  ChevronRight,
  X,
} from "lucide-react";

const menuItems = [
  {
    id: "school",
    label: "Jalur Sekolah",
    icon: <Book size={18} />,
    color: "text-blue-600",
  },
  {
    id: "utbk",
    label: "UTBK - SNBT",
    icon: <GraduationCap size={18} />,
    color: "text-orange-600",
  },
  {
    id: "olympiad",
    label: "Olimpiade",
    icon: <Trophy size={18} />,
    color: "text-purple-600",
  },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
    lg:relative lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }
  `;

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <LayoutDashboard className="text-blue-600" size={24} />
            <span>GudangSoal</span>
          </div>
          <button
            className="lg:hidden p-2 text-slate-500"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <ChevronRight
                size={14}
                className={activeTab === item.id ? "opacity-100" : "opacity-0"}
              />
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
