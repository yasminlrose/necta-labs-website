import { useState } from "react";
import { X, PauseCircle } from "lucide-react";

interface PauseSubscriptionModalProps {
  isOpen: boolean;
  productTitle: string;
  nextDeliveryDate: string;
  onConfirm: (months: number) => void;
  onClose: () => void;
}

const pauseOptions = [
  { months: 1, label: "1 month" },
  { months: 2, label: "2 months" },
  { months: 3, label: "3 months" },
];

function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const PauseSubscriptionModal = ({
  isOpen,
  productTitle,
  nextDeliveryDate,
  onConfirm,
  onClose,
}: PauseSubscriptionModalProps) => {
  const [selected, setSelected] = useState(1);

  if (!isOpen) return null;

  const resumeDate = addMonths(nextDeliveryDate, selected);

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-primary" />
          </button>

          <div className="p-8">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--necta-focus-card))] flex items-center justify-center mb-4">
              <PauseCircle className="h-6 w-6 text-[hsl(var(--necta-focus))]" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">Pause subscription</h3>
            <p className="text-sm text-primary/60 mb-6">
              Pause <strong>{productTitle}</strong> — no charges while paused.
            </p>

            <p className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-3">
              Pause for how long?
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {pauseOptions.map(({ months, label }) => (
                <button
                  key={months}
                  onClick={() => setSelected(months)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    selected === months
                      ? "border-primary bg-primary text-white"
                      : "border-border text-primary hover:border-primary/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-muted rounded-xl p-4 mb-6">
              <p className="text-xs text-primary/50 mb-1">Your subscription will resume on</p>
              <p className="text-base font-bold text-primary">{resumeDate}</p>
              <p className="text-xs text-primary/40 mt-1">
                We'll send you a reminder 7 days before it resumes.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-border rounded-lg text-sm font-medium text-primary/60 hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(selected); onClose(); }}
                className="flex-1 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Pause for {selected} {selected === 1 ? "month" : "months"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PauseSubscriptionModal;
