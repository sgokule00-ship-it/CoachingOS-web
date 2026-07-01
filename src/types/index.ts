export type UserRole = "super_admin" | "owner" | "teacher" | "student" | "parent";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  coachingId: string | null; // null for super_admin
  createdAt: string;
  emailVerified?: boolean;
}

export interface Coaching {
  coachingId: string;
  instituteCode?: string;
  name: string;
  city: string;
  state: string;
  ownerId: string;
  logoUrl?: string;
  primaryColor?: string; // in hex, e.g., "#0f172a"
  secondaryColor?: string; // in hex, e.g., "#3b82f6"
  websiteTitle?: string;
  contactDetails?: string;
  address?: string;
  createdAt: string;
  subscription: {
    status: "trial" | "active" | "expired";
    endsAt: string;
    plan: string;
  };
  academicSession: string;
}

export interface Student {
  id: string;
  coachingId: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  email: string;
  mobile: string;
  parentName: string;
  parentMobile: string;
  batchId: string;
  admissionDate: string;
  feesDue: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Teacher {
  id: string;
  coachingId: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  salary: number;
  joiningDate: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Parent {
  id: string;
  coachingId: string;
  name: string;
  email: string;
  mobile: string;
  studentIds: string[]; // references to Student id
  createdAt: string;
}

export interface Batch {
  id: string;
  coachingId: string;
  name: string;
  course: string;
  timing: string;
  teacherId: string; // references Teacher id
  status: "active" | "inactive";
  createdAt: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: "present" | "absent" | "late";
}

export interface Attendance {
  id: string;
  coachingId: string;
  date: string; // YYYY-MM-DD
  batchId: string;
  records: Record<string, "present" | "absent" | "late">; // studentId -> status
  createdAt: string;
}

export interface TimetableEntry {
  id: string;
  coachingId: string;
  batchId: string;
  dayOfWeek: string; // Monday, Tuesday, etc.
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  subject: string;
  teacherId: string;
  room: string;
}

export interface FeeInvoice {
  id: string;
  coachingId: string;
  studentId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "paid" | "pending" | "partially_paid";
  paidDate?: string;
  paymentMethod?: string;
  academicSession: string;
  createdAt: string;
}

export interface Homework {
  id: string;
  coachingId: string;
  batchId: string;
  title: string;
  description: string;
  dueDate: string;
  teacherId: string;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  coachingId: string;
  batchId: string;
  title: string;
  description: string;
  fileUrl?: string;
  subject: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  coachingId: string;
  batchId: string;
  title: string;
  date: string;
  maxMarks: number;
  subject: string;
  createdAt: string;
}

export interface Result {
  id: string;
  coachingId: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  remarks?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  coachingId: string;
  title: string;
  content: string;
  targetAudience: "all" | "students" | "teachers" | "parents";
  createdAt: string;
  authorId: string;
}

export interface SupportTicket {
  id: string;
  coachingId: string;
  ownerId: string;
  ownerName: string;
  coachingName: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  category: string;
  createdAt: string;
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    message: string;
    createdAt: string;
  }>;
}
