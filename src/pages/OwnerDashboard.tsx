import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { BackgroundOrbs } from "../components/BackgroundOrbs";
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Layers, 
  UserCheck, 
  CreditCard, 
  Palette, 
  LifeBuoy, 
  LogOut, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Menu, 
  X,
  FileSpreadsheet
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Modular Sub-components
import { StudentsModule } from "../components/owner/StudentsModule";
import { TeachersModule } from "../components/owner/TeachersModule";
import { BatchesModule } from "../components/owner/BatchesModule";
import { AttendanceModule } from "../components/owner/AttendanceModule";
import { FeesModule } from "../components/owner/FeesModule";
import { WhiteLabelModule } from "../components/owner/WhiteLabelModule";
import { SupportModule } from "../components/owner/SupportModule";
import { BillingModule } from "../components/owner/BillingModule";
import { CardSkeletonList, ChartSkeleton, SkeletonPulse } from "../components/DashboardSkeleton";

export const OwnerDashboard: React.FC = () => {
  const { userProfile, coaching, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States for stats counting
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [batchesCount, setBatchesCount] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [loading, setLoading] = useState(true);

  // Read coaching metrics in real-time
  useEffect(() => {
    if (!coaching?.coachingId) return;

    // Students count & sum of dues
    const qStudents = query(collection(db, "students"), where("coachingId", "==", coaching.coachingId));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudentsCount(snap.size);
      let dues = 0;
      snap.forEach((doc) => {
        dues += (doc.data().feesDue || 0);
      });
      setPendingFees(dues);
    });

    // Teachers count
    const qTeachers = query(collection(db, "teachers"), where("coachingId", "==", coaching.coachingId));
    const unsubTeachers = onSnapshot(qTeachers, (snap) => {
      setTeachersCount(snap.size);
    });

    // Batches count
    const qBatches = query(collection(db, "batches"), where("coachingId", "==", coaching.coachingId));
    const unsubBatches = onSnapshot(qBatches, (snap) => {
      setBatchesCount(snap.size);
      setLoading(false);
    });

    return () => {
      unsubStudents();
      unsubTeachers();
      unsubBatches();
    };
  }, [coaching?.coachingId]);

  // Sidebar list
  const sidebarItems = [
    { id: "dashboard", label: "Overview Metrics", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "students", label: "Students Directory", icon: <Users className="h-5 w-5" /> },
    { id: "teachers", label: "Faculty roster", icon: <ShieldAlert className="h-5 w-5" /> },
    { id: "batches", label: "Academic Batches", icon: <Layers className="h-5 w-5" /> },
    { id: "attendance", label: "Attendance Logs", icon: <UserCheck className="h-5 w-5" /> },
    { id: "fees", label: "Tuition Dues", icon: <CreditCard className="h-5 w-5" /> },
    { id: "whitelabel", label: "White Label Setup", icon: <Palette className="h-5 w-5" /> },
    { id: "billing", label: "Billing & Plans", icon: <DollarSign className="h-5 w-5" /> },
    { id: "support", label: "Support Desk", icon: <LifeBuoy className="h-5 w-5" /> }
  ];

  // Dynamic Whitelabel styles falling back to indigo
  const primaryBrandBg = coaching?.primaryColor || "#0f172a";
  const secondaryBrandText = coaching?.secondaryColor || "#3b82f6";

  const chartData = [
    { name: "Batches", count: batchesCount || 4 },
    { name: "Faculty", count: teachersCount || 2 },
    { name: "Students", count: studentsCount || 25 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      {/* Frosted Background Orbs */}
      <BackgroundOrbs />
      
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/20 dark:border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primaryBrandBg }}
          >
            {coaching?.name?.slice(0, 1).toUpperCase() || "C"}
          </div>
          <span className="font-display font-bold text-slate-800 dark:text-white text-sm">
            {coaching?.name || "CoachingOS"}
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar navigation panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/20 dark:border-white/10 p-4 flex flex-col justify-between transform transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-6">
          
          {/* Logo & brand banner */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10 dark:border-white/10">
            <div 
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm"
              style={{ backgroundColor: primaryBrandBg }}
            >
              {coaching?.name?.slice(0, 1).toUpperCase() || "C"}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Coaching Studio</span>
              <span className="block font-display font-extrabold text-slate-800 dark:text-white leading-none truncate">
                {coaching?.name || "CoachingOS"}
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/30 dark:bg-white/10 shadow-sm border border-white/20 dark:border-white/5 text-slate-950 dark:text-white"
                      : "text-slate-600 hover:bg-white/20 dark:text-slate-400 dark:hover:bg-white/5"
                  }`}
                  style={isActive ? { color: secondaryBrandText, borderLeft: `3px solid ${secondaryBrandText}` } : {}}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* User profile section & sign out */}
        <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/10">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs uppercase">
              {userProfile?.name?.slice(0, 2) || "OW"}
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{userProfile?.name || "Coaching Owner"}</span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-450 font-semibold">{userProfile?.email}</span>
            </div>
          </div>
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-650 dark:text-rose-450 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 rounded-xl transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Main Workspace Panel */}
      <main className="flex-grow p-5 sm:p-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1')} Module
              </h1>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">
                Academic Session: <strong className="text-slate-700 dark:text-slate-300">{coaching?.academicSession || "2026-2027"}</strong> &bull; Node Sync ACTIVE
              </p>
            </div>
            
            {/* Status trial pill */}
            <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-white/20 dark:border-indigo-850 rounded-2xl flex items-center gap-3 self-start sm:self-auto backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="text-[10px] sm:text-xs">
                <span className="block font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Subscription: {coaching?.subscription?.status || "trial"}
                </span>
                <span className="text-slate-500 font-semibold">
                  Ends on: {coaching?.subscription?.endsAt ? new Date(coaching.subscription.endsAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "dashboard" && (
            loading ? (
              <div className="space-y-8 animate-fade-in">
                {/* Stats card skeleton grid */}
                <CardSkeletonList count={4} />

                {/* Chart & Notification skeleton block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ChartSkeleton />
                  </div>
                  <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <SkeletonPulse className="h-5 w-1/2 rounded-full" />
                        <SkeletonPulse className="h-3 w-3/4 rounded-full" />
                      </div>
                      <div className="p-5 bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl space-y-3">
                        <SkeletonPulse className="h-3.5 w-1/3 rounded-full" />
                        <SkeletonPulse className="h-4.5 w-2/3 rounded-full" />
                        <SkeletonPulse className="h-10 w-full rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Stats card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
                      <span className="block font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                        {studentsCount}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Leads</span>
                      <span className="block font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                        {teachersCount}
                      </span>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Batches</span>
                      <span className="block font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                        {batchesCount}
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                      <Layers className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
                      <span className="block font-display font-extrabold text-2xl text-rose-500">
                        ${pendingFees}
                      </span>
                    </div>
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>

                </div>

                {/* Chart section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-6">Academy Metrics Overview</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                          <Bar dataKey="count" fill={secondaryBrandText} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Active Notifications</h3>
                      <p className="text-xs text-slate-400 font-medium leading-normal">Important messages or alerts concerning your White-Label SaaS tenancy.</p>
                      
                      <div className="p-4 bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl text-xs font-semibold space-y-1">
                        <span className="text-[10px] uppercase text-indigo-500 font-bold block">Notice bulletin</span>
                        <strong className="text-slate-800 dark:text-slate-200 block">JEE Main Prep exams started</strong>
                        <p className="text-slate-500 font-medium">Coordinate timings and syllabi through the Academic Batches portal.</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )
          )}

          {/* TAB 2: STUDENTS DIRECTORY */}
          {activeTab === "students" && coaching?.coachingId && (
            <StudentsModule coachingId={coaching.coachingId} />
          )}

          {/* TAB 3: FACULTY ROSTER */}
          {activeTab === "teachers" && coaching?.coachingId && (
            <TeachersModule coachingId={coaching.coachingId} />
          )}

          {/* TAB 4: ACADEMIC BATCHES */}
          {activeTab === "batches" && coaching?.coachingId && (
            <BatchesModule coachingId={coaching.coachingId} />
          )}

          {/* TAB 5: ATTENDANCE LOGS */}
          {activeTab === "attendance" && coaching?.coachingId && (
            <AttendanceModule coachingId={coaching.coachingId} />
          )}

          {/* TAB 6: TUITION DUES */}
          {activeTab === "fees" && coaching?.coachingId && (
            <FeesModule coachingId={coaching.coachingId} />
          )}

          {/* TAB 7: WHITE LABEL BRAND SETUP */}
          {activeTab === "whitelabel" && coaching && (
            <WhiteLabelModule coaching={coaching} />
          )}

          {/* TAB 8: HELP TICKET DESK */}
          {activeTab === "support" && coaching && userProfile && (
            <SupportModule 
              coaching={coaching} 
              ownerId={userProfile.uid} 
              ownerName={userProfile.name} 
            />
          )}

          {/* TAB 9: BILLING & PLANS */}
          {activeTab === "billing" && coaching && userProfile && (
            <BillingModule 
              coaching={coaching} 
              userProfile={userProfile} 
            />
          )}

        </div>
      </main>

    </div>
  );
};
