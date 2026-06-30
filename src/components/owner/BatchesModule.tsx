import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Batch, Teacher } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, Trash2, Edit2, Layers, Clock, BookOpen, User } from "lucide-react";

interface BatchesModuleProps {
  coachingId: string;
}

export const BatchesModule: React.FC<BatchesModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    timing: "",
    teacherId: ""
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const batchQuery = query(
      collection(db, "batches"),
      where("coachingId", "==", coachingId)
    );

    const unsubBatches = onSnapshot(batchQuery, (snap) => {
      const list: Batch[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Batch);
      });
      setBatches(list);
      setLoading(false);
    });

    const teacherQuery = query(
      collection(db, "teachers"),
      where("coachingId", "==", coachingId)
    );

    const unsubTeachers = onSnapshot(teacherQuery, (snap) => {
      const list: Teacher[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Teacher);
      });
      setTeachers(list);
    });

    return () => {
      unsubBatches();
      unsubTeachers();
    };
  }, [coachingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.course || !formData.timing) {
      toast("Please enter batch name, course title, and timing.", "error");
      return;
    }

    try {
      const batchId = editId || `${coachingId}_b_${Date.now()}`;
      await setDoc(doc(db, "batches", batchId), {
        ...formData,
        id: batchId,
        coachingId,
        status: "active",
        createdAt: new Date().toISOString()
      });

      toast(editId ? "Batch updated successfully!" : "Batch created successfully!", "success");
      setShowForm(false);
      setEditId(null);
      setFormData({ name: "", course: "", timing: "", teacherId: "" });
    } catch (err) {
      toast("Failed to register batch profile.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this academic batch?")) return;
    try {
      await deleteDoc(doc(db, "batches", id));
      toast("Batch archived.", "info");
    } catch (err) {
      toast("Failed to archive record.", "error");
    }
  };

  const handleEdit = (b: Batch) => {
    setEditId(b.id);
    setFormData({
      name: b.name,
      course: b.course,
      timing: b.timing,
      teacherId: b.teacherId || ""
    });
    setShowForm(true);
  };

  const filtered = batches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by batch name or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", course: "", timing: "", teacherId: teachers[0]?.id || "" });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4.5 w-4.5" /> Create Batch
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white mb-4">
            {editId ? "Edit Batch Settings" : "Setup New Academic Batch"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Batch Display Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Class XI JEE - Elite"
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Course Syllabus Code</label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="Physics NEET Prep"
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Daily timings</label>
              <input
                type="text"
                required
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                placeholder="04:00 PM - 05:30 PM"
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Assigned Educator Faculty</label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              >
                <option value="">Select Faculty</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-770 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                {editId ? "Update Batch" : "Setup Batch"}
              </button>
            </div>

          </form>
        </div>
      )}

      {loading ? (
        <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Layers className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm">No academic batches configured.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => {
            const matchedTeacher = teachers.find((t) => t.id === b.teacherId);
            return (
              <div 
                key={b.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 dark:text-white">{b.name}</h4>
                      <span className="text-xs text-slate-400">Course Syllabus: {b.course}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      Batch
                    </span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-850" />

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Schedules: <strong className="text-slate-800 dark:text-slate-200">{b.timing}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Faculty Lead: {matchedTeacher?.name || "Dr. Verma"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-slate-50 dark:border-slate-850">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
