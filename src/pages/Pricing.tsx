import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter Trial",
      price: "0",
      desc: "For newly founded local academies",
      features: [
        "1 Active Batch / Course",
        "Up to 15 Registered Students",
        "Standard Attendance Logging",
        "Basic Announcements Feed",
        "Real-time Sync Connection",
        "14-Day Expiry Timeline"
      ],
      cta: "Register Trial Account",
      popular: false,
      border: "border-slate-200 dark:border-slate-800"
    },
    {
      name: "Pro Studio",
      price: "79",
      desc: "Perfect for scaling professional institutes",
      features: [
        "Unlimited Batches & Courses",
        "Up to 1,000 Active Students",
        "Full Whitelabel Customization",
        "Automated Fee Ledger & Receipts",
        "Homework & Exams Schedules",
        "Priority Support Ticketing",
        "Android App Synchronization"
      ],
      cta: "Start Free Pro Trial",
      popular: true,
      border: "border-blue-600 dark:border-blue-500 shadow-xl"
    },
    {
      name: "Enterprise SLA",
      price: "199",
      desc: "For global coaching chains & universities",
      features: [
        "Unlimited Batches & Courses",
        "Unlimited Registered Students",
        "Custom Dedicated Subdomain",
        "Guaranteed 99.99% Database SLA",
        "Custom Feature Toggle Permissions",
        "Direct Super Admin Support Hot",
        "Dedicated Multi-Region Hosting"
      ],
      cta: "Contact Enterprise Sales",
      popular: false,
      border: "border-slate-200 dark:border-slate-800"
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            Simple, Scale-Friendly Subscriptions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Start completely free for 14 days with no credit card required. Upgrade or downgrade anytime as your institute expands.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 relative flex flex-col h-full ${p.border}`}
            >
              {p.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white font-bold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">${p.price}</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>

              <hr className="border-slate-100 dark:border-slate-800/80 mb-6" />

              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300 mb-8 flex-grow">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={p.price === "199" ? "/contact" : "/register"}
                className={`w-full text-center py-4 rounded-xl font-semibold shadow-md transition-all ${
                  p.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Security / Compatibility Notice */}
        <div className="max-w-4xl mx-auto bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
          <div className="p-3 bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1.5">
              Secure Unified Billing Nodes
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              All subscription plans run on our secure, isolated cloud servers. Changes made to subscription states instantly update your white-label dashboard profiles and active mobile sessions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
