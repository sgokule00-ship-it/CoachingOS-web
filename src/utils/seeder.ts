import { doc, writeBatch, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export const seedCoachingData = async (coachingId: string, ownerId: string) => {
  const batch = writeBatch(db);

  // 1. Teachers
  const teachers = [
    { id: "t_1", name: "Dr. Alok Verma", email: "alok.verma@example.com", mobile: "9876543210", subject: "Mathematics", salary: 45000, joiningDate: "2025-01-10", status: "active" },
    { id: "t_2", name: "Prof. Sarah Smith", email: "sarah.smith@example.com", mobile: "9876543211", subject: "Physics", salary: 42000, joiningDate: "2025-02-15", status: "active" },
    { id: "t_3", name: "Ravi Kumar", email: "ravi.kumar@example.com", mobile: "9876543212", subject: "Chemistry", salary: 38000, joiningDate: "2025-03-20", status: "active" }
  ];

  teachers.forEach((t) => {
    const docRef = doc(db, "teachers", `${coachingId}_${t.id}`);
    batch.set(docRef, {
      ...t,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 2. Batches
  const batches = [
    { id: "b_1", name: "Class XII - Math Pioneers", course: "Mathematics JEE", timing: "04:00 PM - 05:30 PM", teacherId: `${coachingId}_t_1`, status: "active" },
    { id: "b_2", name: "Class XI - Quantum Physics", course: "Physics NEET", timing: "02:30 PM - 04:00 PM", teacherId: `${coachingId}_t_2`, status: "active" },
    { id: "b_3", name: "JEE Chemistry Advanced", course: "Chemistry JEE", timing: "05:30 PM - 07:00 PM", teacherId: `${coachingId}_t_3`, status: "active" }
  ];

  batches.forEach((b) => {
    const docRef = doc(db, "batches", `${coachingId}_${b.id}`);
    batch.set(docRef, {
      ...b,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 3. Students
  const students = [
    { id: "s_1", name: "Arjun Mehta", rollNo: "1201", admissionNo: "ADM202601", email: "arjun@example.com", mobile: "9811111111", parentName: "Rajesh Mehta", parentMobile: "9811111112", batchId: `${coachingId}_b_1`, admissionDate: "2026-04-01", feesDue: 5000, status: "active" },
    { id: "s_2", name: "Sneha Patel", rollNo: "1202", admissionNo: "ADM202602", email: "sneha@example.com", mobile: "9822222222", parentName: "Amit Patel", parentMobile: "9822222223", batchId: `${coachingId}_b_1`, admissionDate: "2026-04-02", feesDue: 0, status: "active" },
    { id: "s_3", name: "Rohan Das", rollNo: "1101", admissionNo: "ADM202603", email: "rohan@example.com", mobile: "9833333333", parentName: "Subrata Das", parentMobile: "9833333334", batchId: `${coachingId}_b_2`, admissionDate: "2026-04-05", feesDue: 12000, status: "active" },
    { id: "s_4", name: "Priya Sharma", rollNo: "1102", admissionNo: "ADM202604", email: "priya@example.com", mobile: "9844444444", parentName: "Vijay Sharma", parentMobile: "9844444445", batchId: `${coachingId}_b_2`, admissionDate: "2026-04-06", feesDue: 4500, status: "active" },
    { id: "s_5", name: "Kabir Singh", rollNo: "1203", admissionNo: "ADM202605", email: "kabir@example.com", mobile: "9855555555", parentName: "Jasbir Singh", parentMobile: "9855555556", batchId: `${coachingId}_b_3`, admissionDate: "2026-04-10", feesDue: 0, status: "active" }
  ];

  students.forEach((s) => {
    const docRef = doc(db, "students", `${coachingId}_${s.id}`);
    batch.set(docRef, {
      ...s,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 4. Fee Invoices
  const fees = [
    { id: "f_1", studentId: `${coachingId}_s_1`, amount: 15000, paidAmount: 10000, dueDate: "2026-05-15", status: "partially_paid", paidDate: "2026-05-10", paymentMethod: "UPI", academicSession: "2026-2027" },
    { id: "f_2", studentId: `${coachingId}_s_2`, amount: 15000, paidAmount: 15000, dueDate: "2026-05-15", status: "paid", paidDate: "2026-05-12", paymentMethod: "Cash", academicSession: "2026-2027" },
    { id: "f_3", studentId: `${coachingId}_s_3`, amount: 12000, paidAmount: 0, dueDate: "2026-06-15", status: "pending", academicSession: "2026-2027" },
    { id: "f_4", studentId: `${coachingId}_s_4`, amount: 12000, paidAmount: 7500, dueDate: "2026-06-15", status: "partially_paid", paidDate: "2026-06-12", paymentMethod: "Card", academicSession: "2026-2027" },
    { id: "f_5", studentId: `${coachingId}_s_5`, amount: 18000, paidAmount: 18000, dueDate: "2026-05-20", status: "paid", paidDate: "2026-05-18", paymentMethod: "NetBanking", academicSession: "2026-2027" }
  ];

  fees.forEach((f) => {
    const docRef = doc(db, "fees", `${coachingId}_${f.id}`);
    batch.set(docRef, {
      ...f,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 5. Attendance (Yesterday & Today)
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const attendanceRecords = [
    {
      id: "att_1",
      date: yesterdayStr,
      batchId: `${coachingId}_b_1`,
      records: {
        [`${coachingId}_s_1`]: "present",
        [`${coachingId}_s_2`]: "present"
      }
    },
    {
      id: "att_2",
      date: yesterdayStr,
      batchId: `${coachingId}_b_2`,
      records: {
        [`${coachingId}_s_3`]: "absent",
        [`${coachingId}_s_4`]: "present"
      }
    },
    {
      id: "att_3",
      date: todayStr,
      batchId: `${coachingId}_b_1`,
      records: {
        [`${coachingId}_s_1`]: "present",
        [`${coachingId}_s_2`]: "late"
      }
    }
  ];

  attendanceRecords.forEach((a) => {
    const docRef = doc(db, "attendance", `${coachingId}_${a.id}`);
    batch.set(docRef, {
      ...a,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 6. Timetable
  const timetable = [
    { id: "tt_1", batchId: `${coachingId}_b_1`, dayOfWeek: "Monday", startTime: "16:00", endTime: "17:30", subject: "JEE Math Advanced", teacherId: `${coachingId}_t_1`, room: "Room 101" },
    { id: "tt_2", batchId: `${coachingId}_b_1`, dayOfWeek: "Wednesday", startTime: "16:00", endTime: "17:30", subject: "JEE Math Advanced", teacherId: `${coachingId}_t_1`, room: "Room 101" },
    { id: "tt_3", batchId: `${coachingId}_b_2`, dayOfWeek: "Tuesday", startTime: "14:30", endTime: "16:00", subject: "Physics NEET Foundation", teacherId: `${coachingId}_t_2`, room: "Room 102" },
    { id: "tt_4", batchId: `${coachingId}_b_2`, dayOfWeek: "Thursday", startTime: "14:30", endTime: "16:00", subject: "Physics NEET Foundation", teacherId: `${coachingId}_t_2`, room: "Room 102" },
    { id: "tt_5", batchId: `${coachingId}_b_3`, dayOfWeek: "Friday", startTime: "17:30", endTime: "19:00", subject: "Chemistry Advanced", teacherId: `${coachingId}_t_3`, room: "Lab A" }
  ];

  timetable.forEach((tt) => {
    const docRef = doc(db, "timetable", `${coachingId}_${tt.id}`);
    batch.set(docRef, {
      ...tt,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 7. Homework
  const homework = [
    { id: "hw_1", batchId: `${coachingId}_b_1`, title: "Calculus Limits Sheet 1", description: "Solve questions 1 to 25 from the JEE Mains limit practice PDF.", dueDate: "2026-07-05", teacherId: `${coachingId}_t_1` },
    { id: "hw_2", batchId: `${coachingId}_b_2`, title: "Rotational Dynamics Prep", description: "Read Chapter 5 from HC Verma and solve objective questions.", dueDate: "2026-07-08", teacherId: `${coachingId}_t_2` }
  ];

  homework.forEach((hw) => {
    const docRef = doc(db, "homework", `${coachingId}_${hw.id}`);
    batch.set(docRef, {
      ...hw,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 8. Study Material
  const studyMaterials = [
    { id: "sm_1", batchId: `${coachingId}_b_1`, title: "Calculus Quick Formulas Reference", description: "Detailed quick cheat-sheet for all differentiation and limits theorems.", subject: "Mathematics", fileUrl: "https://example.com/materials/math_limits.pdf" },
    { id: "sm_2", batchId: `${coachingId}_b_3`, title: "Organic Chemistry Conversions Map", description: "Complete flow-chart diagram of aliphatic and aromatic conversions.", subject: "Chemistry", fileUrl: "https://example.com/materials/chemistry_conversions.pdf" }
  ];

  studyMaterials.forEach((sm) => {
    const docRef = doc(db, "study_material", `${coachingId}_${sm.id}`);
    batch.set(docRef, {
      ...sm,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 9. Exams
  const exams = [
    { id: "ex_1", batchId: `${coachingId}_b_1`, title: "Monthly JEE Math Test - Limits & Continuity", date: "2026-06-28", maxMarks: 100, subject: "Mathematics" },
    { id: "ex_2", batchId: `${coachingId}_b_2`, title: "NEET Physics Test - Kinematics", date: "2026-06-25", maxMarks: 50, subject: "Physics" }
  ];

  exams.forEach((ex) => {
    const docRef = doc(db, "exams", `${coachingId}_${ex.id}`);
    batch.set(docRef, {
      ...ex,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 10. Results
  const results = [
    { id: "res_1", examId: `${coachingId}_ex_1`, studentId: `${coachingId}_s_1`, marksObtained: 85, remarks: "Excellent problem-solving approach." },
    { id: "res_2", examId: `${coachingId}_ex_1`, studentId: `${coachingId}_s_2`, marksObtained: 92, remarks: "Class topper. Kept it neat." },
    { id: "res_3", examId: `${coachingId}_ex_2`, studentId: `${coachingId}_s_3`, marksObtained: 38, remarks: "Needs practice in graphical vectors." },
    { id: "res_4", examId: `${coachingId}_ex_2`, studentId: `${coachingId}_s_4`, marksObtained: 44, remarks: "Good conceptual clarity." }
  ];

  results.forEach((r) => {
    const docRef = doc(db, "results", `${coachingId}_${r.id}`);
    batch.set(docRef, {
      ...r,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 11. Announcements
  const announcements = [
    { id: "an_1", title: "Guru Purnima Celebration Holiday", content: "Coaching classes will remain closed tomorrow on account of Guru Purnima. Academic schedule resumes Wednesday.", targetAudience: "all", authorId: ownerId },
    { id: "an_2", title: "Syllabus Plan for JEE Mains Phase 1", content: "All teachers are requested to submit their physical and online syllabus completion timelines by end of this week.", targetAudience: "teachers", authorId: ownerId }
  ];

  announcements.forEach((an) => {
    const docRef = doc(db, "announcements", `${coachingId}_${an.id}`);
    batch.set(docRef, {
      ...an,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  // 12. Support Tickets
  const supportTickets = [
    { id: "st_1", ownerId, ownerName: "Owner", coachingName: "Your Coaching Name", title: "Custom domain pointing support", description: "I want to point my custom subdomain to CoachingOS, how can I set up the SSL certificate?", status: "open", category: "White Labeling", replies: [], createdAt: new Date().toISOString() }
  ];

  supportTickets.forEach((st) => {
    const docRef = doc(db, "support_tickets", `${coachingId}_${st.id}`);
    batch.set(docRef, {
      ...st,
      coachingId,
      createdAt: new Date().toISOString()
    });
  });

  await batch.commit();
};
