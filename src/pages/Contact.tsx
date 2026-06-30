import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast("Please complete all form fields.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast("Thank you! Your message has been sent to CoachingOS Support.", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Have questions about white-label migration, custom subdomains, or mobile app integration? Drop our architects a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-8 rounded-2xl shadow-sm flex flex-col gap-6">
              
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" /> Support Desk
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our core database and whitelabel configuration team is available Mon-Fri, 9:00 AM - 6:00 PM UTC.
              </p>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-4">
                
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-blue-50 dark:bg-slate-850 rounded-xl text-blue-600 dark:text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-450 font-semibold uppercase">Email</span>
                    <a href="mailto:support@coachingos.com" className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600">
                      support@coachingos.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-blue-50 dark:bg-slate-850 rounded-xl text-blue-600 dark:text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-450 font-semibold uppercase">Phone</span>
                    <a href="tel:+18005550199" className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600">
                      +1 (800) 555-0199
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-blue-50 dark:bg-slate-850 rounded-xl text-blue-600 dark:text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-450 font-semibold uppercase">HQ Address</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Suite 404, Tech Arcade, Silicon Valley, CA
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Project status card */}
            <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl border border-slate-850 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Connection Active
              </span>
              <span className="text-sm font-bold text-white font-display">CoachingOS Cloud Active</span>
              <p className="text-xs text-slate-450">
                Your support tickets and administration workspaces are secured via advanced secure cloud systems and modern data isolation.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 rounded-2xl shadow-sm">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-500 uppercase">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help you?"
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-500 uppercase">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your coaching scale or details..."
                  className="p-3 border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
