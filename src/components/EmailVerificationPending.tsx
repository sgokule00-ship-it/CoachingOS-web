import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "motion/react";
import { Mail, RefreshCw, Send, CheckCircle2, AlertTriangle, LogOut, Loader2 } from "lucide-react";

export const EmailVerificationPending: React.FC = () => {
  const { currentUser, userProfile, sendVerificationEmail, checkVerificationStatus, verifySimulatedEmail, logout } = useAuth();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle countdown timer for resend cooling off
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    setSending(true);
    try {
      await sendVerificationEmail();
      toast("A fresh verification link has been sent to your email address.", "success");
      setCountdown(60); // 60 seconds cooling off period
    } catch (err: any) {
      toast(err.message || "Failed to dispatch verification email.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const isVerified = await checkVerificationStatus();
      if (isVerified) {
        toast("Email verified successfully! Welcome to CoachingOS.", "success");
      } else {
        toast("Verification pending. Please check your spam folder or click the verification link first.", "info");
      }
    } catch (err: any) {
      toast(err.message || "Failed to fetch verification status.", "error");
    } finally {
      setChecking(false);
    }
  };

  const handleInstantVerify = async () => {
    setChecking(true);
    try {
      await verifySimulatedEmail();
      toast("Sandbox account auto-verified successfully!", "success");
    } catch (err: any) {
      toast(err.message || "Failed to bypass verification.", "error");
    } finally {
      setChecking(false);
    }
  };

  const isSimulated = currentUser?.uid.startsWith("sim_");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 text-center"
      >
        {/* Verification Icon Wrapper */}
        <div className="relative mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Mail className="h-10 w-10 animate-bounce" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-extrabold text-white">
            !
          </span>
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-widest font-extrabold uppercase text-blue-600 dark:text-blue-400">
            Security Checkpoint
          </span>
          <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We sent a secure verification link to:
            <strong className="block text-slate-800 dark:text-slate-200 mt-1 break-all select-all text-xs font-mono p-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg">
              {currentUser?.email || userProfile?.email || "your email address"}
            </strong>
          </p>
        </div>

        {/* Dynamic Sandbox Mode Info Box */}
        {isSimulated ? (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl text-left space-y-2">
            <div className="flex gap-2 items-center text-indigo-700 dark:text-indigo-400">
              <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 animate-pulse" />
              <strong className="text-xs font-bold uppercase tracking-wider">Simulated Account Active</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are signed in with a test/simulated account in the sandbox. You can instantly bypass this screen below to explore the full suite of CoachingOS modules.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wide">Next steps:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Open your email client inbox and look for the email.</li>
              <li>Click the verification link to authorize your account.</li>
              <li>Return to this page and click <strong>Check Verification Status</strong>.</li>
            </ul>
          </div>
        )}

        {/* Action Button Controls */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking || sending}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-sm"
          >
            {checking ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <RefreshCw className="h-4.5 w-4.5" />
            )}
            Check Verification Status
          </button>

          <button
            onClick={handleResend}
            disabled={checking || sending || countdown > 0}
            className="w-full py-3.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-sm"
          >
            {sending ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Send className="h-4.5 w-4.5" />
            )}
            {countdown > 0 ? `Resend Email (${countdown}s)` : "Resend Verification Email"}
          </button>

          {/* Quick Sandbox Bypass Option */}
          {isSimulated && (
            <button
              onClick={handleInstantVerify}
              disabled={checking}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              <CheckCircle2 className="h-4 w-4" />
              Instant Verify (Sandbox Bypass)
            </button>
          )}
        </div>

        {/* Back / Logout Option */}
        <div className="pt-2 border-t border-slate-150 dark:border-slate-850">
          <button
            onClick={logout}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out / Register Again
          </button>
        </div>
      </motion.div>
    </div>
  );
};
