import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Smartphone, 
  Database, 
  Palette, 
  ShieldCheck, 
  Users, 
  Calendar, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Zap, 
  FileText, 
  Plus, 
  Minus,
  CheckCircle2
} from "lucide-react";

export const Landing: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "10k+", label: "Active Students" },
    { value: "500+", label: "Coaching Institutes" },
    { value: "99.9%", label: "Real-time Sync Uptime" },
    { value: "100%", label: "Real-time Platform Sync" }
  ];

  const highlights = [
    {
      icon: <Database className="h-6 w-6 text-blue-500" />,
      title: "Shared Synchronized Core",
      description: "Seamless real-time synchronization between the web management dashboard and your native Android mobile app."
    },
    {
      icon: <Palette className="h-6 w-6 text-indigo-500" />,
      title: "100% White-Labeled",
      description: "Customize everything! Upload your brand logo, name, custom title, and brand primary/secondary color schemes instantly."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-pink-500" />,
      title: "Synchronized Android App",
      description: "Your teachers, students, and parents log in directly via the mobile app, with instantaneous state updates in the website."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "Secure Multi-Tenancy",
      description: "Complete data isolation. Every user profile and administrative record is insulated via solid role-based access rules."
    }
  ];

  const faqs = [
    {
      q: "How does the website coordinate with my Android app?",
      a: "Both applications connect directly to the same secure cloud network. With robust offline sync and secure web channels, any data entry, homework assignment, or attendance logged on this website instantly populates in the mobile application!"
    },
    {
      q: "Can teachers, students, or parents log in on the website?",
      a: "No. To maintain clean operations and native focus, teachers, students, and parents log in exclusively through the CoachingOS Android application. The website is reserved entirely for Coaching Owners to manage billing, configurations, and academics, and for Super Admins to monitor the global system."
    },
    {
      q: "How does the White-Label branding work?",
      a: "Through the Owner Dashboard, you can specify your coaching name, upload a logo, and choose custom colors. This theme customizes the dashboards and is immediately synced to the mobile workspace, creating a seamless branded feel."
    },
    {
      q: "Is there a free trial?",
      a: "Yes! Every new coaching registration instantly kicks off a 14-day fully-featured Free Trial with demo data populated in a single click, allowing you to try out all modules immediately."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-white/10 dark:bg-slate-950/20 backdrop-blur-[2px] border-b border-white/20 dark:border-white/10">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800/40 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Version 2.0 Advanced Cloud Sync Engine Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              The White-Label{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Coaching Engine
              </span>{" "}
              for Enterprise Institutes
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Launch your custom-branded coaching platform in minutes. Manage students, collect online fees, track attendance, and assign homework with real-time sync to your existing Android app.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-base"
              >
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-center px-8 py-4 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-all shadow-sm text-base"
              >
                Log In to Dashboard
              </Link>
            </div>

            {/* Android Notice */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Smartphone className="h-4 w-4 text-slate-400" />
              <span>Looking for student, parent, or teacher portals? Log in via your Android App.</span>
            </div>

          </div>

          {/* Interactive Screen Preview */}
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card p-2 sm:p-4 shadow-2xl">
            <div className="rounded-2xl overflow-hidden border border-white/25 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md shadow-inner aspect-[16/9] flex flex-col">
              {/* Fake Window bar */}
              <div className="h-10 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-6 py-1 rounded">
                  coachingos.app/dashboard/c_demo
                </div>
                <div className="w-12" />
              </div>
              {/* Fake Content */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <div className="md:col-span-1 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-900 p-4 flex flex-col gap-3">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <hr className="border-slate-150 dark:border-slate-800" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded flex items-center px-2">
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl flex flex-col gap-2">
                        <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-end">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Stats Grid */}
      <section className="py-12 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md border-y border-white/20 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="font-display font-extrabold text-3xl sm:text-4xl">{s.value}</span>
                <span className="text-xs sm:text-sm text-blue-100 font-medium tracking-wide uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Highlights */}
      <section className="py-20 md:py-28 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
              Designed for Scale & Shared Compatibility
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Stop juggling disjointed services. CoachingOS integrates your administrative, academic, and communication networks into one unified cloud workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {highlights.map((h, idx) => (
              <div key={idx} className="glass-card p-8 rounded-3xl flex gap-5 items-start hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="p-3.5 bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl flex-shrink-0">
                  {h.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{h.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{h.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Why Choose CoachingOS */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                AUTOMATED OPERATIONS
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
                Instantly Populate Your Dashboard in 1-Click
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                We understand testing SaaS dashboards with empty states can be tedious. When you start your free trial, CoachingOS provides an option to load full-scale, clean **academic data instantly**.
              </p>
              
              <div className="space-y-3">
                {[
                  "Seeded with realistic Student lists and profiles",
                  "Automated Fee Invoices and Collection Logs",
                  "Sample Batches with linked mock Teachers",
                  "Mock Daily Attendance schedules"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm group"
                >
                  Create Trial Account Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-3xl flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-base">Instant Seeder Engine</span>
                <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">READY</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Users className="text-blue-500" />, title: "Students", val: "5 Registered" },
                  { icon: <Calendar className="text-indigo-500" />, title: "Attendance", val: "3 Active Lists" },
                  { icon: <BookOpen className="text-pink-500" />, title: "Batches", val: "3 Setup" },
                  { icon: <Award className="text-amber-500" />, title: "Exams", val: "2 Configured" }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col gap-2 text-center items-center justify-center hover:scale-105 transition-transform duration-200">
                    <div className="p-2 bg-white/10 dark:bg-white/5 rounded-lg">{item.icon}</div>
                    <span className="text-xs font-semibold text-slate-850 dark:text-slate-150">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-slate-800 text-xs text-blue-700 dark:text-slate-400 leading-normal">
                <strong>Backward Compatible Guard:</strong> Seeding data maps automatically using the sub-tenant framework. It works directly with existing Android security rules schemas, meaning you can test mobile sync instantly.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Pricing Preview Card */}
      <section className="py-20 bg-transparent border-t border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            Transparent, Growth-Friendly Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
            No setup fees, no hidden percentages. Choose the perfect plan for your coaching institute size. Start free, scale at your own pace.
          </p>

          <div className="max-w-md mx-auto glass-card p-8 rounded-3xl border-2 border-indigo-500/80 dark:border-indigo-500/60 shadow-xl relative text-left">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Pro Studio Plan</h3>
                <p className="text-xs text-slate-400 mt-1">Perfect for growing coaching academies</p>
              </div>
              <div className="text-right">
                <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">$79</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-6" />

            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300 mb-8">
              {[
                "Unlimited Batches & Classrooms",
                "Up to 1,000 Active Students",
                "Full White-Labeling (Logo, Theme Colors)",
                "Full Attendance & Fees Tracking System",
                "Android Application Access",
                "Instant Real-time Sync"
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="block w-full text-center py-3.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-all shadow-md"
            >
              Start Free Trial Now
            </Link>
          </div>
          
          <div className="mt-6">
            <Link to="/pricing" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View All Pricing Plans &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Have questions about cloud synchronization or custom white-label setups? Let's clarify.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? <Minus className="h-4 w-4 flex-shrink-0" /> : <Plus className="h-4 w-4 flex-shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-450 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Footer */}
      <section className="py-20 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 text-white text-center relative overflow-hidden border-t border-white/20 dark:border-white/10 backdrop-blur-md">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">
            Ready to Accelerate Your Academy Operations?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get instant access to the owner dashboard, setup batch rosters, send global announcements, and watch everything sync in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-550 text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 border border-blue-400 hover:bg-blue-500/20 text-white font-bold rounded-xl transition-all"
            >
              Speak to our Architects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
