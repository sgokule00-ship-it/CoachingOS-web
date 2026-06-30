import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Teacher } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, Trash2, Edit2, ShieldAlert, Award, Phone, Mail } from "lucide-react";

interface TeachersModuleProps {
  coachingId: string;
}

export const TeachersModule: React.FC<TeachersModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    salary: 0
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const teacherQuery = query(
      collection(db, "teachers"),
      where("coachingId", "==", coachingId)
    );

    const unsub = onSnapshot(teacherQuery, (snap) => {
      const list: Teacher[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Teacher);
      });
      setTeachers(list);
      setLoading(false);
    });

    return unsub;
  }, [coachingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.mobile) {
      toast("Please enter name, subject, and mobile number.", "error");
      return;
    }

    try {
      const teacherId = editId || `${coachingId}_t_${Date.now()}`;
      await setDoc(doc(db, "teachers", teacherId), {
        ...formData,
        id: teacherId,
        coachingId,
        salary: Number(formData.salary),
        status: "active",
        joiningDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      });

      toast(editId ? "Teacher file updated successfully!" : "Teacher rostered successfully!", "success");
      setShowForm(false);
      setEditId(null);
      setFormData({ name: "", email: "", mobile: "", subject: "", salary: 0 });
    } catch (err) {
      toast("Failed to register teacher profile.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to dismiss this teacher profile?")) return;
    try {
      await deleteDoc(doc(db, "teachers", id));
      toast("Teacher file dismissed.", "info");
    } catch (err) {
      toast("Failed to dismiss record.", "error");
    }
  };

  const handleEdit = (t: Teacher) => {
    setEditId(t.id);
    setFormData({
      name: t.name,
      email: t.email || "",
      mobile: t.mobile,
      subject: t.subject,
      salary: t.salary || 0
    });
    setShowForm(true);
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by teacher name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", email: "", mobile: "", subject: "", salary: 0 });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4.5 w-4.5" /> Roster Teacher
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white mb-4">
            {editId ? "Edit Teacher Dossier" : "Register Teacher Faculty"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Teacher Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Designated Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Mathematics"
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Mobile Number</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Monthly Remuneration ($)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                {editId ? "Update Dossier" : "Roster Faculty"}
              </button>
            </div>

          </form>
        </div>
      )}

      {loading ? (
        <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <ShieldAlert className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm">No rostered teacher faculty found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div 
              key={t.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">{t.subject} Department</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                    Faculty
                  </span>
                </div>

                <hr className="border-slate-100 dark:border-slate-850" />

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>Mobile: {t.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>Email: {t.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-400" />
                    <span>Base Salary: <strong className="text-slate-850 dark:text-slate-150">${t.salary}/mo</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-slate-50 dark:border-slate-850">
                <button
                  onClick={() => handleEdit(t)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
