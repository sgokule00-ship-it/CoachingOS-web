import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Teacher, Batch } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, Trash2, Edit2, ShieldAlert, Award, Phone, Mail, Eye, BookOpen, Calendar, DollarSign, Sparkles } from "lucide-react";
import { GridSkeleton } from "../DashboardSkeleton";

interface TeachersModuleProps {
  coachingId: string;
}

export const TeachersModule: React.FC<TeachersModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom states for Profile details & Batch assignment
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    salary: 0,
    assignedBatches: [] as string[]
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
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
      setLoading(false);
    });

    // Query batches for assignment
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
    });

    return () => {
      unsubTeachers();
      unsubBatches();
    };
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
        assignedBatches: formData.assignedBatches || [],
        status: "active",
        joiningDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      });

      toast(editId ? "Teacher file updated successfully!" : "Teacher rostered successfully!", "success");
      setShowForm(false);
      setEditId(null);
      setFormData({ name: "", email: "", mobile: "", subject: "", salary: 0, assignedBatches: [] });
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

  const handleEdit = (t: any) => {
    setEditId(t.id);
    setFormData({
      name: t.name,
      email: t.email || "",
      mobile: t.mobile,
      subject: t.subject,
      salary: t.salary || 0,
      assignedBatches: t.assignedBatches || []
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
            setFormData({ name: "", email: "", mobile: "", subject: "", salary: 0, assignedBatches: [] });
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

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-semibold text-slate-500">Assigned Batches</label>
              {batches.length === 0 ? (
                <p className="text-xs text-slate-400">No batches created yet. Please create a batch first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {batches.map((b) => {
                    const isChecked = formData.assignedBatches?.includes(b.id);
                    return (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => {
                          const current = [...(formData.assignedBatches || [])];
                          if (current.includes(b.id)) {
                            setFormData({ ...formData, assignedBatches: current.filter(id => id !== b.id) });
                          } else {
                            setFormData({ ...formData, assignedBatches: [...current, b.id] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                          isChecked
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              )}
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
        <GridSkeleton count={3} />
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
                  onClick={() => setSelectedTeacher(t)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-indigo-500 rounded-lg transition-colors"
                  title="View Faculty Profile"
                >
                  <Eye className="h-4 w-4" />
                </button>
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

      {/* Teacher/Faculty Profile Modal with Salary & Leaves Tracker */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto animate-fade-in relative">
            
            <button 
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 p-2 text-slate-450 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              &times;
            </button>

            {/* Left Column: Faculty dossier, batches, subject assignments */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-indigo-500">Faculty profile dossier</span>
                <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{selectedTeacher.name}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{selectedTeacher.subject} Department Head</p>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Assigned Batches ({selectedTeacher.assignedBatches?.length || 0})</h4>
                <div className="flex flex-wrap gap-2">
                  {(!selectedTeacher.assignedBatches || selectedTeacher.assignedBatches.length === 0) ? (
                    <span className="text-xs text-slate-400 italic">No specific batches assigned yet</span>
                  ) : (
                    selectedTeacher.assignedBatches.map((bId: string) => {
                      const b = batches.find(x => x.id === bId);
                      return (
                        <span key={bId} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold">
                          {b ? b.name : "Active Batch"}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Roster & Contract records</h4>
                <div className="space-y-2 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Joining Date:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.joiningDate || "N/A"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roster Status:</span>
                    <strong className="text-emerald-500 font-semibold">Active Duty</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Email:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.email || "N/A"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Direct Contact:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.mobile}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Salary Logs and Leave Management */}
            <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 space-y-6">
              
              {/* Leaves tracker */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Leaves Tracker & Attendance</h4>
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl text-xs space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Leaves Taken</span>
                      <strong className="text-lg text-indigo-600 dark:text-indigo-400">2 Days</strong>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Remaining</span>
                      <strong className="text-lg text-slate-850 dark:text-slate-200">10 Days</strong>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-450">
                    <span>Attendance Rating:</span>
                    <strong className="text-emerald-500">96.8% Excellent</strong>
                  </div>
                </div>
              </div>

              {/* Salary disbursement log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Monthly Salary Logs</h4>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {[
                    { month: "June 2026", amt: selectedTeacher.salary, status: "Paid" },
                    { month: "May 2026", amt: selectedTeacher.salary, status: "Paid" },
                    { month: "April 2026", amt: selectedTeacher.salary, status: "Paid" },
                    { month: "March 2026", amt: selectedTeacher.salary, status: "Paid" }
                  ].map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl text-xs">
                      <div>
                        <strong className="text-slate-850 dark:text-slate-200">{log.month}</strong>
                        <span className="block text-[10px] text-slate-400">${log.amt} Monthly Base</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-500">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    toast("Faculty salary stub and payslip generated successfully!", "success");
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <DollarSign className="h-3.5 w-3.5" /> Disburse Current Salary
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
