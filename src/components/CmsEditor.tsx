import React, { useState, useEffect } from "react";
import { useCms, CmsConfig, defaultCmsConfig } from "../contexts/CmsContext";
import { useToast } from "../contexts/ToastContext";
import { 
  Palette, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Smartphone, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Globe, 
  DollarSign, 
  Image, 
  CheckCircle2, 
  Megaphone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Star
} from "lucide-react";

export const CmsEditor: React.FC = () => {
  const { cmsConfig, saveCmsConfig, resetCmsConfig } = useCms();
  const { toast } = useToast();
  
  // Local state representing the complete editable CMS configuration
  const [config, setConfig] = useState<CmsConfig>(cmsConfig);
  const [activeSubTab, setActiveSubTab] = useState("branding");
  const [isSaving, setIsSaving] = useState(false);

  // Sync local config if backend snapshot updates
  useEffect(() => {
    if (cmsConfig) {
      setConfig(cmsConfig);
    }
  }, [cmsConfig]);

  const handleSaveSection = async (sectionName: string) => {
    setIsSaving(true);
    try {
      await saveCmsConfig(config);
      toast(`${sectionName} saved successfully and updated in real-time!`, "success");
    } catch (err) {
      toast(`Failed to save ${sectionName}. Try again.`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (window.confirm("Are you sure you want to reset all website sections to their default templates? This cannot be undone.")) {
      setIsSaving(true);
      try {
        await resetCmsConfig();
        toast("Website content successfully reset to templates!", "success");
      } catch (err) {
        toast("Failed to reset configurations.", "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  // --- Sub-Tab Navigation ---
  const subTabs = [
    { id: "branding", label: "Branding & Bar", icon: <Palette className="h-4 w-4" /> },
    { id: "hero", label: "Hero Banner", icon: <Sparkles className="h-4 w-4" /> },
    { id: "slider", label: "Hero Slider", icon: <Image className="h-4 w-4" /> },
    { id: "features", label: "Features List", icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: "about", label: "About (Seeder)", icon: <Smartphone className="h-4 w-4" /> },
    { id: "pricing", label: "Pricing Subscriptions", icon: <DollarSign className="h-4 w-4" /> },
    { id: "testimonials", label: "Testimonials Reviews", icon: <Star className="h-4 w-4" /> },
    { id: "faq", label: "FAQ Accordions", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "contact", label: "Contact & Socials", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "seo", label: "SEO & Popups", icon: <Globe className="h-4 w-4" /> }
  ];

  // Helper arrays state handling (Sliders)
  const [newSlide, setNewSlide] = useState({ image: "", title: "", subtitle: "", link: "" });
  const handleAddSlide = () => {
    if (!newSlide.image || !newSlide.title) {
      toast("Slide must contain an Image URL and a Title.", "error");
      return;
    }
    const slides = [...(config.bannerSlider?.slides || [])];
    slides.push({
      id: `slide_${Date.now()}`,
      image: newSlide.image,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      link: newSlide.link
    });
    setConfig({
      ...config,
      bannerSlider: { ...(config.bannerSlider || { show: true }), slides }
    });
    setNewSlide({ image: "", title: "", subtitle: "", link: "" });
    toast("Slide added! Save changes to apply.", "success");
  };

  const handleRemoveSlide = (id: string) => {
    const slides = (config.bannerSlider?.slides || []).filter(s => s.id !== id);
    setConfig({
      ...config,
      bannerSlider: { ...(config.bannerSlider || { show: true }), slides }
    });
  };

  // Helpers (Features Highlights)
  const [newHighlight, setNewHighlight] = useState({ icon: "Database", title: "", description: "" });
  const handleAddHighlight = (category: "highlights" | "adminFeatures" | "operationalFeatures") => {
    if (!newHighlight.title || !newHighlight.description) {
      toast("Feature item must contain a Title and Description.", "error");
      return;
    }
    const targetFeatures = { ...config.features };
    const list = [...(targetFeatures[category] || [])];
    list.push({
      id: `feat_${Date.now()}`,
      icon: newHighlight.icon,
      title: newHighlight.title,
      description: newHighlight.description
    });
    
    setConfig({
      ...config,
      features: {
        ...config.features,
        [category]: list
      }
    });
    setNewHighlight({ icon: "Database", title: "", description: "" });
    toast("Feature added! Save changes to apply.", "success");
  };

  const handleRemoveHighlight = (category: "highlights" | "adminFeatures" | "operationalFeatures", id: string) => {
    const list = (config.features[category] || []).filter((f: any) => f.id !== id);
    setConfig({
      ...config,
      features: {
        ...config.features,
        [category]: list
      }
    });
  };

  // Bullet point helpers (About us)
  const [newBullet, setNewBullet] = useState("");
  const handleAddBullet = () => {
    if (!newBullet.trim()) return;
    const bulletPoints = [...(config.about?.bulletPoints || [])];
    bulletPoints.push(newBullet.trim());
    setConfig({
      ...config,
      about: { ...(config.about || { title: "", subtitle: "", description: "" }), bulletPoints }
    });
    setNewBullet("");
  };

  const handleRemoveBullet = (index: number) => {
    const bulletPoints = (config.about?.bulletPoints || []).filter((_, i) => i !== index);
    setConfig({
      ...config,
      about: { ...(config.about || { title: "", subtitle: "", description: "" }), bulletPoints }
    });
  };

  // Pricing plans helpers
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    period: "mo",
    description: "",
    badge: "",
    isPopular: false,
    ctaText: "Register Trial Account",
    link: "/register"
  });
  const [newPlanFeature, setNewPlanFeature] = useState("");
  const [tempPlanFeatures, setTempPlanFeatures] = useState<string[]>([]);

  const handleAddPlanFeature = () => {
    if (!newPlanFeature.trim()) return;
    setTempPlanFeatures([...tempPlanFeatures, newPlanFeature.trim()]);
    setNewPlanFeature("");
  };

  const handleAddPricingPlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast("Plan name and price are required.", "error");
      return;
    }
    const plans = [...(config.pricing?.plans || [])];
    plans.push({
      id: `plan_${Date.now()}`,
      name: newPlan.name,
      price: newPlan.price,
      period: newPlan.period,
      description: newPlan.description,
      badge: newPlan.badge,
      isPopular: newPlan.isPopular,
      features: tempPlanFeatures,
      ctaText: newPlan.ctaText,
      link: newPlan.link
    });
    setConfig({
      ...config,
      pricing: { ...(config.pricing || { title: "", subtitle: "" }), plans }
    });
    setNewPlan({
      name: "",
      price: "",
      period: "mo",
      description: "",
      badge: "",
      isPopular: false,
      ctaText: "Register Trial Account",
      link: "/register"
    });
    setTempPlanFeatures([]);
    toast("Pricing plan added! Save changes to apply.", "success");
  };

  const handleRemovePricingPlan = (id: string) => {
    const plans = (config.pricing?.plans || []).filter(p => p.id !== id);
    setConfig({
      ...config,
      pricing: { ...(config.pricing || { title: "", subtitle: "" }), plans }
    });
  };

  // Testimonials Helpers
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "",
    rating: 5
  });

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      toast("Testimonial name and quote description are required.", "error");
      return;
    }
    const list = [...(config.testimonials?.list || [])];
    list.push({
      id: `test_${Date.now()}`,
      ...newTestimonial
    });
    setConfig({
      ...config,
      testimonials: { ...(config.testimonials || { show: true, title: "" }), list }
    });
    setNewTestimonial({
      name: "",
      role: "",
      company: "",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      content: "",
      rating: 5
    });
    toast("Testimonial added! Save changes to apply.", "success");
  };

  const handleRemoveTestimonial = (id: string) => {
    const list = (config.testimonials?.list || []).filter(t => t.id !== id);
    setConfig({
      ...config,
      testimonials: { ...(config.testimonials || { show: true, title: "" }), list }
    });
  };

  // FAQ Helpers
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });
  const handleAddFaq = () => {
    if (!newFaq.q || !newFaq.a) {
      toast("Question and Answer are required.", "error");
      return;
    }
    const list = [...(config.faq?.list || [])];
    list.push({
      id: `faq_${Date.now()}`,
      q: newFaq.q,
      a: newFaq.a
    });
    setConfig({
      ...config,
      faq: { ...(config.faq || { title: "", subtitle: "" }), list }
    });
    setNewFaq({ q: "", a: "" });
    toast("FAQ item added! Save changes to apply.", "success");
  };

  const handleRemoveFaq = (id: string) => {
    const list = (config.faq?.list || []).filter(f => f.id !== id);
    setConfig({
      ...config,
      faq: { ...(config.faq || { title: "", subtitle: "" }), list }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      
      {/* CMS Sub Sidebar */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">CMS Sections</span>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSubTab === tab.id
                ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
        
        <hr className="border-slate-100 dark:border-slate-800 my-4" />
        
        <button
          onClick={handleResetToDefaults}
          disabled={isSaving}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[11px] font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-all disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Sections
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="lg:col-span-9 flex flex-col gap-6">

        {/* SECTION: 1. BRANDING & ANNOUNCEMENT BAR */}
        {activeSubTab === "branding" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">General Branding & Header</h3>
              <p className="text-xs text-slate-400 mt-1">Configure your corporate identity, logo lettering, and dynamic browser metadata.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Logo Brand Text</label>
                <input
                  type="text"
                  value={config.branding?.logoText || ""}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoText: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Logo Avatar Letter</label>
                <input
                  type="text"
                  maxLength={1}
                  value={config.branding?.logoLetter || ""}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoLetter: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Website Tab Title</label>
                <input
                  type="text"
                  value={config.branding?.websiteTitle || ""}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, websiteTitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Custom Favicon URL (PNG Link)</label>
                <input
                  type="text"
                  placeholder="https://example.com/favicon.png"
                  value={config.branding?.faviconUrl || ""}
                  onChange={(e) => setConfig({ ...config, branding: { ...config.branding, faviconUrl: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Announcement Announcement Bar</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle a header bar at the top of the entire landing page.</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.announcementBar?.show}
                  onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, show: e.target.checked } })}
                  className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
                />
              </div>
              
              {config.announcementBar?.show && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Announcement Text</label>
                    <input
                      type="text"
                      value={config.announcementBar.text}
                      onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, text: e.target.value } })}
                      className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Target Redirect Link</label>
                      <input
                        type="text"
                        value={config.announcementBar.link}
                        onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, link: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Link Label Text</label>
                      <input
                        type="text"
                        value={config.announcementBar.linkText}
                        onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, linkText: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Background CSS Class</label>
                      <input
                        type="text"
                        placeholder="bg-indigo-600"
                        value={config.announcementBar.bgClass || ""}
                        onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, bgClass: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Text CSS Class</label>
                      <input
                        type="text"
                        placeholder="text-white"
                        value={config.announcementBar.textClass || ""}
                        onChange={(e) => setConfig({ ...config, announcementBar: { ...config.announcementBar, textClass: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("General Branding")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Branding & Bar
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 2. HERO BANNER EDITOR */}
        {activeSubTab === "hero" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Hero Section Headline & CTA</h3>
              <p className="text-xs text-slate-400 mt-1">Configure titles, tags, descriptions, and CTA action target routing links.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Tag / Status Notice Banner</label>
              <input
                type="text"
                value={config.hero?.tag || ""}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, tag: e.target.value } })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Primary Title Headline</label>
              <textarea
                rows={2}
                value={config.hero?.title || ""}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-display font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Sub-Headline Text Content</label>
              <textarea
                rows={3}
                value={config.hero?.subtitle || ""}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={config.hero?.ctaText || ""}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, ctaText: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Primary CTA Target Route Link</label>
                <input
                  type="text"
                  value={config.hero?.ctaLink || ""}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, ctaLink: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Secondary Button Label</label>
                <input
                  type="text"
                  value={config.hero?.secText || ""}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, secText: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Secondary Target Route Link</label>
                <input
                  type="text"
                  value={config.hero?.secLink || ""}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, secLink: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Android Mobile App Portal Notice</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Toggle notice line linking native student/parent mobile portals.</p>
                {config.hero?.showAndroidNotice && (
                  <input
                    type="text"
                    value={config.hero.androidNoticeText}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, androidNoticeText: e.target.value } })}
                    className="p-2 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 mt-2.5 w-[300px] sm:w-[450px]"
                  />
                )}
              </div>
              <input
                type="checkbox"
                checked={config.hero?.showAndroidNotice}
                onChange={(e) => setConfig({ ...config, hero: { ...config.hero, showAndroidNotice: e.target.checked } })}
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Hero Banner Headline")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Hero Banner
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 3. BANNER SLIDER */}
        {activeSubTab === "slider" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Interactive Website Slider</h3>
                <p className="text-xs text-slate-400 mt-1">Configure a list of slides, visual backdrops, and descriptive links on the homepage.</p>
              </div>
              <input
                type="checkbox"
                checked={config.bannerSlider?.show}
                onChange={(e) => setConfig({ ...config, bannerSlider: { ...(config.bannerSlider || { show: true, slides: [] }), show: e.target.checked } })}
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
              />
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            {config.bannerSlider?.show && (
              <>
                {/* Add new slide card */}
                <div className="border border-indigo-100 dark:border-slate-800 p-5 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/20 space-y-4">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Add Brand Slide</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Slide Headline Title</label>
                      <input
                        type="text"
                        placeholder="e.g. 100% White-Labeled Setup"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Backdrop Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newSlide.image}
                        onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Slide Subtitle / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Upload your logo and custom primary branding hex colors."
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Action Target Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="/features"
                        value={newSlide.link}
                        onChange={(e) => setNewSlide({ ...newSlide, link: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleAddSlide}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="h-4 w-4" /> Add Slide Card
                    </button>
                  </div>
                </div>

                {/* Slides listing */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Existing Slider Items ({config.bannerSlider.slides?.length || 0})</span>
                  <div className="grid grid-cols-1 gap-3.5">
                    {config.bannerSlider.slides?.map((slide, idx) => (
                      <div key={slide.id} className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <img 
                          src={slide.image} 
                          alt="slide" 
                          className="h-12 w-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{slide.title}</h4>
                          <p className="text-[10px] text-slate-400 truncate leading-relaxed">{slide.subtitle}</p>
                          <span className="text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1 rounded">{slide.link || 'No redirect'}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSlide(slide.id)}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors flex-shrink-0"
                          title="Delete Slide"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Homepage Hero Slider")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Slider List
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 4. FEATURES MATRIX */}
        {activeSubTab === "features" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Features Directory Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">Configure headings and fully manage lists inside Core Academic and Daily Operations sections.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Features Section Title</label>
                <input
                  type="text"
                  value={config.features?.title || ""}
                  onChange={(e) => setConfig({ ...config, features: { ...config.features, title: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Features Section Description Subtitle</label>
                <input
                  type="text"
                  value={config.features?.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, features: { ...config.features, subtitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Sub-categories management */}
            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Configure Feature Entries</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Lucide Icon Name</label>
                  <select
                    value={newHighlight.icon}
                    onChange={(e) => setNewHighlight({ ...newHighlight, icon: e.target.value })}
                    className="p-2 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs"
                  >
                    <option value="Database">Database / Sync</option>
                    <option value="Palette">Palette / Branding</option>
                    <option value="Smartphone">Smartphone / Mobile</option>
                    <option value="ShieldCheck">ShieldCheck / Security</option>
                    <option value="Users">Users / Students</option>
                    <option value="UserSquare2">UserSquare2 / Teachers</option>
                    <option value="Layers">Layers / Batches</option>
                    <option value="Clock">Clock / Schedule</option>
                    <option value="ClipboardCheck">ClipboardCheck / Attendance</option>
                    <option value="CreditCard">CreditCard / Ledger</option>
                    <option value="BookOpen">BookOpen / Homework</option>
                    <option value="GraduationCap">GraduationCap / Exam</option>
                    <option value="Megaphone">Megaphone / Announcements</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Feature Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Student Directory"
                    value={newHighlight.title}
                    onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                    className="p-2 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Feature Description Text</label>
                  <input
                    type="text"
                    placeholder="Manage detailed student files..."
                    value={newHighlight.description}
                    onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
                    className="p-2 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2 justify-end">
                <button
                  onClick={() => handleAddHighlight("highlights")}
                  className="px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20 text-[10px] font-semibold rounded-lg flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Highlights List
                </button>
                <button
                  onClick={() => handleAddHighlight("adminFeatures")}
                  className="px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20 text-[10px] font-semibold rounded-lg flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Academics List
                </button>
                <button
                  onClick={() => handleAddHighlight("operationalFeatures")}
                  className="px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20 text-[10px] font-semibold rounded-lg flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Operations List
                </button>
              </div>

              {/* Listings */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* 1 */}
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Primary Front Highlights ({config.features.highlights?.length || 0})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {config.features.highlights?.map((f) => (
                      <div key={f.id} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <strong className="text-slate-800 dark:text-slate-200">[{f.icon}] {f.title}</strong>
                          <p className="text-[10px] text-slate-400 truncate">{f.description}</p>
                        </div>
                        <button onClick={() => handleRemoveHighlight("highlights", f.id)} className="text-rose-500 p-1 hover:bg-rose-500/10 rounded">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 */}
                <div className="pt-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Core Academics Section ({config.features.adminFeatures?.length || 0})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {config.features.adminFeatures?.map((f) => (
                      <div key={f.id} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <strong className="text-slate-800 dark:text-slate-200">[{f.icon}] {f.title}</strong>
                          <p className="text-[10px] text-slate-400 truncate">{f.description}</p>
                        </div>
                        <button onClick={() => handleRemoveHighlight("adminFeatures", f.id)} className="text-rose-500 p-1 hover:bg-rose-500/10 rounded">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 */}
                <div className="pt-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Daily Operations Section ({config.features.operationalFeatures?.length || 0})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {config.features.operationalFeatures?.map((f) => (
                      <div key={f.id} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <strong className="text-slate-800 dark:text-slate-200">[{f.icon}] {f.title}</strong>
                          <p className="text-[10px] text-slate-400 truncate">{f.description}</p>
                        </div>
                        <button onClick={() => handleRemoveHighlight("operationalFeatures", f.id)} className="text-rose-500 p-1 hover:bg-rose-500/10 rounded">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Features Matrices")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Features Directory
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 5. ABOUT US (SEEDER BOARD) */}
        {activeSubTab === "about" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">About Page / Seeder Board</h3>
              <p className="text-xs text-slate-400 mt-1">Configure descriptions, headers, and bullet points mapping to the 1-Click Dashboard Demo Seeding system.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Seeder Tag Line</label>
                <input
                  type="text"
                  value={config.about?.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, subtitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Seeder Title Headline</label>
                <input
                  type="text"
                  value={config.about?.title || ""}
                  onChange={(e) => setConfig({ ...config, about: { ...config.about, title: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Long Seeder Description Body</label>
              <textarea
                rows={4}
                value={config.about?.description || ""}
                onChange={(e) => setConfig({ ...config, about: { ...config.about, description: e.target.value } })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Bullet points config */}
            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Seeded Features Bullets</span>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Sample Batches with linked mock Teachers"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddBullet}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add Bullet
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {config.about?.bulletPoints?.map((pt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {pt}
                    </span>
                    <button onClick={() => handleRemoveBullet(idx)} className="text-rose-500 hover:opacity-80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("About Seeder Settings")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Seeder Section
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 6. PRICING PLANS */}
        {activeSubTab === "pricing" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Pricing & Subscriptions Panel</h3>
              <p className="text-xs text-slate-400 mt-1">Configure subscription pricing layouts. CoachingOS Pro is the single standardized plan enabled globally.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Pricing Layout Title</label>
                <input
                  type="text"
                  value={config.pricing?.title || ""}
                  onChange={(e) => setConfig({ ...config, pricing: { ...config.pricing, title: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Pricing Layout Description</label>
                <input
                  type="text"
                  value={config.pricing?.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, pricing: { ...config.pricing, subtitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-350">
              <p className="font-semibold">CoachingOS Pro Subscription Rule Enforced:</p>
              <p className="mt-1">
                To simplify the platform and provide maximum value, CoachingOS has migrated to a single premium standard plan: <strong>CoachingOS Pro (₹999/month with a 30-Day Free Trial)</strong>. Custom plan generation has been locked to maintain consistency across the entire ecosystem.
              </p>
            </div>

            {/* List existing */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active System Plan</span>
              <div className="max-w-md border border-indigo-200 dark:border-indigo-800 p-5 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-col justify-between gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      CoachingOS Pro
                      <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-mono uppercase">Enforced</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Everything you need to run your coaching institute at scale</p>
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-white font-mono">₹999/month</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold">30 Days Free Trial</div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-500 list-disc pl-4">
                  <li>Unlimited Students</li>
                  <li>Unlimited Teachers</li>
                  <li>Unlimited Parents</li>
                  <li>Unlimited Batches</li>
                  <li>Attendance Management</li>
                  <li>Fee Management</li>
                  <li>Exam & Result Management</li>
                  <li>Homework Management</li>
                  <li>Study Material</li>
                  <li>Timetable</li>
                  <li>Notice Board</li>
                  <li>Reports</li>
                  <li>White-Label Branding</li>
                  <li>Android Mobile App</li>
                  <li>Owner Web Dashboard</li>
                  <li>Teacher App</li>
                  <li>Student App</li>
                  <li>Parent App</li>
                  <li>Free Updates</li>
                  <li>Technical Support</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Website Subscriptions")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Pricing Config
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 7. TESTIMONIALS */}
        {activeSubTab === "testimonials" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Testimonial Reviews</h3>
                <p className="text-xs text-slate-400 mt-1">Configure client reviews, principal ratings, roles, and avatar images.</p>
              </div>
              <input
                type="checkbox"
                checked={config.testimonials?.show}
                onChange={(e) => setConfig({ ...config, testimonials: { ...(config.testimonials || { show: true, list: [], title: "" }), show: e.target.checked } })}
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
              />
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            {config.testimonials?.show && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Testimonials Section Headline Title</label>
                  <input
                    type="text"
                    value={config.testimonials?.title || ""}
                    onChange={(e) => setConfig({ ...config, testimonials: { ...config.testimonials, title: e.target.value } })}
                    className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Add testimonial */}
                <div className="border border-indigo-100 dark:border-slate-800 p-5 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/20 space-y-4">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Add Client Review</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Client Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Patel"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Client Role / Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Principal"
                        value={newTestimonial.role}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Institute Name / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Starlight Arts Academy"
                        value={newTestimonial.company}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Avatar Picture URL Link</label>
                      <input
                        type="text"
                        value={newTestimonial.avatar}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Stars Rating Selection</label>
                      <select
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) || 5 })}
                        className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="5">5 Stars (Excellent)</option>
                        <option value="4">4 Stars (Good)</option>
                        <option value="3">3 Stars (Average)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Review Description Quote</label>
                    <textarea
                      rows={3}
                      placeholder="Billing fees and taking daily attendance was always a nightmare..."
                      value={newTestimonial.content}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                      className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleAddTestimonial}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Testimonial Card
                    </button>
                  </div>
                </div>

                {/* Existing list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Existing Client Reviews ({config.testimonials.list?.length || 0})</span>
                  <div className="grid grid-cols-1 gap-3.5">
                    {config.testimonials.list?.map((test) => (
                      <div key={test.id} className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <img 
                          src={test.avatar} 
                          alt="avatar" 
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-750 flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            {test.name}
                            <span className="flex items-center text-amber-500 text-[10px]">
                              {Array.from({ length: test.rating || 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
                            </span>
                          </h4>
                          <span className="text-[10px] text-slate-400 block">{test.role} &bull; {test.company}</span>
                          <p className="text-[10px] text-slate-500 italic mt-1 leading-normal">"{test.content}"</p>
                        </div>
                        <button
                          onClick={() => handleRemoveTestimonial(test.id)}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Website Testimonials")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Testimonials
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 8. FAQ ACCORDIONS */}
        {activeSubTab === "faq" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">FAQ Accordions Directory</h3>
              <p className="text-xs text-slate-400 mt-1">Configure client troubleshooting panels, questions, answers, and accordions headings.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">FAQ Section Title</label>
                <input
                  type="text"
                  value={config.faq?.title || ""}
                  onChange={(e) => setConfig({ ...config, faq: { ...config.faq, title: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">FAQ Subtitle description</label>
                <input
                  type="text"
                  value={config.faq?.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, faq: { ...config.faq, subtitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Add FAQ */}
            <div className="border border-indigo-100 dark:border-slate-800 p-5 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/20 space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Add FAQ Item</span>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Question Heading</label>
                <input
                  type="text"
                  placeholder="e.g. How does the White-Label branding work?"
                  value={newFaq.q}
                  onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                  className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Detailed Answer Content</label>
                <textarea
                  rows={3}
                  placeholder="Write clear response answer..."
                  value={newFaq.a}
                  onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                  className="p-2.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleAddFaq}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add FAQ Item
                </button>
              </div>
            </div>

            {/* Existing FAQ items list */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Existing FAQs ({config.faq.list?.length || 0})</span>
              <div className="space-y-2.5">
                {config.faq.list?.map((item) => (
                  <div key={item.id} className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-normal">Q: {item.q}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">A: {item.a}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFaq(item.id)}
                      className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("FAQ Accordions")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save FAQ List
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 9. CONTACT & SOCIALS */}
        {activeSubTab === "contact" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Contact Info & Social Media Links</h3>
              <p className="text-xs text-slate-400 mt-1">Configure physical addresses, phone networks, emails, working hours, and social redirects.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Contact Section Title</label>
                <input
                  type="text"
                  value={config.contact?.title || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, title: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Contact Subtitle Description</label>
                <input
                  type="text"
                  value={config.contact?.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, subtitle: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Support Email Node</label>
                <input
                  type="email"
                  value={config.contact?.email || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">HQ Support Phone Line</label>
                <input
                  type="text"
                  value={config.contact?.phone || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">HQ Physical Address</label>
                <input
                  type="text"
                  value={config.contact?.address || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, address: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Working Hours Statement</label>
                <input
                  type="text"
                  value={config.contact?.hours || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, hours: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Cloud status headline</label>
                <input
                  type="text"
                  value={config.contact?.statusText || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, statusText: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Support brief details description</label>
                <input
                  type="text"
                  value={config.contact?.description || ""}
                  onChange={(e) => setConfig({ ...config, contact: { ...config.contact, description: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* SOCIAL MEDIA REDIRECTS */}
            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Social Media Links</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2 rounded-xl">
                  <Facebook className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://facebook.com/..."
                    value={config.socials?.facebook || ""}
                    onChange={(e) => setConfig({ ...config, socials: { ...config.socials, facebook: e.target.value } })}
                    className="flex-grow bg-transparent text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2 rounded-xl">
                  <Twitter className="h-5 w-5 text-sky-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://twitter.com/..."
                    value={config.socials?.twitter || ""}
                    onChange={(e) => setConfig({ ...config, socials: { ...config.socials, twitter: e.target.value } })}
                    className="flex-grow bg-transparent text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2 rounded-xl">
                  <Linkedin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://linkedin.com/..."
                    value={config.socials?.linkedin || ""}
                    onChange={(e) => setConfig({ ...config, socials: { ...config.socials, linkedin: e.target.value } })}
                    className="flex-grow bg-transparent text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2 rounded-xl">
                  <Instagram className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    value={config.socials?.instagram || ""}
                    onChange={(e) => setConfig({ ...config, socials: { ...config.socials, instagram: e.target.value } })}
                    className="flex-grow bg-transparent text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2 rounded-xl">
                  <Youtube className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={config.socials?.youtube || ""}
                    onChange={(e) => setConfig({ ...config, socials: { ...config.socials, youtube: e.target.value } })}
                    className="flex-grow bg-transparent text-xs focus:outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("Contact & Social Coordinates")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Coordinates
              </button>
            </div>
          </div>
        )}

        {/* SECTION: 10. SEO & POPUPS */}
        {activeSubTab === "seo" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">SEO Optimization & Popups</h3>
              <p className="text-xs text-slate-400 mt-1">Configure search meta tags, custom browser indexing details, and toggle dynamic popup promotions.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">SEO Optimization Parameters</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Meta Indexing Title</label>
                  <input
                    type="text"
                    value={config.seo?.metaTitle || ""}
                    onChange={(e) => setConfig({ ...config, seo: { ...config.seo, metaTitle: e.target.value } })}
                    className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Platform Author Name</label>
                  <input
                    type="text"
                    value={config.seo?.author || ""}
                    onChange={(e) => setConfig({ ...config, seo: { ...config.seo, author: e.target.value } })}
                    className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Meta Keyword Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="White-label LMS, Coaching Management..."
                  value={config.seo?.metaKeywords || ""}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, metaKeywords: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Meta Description</label>
                <textarea
                  rows={3}
                  value={config.seo?.metaDescription || ""}
                  onChange={(e) => setConfig({ ...config, seo: { ...config.seo, metaDescription: e.target.value } })}
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Promotional Corner Popup Modal</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle a sleek bottom-right dismissable marketing popup on the homepage.</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.popup?.show}
                  onChange={(e) => setConfig({ ...config, popup: { ...config.popup, show: e.target.checked } })}
                  className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
                />
              </div>
              
              {config.popup?.show && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Popup Header Title</label>
                      <input
                        type="text"
                        value={config.popup.title}
                        onChange={(e) => setConfig({ ...config, popup: { ...config.popup, title: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Popup Dismiss Key Identifier</label>
                      <input
                        type="text"
                        value={config.popup.cookieKey}
                        onChange={(e) => setConfig({ ...config, popup: { ...config.popup, cookieKey: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Popup Short Description Content</label>
                    <input
                      type="text"
                      value={config.popup.description}
                      onChange={(e) => setConfig({ ...config, popup: { ...config.popup, description: e.target.value } })}
                      className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Button Action Label</label>
                      <input
                        type="text"
                        value={config.popup.ctaText}
                        onChange={(e) => setConfig({ ...config, popup: { ...config.popup, ctaText: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Button Redirect Route Link</label>
                      <input
                        type="text"
                        value={config.popup.ctaLink}
                        onChange={(e) => setConfig({ ...config, popup: { ...config.popup, ctaLink: e.target.value } })}
                        className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE ASSISTANT CHATBOT */}
            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Standard AI Support Chatbot</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Toggle a floating interactive product guide assistant at the bottom-left of public views.</p>
              </div>
              <input
                type="checkbox"
                checked={config.settings?.supportChatbot}
                onChange={(e) => setConfig({ ...config, settings: { ...config.settings, supportChatbot: e.target.checked } })}
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSaveSection("SEO & Popups Parameters")}
                disabled={isSaving}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Parameters
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
