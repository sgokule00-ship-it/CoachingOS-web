import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { SupportTicket, Coaching } from "../../types";
import { useToast } from "../../contexts/ToastContext";
import { Plus, LifeBuoy, CheckCircle, ChevronRight, MessageSquare, Send } from "lucide-react";

interface SupportModuleProps {
  coaching: Coaching;
  ownerId: string;
  ownerName: string;
}

export const SupportModule: React.FC<SupportModuleProps> = ({ coaching, ownerId, ownerName }) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ticket Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "Billing" });
  
  // Active Ticket focus
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    // Listen to tickets for this coaching
    const ticketQuery = query(
      collection(db, "support_tickets"),
      where("coachingId", "==", coaching.coachingId)
    );

    const unsub = onSnapshot(ticketQuery, (snap) => {
      const list: SupportTicket[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as SupportTicket);
      });
      setTickets(list);
      setLoading(false);
    });

    return unsub;
  }, [coaching.coachingId]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast("Please provide both title and description.", "error");
      return;
    }

    try {
      const ticketId = `st_${Date.now()}`;
      const docRef = doc(db, "support_tickets", `${coaching.coachingId}_${ticketId}`);
      
      const payload: SupportTicket = {
        id: `${coaching.coachingId}_${ticketId}`,
        coachingId: coaching.coachingId,
        ownerId,
        ownerName,
        coachingName: coaching.name,
        title: formData.title,
        description: formData.description,
        status: "open",
        category: formData.category,
        replies: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(docRef, payload);
      toast("Support ticket dispatched to Super Admin desk!", "success");
      setShowForm(false);
      setFormData({ title: "", description: "", category: "Billing" });
    } catch (err) {
      toast("Failed to log ticket.", "error");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      const ticketRef = doc(db, "support_tickets", selectedTicket.id);
      const updatedReplies = [
        ...(selectedTicket.replies || []),
        {
          id: `rep_${Date.now()}`,
          authorName: ownerName,
          authorRole: "owner",
          message: replyMessage,
          createdAt: new Date().toISOString()
        }
      ];

      await updateDoc(ticketRef, {
        replies: updatedReplies,
        status: "open" // revert back to open so admin sees it
      });

      setSelectedTicket({
        ...selectedTicket,
        replies: updatedReplies,
        status: "open"
      });
      setReplyMessage("");
      toast("Reply message sent successfully!", "success");
    } catch (err) {
      toast("Failed to submit reply.", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Tickets List column */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm space-y-4">
        
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
          <h3 className="font-display font-bold text-slate-850 dark:text-slate-150 text-base">Support Tickets</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Log Ticket
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateTicket} className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-lg"
              >
                <option value="Billing">Billing & Subscription</option>
                <option value="White labeling">White Label setup</option>
                <option value="Mobile app">Mobile app coordination</option>
                <option value="Other">Other operations</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Ticket Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. DNS CNAME binding issue"
                className="p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Describe Issue</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain in details..."
                className="p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg"
            >
              Submit Ticket
            </button>
          </form>
        )}

        {loading ? (
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ) : tickets.length === 0 ? (
          <p className="text-xs text-slate-400 py-12 text-center">No active tickets registered. Create one to begin.</p>
        ) : (
          <div className="space-y-2.5">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
                  selectedTicket?.id === t.id
                    ? "bg-blue-50/50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800"
                    : "bg-slate-50 dark:bg-slate-850 border-slate-150 hover:border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <strong className="block text-xs font-bold text-slate-800 dark:text-slate-200">{t.title}</strong>
                  <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                    t.status === "resolved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/15" : "bg-blue-500/10 text-blue-500 border-blue-500/15"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 mt-1 uppercase font-mono">{t.category} &bull; {new Date(t.createdAt).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Conversation Thread column */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm">
        {selectedTicket ? (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{selectedTicket.title}</h3>
                <span className="text-xs text-slate-400 uppercase font-mono font-bold">Category: {selectedTicket.category}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                selectedTicket.status === "resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-250"
              }`}>
                {selectedTicket.status}
              </span>
            </div>

            {/* Ticket desc */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-800 text-xs">
              <span className="block font-bold text-slate-400 mb-1">YOUR EXPLAINED PROBLEM DESCRIPTION:</span>
              <p className="text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">{selectedTicket.description}</p>
            </div>

            {/* Conversation list */}
            <div className="space-y-4">
              <span className="block text-xs font-bold text-slate-400 uppercase">Super Admin support Response stream:</span>
              
              {(selectedTicket.replies || []).length === 0 ? (
                <p className="text-xs text-slate-500">Super Admin has not written replies yet. The desk will respond shortly.</p>
              ) : (
                (selectedTicket.replies || []).map((rep) => (
                  <div 
                    key={rep.id} 
                    className={`p-3.5 rounded-xl border text-xs max-w-md ${
                      rep.authorRole === "super_admin"
                        ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-150 dark:border-indigo-850"
                        : "ml-auto bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-semibold">
                      <span>{rep.authorName} ({rep.authorRole === "super_admin" ? "SaaS Support" : "You"})</span>
                      <span className="font-mono">{new Date(rep.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-850 dark:text-slate-200 font-semibold leading-normal">{rep.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply sender form */}
            {selectedTicket.status !== "resolved" && (
              <form onSubmit={handleSendReply} className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <textarea
                  rows={2}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type a response message back to the support team..."
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Message
                </button>
              </form>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 space-y-2">
            <LifeBuoy className="h-10 w-10 text-slate-350 mx-auto" />
            <p className="text-xs">Select any logged support ticket from the side directory to compose conversation responses.</p>
          </div>
        )}
      </div>

    </div>
  );
};
