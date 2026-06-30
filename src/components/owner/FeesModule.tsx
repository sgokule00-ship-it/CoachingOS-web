import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Student, FeeInvoice } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Search, DollarSign, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";

interface FeesModuleProps {
  coachingId: string;
}

export const FeesModule: React.FC<FeesModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Invoice creator state
  const [showCreator, setShowCreator] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    amount: 0,
    dueDate: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    // Read students
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
    });

    // Read Fee Invoices
    const feeQuery = query(
      collection(db, "fees"),
      where("coachingId", "==", coachingId)
    );
    const unsubFees = onSnapshot(feeQuery, (snap) => {
      const list: FeeInvoice[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as FeeInvoice);
      });
      setInvoices(list);
      setLoading(false);
    });

    return () => {
      unsubStudents();
      unsubFees();
    };
  }, [coachingId]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || formData.amount <= 0) {
      toast("Please select a student and specify an amount greater than 0.", "error");
      return;
    }

    try {
      const feeId = `fee_${Date.now()}`;
      const docRef = doc(db, "fees", `${coachingId}_${feeId}`);
      
      const payload: FeeInvoice = {
        id: `${coachingId}_${feeId}`,
        coachingId,
        studentId: formData.studentId,
        amount: Number(formData.amount),
        paidAmount: 0,
        dueDate: formData.dueDate,
        status: "pending",
        academicSession: "2026-2027",
        createdAt: new Date().toISOString()
      };

      await setDoc(docRef, payload);
      
      // Update student's feesDue in Firestore
      const studentRef = doc(db, "students", formData.studentId);
      const student = students.find((s) => s.id === formData.studentId);
      if (student) {
        await updateDoc(studentRef, {
          feesDue: (student.feesDue || 0) + Number(formData.amount)
        });
      }

      toast("Fee invoice logged and parent alert dispatched!", "success");
      setShowCreator(false);
      setFormData({ studentId: "", amount: 0, dueDate: new Date().toISOString().split("T")[0] });
    } catch (err) {
      toast("Failed to log fee invoice.", "error");
    }
  };

  const handleRecordPayment = async (inv: FeeInvoice, payAmount: number) => {
    if (payAmount <= 0) return;
    
    try {
      const feeRef = doc(db, "fees", inv.id);
      const studentRef = doc(db, "students", inv.studentId);
      const student = students.find((s) => s.id === inv.studentId);

      const totalPaid = (inv.paidAmount || 0) + payAmount;
      const remains = inv.amount - totalPaid;
      const newStatus = remains <= 0 ? "paid" : "partially_paid";

      await updateDoc(feeRef, {
        paidAmount: totalPaid,
        status: newStatus,
        paidDate: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI"
      });

      // Reduce student's feesDue
      if (student) {
        await updateDoc(studentRef, {
          feesDue: Math.max(0, (student.feesDue || 0) - payAmount)
        });
      }

      toast("Payment recorded and balance synchronized!", "success");
    } catch (err) {
      toast("Failed to log payment.", "error");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matched = students.find((s) => s.id === inv.studentId);
    return matched?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        
        <button
          onClick={() => setShowCreator(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4.5 w-4.5" /> Log Tuition Bill
        </button>
      </div>

      {showCreator && (
        <form onSubmit={handleCreateInvoice} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Student Mapped</label>
            <select
              value={formData.studentId}
              required
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="p-3 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Tuition Invoice Amount ($)</label>
            <input
              type="number"
              required
              min={1}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              placeholder="e.g. 5000"
              className="p-3 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Invoice Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="p-3 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCreator(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Create Tuition Invoice
            </button>
          </div>

        </form>
      )}

      {loading ? (
        <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <ShoppingBag className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm">No tuition fee invoices logged.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => {
            const matchedStudent = students.find((s) => s.id === inv.studentId);
            const remaining = inv.amount - (inv.paidAmount || 0);
            return (
              <div 
                key={inv.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 dark:text-white">
                        {matchedStudent?.name || "Apex Scholar"}
                      </h4>
                      <span className="text-xs text-slate-400">Due: {inv.dueDate}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded ${
                      inv.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : inv.status === "partially_paid"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-850" />

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-semibold grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">Bill Amount</span>
                      <strong className="text-sm text-slate-800 dark:text-slate-200">${inv.amount}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">Paid Amount</span>
                      <strong className="text-sm text-slate-800 dark:text-slate-200">${inv.paidAmount || 0}</strong>
                    </div>
                  </div>
                </div>

                {remaining > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 flex gap-2 justify-between items-center">
                    <span className="text-[11px] font-bold text-rose-500">Unpaid: ${remaining}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRecordPayment(inv, remaining)}
                        className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded border border-emerald-200 text-xs font-bold"
                      >
                        Record Fully Paid
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
