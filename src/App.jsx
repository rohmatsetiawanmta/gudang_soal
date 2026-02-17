import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Sidebar from "./components/Sidebar";
import CategoryGrid from "./components/CategoryGrid";
import Breadcrumbs from "./components/Breadcrumbs";
import QuestionCard from "./components/QuestionCard";
import Admin from "./pages/Admin"; // Pastikan file ini sudah dibuat
import {
  Search,
  Menu,
  Loader2,
  SlidersHorizontal,
  Inbox,
  Settings,
  ArrowLeft,
} from "lucide-react";

function App() {
  // --- UI STATE ---
  const [view, setView] = useState("user"); // 'user' atau 'admin'
  const [activeTab, setActiveTab] = useState("school");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  // --- DATA STATE ---
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);

  // --- LOGIC: FETCHING ---

  useEffect(() => {
    if (view === "user") {
      resetNavigation();
    }
  }, [activeTab, view]);

  const resetNavigation = () => {
    setNavigationStack([]);
    setViewMode("grid");
    fetchInitialCategories();
  };

  const fetchInitialCategories = async () => {
    setLoading(true);
    try {
      let query;
      if (activeTab === "school") {
        query = supabase
          .from("grades")
          .select("id, name, number_value, levels(name)")
          .order("number_value");
      } else {
        const slug = activeTab === "utbk" ? "utbk-snbt" : "osn-matematika";
        query = supabase
          .from("exam_sections")
          .select("id, name, exam_categories!inner(name)")
          .eq("exam_categories.slug", slug);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCategories(data);
    } catch (err) {
      console.error("Error Initial Fetch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsWithQuestions = async (parentId) => {
    setLoading(true);
    try {
      let query = supabase.from("subjects").select(`
        id, name, slug,
        subtopics!inner(questions!inner(id))
      `);

      if (activeTab === "school") {
        query = query.eq("subtopics.questions.grade_id", parentId);
      } else {
        query = query.eq("subtopics.questions.exam_section_id", parentId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const uniqueSubjects = data.filter(
        (subject, index, self) =>
          index === self.findIndex((t) => t.id === subject.id)
      );

      setCategories(uniqueSubjects);
      setViewMode("grid");
    } catch (err) {
      console.error("Error Smart Fetch:", err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (subjectId, parentId) => {
    setLoading(true);
    try {
      const { data: subtopicData } = await supabase
        .from("subtopics")
        .select("id")
        .eq("subject_id", subjectId);

      const subtopicIds = subtopicData?.map((s) => s.id) || [];

      let query = supabase
        .from("questions")
        .select("*")
        .in("subtopic_id", subtopicIds);

      if (activeTab === "school") {
        query = query.eq("grade_id", parentId);
      } else {
        query = query.eq("exam_section_id", parentId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setQuestions(data);
      setViewMode("list");
    } catch (err) {
      console.error("Error Fetch Questions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---

  const handleSelectCategory = (item) => {
    const depth = navigationStack.length;
    if (depth === 0) {
      setNavigationStack([{ id: item.id, name: item.name, type: "category" }]);
      fetchSubjectsWithQuestions(item.id);
    } else if (depth === 1) {
      const parentCategory = navigationStack[0];
      setNavigationStack([
        parentCategory,
        { id: item.id, name: item.name, type: "subject" },
      ]);
      fetchQuestions(item.id, parentCategory.id);
    }
  };

  const handleBreadcrumbNavigate = (type, path) => {
    if (type === "root") {
      resetNavigation();
    } else {
      const index = navigationStack.findIndex((p) => p.id === path.id);
      const newStack = navigationStack.slice(0, index + 1);
      setNavigationStack(newStack);
      if (newStack.length === 1) fetchSubjectsWithQuestions(path.id);
    }
  };

  // --- RENDER ADMIN VIEW ---
  if (view === "admin") {
    return <Admin onBack={() => setView("user")} />;
  }

  // --- RENDER USER VIEW ---
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 sticky top-0 z-30 flex items-center gap-4">
          <button
            className="lg:hidden p-2 bg-slate-50 border border-slate-200 rounded-xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari materi..."
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setView("admin")}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Admin Panel"
          >
            <Settings size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Breadcrumbs
              paths={navigationStack}
              onNavigate={handleBreadcrumbNavigate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {navigationStack.length > 0
                    ? navigationStack[navigationStack.length - 1].name
                    : activeTab === "school"
                    ? "Kurikulum Sekolah"
                    : activeTab === "utbk"
                    ? "UTBK - SNBT"
                    : "Pusat Olimpiade"}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  {viewMode === "grid"
                    ? "Pilih kategori materi untuk mulai belajar."
                    : `Tersedia ${questions.length} soal.`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                <Loader2
                  className="animate-spin mb-3 text-blue-600"
                  size={40}
                />
                <p className="text-sm font-medium">Sinkronisasi...</p>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <CategoryGrid
                    loading={loading}
                    categories={categories}
                    activeTab={activeTab}
                    onSelect={handleSelectCategory}
                  />
                ) : (
                  <div className="space-y-6 pb-20">
                    {questions.map((q) => (
                      <QuestionCard key={q.id} question={q} />
                    ))}
                    {questions.length === 0 && (
                      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center text-center">
                        <Inbox className="text-slate-300 mb-4" size={40} />
                        <p className="text-slate-500 font-semibold text-lg">
                          Halaman Kosong
                        </p>
                        <button
                          onClick={() => handleBreadcrumbNavigate("root")}
                          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg hover:bg-blue-700 transition-all"
                        >
                          Kembali
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
