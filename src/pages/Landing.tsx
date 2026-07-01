import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useCms } from "../contexts/CmsContext";
import * as Icons from "lucide-react";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  CheckCircle2,
  PlayCircle
} from "lucide-react";

export const Landing: React.FC = () => {
  const { cmsConfig, loading } = useCms();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic Lucide Icon Resolver
  const renderIcon = (iconName: string, colorClass = "text-blue-500") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={`h-6 w-6 ${colorClass}`} />;
    }
    // Default fallback icon
    const HelpIcon = Icons.HelpCircle;
    return <HelpIcon className={`h-6 w-6 ${colorClass}`} />;
  };

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleNextSlide = () => {
    if (!cmsConfig.bannerSlider?.slides) return;
    setCurrentSlide((prev) => (prev + 1) % cmsConfig.bannerSlider.slides.length);
  };

  const handlePrevSlide = () => {
    if (!cmsConfig.bannerSlider?.slides) return;
    setCurrentSlide((prev) => (prev - 1 + cmsConfig.bannerSlider.slides.length) % cmsConfig.bannerSlider.slides.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing dynamic view assets...</p>
      </div>
    );
  }

  const { hero, features, about, pricing, faq, bannerSlider } = cmsConfig;

  // Static stats array mapped with values
  const stats = [
    { value: "10k+", label: "Active Students" },
    { value: "500+", label: "Coaching Institutes" },
    { value: "99.9%", label: "Real-time Sync Uptime" },
    { value: "100%", label: "Real-time Platform Sync" }
  ];

  const slides = bannerSlider?.slides || [];

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 bg-white/10 dark:bg-slate-950/20 backdrop-blur-[2px] border-b border-white/20 dark:border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Tag */}
            {hero.tag && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800/40 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
                <Icons.Zap className="h-3.5 w-3.5 fill-current animate-pulse text-indigo-500" />
                <span>{hero.tag}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              {hero.title}
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-2xl">
              {hero.subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to={hero.ctaLink || "/register"}
                className="w-full sm:w-auto text-center px-8 py-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-base"
              >
                {hero.ctaText}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={hero.secLink || "/login"}
                className="w-full sm:w-auto text-center px-8 py-4 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-all shadow-sm text-base"
              >
                {hero.secText}
              </Link>
            </div>

            {/* Android Notice */}
            {hero.showAndroidNotice && (
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Icons.Smartphone className="h-4 w-4 text-slate-400" />
                <span>{hero.androidNoticeText}</span>
              </div>
            )}

          </div>

          {/* Interactive Screen Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card p-2 sm:p-4 shadow-2xl">
            <div className="rounded-2xl overflow-hidden border border-white/25 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md shadow-inner aspect-[16/9] flex flex-col">
              {/* Window Header */}
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
              
              {/* Dummy Admin Workspace Interface Mock */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-slate-950 overflow-hidden text-left">
                <div className="md:col-span-1 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-900 p-4 flex flex-col gap-3">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <hr className="border-slate-150 dark:border-slate-800" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 bg-slate-100 dark:bg-slate-850 rounded flex items-center px-2">
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-750 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { l: "Students", v: "154 Active" },
                      { l: "Collections", v: "$4,810 This Month" },
                      { l: "Attendance", v: "94.2% Average" }
                    ].map((stat, idx) => (
                      <div key={idx} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl flex flex-col gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.l}</span>
                        <span className="text-sm font-bold text-slate-850 dark:text-slate-150">{stat.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 flex flex-col justify-end">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC BANNER SLIDER */}
      {bannerSlider?.show && slides.length > 0 && (
        <section className="py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative glass-card rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[32/10] bg-slate-950 group">
              {/* Background Image with Overlay */}
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover opacity-35 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end text-left max-w-xl z-10">
                <h3 className="font-display font-extrabold text-xl sm:text-3xl text-white tracking-tight mb-2">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {slides[currentSlide].subtitle}
                </p>
                {slides[currentSlide].link && (
                  <Link 
                    to={slides[currentSlide].link}
                    className="w-fit px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    Explore Topic <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {/* Slider controls */}
              <button 
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/45 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/45 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Position Dots */}
              <div className="absolute bottom-4 right-6 flex gap-1.5 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-5 bg-blue-500' : 'w-2 bg-white/40'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. STATS GRID */}
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

      {/* 4. FEATURES HIGHLIGHTS */}
      <section className="py-20 md:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
              {features.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.highlights?.map((h) => (
              <div key={h.id} className="glass-card p-8 rounded-3xl flex gap-5 items-start hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left">
                <div className="p-3.5 bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl flex-shrink-0">
                  {renderIcon(h.icon, h.icon === "Palette" ? "text-indigo-500" : h.icon === "Smartphone" ? "text-pink-500" : h.icon === "ShieldCheck" ? "text-emerald-500" : "text-blue-500")}
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

      {/* 5. ABOUT US / SEEDER BLOCK */}
      <section className="py-20 bg-transparent border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {about.subtitle}
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
                {about.title}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {about.description}
              </p>
              
              <div className="space-y-3">
                {about.bulletPoints?.map((item, idx) => (
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

            <div className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-3xl flex flex-col gap-6 text-left">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-base">Instant Seeder Engine</span>
                <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">READY</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Icons.Users className="text-blue-500" />, title: "Students", val: "5 Registered" },
                  { icon: <Icons.Calendar className="text-indigo-500" />, title: "Attendance", val: "3 Active Lists" },
                  { icon: <Icons.BookOpen className="text-pink-500" />, title: "Batches", val: "3 Setup" },
                  { icon: <Icons.Award className="text-amber-500" />, title: "Exams", val: "2 Configured" }
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

      {/* 6. PRICING PREVIEW CARD */}
      <section className="py-20 bg-transparent border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            {pricing.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
            {pricing.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto text-left">
            {pricing.plans?.map((plan) => (
              <div 
                key={plan.id} 
                className={`glass-card p-8 rounded-3xl relative flex flex-col justify-between transition-all hover:scale-[1.01] ${
                  plan.isPopular 
                    ? "border-2 border-indigo-500/80 dark:border-indigo-500/60 shadow-xl" 
                    : "border border-slate-200 dark:border-slate-800"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400">/{plan.period}</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-850 my-6" />

                  <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300 mb-8">
                    {plan.features?.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.link || "/register"}
                  className={`block w-full text-center py-3.5 font-semibold rounded-xl transition-all shadow-md ${
                    plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/pricing" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1">
              View All Comprehensive Pricing Plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC TESTIMONIALS SECTION */}
      {cmsConfig.testimonials?.show && (
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-4">
              {cmsConfig.testimonials.title || "Loved by Coaching Operators Globally"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-16">
              Hear directly from directors, principles, and academic owners who scaled their physical academies onto the secure cloud network.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left max-w-5xl mx-auto">
              {cmsConfig.testimonials.list?.map((test) => (
                <div key={test.id} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5 justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
                    "{test.content}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-850 pt-5">
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{test.name}</h4>
                      <p className="text-[11px] text-slate-500">{test.role}, {test.company}</p>
                    </div>
                    {/* Stars */}
                    <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Icons.Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 bg-transparent border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
              {faq.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {faq.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faq.list?.map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl overflow-hidden transition-all duration-300 text-left border border-slate-150 dark:border-slate-800"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <span className="pr-4">{item.q}</span>
                    {isOpen ? <Minus className="h-4 w-4 flex-shrink-0" /> : <Plus className="h-4 w-4 flex-shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION FOOTER */}
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
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
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
