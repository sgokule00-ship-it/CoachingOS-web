import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Sun, Moon, Menu, X, ArrowRight, LayoutDashboard, Database, Smartphone, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundOrbs } from "./BackgroundOrbs";

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardRedirect = () => {
    if (userProfile?.role === "super_admin") {
      navigate("/admin");
    } else if (userProfile?.role === "owner") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Frosted background elements */}
      <BackgroundOrbs />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 dark:border-white/10 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              C
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Coaching<span className="text-blue-600 dark:text-blue-400">OS</span>
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
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg"
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
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo and About */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                  C
                </div>
                <span className="font-display font-bold text-lg text-white">
                  Coaching<span className="text-blue-500">OS</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The ultimate enterprise white-label coaching management platform. Launch, scale, and automate your coaching institute globally.
              </p>
            </div>

            {/* Links - Product */}
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise SLA</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Rules</a></li>
              </ul>
            </div>

            {/* Links - Company */}
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
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
            <p>&copy; {new Date().getFullYear()} CoachingOS Ltd. All rights reserved.</p>
            {userProfile?.role === "super_admin" && (
              <p className="flex items-center gap-1">
                Active Firebase Node <span className="font-mono text-emerald-400">long-wind-w0bnn</span>
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
