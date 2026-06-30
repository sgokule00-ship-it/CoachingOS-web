import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Mail, Lock, LogIn, AlertTriangle, ArrowRight, Check } from "lucide-react";

export const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [restrictionError, setRestrictionError] = useState(false);
  const [operationNotAllowedError, setOperationNotAllowedError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please provide both email and password.", "error");
      return;
    }
    setLoading(true);
    setRestrictionError(false);
    setOperationNotAllowedError(false);
    
    try {
      const profile = await login(email, password);
      toast(`Welcome back, ${profile.name}!`, "success");
      
      // Role-based redirects
      if (profile.role === "super_admin") {
        navigate("/admin");
      } else if (profile.role === "owner") {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === "auth/operation-not-allowed" || error.message?.includes("operation-not-allowed")) {
        setOperationNotAllowedError(true);
        toast("Email/Password login is currently offline. Please use the simulated accounts below.", "error");
      } else if (error.message === "WEBSITE_RESTRICTED") {
        setRestrictionError(true);
        toast("Access restricted. Please use the mobile app.", "error");
      } else {
        toast("Authentication failed. Please verify credentials.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setRestrictionError(false);
    setOperationNotAllowedError(false);
    try {
      const profile = await loginWithGoogle();
      toast(`Welcome, ${profile.name}!`, "success");
      
      // Role-based redirects
      if (profile.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      if (error.message === "WEBSITE_RESTRICTED") {
        setRestrictionError(true);
        toast("Access restricted. Please use the mobile app.", "error");
      } else {
        toast("Google Sign-In failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-2">
            Sign In
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Access your CoachingOS operational control panels.
          </p>
        </div>

        {/* Restricted Role Alert */}
        {restrictionError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-850 text-slate-750 dark:text-slate-200 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs space-y-1">
              <strong className="block text-slate-900 dark:text-amber-400 text-sm font-bold">Portal Access Denied</strong>
              <p className="leading-relaxed font-semibold">
                Teachers, students, and parents cannot log in on the website.
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase tracking-wide">
                Please use the CoachingOS Android application.
              </p>
            </div>
          </div>
        )}

        {/* Secure Sync Auth Mode Warning */}
        {operationNotAllowedError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-350 dark:border-amber-800/80 text-slate-750 dark:text-slate-200 flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 animate-pulse" />
              <strong className="text-slate-900 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Cloud Sync Mode Active</strong>
            </div>
            <div className="text-xs space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                The secure cloud network is currently operating in sandbox synchronization mode.
              </p>
              <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-850 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                💡 Note: You can use any of the preset simulated accounts below to log in instantly!
              </div>
            </div>
          </div>
        )}

        {/* Demo Login Assist Panel */}
        <div className="mb-6 p-3 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex flex-col gap-2">
          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
            TESTING CREDENTIALS ASSIST
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setEmail("admin@coachingos.com");
                setPassword("admin123");
              }}
              className="p-2 border border-blue-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-left font-mono hover:bg-slate-50 text-[11px]"
            >
              <strong className="block text-blue-600 dark:text-blue-400">Super Admin:</strong>
              admin@coachingos.com / admin123
            </button>
            <button
              onClick={() => {
                setEmail("owner@demo.com");
                setPassword("owner123");
              }}
              className="p-2 border border-blue-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-left font-mono hover:bg-slate-50 text-[11px]"
            >
              <strong className="block text-indigo-600 dark:text-indigo-400">Demo Owner:</strong>
              owner@demo.com / owner123
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setRestrictionError(false);
                }}
                placeholder="you@coachingos.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setRestrictionError(false);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <LogIn className="h-4.5 w-4.5" />
          </button>

        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100 dark:border-slate-800/80" />
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-750 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.23 1.83 15.52 1 12.24 1 6.05 1 1.05 6.05 1.05 12.24s5 11.24 11.19 11.24c6.35 0 10.58-4.47 10.58-10.77 0-.725-.075-1.275-.175-1.825H12.24z"
            />
          </svg>
          Continue with Google
        </button>

        <hr className="border-slate-100 dark:border-slate-800/80 my-6" />

        <p className="text-sm text-center text-slate-500 dark:text-slate-400">
          Want to register a coaching institute?{" "}
          <Link 
            to="/register" 
            className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Start Free Trial &rarr;
          </Link>
        </p>

      </div>
    </div>
  );
};
