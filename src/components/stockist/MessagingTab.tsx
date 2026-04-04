import { useState, useRef, useEffect } from "react";
import { Send, Clock, Calendar, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  from: "stockist" | "necta";
  body: string;
  timestamp: string;
  sender_name: string;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: "m1",
    from: "necta",
    body: "Hi! Welcome to your NECTA stockist portal. I'm Yasmin, your account manager. Feel free to message me here any time — I'm available Mon–Fri 9am–5pm and respond within 4 hours.",
    timestamp: "2025-11-16T10:30:00Z",
    sender_name: "Yasmin · Account Manager",
  },
  {
    id: "m2",
    from: "stockist",
    body: "Hi Yasmin, thanks! Quick question — do you have any POS display stands available for the counter?",
    timestamp: "2025-11-18T14:22:00Z",
    sender_name: "You",
  },
  {
    id: "m3",
    from: "necta",
    body: "Great question! We do have acrylic counter display units available — they hold 2 bottles and come with branded cards. I can include one free with your next order of 12+ bottles. Just mention it when you reorder.",
    timestamp: "2025-11-18T16:55:00Z",
    sender_name: "Yasmin · Account Manager",
  },
  {
    id: "m4",
    from: "stockist",
    body: "That's brilliant, yes please! I'll add a note when I next reorder.",
    timestamp: "2025-11-19T09:10:00Z",
    sender_name: "You",
  },
  {
    id: "m5",
    from: "necta",
    body: "Perfect. Also wanted to let you know — we're launching GLOW next month. Given your cafe is wellness-focused I think it'll be a great seller for you. I'll send over the tasting pack before it goes live.",
    timestamp: "2026-01-07T11:15:00Z",
    sender_name: "Yasmin · Account Manager",
  },
];

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const MessagingTab = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "stockist",
      body: draft.trim(),
      timestamp: new Date().toISOString(),
      sender_name: (user?.user_metadata?.full_name as string) ?? "You",
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
    setSending(false);
    // Simulate auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `auto_${Date.now()}`,
          from: "necta",
          body: "Thanks for your message! I'll get back to you within 4 hours (Mon–Fri, 9am–5pm). For urgent orders, call +44 7700 900000.",
          timestamp: new Date().toISOString(),
          sender_name: "Yasmin · Account Manager",
        },
      ]);
    }, 2000);
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
            <p className="text-sm font-semibold text-primary">Yasmin Reyes</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-xs text-primary/50">Responds within 4 hours · Mon–Fri</p>
            </div>
          </div>
        </div>
        <a
          href="tel:+447700900000"
          className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
      </div>

      {/* Messages */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isStockist = msg.from === "stockist";
            return (
              <div key={msg.id} className={`flex ${isStockist ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${isStockist ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <p className="text-xs text-primary/40">{msg.sender_name}</p>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isStockist
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-primary rounded-bl-sm"
                    }`}
                  >
                    {msg.body}
                  </div>
                  <p className="text-[10px] text-primary/30">{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2 items-end">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your account manager… (Enter to send)"
            rows={2}
            className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Schedule call */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Calendar className="h-4 w-4 text-primary/50" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">Schedule a call</p>
            <p className="text-xs text-primary/50">Book a 15-min check-in with Yasmin</p>
          </div>
          <button
            onClick={() => alert("Calendar booking: Connect Calendly or similar via VITE_CALENDLY_URL")}
            className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors"
          >
            Book
          </button>
        </div>
      </div>

      {/* Auto-reply notice */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <Clock className="h-3.5 w-3.5 text-primary/40 flex-shrink-0" />
        <p className="text-xs text-primary/50">
          Messages sent outside business hours will be replied to on the next working day.
        </p>
      </div>
    </div>
  );
};

export default MessagingTab;
