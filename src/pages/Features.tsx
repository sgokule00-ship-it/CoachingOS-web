import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserSquare2, 
  Smartphone, 
  Clock, 
  CreditCard, 
  ClipboardCheck, 
  Layers, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  CheckCircle,
  Megaphone,
  Palette
} from "lucide-react";

export const Features: React.FC = () => {
  const adminFeatures = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Student Directory",
      description: "Manage detailed student dossiers, roll numbers, guardian contact numbers, linked batch rosters, and tuition statuses."
    },
    {
      icon: <UserSquare2 className="h-6 w-6 text-indigo-500" />,
      title: "Teacher Coordination",
      description: "Track teacher profile records, designated subjects, monthly payroll settings, and assigned batches in a single tab."
    },
    {
      icon: <Layers className="h-6 w-6 text-pink-500" />,
      title: "Batch & Course Allocator",
      description: "Establish dedicated physical or online batches. Define course syllabus structures and set individual batch timetables."
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      title: "Interactive Timetables",
      description: "Generate structured class timesheets. Prevent class conflicts by assigning specific rooms and available teachers."
    }
  ];

  const operationalFeatures = [
    {
      icon: <ClipboardCheck className="h-6 w-6 text-emerald-500" />,
      title: "Daily Real-time Attendance",
      description: "Log present, absent, or late states. Sync results with the mobile app so parents are instantly notified on their phones."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-purple-500" />,
      title: "Tuition Fees ledger",
      description: "Create billing invoices, track pending tuition fees, record digital or cash payments, and generate downloadable receipts."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-teal-500" />,
      title: "Homework & Syllabus Tracking",
      description: "Publish homework assignments with custom descriptions and due dates. Deliver study resources (PDF files, slides) to batches."
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-orange-500" />,
      title: "Exams & Results Processor",
      description: "Schedule exams and tests. Enter marks to generate beautiful, mobile-friendly report cards accessible to parents."
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            A Complete Suite of Academic Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            CoachingOS offers a robust multi-tenant platform equipped with every tool needed to coordinate teachers, automate student administration, and streamline billing.
          </p>
        </div>

        {/* Section 1: Core Academic Management */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Core Academic Directory & Rosters
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adminFeatures.map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Daily Operations & Sync */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Daily Operations & Real-time Synchronization
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {operationalFeatures.map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Premium Branding & Notice Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex-shrink-0 text-amber-500">
              <Palette className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Full Whitelabel Customization
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Tailor the experience to match your identity. Choose your own coaching title, specify exact primary/secondary hex color pairings, and upload your custom PNG brand logo to customize your dashboard immediately.
              </p>
              <div className="flex gap-2.5">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-semibold">Custom Logo</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-semibold">Primary Hex Color</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-semibold">Secondary Hex Color</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex-shrink-0 text-blue-500">
              <Megaphone className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Global Announcements System
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Push instantaneous notice bulletins to your academic directory. Filter target audiences so notices go exclusively to teachers, students, or parents, instantly triggering in-app alerts on mobile.
              </p>
              <div className="flex gap-2.5">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-semibold">Audience Filters</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-semibold">FCM Push Sync</span>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-3xl text-center border border-slate-850 flex flex-col items-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
            Experience CoachingOS with Demo Data
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mb-8">
            Create an owner trial account, choose your customized whitelabel themes, and trigger our instant seeder tool to start visualizing charts instantly.
          </p>
          <Link
            to="/register"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all text-base"
          >
            Start Your Free Trial
          </Link>
        </div>

      </div>
    </div>
  );
};
