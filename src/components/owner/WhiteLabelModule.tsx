import React, { useState } from "react";
import { Coaching } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Palette, Eye, CheckCircle } from "lucide-react";

interface WhiteLabelModuleProps {
  coaching: Coaching;
}

export const WhiteLabelModule: React.FC<WhiteLabelModuleProps> = ({ coaching }) => {
  const { updateCoachingTheme, setCoachingState } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: coaching.name || "",
    primaryColor: coaching.primaryColor || "#0f172a",
    secondaryColor: coaching.secondaryColor || "#3b82f6",
    websiteTitle: coaching.websiteTitle || coaching.name || "",
    contactDetails: coaching.contactDetails || "",
    address: coaching.address || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const coachingRef = doc(db, "coachings", coaching.coachingId);
      const updatedCoaching: Coaching = {
        ...coaching,
        name: formData.name,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        websiteTitle: formData.websiteTitle,
        contactDetails: formData.contactDetails,
        address: formData.address
      };

      await setDoc(coachingRef, updatedCoaching, { merge: true });
      setCoachingState(updatedCoaching);
      toast("White label configurations deployed to servers!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to save whitelabel settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Settings Form */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl shadow-sm">
        <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white mb-6 flex items-center gap-2">
          <Palette className="h-5 w-5 text-blue-500" /> White Label Theme Customizer
        </h3>

        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Coaching Brand Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Website Tab Title</label>
              <input
                type="text"
                required
                value={formData.websiteTitle}
                onChange={(e) => setFormData({ ...formData, websiteTitle: e.target.value })}
                className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Primary Color (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-10 w-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  required
                  pattern="^#([A-Fa-f0-9]{6})$"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="p-3 w-full border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Secondary Color (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-10 w-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  required
                  pattern="^#([A-Fa-f0-9]{6})$"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="p-3 w-full border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Contact Details</label>
            <input
              type="text"
              required
              value={formData.contactDetails}
              onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
              className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Address Coordinates</label>
            <textarea
              rows={3}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? "Deploying brand configuration..." : "Save Whitelabel brand Settings"}
          </button>

        </form>
      </div>

      {/* Visual Workspace Previewer */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl border border-slate-850 flex flex-col gap-4">
          <h4 className="font-display font-bold text-white text-base flex items-center gap-1.5">
            <Eye className="h-5 w-5 text-blue-500" /> Active Brand Previewer
          </h4>
          
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: formData.primaryColor }}
              >
                {formData.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong className="block text-sm text-white leading-tight">{formData.name}</strong>
                <span className="text-[10px] uppercase font-mono tracking-wide" style={{ color: formData.secondaryColor }}>
                  {formData.websiteTitle}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg text-xs space-y-1">
              <span className="block font-semibold text-slate-300">Brand Primary Color:</span>
              <span className="font-mono text-slate-400">{formData.primaryColor}</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg text-xs space-y-1">
              <span className="block font-semibold text-slate-300">Physical Address Mapped:</span>
              <span className="text-slate-400 font-medium leading-relaxed">{formData.address || "No address declared."}</span>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Updates sync automatically to linked Android devices.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
