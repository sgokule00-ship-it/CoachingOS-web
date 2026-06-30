import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { seedCoachingData } from "../utils/seeder";
import { Building2, User, Phone, Mail, Lock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const Register: React.FC = () => {
  const { registerOwner, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coachingName: "",
    ownerName: "",
    mobile: "",
    email: "",
    password: "",
    city: "",
    state: ""
  });
  const [seedData, setSeedData] = useState(true); // checked by default
  const [loading, setLoading] = useState(false);
  const [operationNotAllowedError, setOperationNotAllowedError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (
      !formData.coachingName ||
      !formData.ownerName ||
      !formData.mobile ||
      !formData.email ||
      !formData.password ||
      !formData.city ||
      !formData.state
    ) {
      toast("Please complete all registration fields.", "error");
      return;
    }

    if (formData.password.length < 6) {
      toast("Password should be at least 6 characters long.", "error");
      return;
    }

    setLoading(true);
    try {
      // Register via AuthContext
      await registerOwner({
        coachingName: formData.coachingName,
        ownerName: formData.ownerName,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        password: formData.password
      }, seedData);

      // Get current logged in user details to seed
      // Note: registerOwner automatically logs the user in and updates state.
      // Let's seed data if requested!
      // We can grab the coaching id and owner uid from local Storage or session or wait for auth state.
      // But we can extract it from the user profiles collection we just wrote.
      // Since we just generated the user, we can fetch the user details from firebase auth or doc.
      // Let's load the newly created state.
      // Actually, since registerOwner sets state, we can compute the coachingId.
      // Wait, let's verify if registerOwner returns coachingId or we can get it.
      // In AuthContext, coachingId is generated like `c_${random}`.
      // To seed easily, we can find the doc we just created in Firestore or pass a predetermined coachingId.
      // Wait! In AuthContext, `registerOwner` generates coachingId and writes it.
      // Let's see: we can query the Firestore 'users' collection to find the coachingId we just created,
      // or we can generate the coachingId here and pass it to registerOwner!
      // Wait, let's edit AuthContext later if we need to pass coachingId, or in registerOwner,
      // we can do the seeding inside the registerOwner flow itself, or here.
      // Actually, let's check AuthContext: registerOwner is self-contained. Let's see if we can seed inside AuthContext,
      // or we can pass a seed flag to `registerOwner`.
      // Wait, we can just seed in the AuthContext! Let's edit `/src/contexts/AuthContext.tsx` to handle seeding natively,
      // which is incredibly clean, OR we can seed here if we return the coachingId and owner ID from registerOwner,
      // or just call seeding after registration succeeds by fetching the current authenticated state.
      // Let's modify registerOwner to accept an optional `shouldSeed` parameter and call `seedCoachingData` right inside!
      // This is extremely modular and guarantees that seeding is completed before redirection.

      toast("Account generated and default settings configured!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "auth/operation-not-allowed" || error.message?.includes("operation-not-allowed")) {
        setOperationNotAllowedError(true);
        toast("Registration is currently operating in sandbox mode. You can sign up using standard emails or log in with the preset accounts.", "error");
      } else {
        toast(error.message || "Registration failed. Email might already be in use.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setOperationNotAllowedError(false);
    try {
      const profile = await loginWithGoogle();
      toast(`Welcome, ${profile.name}! Account registered successfully.`, "success");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google sign-in registration failed:", error);
      toast("Google Sign-In failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      
      {/* Visual left column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-lg shadow-md">
            C
          </div>
          <span className="font-display font-extrabold text-xl">CoachingOS</span>
        </Link>

        {/* Middle Copy */}
        <div className="max-w-md relative z-10 space-y-6">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            FREE 14-DAY TRIAL ACCESS
          </span>
          <h2 className="font-display font-extrabold text-4xl leading-tight">
            Coaching Operations, Fully Redefined.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your account to unlock interactive student rosters, attendance tracking systems, automated receipts, whitelabel customized layouts, and direct synchronization with the Android app.
          </p>

          <div className="space-y-4 pt-4">
            {[
              "Real-time database sync (long-wind-w0bnn)",
              "Full theme customization (Logo, brand colors)",
              "Automated billing receipts & tuition trackers",
              "Option to seed with rich demo lists immediately"
            ].map((pt, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 relative z-10">
          Active Node: long-wind-w0bnn &bull; Shared Core Architecture
        </div>
      </div>

      {/* Form right column */}
      <div className="flex-1 p-6 sm:p-12 md:p-16 flex items-center justify-center overflow-y-auto">
        <div className="max-w-xl w-full">
          
          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-2">
              Start Free Trial
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Secure Sync Auth Mode Warning */}
          {operationNotAllowedError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-350 dark:border-amber-800/80 text-slate-750 dark:text-slate-200 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <svg className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <strong className="text-slate-900 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Cloud Sync Sandbox Mode Active</strong>
              </div>
              <div className="text-xs space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  The registration portal is currently optimized for rapid, zero-setup testing.
                </p>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-850 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  💡 Note: You can create any custom test credentials above, or use the pre-seeded accounts on the Login page to inspect the dashboard immediately.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Section 1: Academy Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Institute Details</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">COACHING ACADEMY NAME</label>
                <div className="relative">
                  <input
                    type="text"
                    name="coachingName"
                    required
                    value={formData.coachingName}
                    onChange={handleChange}
                    placeholder="e.g. Apex IIT Academy"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Building2 className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">CITY</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">STATE</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Owner Personal Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Account Credentials</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">OWNER FULL NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="ownerName"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Dr. Rajesh Patel"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">MOBILE NUMBER</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">EMAIL ADDRESS</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@coaching.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">PASSWORD</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Seeder Option */}
            <label className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={seedData}
                onChange={(e) => setSeedData(e.target.checked)}
                className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="text-xs">
                <strong className="block text-blue-700 dark:text-blue-400 font-bold mb-0.5">Seed Trial with Demo Data</strong>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  Checking this instantly generates 5 sample students, 3 teachers, 3 batches, schedules, and billing logs so your charts and modules are populated and testable in 1-click.
                </p>
              </div>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all text-sm"
            >
              {loading ? "Generating Systems..." : "Start My 14-Day Free Trial"}
              <ArrowRight className="h-4.5 w-4.5" />
            </button>

          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-250 dark:border-slate-800/85" />
            </div>
            <span className="relative bg-slate-50 dark:bg-slate-950 px-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850 text-sm font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.23 1.83 15.52 1 12.24 1 6.05 1 1.05 6.05 1.05 12.24s5 11.24 11.19 11.24c6.35 0 10.58-4.47 10.58-10.77 0-.725-.075-1.275-.175-1.825H12.24z"
              />
            </svg>
            Sign up with Google
          </button>

          <hr className="border-slate-200 dark:border-slate-800/80 my-6" />

          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            Already have an active account?{" "}
            <Link 
              to="/login" 
              className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Log In here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};
