import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  History, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  ArrowRight
} from "lucide-react";

interface BillingModuleProps {
  coaching: any;
  userProfile: any;
}

const PLANS = [
  {
    id: "starter_monthly",
    name: "Starter Studio Plan",
    price: 799,
    currency: "INR",
    period: "month",
    description: "Ideal for growing individual studios starting up.",
    features: [
      "Up to 50 active students",
      "Academic batch planner",
      "Simple attendance ledger",
      "Email support within 24 hours"
    ]
  },
  {
    id: "growth_monthly",
    name: "Growth Scale Plan",
    price: 2499,
    currency: "INR",
    period: "month",
    description: "Perfect for multi-batch institutes with faculty rosters.",
    features: [
      "Unlimited active students",
      "Full faculty roster & permissions",
      "Automated attendance logs",
      "Tuition fee tracker",
      "Priority priority support"
    ],
    isPopular: true
  },
  {
    id: "pro_annual",
    name: "Pro Studio Annual",
    price: 19999,
    currency: "INR",
    period: "year",
    description: "Best value for full white-label brand ownership.",
    features: [
      "Full White-Label portal setup",
      "Custom brand colors & secondary menus",
      "Unlimited batch rosters & tutors",
      "Advanced revenue analytics reports",
      "Dedicated account manager support"
    ],
    badge: "Best Value"
  }
];

