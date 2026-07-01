import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCms } from "../contexts/CmsContext";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  Database, 
  Smartphone, 
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageSquare,
  Sparkles,
  Megaphone,
  XCircle,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundOrbs } from "./BackgroundOrbs";

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();
  const { cmsConfig, loading } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMessage, setChatbotMessage] = useState("");
  const [chatbotHistory, setChatbotHistory] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Welcome to CoachingOS! How can I assist you with your coaching management system today?" }
  ]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Popup display based on local storage key
  useEffect(() => {
    if (cmsConfig.popup?.show) {
      const isDismissed = localStorage.getItem(cmsConfig.popup.cookieKey);
      if (!isDismissed) {
        // Delay slightly for natural entrance
        const timer = setTimeout(() => setShowPopup(true), 2500);
        return () => clearTimeout(timer);
      }
    } else {
      setShowPopup(false);
    }
  }, [cmsConfig.popup]);

  // Inject SEO settings dynamically
  useEffect(() => {
    if (cmsConfig.seo) {
      // Title
      document.title = cmsConfig.seo.metaTitle || cmsConfig.branding.websiteTitle || "CoachingOS";
      
      // Meta Description
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", cmsConfig.seo.metaDescription);

      // Meta Keywords
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", cmsConfig.seo.metaKeywords);
    }
  }, [cmsConfig.seo, cmsConfig.branding]);

  const handleDismissPopup = () => {
    setShowPopup(false);
    if (cmsConfig.popup?.cookieKey) {
      localStorage.setItem(cmsConfig.popup.cookieKey, "true");
    }
  };

  const handleDashboardRedirect = () => {
    if (userProfile?.role === "super_admin") {
      navigate("/admin");
    } else if (userProfile?.role === "owner") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatbotMessage.trim()) return;

    const userText = chatbotMessage;
    setChatbotHistory(prev => [...prev, { sender: "user", text: userText }]);
    setChatbotMessage("");

    // Simple AI simulation bot answers
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! A product specialist will connect with you shortly. You can also view our Pricing page or Contact Support for faster responses.";
      const textLower = userText.toLowerCase();
      if (textLower.includes("price") || textLower.includes("cost") || textLower.includes("plan")) {
        botResponse = "CoachingOS has growth-friendly plans! Our Pro Studio Plan is just $79/mo. You can view all features on our Pricing tab.";
      } else if (textLower.includes("trial") || textLower.includes("free")) {
        botResponse = "Yes! You can register a 14-day Standard Trial Account instantly with a 1-click mock data seeder option to test all modules right away.";
      } else if (textLower.includes("android") || textLower.includes("mobile") || textLower.includes("app")) {
        botResponse = "Both our Web App and Android Mobile app sync instantly in real-time. Students, parents, and teachers can use the mobile app while you manage everything on the web.";
      } else if (textLower.includes("demo") || textLower.includes("mock") || textLower.includes("data")) {
        botResponse = "You can populate mock students, batches, and fee records inside your trial owner dashboard in just one click to easily preview the operations!";
      }

      setChatbotHistory(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" }
  ];

  const brandLetter = cmsConfig.branding?.logoLetter || "C";
  const brandName = cmsConfig.branding?.logoText || "CoachingOS";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Frosted background elements */}
      <BackgroundOrbs />

      {/* Dynamic Announcement Bar */}
      {cmsConfig.announcementBar?.show && (
        <div className={`py-2 px-4 text-center text-xs font-semibold tracking-wide transition-all ${cmsConfig.announcementBar.bgClass || 'bg-indigo-600'} ${cmsConfig.announcementBar.textClass || 'text-white'} flex items-center justify-center gap-2 relative z-50`}>
          <Megaphone className="h-4 w-4 animate-bounce flex-shrink-0" />
          <span>{cmsConfig.announcementBar.text}</span>
          {cmsConfig.announcementBar.link && (
            <Link to={cmsConfig.announcementBar.link} className="underline hover:opacity-90 ml-1 inline-flex items-center gap-0.5">
              {cmsConfig.announcementBar.linkText || 'Learn More'} &rarr;
            </Link>
          )}
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 dark:border-white/10 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              {brandLetter}
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              {brandName.endsWith("OS") ? (
                <>
                  {brandName.slice(0, -2)}<span className="text-blue-600 dark:text-blue-400">OS</span>
                </>
              ) : (
                brandName
              )}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive 
                      ? "text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDashboardRedirect}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1 group"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions Container */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg relative z-40"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    location.pathname === item.path
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <hr className="border-slate-100 dark:border-slate-800 my-1" />

              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDashboardRedirect();
                    }}
                    className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-xl"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center px-4 py-2.5 text-base font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-base font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-base font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-xl shadow-md"
                  >
                    Start Free Trial
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow relative">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo and About */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                  {brandLetter}
                </div>
                <span className="font-display font-bold text-lg text-white">
                  {brandName.endsWith("OS") ? (
                    <>
                      {brandName.slice(0, -2)}<span className="text-blue-500">OS</span>
                    </>
                  ) : (
                    brandName
                  )}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {cmsConfig.footer?.text || "The ultimate enterprise white-label coaching management platform. Launch, scale, and automate your coaching institute globally."}
              </p>
              
              {/* Dynamic Social Media Links */}
              <div className="flex items-center gap-3.5">
                {cmsConfig.socials?.facebook && (
                  <a href={cmsConfig.socials.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors" title="Facebook">
                    <Facebook className="h-4.5 w-4.5" />
                  </a>
                )}
                {cmsConfig.socials?.twitter && (
                  <a href={cmsConfig.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors" title="Twitter">
                    <Twitter className="h-4.5 w-4.5" />
                  </a>
                )}
                {cmsConfig.socials?.linkedin && (
                  <a href={cmsConfig.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                )}
                {cmsConfig.socials?.instagram && (
                  <a href={cmsConfig.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" title="Instagram">
                    <Instagram className="h-4.5 w-4.5" />
                  </a>
                )}
                {cmsConfig.socials?.youtube && (
                  <a href={cmsConfig.socials.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500 transition-colors" title="YouTube">
                    <Youtube className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Dynamic Footer Links Columns */}
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Navigation</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">All Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Enterprise Hub</h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Enterprise SLA</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Rules</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Gateway</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Coaching Signup</Link></li>
              </ul>
            </div>

            {/* Platform Integration Info */}
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Synchronized</h3>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  CLOUDSYNC ACTIVE
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {userProfile?.role === "super_admin" ? (
                    <>Connected directly to Firestore project ID <span className="font-mono text-blue-400">long-wind-w0bnn</span>. Real-time updates sync instantly with the Android mobile app.</>
                  ) : (
                    <>CoachingOS Enterprise cloud synchronizes all schedules, fees, attendance, and materials instantly across web and mobile views.</>
                  )}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    <Database className="h-3 w-3 text-blue-400" /> {userProfile?.role === "super_admin" ? "Firestore" : "Secure Cloud"}
                  </span>
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    <Smartphone className="h-3 w-3 text-blue-400" /> Mobile Hub
                  </span>
                </div>
              </div>
            </div>

          </div>

          <hr className="border-slate-850 my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} {cmsConfig.footer?.copyright || "CoachingOS Ltd. All rights reserved."}</p>
            {userProfile?.role === "super_admin" && (
              <p className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                Active Sync Node <span className="text-emerald-400">long-wind-w0bnn</span>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* --- Dynamic Dismissable Promotional Center/Corner Popup --- */}
      <AnimatePresence>
        {showPopup && cmsConfig.popup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Bell className="h-5 w-5 animate-swing" />
                <span className="text-xs font-bold uppercase tracking-wider">Announcement</span>
              </div>
              <button
                onClick={handleDismissPopup}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug">
                {cmsConfig.popup.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1.5">
                {cmsConfig.popup.description}
              </p>
            </div>
            {cmsConfig.popup.ctaText && (
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={handleDismissPopup}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800"
                >
                  Close
                </button>
                <Link
                  to={cmsConfig.popup.ctaLink || "#"}
                  onClick={handleDismissPopup}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm"
                >
                  {cmsConfig.popup.ctaText}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Dynamic Live Assistant Chatbot --- */}
      {cmsConfig.settings?.supportChatbot && (
        <div className="fixed bottom-6 left-6 z-40">
          <AnimatePresence>
            {showChatbot ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-80 sm:w-88 flex flex-col overflow-hidden h-[400px]"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/25 rounded-lg">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs">Platform Assistant</h4>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online Sync Enabled
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowChatbot(false)} className="hover:opacity-80">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Chat Content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
                  {chatbotHistory.map((item, idx) => (
                    <div key={idx} className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                        item.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      }`}>
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="border-t border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask about features, pricing..."
                    value={chatbotMessage}
                    onChange={(e) => setChatbotMessage(e.target.value)}
                    className="flex-1 text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChatbot(true)}
                className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
                title="Open Assistant Support Chatbot"
              >
                <MessageSquare className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
