import React, { useState, useEffect } from "react";
import { useAuth, generateInstituteCode } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { db } from "../firebase/config";
import { BackgroundOrbs } from "../components/BackgroundOrbs";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query,
  where
} from "firebase/firestore";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  LineChart, 
  LifeBuoy, 
  Flag, 
  Settings, 
  Megaphone, 
  LogOut, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  Plus,
  Globe,
  Menu,
  X
} from "lucide-react";
import { CmsEditor } from "../components/CmsEditor";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

import { CardSkeletonList, TableSkeleton, ChartSkeleton, SkeletonPulse } from "../components/DashboardSkeleton";

export const AdminDashboard: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin stats
  const [coachings, setCoachings] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for Admin actions
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [featureFlags, setFeatureFlags] = useState({
    aiFeatures: true,
    fcmDirect: false,
    customDomain: true,
    trialAutoExtend: false
  });

  // Global settings
  const [systemConfig, setSystemConfig] = useState({
    gatewayUrl: "https://api.coachingos.com",
    maintenanceMode: false,
    maxTrialDays: 14
  });

  // Fetch collections in real-time
  useEffect(() => {
    setLoading(true);
    
    // Listen to Coachings
    const unsubCoachings = onSnapshot(collection(db, "coachings"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setCoachings(list);
    });

    // Listen to Owners
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.role === "owner") {
          list.push({ uid: d.id, ...data });
        }
      });
      setOwners(list);
    });

    // Listen to Support Tickets
    const unsubTickets = onSnapshot(collection(db, "support_tickets"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setTickets(list);
      setLoading(false);
    });

    return () => {
      unsubCoachings();
      unsubUsers();
      unsubTickets();
    };
  }, []);

  // Actions
  const handleExtendTrial = async (coachingId: string) => {
    try {
      const coachingRef = doc(db, "coachings", coachingId);
      const endsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // extend 14 days
      await updateDoc(coachingRef, {
        "subscription.endsAt": endsAt,
        "subscription.status": "trial"
      });
      toast("Trial extended by 14 days successfully!", "success");
    } catch (err) {
      toast("Failed to extend trial.", "error");
    }
  };

  const handleActivateSubscription = async (coachingId: string) => {
    try {
      const coachingRef = doc(db, "coachings", coachingId);
      const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days active
      await updateDoc(coachingRef, {
        "subscription.status": "active",
        "subscription.endsAt": endsAt,
        "subscription.plan": "CoachingOS Pro"
      });
      toast("Subscription activated for 30 days!", "success");
    } catch (err) {
      toast("Failed to activate subscription.", "error");
    }
  };

  const handleRegenerateCode = async (coachingId: string) => {
    try {
      const code = await generateInstituteCode();
      const coachingRef = doc(db, "coachings", coachingId);
      await updateDoc(coachingRef, {
        instituteCode: code
      });
      toast(`Institute Code regenerated to: ${code}`, "success");
    } catch (err) {
      toast("Failed to regenerate Institute Code.", "error");
    }
  };

  const handleSendGlobalNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) {
      toast("Please enter both title and content.", "error");
      return;
    }
    try {
      // Send notice to 'announcements' for all coachings
      // In multi-tenant, we can push a global alert or write to an administrative collection 'global_notices'
      const globalNoticeId = `global_${Date.now()}`;
      await setDoc(doc(db, "global_notices", globalNoticeId), {
        id: globalNoticeId,
        title: newNotice.title,
        content: newNotice.content,
        createdAt: new Date().toISOString(),
        authorName: "Super Admin"
      });
      toast("Global notification broadcasted to all tenants!", "success");
      setNewNotice({ title: "", content: "" });
    } catch (err) {
      toast("Failed to broadcast global notification.", "error");
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !selectedTicket) return;

    try {
      const ticketRef = doc(db, "support_tickets", selectedTicket.id);
      const updatedReplies = [
        ...(selectedTicket.replies || []),
        {
          id: `rep_${Date.now()}`,
          authorName: "Super Admin",
          authorRole: "super_admin",
          message: ticketReply,
          createdAt: new Date().toISOString()
        }
      ];

      await updateDoc(ticketRef, {
        replies: updatedReplies,
        status: "in_progress"
      });

      setSelectedTicket({
        ...selectedTicket,
        replies: updatedReplies,
        status: "in_progress"
      });
      setTicketReply("");
      toast("Reply submitted successfully!", "success");
    } catch (err) {
      toast("Failed to submit reply.", "error");
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      const ticketRef = doc(db, "support_tickets", ticketId);
      await updateDoc(ticketRef, { status: "resolved" });
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: "resolved" });
      }
      toast("Ticket marked as resolved!", "success");
    } catch (err) {
      toast("Failed to resolve ticket.", "error");
    }
  };

  // Stats computation for Admin dashboard
  const activeTrials = coachings.filter((c) => c.subscription?.status === "trial").length;
  const activeSubs = coachings.filter((c) => c.subscription?.status === "active").length;
  const expiredSubs = coachings.filter((c) => c.subscription?.status === "expired").length;
  const totalRevenue = activeSubs * 999; // Estimate based on Pro plan (₹999)

  const revenueData = [
    { name: "Jan", revenue: 2400 },
    { name: "Feb", revenue: 3800 },
    { name: "Mar", revenue: 4200 },
    { name: "Apr", revenue: 5100 },
    { name: "May", revenue: 5900 },
    { name: "Jun", revenue: totalRevenue || 6200 }
  ];

  const subTypeData = [
    { name: "Trials", value: activeTrials || 4, color: "#3b82f6" },
    { name: "Paid Active", value: activeSubs || 2, color: "#10b981" },
    { name: "Expired", value: expiredSubs || 1, color: "#ef4444" }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "coachings", label: "Coachings", icon: <Building2 className="h-5 w-5" /> },
    { id: "owners", label: "Owners Profile", icon: <Users className="h-5 w-5" /> },
    { id: "revenue", label: "Revenue & Subs", icon: <CreditCard className="h-5 w-5" /> },
    { id: "support", label: "Support Tickets", icon: <LifeBuoy className="h-5 w-5" /> },
    { id: "websiteCms", label: "Website CMS", icon: <Globe className="h-5 w-5" /> },
    { id: "flags", label: "Feature Flags", icon: <Flag className="h-5 w-5" /> },
    { id: "settings", label: "System Settings", icon: <Settings className="h-5 w-5" /> },
    { id: "broadcast", label: "Global Notices", icon: <Megaphone className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      {/* Frosted Background Orbs */}
      <BackgroundOrbs />
      
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/20 dark:border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-slate-800 dark:text-white text-sm">
            CoachingOS Admin
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/20 dark:border-white/10 p-4 flex flex-col justify-between transform transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-6">
          {/* Admin Tag */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10 dark:border-white/10">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-indigo-500 uppercase">Super Admin</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">CoachingOS Core</span>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "support") setSelectedTicket(null);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-white/30 dark:bg-white/10 shadow-sm border border-white/20 dark:border-white/5 text-indigo-700 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-white/20 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-650 dark:text-rose-450 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-5 sm:p-8 overflow-y-auto relative z-10">
        {loading ? (
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header Title skeleton */}
            <div className="space-y-2">
              <SkeletonPulse className="h-8 w-64 rounded-full" />
              <SkeletonPulse className="h-4 w-40 rounded-full" />
            </div>

            {/* Stats Cards Row skeleton */}
            <CardSkeletonList count={4} />

            {/* Main content grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TableSkeleton rows={4} cols={5} />
              </div>
              <div>
                <ChartSkeleton />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Title */}
            <div>
              <h1 className="font-display font-extrabold text-3xl text-slate-950 dark:text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1')} Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">
                Active Database Node: <span className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">long-wind-w0bnn</span>
              </p>
            </div>

            {/* TAB CONTENT: 1. DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Total Coachings</span>
                      <span className="block font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                        {coachings.length}
                      </span>
                    </div>
                    <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Active Trials</span>
                      <span className="block font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                        {activeTrials}
                      </span>
                    </div>
                    <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Paid Active</span>
                      <span className="block font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                        {activeSubs}
                      </span>
                    </div>
                    <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Monthly Revenue</span>
                      <span className="block font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                        ${totalRevenue || 158}
                      </span>
                    </div>
                    <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>

                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Revenue Chart */}
                  <div className="lg:col-span-8 glass-card p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" /> Revenue Growth (USD)
                      </h3>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                          <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart of Plans */}
                  <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-6">Subscription Breakdown</h3>
                      <div className="h-44 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={subTypeData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {subTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                      {subTypeData.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                          <span className="flex items-center gap-2 text-slate-500">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.name}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Urgent support tickets */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <LifeBuoy className="h-5 w-5 text-rose-500" /> Pending Support Tickets
                  </h3>
                  <div className="space-y-3">
                    {tickets.filter(t => t.status !== "resolved").length === 0 ? (
                      <p className="text-sm text-slate-500">All support tickets have been fully resolved.</p>
                    ) : (
                      tickets.filter(t => t.status !== "resolved").map((t) => (
                        <div 
                          key={t.id} 
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-slate-200 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTicket(t);
                            setActiveTab("support");
                          }}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.title}</span>
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">{t.status}</span>
                            </div>
                            <p className="text-xs text-slate-450">Coaching: {t.coachingName} &bull; Category: {t.category}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: WEBSITE CMS */}
            {activeTab === "websiteCms" && (
              <CmsEditor />
            )}

            {/* TAB CONTENT: 2. COACHINGS LIST */}
            {activeTab === "coachings" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="py-4 font-bold">Coaching Name</th>
                        <th className="py-4 font-bold">Location</th>
                        <th className="py-4 font-bold">Session</th>
                        <th className="py-4 font-bold">Institute Code</th>
                        <th className="py-4 font-bold">Subscription</th>
                        <th className="py-4 font-bold">Expiry</th>
                        <th className="py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm font-medium">
                      {coachings.map((c) => (
                        <tr key={c.id}>
                          <td className="py-4 text-slate-900 dark:text-white font-bold flex flex-col">
                            {c.name}
                            <span className="text-xs text-slate-400 font-mono font-medium">{c.coachingId}</span>
                          </td>
                          <td className="py-4 text-slate-600 dark:text-slate-350">{c.city}, {c.state}</td>
                          <td className="py-4 text-slate-600 dark:text-slate-350">{c.academicSession}</td>
                          <td className="py-4 font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wider text-xs">{c.instituteCode || "N/A"}</td>
                          <td className="py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                              c.subscription?.status === "active" 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : c.subscription?.status === "trial"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                                : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                            }`}>
                              {c.subscription?.status || "trial"}
                            </span>
                          </td>
                          <td className="py-4 text-xs font-mono text-slate-400">
                            {c.subscription?.endsAt ? new Date(c.subscription.endsAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleRegenerateCode(c.id)}
                                className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-650 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900 rounded border border-indigo-200 font-bold"
                              >
                                Regenerate Code
                              </button>
                              <button
                                onClick={() => handleExtendTrial(c.id)}
                                className="px-2.5 py-1 text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 rounded border border-amber-200 font-bold"
                              >
                                Extend Trial
                              </button>
                              <button
                                onClick={() => handleActivateSubscription(c.id)}
                                className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded border border-emerald-200 font-bold"
                              >
                                Activate Paid
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. OWNERS LIST */}
            {activeTab === "owners" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="py-4 font-bold">Owner Name</th>
                        <th className="py-4 font-bold">Email Address</th>
                        <th className="py-4 font-bold">Mobile Number</th>
                        <th className="py-4 font-bold">Linked Coaching</th>
                        <th className="py-4 font-bold font-mono text-right">Registered On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm font-medium">
                      {owners.map((o) => {
                        const matchedCoaching = coachings.find((c) => c.coachingId === o.coachingId);
                        return (
                          <tr key={o.uid}>
                            <td className="py-4 text-slate-900 dark:text-white font-bold">{o.name}</td>
                            <td className="py-4 font-semibold text-slate-600 dark:text-slate-350">{o.email}</td>
                            <td className="py-4 text-slate-600 dark:text-slate-350">{o.mobile || "N/A"}</td>
                            <td className="py-4 text-slate-900 dark:text-slate-250 font-bold">
                              {matchedCoaching?.name || "Apex Academy"}
                            </td>
                            <td className="py-4 text-right text-xs font-mono text-slate-400">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. REVENUE & SUBS */}
            {activeTab === "revenue" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Subscription management ledger */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-6">Subscriptions Ledger</h3>
                  <div className="space-y-4">
                    {coachings.map((c) => (
                      <div key={c.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="block text-slate-800 dark:text-slate-200">{c.name}</strong>
                          <span className="text-xs text-slate-400 font-semibold font-mono">Plan: {c.subscription?.plan || "Trial Plan"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            c.subscription?.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {c.subscription?.status}
                          </span>
                          <span className="text-xs font-mono text-slate-450">{new Date(c.subscription?.endsAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub rates */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Pricing Configuration</h3>
                    <p className="text-sm text-slate-500 mb-6">Global plan costs applied across the White-label SaaS architecture.</p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-850">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">CoachingOS Pro</span>
                          <span className="text-sm font-extrabold text-blue-500">₹999/month</span>
                        </div>
                        <span className="text-xs text-slate-400">Includes white-label branding, unlimited directories, mobile app access, and multi-user support modules.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 5. SUPPORT TICKETS */}
            {activeTab === "support" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Tickets list */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">Active Support Tickets</h3>
                  
                  <div className="space-y-3">
                    {tickets.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-6">No support tickets found.</p>
                    ) : (
                      tickets.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTicket(t)}
                          className={`w-full text-left p-4 rounded-xl border transition-colors ${
                            selectedTicket?.id === t.id
                              ? "bg-indigo-50/50 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800"
                              : "bg-slate-50 dark:bg-slate-850 border-slate-150 hover:border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <strong className="block text-sm text-slate-800 dark:text-slate-200">{t.title}</strong>
                            <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                              t.status === "resolved" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-500/20" 
                                : t.status === "open"
                                ? "bg-rose-50 text-rose-600 border-rose-500/20"
                                : "bg-amber-50 text-amber-600 border-amber-500/20"
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <span className="block text-xs text-slate-450 mt-1">From: {t.coachingName} ({t.category})</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected Ticket details panel */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm">
                  {selectedTicket ? (
                    <div className="space-y-6">
                      
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{selectedTicket.title}</h3>
                          <span className="text-xs text-slate-400">
                            Category: {selectedTicket.category} &bull; Date: {new Date(selectedTicket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedTicket.status !== "resolved" && (
                          <button
                            onClick={() => handleResolveTicket(selectedTicket.id)}
                            className="px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg font-bold border border-emerald-200"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>

                      {/* Ticket Description */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-800">
                        <span className="block text-xs font-bold text-slate-400 mb-1">TICKET DESCRIPTION:</span>
                        <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed">{selectedTicket.description}</p>
                      </div>

                      {/* Conversation thread */}
                      <div className="space-y-4">
                        <span className="block text-xs font-bold text-slate-400">CONVERSATION LOGS:</span>
                        
                        {(selectedTicket.replies || []).length === 0 ? (
                          <p className="text-xs text-slate-500">No replies written yet. Use form below to write.</p>
                        ) : (
                          (selectedTicket.replies || []).map((rep: any) => (
                            <div 
                              key={rep.id} 
                              className={`p-3.5 rounded-xl border text-sm max-w-lg ${
                                rep.authorRole === "super_admin"
                                  ? "ml-auto bg-indigo-50 dark:bg-indigo-950/20 border-indigo-150 dark:border-indigo-850"
                                  : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              <div className="flex justify-between items-center text-xs text-slate-500 mb-1 font-semibold">
                                <span>{rep.authorName} ({rep.authorRole === "super_admin" ? "Admin" : "Owner"})</span>
                                <span className="font-mono text-[10px]">{new Date(rep.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-slate-850 dark:text-slate-250 font-medium leading-relaxed">{rep.message}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Ticket Response form */}
                      {selectedTicket.status !== "resolved" ? (
                        <form onSubmit={handleReplyTicket} className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                          <textarea
                            rows={3}
                            required
                            value={ticketReply}
                            onChange={(e) => setTicketReply(e.target.value)}
                            placeholder="Write your system reply response..."
                            className="w-full p-3.5 text-sm border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow"
                          >
                            <MessageSquare className="h-4 w-4" /> Reply response
                          </button>
                        </form>
                      ) : (
                        <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl text-center text-xs font-semibold">
                          This ticket is resolved. Reopen to reply.
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500 space-y-2">
                      <LifeBuoy className="h-10 w-10 text-slate-350 mx-auto" />
                      <p className="text-sm">Select an active support ticket from the side column to compose reply responses.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: 6. FEATURE FLAGS */}
            {activeTab === "flags" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Feature Flag Controls</h3>
                  <p className="text-sm text-slate-500">Enable or disable experimental features instantly across the CoachingOS network nodes.</p>
                </div>

                <hr className="border-slate-100 dark:border-slate-850" />

                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-sm text-slate-800 dark:text-slate-200">Gemini AI Auto-Summaries</strong>
                      <span className="text-xs text-slate-450">Toggles the AI summary engine inside result analysis tools.</span>
                    </div>
                    <button
                      onClick={() => setFeatureFlags({ ...featureFlags, aiFeatures: !featureFlags.aiFeatures })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${featureFlags.aiFeatures ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-800"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${featureFlags.aiFeatures ? "translate-x-6" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-sm text-slate-800 dark:text-slate-200">FCM Direct Push</strong>
                      <span className="text-xs text-slate-450">Triggers instantaneous mobile push alerts when attendance or homework is logged.</span>
                    </div>
                    <button
                      onClick={() => setFeatureFlags({ ...featureFlags, fcmDirect: !featureFlags.fcmDirect })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${featureFlags.fcmDirect ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-800"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${featureFlags.fcmDirect ? "translate-x-6" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-sm text-slate-800 dark:text-slate-200">Custom Domain Mapping</strong>
                      <span className="text-xs text-slate-450">Enables owners to bind a custom subdomain (e.g. academy.coachingos.app).</span>
                    </div>
                    <button
                      onClick={() => setFeatureFlags({ ...featureFlags, customDomain: !featureFlags.customDomain })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${featureFlags.customDomain ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-800"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${featureFlags.customDomain ? "translate-x-6" : ""}`} />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT: 7. SYSTEM SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">System Settings</h3>
                  <p className="text-sm text-slate-500">Edit core parameters coordinates of the global cloud hosting framework.</p>
                </div>

                <hr className="border-slate-100 dark:border-slate-850" />

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Core API Gateway Node</label>
                    <input
                      type="text"
                      value={systemConfig.gatewayUrl}
                      onChange={(e) => setSystemConfig({ ...systemConfig, gatewayUrl: e.target.value })}
                      className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Default Trial Duration (Days)</label>
                      <input
                        type="number"
                        value={systemConfig.maxTrialDays}
                        onChange={(e) => setSystemConfig({ ...systemConfig, maxTrialDays: parseInt(e.target.value) || 14 })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Maintenance Mode</label>
                      <select
                        value={systemConfig.maintenanceMode ? "yes" : "no"}
                        onChange={(e) => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.value === "yes" })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="no">Disabled (Active)</option>
                        <option value="yes">Enabled (Maintenance)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => toast("System configuration updated successfully!", "success")}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md"
                  >
                    Save configuration
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 8. GLOBAL NOTICES */}
            {activeTab === "broadcast" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 max-w-2xl">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-indigo-500" /> Broadcast Global Notice
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Dispatches an administrative notice bulletin mapped to all sub-tenants instantly.</p>
                </div>

                <hr className="border-slate-100 dark:border-slate-850 my-6" />

                <form onSubmit={handleSendGlobalNotice} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Notice Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scheduled Core Platform Upgrade"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Notice Body Content</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write core notice update..."
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Megaphone className="h-4 w-4" /> Broadcast notice bulletin
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </main>

    </div>
  );
};