export const BillingModule: React.FC<BillingModuleProps> = ({ coaching, userProfile }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Simulation Modal States
  const [showSimModal, setShowSimModal] = useState(false);
  const [activeSimOrder, setActiveSimOrder] = useState<any>(null);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  // Fetch Payment Logs in real-time
  useEffect(() => {
    if (!coaching?.coachingId) return;

    const q = query(
      collection(db, "payments"),
      where("coachingId", "==", coaching.coachingId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      setPayments(logs);
      setLoading(false);
    }, (error) => {
      console.error("Failed to load payment history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [coaching?.coachingId]);

  // Dynamically load the Cashfree SDK script based on sandbox/production environment mode
  const loadCashfreeSDK = (isSandbox: boolean): Promise<any> => {
    return new Promise((resolve, reject) => {
      const scriptId = "cashfree-sdk-script";
      const existingScript = document.getElementById(scriptId);

      if (existingScript) {
        resolve((window as any).Cashfree);
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = isSandbox 
        ? "https://sdk.cashfree.com/js/v3/2.0.0/cashfree.sandbox.js" 
        : "https://sdk.cashfree.com/js/v3/2.0.0/cashfree.js";
      script.async = true;
      script.onload = () => resolve((window as any).Cashfree);
      script.onerror = () => reject(new Error("Cashfree SDK script load failed"));
      document.body.appendChild(script);
    });
  };

  // Trigger Purchase order creation
  const handlePurchase = async (plan: typeof PLANS[0]) => {
    try {
      setProcessing(plan.id);

      // Create Cashfree Order securely via Cloud Function / local Node server proxy
      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          coachingId: coaching.coachingId,
          userId: userProfile.uid,
          amount: plan.price,
          currency: plan.currency
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout order");
      }

      if (data.isSimulated) {
        // Cashfree keys not set on server, open gorgeous simulated bypass modal
        setActiveSimOrder({
          orderId: data.order_id,
          orderSessionId: data.order_session_id,
          planName: plan.name,
          amount: plan.price
        });
        setShowSimModal(true);
        setProcessing(null);
        return;
      }

      // Real Cashfree API keys configured! Retrieve configuration metadata
      const configResp = await fetch("/api/cashfree/config");
      const configData = await configResp.json();

      const isSandbox = configData.env !== "PROD";
      const CashfreeLib = await loadCashfreeSDK(isSandbox);
      const cashfreeInstance = CashfreeLib({ mode: isSandbox ? "sandbox" : "production" });

      // Trigger official Cashfree Inline/Redirect Web Checkout UI
      cashfreeInstance.checkout({
        paymentSessionId: data.order_session_id,
        redirectTarget: "_self"
      });

    } catch (err: any) {
      console.error("Purchase error:", err);
      alert(err.message || "An error occurred during order creation.");
    } finally {
      setProcessing(null);
    }
  };

  // Simulate complete payment on backend
  const handleSimulatePayment = async (success: boolean) => {
    if (!activeSimOrder) return;
    try {
      setSimulatingPayment(true);

      if (!success) {
        // Mark as failed locally or on simulated orders
        alert("Simulating checkout cancellation / failure.");
        setShowSimModal(false);
        setActiveSimOrder(null);
        return;
      }

      // Submit payment completion request to Express server simulator
      const response = await fetch("/api/cashfree/sim-complete-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: activeSimOrder.orderId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to complete simulation");
      }

      setShowSimModal(false);
      setActiveSimOrder(null);
    } catch (err: any) {
      console.error("Simulation error:", err);
      alert(err.message || "An error occurred during payment simulation");
    } finally {
      setSimulatingPayment(false);
    }
  };

  // Format Date gracefully
  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calculate remaining subscription trial/active days
  const getSubscriptionDaysLeft = () => {
    if (!coaching?.subscription?.endsAt) return 0;
    const end = new Date(coaching.subscription.endsAt).getTime();
    const now = Date.now();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getSubscriptionDaysLeft();
  const subStatus = coaching?.subscription?.status || "trial";
  const activePlanName = coaching?.subscription?.plan || "Free Trial Tier";

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* 1. Subscription Header Overview Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="h-24 w-24 text-indigo-500" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Subscription Node</span>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white capitalize">
                {activePlanName}
              </h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                subStatus === "active" 
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20"
              }`}>
                {subStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-450">
              Valid until: <strong className="text-slate-800 dark:text-slate-200">
                {coaching?.subscription?.endsAt ? formatDate(coaching.subscription.endsAt) : "N/A"}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6 py-2">
            <div className="space-y-1">
              <span className="block text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {daysRemaining}
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days Access Left</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Plan Grid Container */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">Upgrade or Renew Plans</h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose a premium tier to scale your student directories, white-label portals, and unlock Priority support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = activePlanName === plan.name && subStatus === "active";
            const isProcessing = processing === plan.id;

            return (
              <div 
                key={plan.id}
                className={`bg-white dark:bg-slate-900 border-2 rounded-3xl p-6 relative flex flex-col justify-between transition-all hover:shadow-md ${
                  plan.isPopular 
                    ? "border-indigo-500 dark:border-indigo-400 shadow-sm" 
                    : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 fill-current" /> {plan.badge}
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="font-display font-extrabold text-2xl text-slate-950 dark:text-white">₹{plan.price}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">/{plan.period}</span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800/80 mb-4" />

                  <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed border border-emerald-500/20"
                      : plan.isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white"
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Active Subscription</span>
                    </>
                  ) : isProcessing ? (
                    <>
                      <div className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      <span>Initiating Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade Plan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Payment Transaction Logs */}
      <div className="glass-card rounded-3xl border border-white/20 dark:border-white/10 p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <History className="h-5 w-5 text-indigo-500" />
          <h3 className="font-display font-extrabold text-base text-slate-950 dark:text-white">Unified Transaction History</h3>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] text-slate-450 uppercase font-bold tracking-wider">Syncing Transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-bold uppercase tracking-wider">No Transaction Logs Recorded</p>
            <p className="text-[10px] text-slate-400">Upgrade a plan to register transaction entries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Gateway Status</th>
                  <th className="py-3 px-4">Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/30">
                {payments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[11px] text-slate-800 dark:text-slate-250">
                      {tx.cashfreePaymentId || tx.id}
                      {tx.isSimulated && (
                        <span className="ml-1.5 text-[8px] font-extrabold uppercase px-1 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                          SIM
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-750 dark:text-slate-300">
                      {tx.planName}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-900 dark:text-white font-bold">
                      {tx.currency === "INR" ? "₹" : "$"}
                      {tx.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide inline-flex items-center gap-1 border ${
                        tx.status === "success"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-500/10 dark:bg-emerald-950/10 dark:text-emerald-450"
                          : tx.status === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-500/10 dark:bg-amber-950/10 dark:text-amber-450"
                            : "bg-rose-50 text-rose-600 border-rose-500/10 dark:bg-rose-950/10 dark:text-rose-450"
                      }`}>
                        {tx.status === "success" && <span className="h-1 w-1 bg-emerald-500 rounded-full" />}
                        {tx.status === "pending" && <span className="h-1 w-1 bg-amber-500 rounded-full animate-pulse" />}
                        {tx.status === "failed" && <span className="h-1 w-1 bg-rose-500 rounded-full" />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-450 dark:text-slate-400 text-[10px]">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Interactive Simulated Bypass Modal */}
      {showSimModal && activeSimOrder && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl relative animate-scale-up text-left">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white">
                Cashfree Gateway Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Cashfree PG API credentials are not set on this server. This sandbox simulation replicates the exact server-side webhooks flow for manual testing.
              </p>
            </div>

            {/* Order specs panel */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-2 text-xs border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Plan Selected:</span>
                <span className="font-bold text-slate-800 dark:text-white">{activeSimOrder.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Session Ref:</span>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{activeSimOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Total Due:</span>
                <span className="font-display font-extrabold text-base text-slate-950 dark:text-white">₹{activeSimOrder.amount}.00</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleSimulatePayment(true)}
                disabled={simulatingPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {simulatingPayment ? (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Simulate Webhook Success Update</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSimulatePayment(false)}
                disabled={simulatingPayment}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold py-3 rounded-xl text-xs transition-all"
              >
                Cancel Simulated Checkout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
