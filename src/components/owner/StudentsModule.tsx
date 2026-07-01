import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Student, Batch } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, Trash2, Edit2, User, Phone, Calendar, UserCheck, Eye, Filter, Download, Upload, QrCode, Printer, FileText } from "lucide-react";
import { GridSkeleton } from "../DashboardSkeleton";

interface StudentsModuleProps {
  coachingId: string;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtering and extra action states
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState("");
  
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

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast("No student records available to export.", "info");
      return;
    }
    const headers = ["Name", "Roll No", "Admission No", "Email", "Mobile", "Parent Name", "Parent Mobile", "Batch", "Fees Due ($)", "Admission Date", "Status"];
    const rows = filtered.map((s) => {
      const b = batches.find((x) => x.id === s.batchId);
      return [
        s.name,
        s.rollNo,
        s.admissionNo || "",
        s.email || "",
        s.mobile || "",
        s.parentName || "",
        s.parentMobile || "",
        b ? b.name : "Unassigned",
        s.feesDue || 0,
        s.admissionDate || "",
        s.status || "active"
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_directory_${coachingId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("CSV exported successfully!", "success");
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      toast("Please enter or paste CSV lines.", "error");
      return;
    }
    try {
      const lines = bulkText.split("\n");
      let count = 0;
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(",").map(p => p.trim());
        if (parts[0].toLowerCase() === "name" || parts[0].toLowerCase() === "student name") continue;

        if (parts.length >= 2) {
          const name = parts[0];
          const rollNo = parts[1];
          const email = parts[2] || "";
          const mobile = parts[3] || "";
          const parentName = parts[4] || "";
          const parentMobile = parts[5] || "";
          const feesDue = parts[6] ? Number(parts[6]) : 0;
          const batchId = batches[0]?.id || "";

          const studentId = `${coachingId}_s_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          await setDoc(doc(db, "students", studentId), {
            id: studentId,
            coachingId,
            name,
            rollNo,
            admissionNo: `ADM${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`,
            email,
            mobile,
            parentName,
            parentMobile,
            batchId,
            feesDue,
            status: "active",
            admissionDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString()
          });
          count++;
        }
      }
      toast(`Successfully registered ${count} students in batch!`, "success");
      setBulkText("");
      setShowBulkImport(false);
    } catch (e) {
      toast("Failed to parse or save bulk data.", "error");
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNo.includes(searchQuery) || 
                          (s.admissionNo && s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBatch = selectedBatchId ? s.batchId === selectedBatchId : true;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6">
      
      {/* List Header Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Batch Filter dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-450 shrink-0" />
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full sm:w-48 py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-750 dark:text-slate-200"
            >
              <option value="">All Batches (No Filter)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Bulk Import trigger */}
          <button
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Upload className="h-4 w-4 text-slate-450" /> Bulk CSV
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 text-slate-450" /> Export CSV
          </button>

          {/* Add Student Button */}
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm ml-auto"
          >
            <Plus className="h-4 w-4" /> Register Student
          </button>
        </div>
      </div>

      {/* Bulk Import section */}
      {showBulkImport && (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bulk Register Students (CSV format)</h4>
              <p className="text-xs text-slate-500">Provide comma-separated fields. The first row will automatically assign to your default batch.</p>
            </div>
            <button 
              onClick={() => {
                setBulkText("Rahul Sharma,ROLL01,rahul@mail.com,9876543210,Manoj Sharma,9876543211,250\nKiran Verma,ROLL02,kiran@mail.com,9876543220,Sunil Verma,9876543221,400");
              }}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Insert Sample Rows
            </button>
          </div>
          <textarea
            rows={4}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Name,RollNo,Email,Mobile,ParentName,ParentMobile,FeesDue"
            className="w-full p-3 font-mono text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowBulkImport(false)}
              className="px-3 py-1.5 text-xs text-slate-550 border border-slate-200 dark:border-slate-850 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkImport}
              className="px-3.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
            >
              Start Bulk Import
            </button>
          </div>
        </div>
      )}

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
        <GridSkeleton count={6} />
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
                    onClick={() => setSelectedStudent(s)}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-indigo-500 rounded-lg transition-colors"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
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

      {/* Student Profile Dialog Modal with ID Card */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto animate-fade-in relative">
            
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-450 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              &times;
            </button>

            {/* Left Hand: Student File Data */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-blue-500">Academic dossier</span>
                <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-450">ID: {selectedStudent.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Admission Number</span>
                  <strong className="text-sm text-slate-850 dark:text-slate-150">{selectedStudent.admissionNo || "N/A"}</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Roll Number</span>
                  <strong className="text-sm text-slate-850 dark:text-slate-150">{selectedStudent.rollNo}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Parent & Guardian details</h4>
                <div className="space-y-2 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parent Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.parentName || "Unlinked"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parent Phone:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.parentMobile || "N/A"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relation Status:</span>
                    <strong className="text-emerald-500 font-semibold">Connected (Active)</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Enrolment status</h4>
                <div className="space-y-2 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrolled Batch:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {batches.find(b => b.id === selectedStudent.batchId)?.name || "Default Class"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Admission Date:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.admissionDate || "N/A"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dues Outstanding:</span>
                    <strong className="text-rose-500">${selectedStudent.feesDue || 0}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand: High-Fidelity ID Card Graphic */}
            <div className="w-full md:w-72 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
              <div className="w-full max-w-[260px] bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden border border-white/10 flex flex-col justify-between h-[360px]">
                {/* ID Card Brand Background Header */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    C
                  </div>
                  <div>
                    <span className="text-[9px] block text-slate-400 uppercase tracking-widest leading-none">Institute Credential</span>
                    <span className="text-xs font-extrabold text-white">COACHING OS</span>
                  </div>
                </div>

                {/* ID Card Core Body */}
                <div className="flex flex-col items-center py-4 space-y-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow">
                    <div className="h-full w-full bg-slate-900 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-350" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="font-bold text-sm tracking-wide">{selectedStudent.name}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {batches.find(b => b.id === selectedStudent.batchId)?.name || "Apex Scholar"}
                    </span>
                  </div>
                </div>

                {/* ID Card Footer Metadata & QR Code */}
                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div className="space-y-1 text-[9px] text-slate-450">
                    <div>Roll No: <strong className="text-white">{selectedStudent.rollNo}</strong></div>
                    <div>Adm No: <strong className="text-white">{selectedStudent.admissionNo || "ADM0921"}</strong></div>
                    <div className="text-emerald-450 uppercase font-bold tracking-widest text-[8px] mt-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                      Verified
                    </div>
                  </div>

                  {/* Dynamic mock QR Code */}
                  <div className="h-14 w-14 bg-white p-1 rounded-lg flex items-center justify-center shadow-inner shrink-0">
                    <svg className="h-full w-full text-slate-900" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="10" y="10" width="10" height="10" fill="white" />
                      
                      <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="80" y="10" width="10" height="10" fill="white" />

                      <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                      <rect x="10" y="80" width="10" height="10" fill="white" />

                      {/* Random scannable matrix blocks */}
                      <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="50" y="25" width="10" height="10" fill="currentColor" />
                      <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                      <rect x="45" y="45" width="10" height="15" fill="currentColor" />
                      <rect x="75" y="45" width="15" height="10" fill="currentColor" />
                      <rect x="40" y="70" width="10" height="20" fill="currentColor" />
                      <rect x="70" y="80" width="20" height="10" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ID Card utility action */}
              <button 
                onClick={() => {
                  toast("ID Card format prepared for print spooler!", "success");
                }}
                className="w-full max-w-[260px] mt-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="h-3.5 w-3.5" /> Print Credential
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
