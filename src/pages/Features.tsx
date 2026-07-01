import React from "react";
import { Link } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";
import * as Icons from "lucide-react";

export const Features: React.FC = () => {
  const { cmsConfig, loading } = useCms();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Syncing feature matrix...</p>
      </div>
    );
  }

  const { features } = cmsConfig;

  // Dynamic Lucide Icon Resolver
  const renderIcon = (iconName: string, defaultColorClass = "text-blue-500") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={`h-6 w-6 ${defaultColorClass}`} />;
    }
    const HelpIcon = Icons.HelpCircle;
    return <HelpIcon className={`h-6 w-6 ${defaultColorClass}`} />;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24 text-left">
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
              {features.adminTitle || "Core Academic Directory & Rosters"}
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.adminFeatures?.map((f) => (
              <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">
                  {renderIcon(f.icon, f.icon === "Users" ? "text-blue-500" : f.icon === "UserSquare2" ? "text-indigo-500" : f.icon === "Layers" ? "text-pink-500" : "text-amber-500")}
                </div>
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
              {features.operationalTitle || "Daily Operations & Real-time Synchronization"}
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.operationalFeatures?.map((f) => (
              <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">
                  {renderIcon(f.icon, f.icon === "ClipboardCheck" ? "text-emerald-500" : f.icon === "CreditCard" ? "text-purple-500" : f.icon === "BookOpen" ? "text-teal-500" : "text-orange-500")}
                </div>
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
              <Icons.Palette className="h-8 w-8" />
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
              <Icons.Megaphone className="h-8 w-8" />
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

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              Ready to claim your branded, white-labeled system?
            </h2>
            <p className="text-base text-blue-100 max-w-xl">
              Register in under 60 seconds, choose your brand hex colors, upload your custom logo, and try out our cloud sync features free for 14 days.
            </p>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-blue-600 hover:bg-slate-100 font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Start Free Trial Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
