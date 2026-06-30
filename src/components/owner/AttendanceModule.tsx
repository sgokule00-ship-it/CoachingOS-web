import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Student, Batch, Attendance } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Calendar, CheckCircle2, XCircle, Clock, Save, UserCheck } from "lucide-react";

interface AttendanceModuleProps {
  coachingId: string;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({ coachingId }) => {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, "present" | "absent" | "late">>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load Batches
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
      if (list.length > 0 && !selectedBatchId) {
        setSelectedBatchId(list[0].id);
      }
      setLoading(false);
    });

    return unsubBatches;
  }, [coachingId]);

  // Load students belonging to selected batch
  useEffect(() => {
    if (!selectedBatchId) {
      setStudents([]);
      return;
    }

    const studentQuery = query(
      collection(db, "students"),
      where("coachingId", "==", coachingId),
      where("batchId", "==", selectedBatchId)
    );

    const unsubStudents = onSnapshot(studentQuery, (snap) => {
      const list: Student[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(list);
    });

    return unsubStudents;
  }, [coachingId, selectedBatchId]);

  // Load existing attendance record for selected batch + date
  useEffect(() => {
    if (!selectedBatchId || !selectedDate) return;

    const checkExistingAttendance = async () => {
      const attendanceDocId = `${coachingId}_att_${selectedBatchId}_${selectedDate}`;
      const docRef = doc(db, "attendance", attendanceDocId);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Attendance;
          setAttendanceRecords(data.records || {});
          toast("Loaded existing attendance logs for this day.", "info");
        } else {
          // Initialize with default 'present' for all students
          const initial: Record<string, "present" | "absent" | "late"> = {};
          students.forEach((s) => {
            initial[s.id] = "present";
          });
          setAttendanceRecords(initial);
        }
      } catch (err) {
        console.error("Error loading attendance", err);
      }
    };

    if (students.length > 0) {
      checkExistingAttendance();
    }
  }, [selectedBatchId, selectedDate, students.length]);

  const handleMarkStatus = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatchId) {
      toast("Please select an active academic batch.", "error");
      return;
    }

    const attendanceDocId = `${coachingId}_att_${selectedBatchId}_${selectedDate}`;
    const docRef = doc(db, "attendance", attendanceDocId);

    try {
      const attendancePayload: Attendance = {
        id: attendanceDocId,
        coachingId,
        date: selectedDate,
        batchId: selectedBatchId,
        records: attendanceRecords,
        createdAt: new Date().toISOString()
      };

      await setDoc(docRef, attendancePayload);
      toast("Attendance registered and synchronized successfully!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to register attendance logs.", "error");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Selection Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Select Academic Batch</label>
          <select
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value);
              setAttendanceRecords({});
            }}
            className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Select Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setAttendanceRecords({});
              }}
              className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none"
            />
            <Calendar className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={students.length === 0}
          className="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow"
        >
          <Save className="h-4.5 w-4.5" /> Save Attendance Log
        </button>

      </div>

      {/* Directory of Students */}
      {students.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <UserCheck className="h-10 w-10 mx-auto text-slate-350 mb-2" />
          <p className="text-sm text-slate-500">Please select a batch with registered students to begin logging.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900">
                  <th className="py-4 px-6 font-bold">Roll No</th>
                  <th className="py-4 px-6 font-bold">Student Name</th>
                  <th className="py-4 px-6 font-bold text-center">Mark Attendance State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm font-medium">
                {students.map((s) => {
                  const currentStatus = attendanceRecords[s.id] || "present";
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                      <td className="py-4 px-6 text-slate-400 font-mono font-medium">{s.rollNo}</td>
                      <td className="py-4 px-6 text-slate-900 dark:text-white font-bold">{s.name}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2">
                          
                          <button
                            onClick={() => handleMarkStatus(s.id, "present")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              currentStatus === "present"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Present
                          </button>

                          <button
                            onClick={() => handleMarkStatus(s.id, "absent")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              currentStatus === "absent"
                                ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/20 dark:text-rose-400"
                                : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <XCircle className="h-4 w-4" /> Absent
                          </button>

                          <button
                            onClick={() => handleMarkStatus(s.id, "late")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              currentStatus === "late"
                                ? "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/20 dark:text-amber-400"
                                : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <Clock className="h-4 w-4" /> Late
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
