import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { CmsProvider } from "./contexts/CmsContext";
// Layout
import { PublicLayout } from "./components/PublicLayout";

// Public Pages
import { Landing } from "./pages/Landing";
import { Features } from "./pages/Features";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";

// Private Dashboards
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

// Protected Route Guard for Coaching Owners
const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing user nodes...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role === "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  if (userProfile?.role !== "owner") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-rose-500">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-2">Only whitelisted Coaching Owners can log in to this web terminal.</p>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return <>{children}</>;
};

// Protected Route Guard for Super Admins
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing core nodes...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== "super_admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CmsProvider>
            <BrowserRouter>
              <Routes>
                
                {/* Public Website Pages (with Public Header/Footer Layout) */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Secure Multitenant Dashboards */}
                <Route 
                  path="/dashboard" 
                  element={
                    <OwnerRoute>
                      <OwnerDashboard />
                    </OwnerRoute>
                  } 
                />

                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />

                {/* Route Fallbacks */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </BrowserRouter>
          </CmsProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
