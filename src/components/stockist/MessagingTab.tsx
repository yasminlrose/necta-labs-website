'use client';

import { useState } from "react";
import { Send, CheckCircle2, Mail, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MessagingTab = () => {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const businessName = (user?.user_metadata?.business_name as string) || "";

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/stockist-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: draft.trim(),
          senderEmail: user?.email,
          senderName: (user?.user_metadata?.full_name as string) || user?.email,
          businessName,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      setDraft("");
    } catch {
      setError("Couldn't send message. Email us directly at wholesale@nectalabs.com");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      {/* Account manager info bar */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            YR
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Yasmin · NECTA Labs</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-xs text-primary/50">Responds within 1 business day</p>
            </div>
          </div>
        </div>
        <a
          href="mailto:wholesale@nectalabs.com"
          className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
      </div>

      {/* Message box */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {sent ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-primary mb-1">Message sent</p>
            <p className="text-xs text-primary/50 mb-4">We'll reply to {user?.email} within 1 business day.</p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-primary/50 hover:text-primary underline transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border bg-muted/30">
              <p className="text-xs text-primary/50">
                To: <strong className="text-primary">wholesale@nectalabs.com</strong>
              </p>
              <p className="text-xs text-primary/50 mt-0.5">
                From: {user?.email}
              </p>
            </div>
            <div className="p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hi Yasmin, I wanted to ask about…"
                rows={5}
                className="w-full text-sm text-primary placeholder:text-primary/30 focus:outline-none resize-none"
              />
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between gap-3">
              {error && <p className="text-xs text-red-500 flex-1">{error}</p>}
              {!error && <span />}
              <button
                onClick={handleSend}
                disabled={!draft.trim() || sending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
                {sending ? "Sending…" : "Send message"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <Clock className="h-3.5 w-3.5 text-primary/40 flex-shrink-0" />
        <p className="text-xs text-primary/50">
          Mon–Fri, 9am–5pm. Messages outside business hours will be replied to next working day.
        </p>
      </div>
    </div>
  );
};

export default MessagingTab;
