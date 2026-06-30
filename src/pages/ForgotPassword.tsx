import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Mail, ArrowLeft, Send } from "lucide-react";

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Please enter your email address.", "error");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      toast("A password reset link has been dispatched to your email address.", "success");
      setEmail("");
    } catch (error: any) {
      console.error(error);
      toast(error.message || "Unable to dispatch password reset. Please double check.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Login</span>
        </Link>

        {/* Branding Title */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your account email address and we will dispatch a reset link to your inbox.
          </p>
        </div>

        {/* Form */}
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourcoaching.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? "Sending reset..." : "Send Reset Link"}
            <Send className="h-4 w-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
