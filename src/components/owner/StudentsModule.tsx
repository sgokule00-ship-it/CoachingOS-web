import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Student, Batch } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, Trash2, Edit2, User, Phone, Calendar, UserCheck } from "lucide-react";

interface StudentsModuleProps {
  coachingId: string;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    admissionNo: "",
    email: "",
    mobile: "",
    parentName: "",
    parentMobile: "",
    batchId: "",
    feesDue: 0
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    // Read students filtered by coachingId in real-time
    const studentQuery = query(
      collection(db, "students"),
      where("coachingId", "==", coachingId)
    );
    
    const unsubStudents = onSnapshot(studentQuery, (snap) => {
      const list: Student[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(list);
      setLoading(false);
    });

    // Read batches filtered by coachingId
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
      unsubStudents();
      unsubBatches();
    };
  }, [coachingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.batchId) {
      toast("Please provide name, roll number, and batch selection.", "error");
      return;
    }

    try {
      const studentId = editId || `${coachingId}_s_${Date.now()}`;
      const docRef = doc(db, "students", studentId);
      
      const recordData = {
        ...formData,
        id: studentId,
        coachingId,
        feesDue: Number(formData.feesDue),
        status: "active",
        admissionDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      };

      await setDoc(docRef, recordData);
      toast(editId ? "Student updated successfully!" : "Student registered successfully!", "success");
      
      // Reset
      setShowForm(false);
      setEditId(null);
      setFormData({
        name: "",
        rollNo: "",
        admissionNo: `ADM${Date.now().toString().slice(-6)}`,
        email: "",
        mobile: "",
        parentName: "",
        parentMobile: "",
        batchId: "",
        feesDue: 0
      });
    } catch (err) {
      console.error(err);
      toast("Failed to register student record.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast("Student record deleted.", "info");
    } catch (err) {
      toast("Failed to delete record.", "error");
    }
  };

  const handleEdit = (student: Student) => {
    setEditId(student.id);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      admissionNo: student.admissionNo || "",
      email: student.email || "",
      mobile: student.mobile || "",
      parentName: student.parentName || "",
      parentMobile: student.parentMobile || "",
      batchId: student.batchId,
      feesDue: student.feesDue || 0
    });
    setShowForm(true);
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* List Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        
        <button
          onClick={() => {
            setEditId(null);
            setFormData({
              name: "",
              rollNo: "",
              admissionNo: `ADM${Date.now().toString().slice(-6)}`,
              email: "",
              mobile: "",
              parentName: "",
              parentMobile: "",
              batchId: batches[0]?.id || "",
              feesDue: 0
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4.5 w-4.5" /> Register Student
        </button>
      </div>

      {/* Register/Edit Dialog Box */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white mb-4">
            {editId ? "Edit Student File" : "New Student Registration"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Student Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Roll Number</label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Admission No</label>
              <input
                type="text"
                value={formData.admissionNo}
                onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
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
              <label className="text-xs font-semibold text-slate-500">Mobile Number</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Assigned Batch</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Parent / Guardian Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Parent Mobile No</label>
              <input
                type="tel"
                value={formData.parentMobile}
                onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Tuition Fees Due ($)</label>
              <input
                type="number"
                value={formData.feesDue}
                onChange={(e) => setFormData({ ...formData, feesDue: Number(e.target.value) })}
                className="p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                {editId ? "Update File" : "Register Student"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <User className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm">No registered students found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => {
            const currentBatch = batches.find((b) => b.id === s.batchId);
            return (
              <div 
                key={s.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 dark:text-white">{s.name}</h4>
                      <span className="text-xs text-slate-450">Roll No: {s.rollNo} &bull; Adm: {s.admissionNo}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      Active
                    </span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-850" />

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      <span>Batch: <strong className="text-slate-800 dark:text-slate-200">{currentBatch?.name || "Apex XI"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>Parent Mobile: {s.parentMobile || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>Due Fees: <strong className="text-rose-500">${s.feesDue || 0}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-slate-50 dark:border-slate-850">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
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
