import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import EntryForm from "./EntryForm";
import DataRepository from "./DataRepository";

export default function Admin({ onBack }) {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState("levels");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // --- DATA STATE ---
  const [data, setData] = useState([]);
  const [relations, setRelations] = useState({
    levels: [],
    subjects: [],
    subtopics: [],
    grades: [],
    exam_categories: [],
    exam_sections: [],
  });

  // State awal form dengan template opsi untuk soal
  const initialFormState = {
    name: "",
    slug: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ],
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- LOGIC: AUTO SLUG ---
  // Menghasilkan slug otomatis setiap kali field 'name' berubah
  useEffect(() => {
    if (formData.name && activeTab !== "questions") {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, activeTab]);

  // --- LOGIC: DATA FETCHING ---
  useEffect(() => {
    fetchData();
    fetchRelations();
    // Reset form saat pindah tab agar tidak ada data sisa
    setFormData(initialFormState);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from(activeTab).select("*");

      // Join tabel agar tampilan repository lebih informatif
      if (activeTab === "grades")
        query = supabase.from("grades").select("*, levels(name)");
      if (activeTab === "subtopics")
        query = supabase.from("subtopics").select("*, subjects(name)");
      if (activeTab === "exam_sections")
        query = supabase
          .from("exam_sections")
          .select("*, exam_categories(name)");
      if (activeTab === "questions")
        query = supabase
          .from("questions")
          .select("*, subtopics(name, subjects(name))");

      const { data: res, error } = await query;
      if (error) throw error;
      setData(res || []);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelations = async () => {
    const tables = [
      "levels",
      "subjects",
      "subtopics",
      "grades",
      "exam_categories",
      "exam_sections",
    ];
    try {
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select("id, name"))
      );
      const mapping = {};
      tables.forEach((t, i) => {
        mapping[t] = results[i].data || [];
      });
      setRelations(mapping);
    } catch (err) {
      console.error("Relations Error:", err.message);
    }
  };

  // --- HANDLERS ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from(activeTab).insert([formData]);

      if (error) throw error;

      setStatus({ type: "success", msg: "Data berhasil disimpan!" });
      setFormData(initialFormState);
      fetchData();

      // Hilangkan pesan status setelah 3 detik
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus entri ini secara permanen?")) {
      try {
        const { error } = await supabase.from(activeTab).delete().eq("id", id);
        if (error) throw error;
        fetchData();
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Navigasi Admin */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBack={onBack}
      />

      <main className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Header dengan Status Indikator */}
        <AdminHeader activeTab={activeTab} status={status} />

        <div className="p-8 max-w-7xl mx-auto">
          <div
            className={`grid grid-cols-1 ${
              activeTab === "questions" ? "lg:grid-cols-1" : "lg:grid-cols-3"
            } gap-10`}
          >
            {/* Form Input Dinamis */}
            <EntryForm
              activeTab={activeTab}
              formData={formData}
              setFormData={setFormData}
              relations={relations}
              isSubmitting={isSubmitting}
              onSubmit={handleCreate}
            />

            {/* Visualisasi Repository Data */}
            <DataRepository
              activeTab={activeTab}
              data={data}
              loading={loading}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
