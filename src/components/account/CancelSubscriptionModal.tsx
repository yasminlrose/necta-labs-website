import { useState } from "react";
import { X, AlertTriangle, PauseCircle, Heart } from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  productTitle: string;
  onConfirm: (reason: string) => void;
  onPauseInstead: () => void;
  onClose: () => void;
}

const cancelReasons = [
  { id: "too_expensive", label: "It's too expensive", offer: "discount" },
  { id: "no_results", label: "I didn't see the results I expected", offer: "education" },
  { id: "taking_break", label: "I'm taking a break", offer: "pause" },
  { id: "wrong_product", label: "This product isn't right for me", offer: "alternatives" },
  { id: "too_much_stock", label: "I have too much stock", offer: "skip" },
  { id: "other", label: "Other reason", offer: null },
];

type Step = "survey" | "retention" | "confirm";

const CancelSubscriptionModal = ({
  isOpen,
  productTitle,
  onConfirm,
  onPauseInstead,
  onClose,
}: CancelSubscriptionModalProps) => {
  const [step, setStep] = useState<Step>("survey");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const chosenReason = cancelReasons.find((r) => r.id === selectedReason);

  const handleSurveyNext = () => {
    if (!selectedReason) return;
    if (chosenReason?.offer === "pause" || chosenReason?.offer === "discount" || chosenReason?.offer === "skip") {
      setStep("retention");
    } else {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    const reason = selectedReason === "other" ? otherReason : (chosenReason?.label ?? selectedReason);
    onConfirm(reason);
    setStep("survey");
    setSelectedReason("");
  };

  const handleClose = () => {
    setStep("survey");
    setSelectedReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors z-10"
          >
            <X className="h-4 w-4 text-primary" />
          </button>

          {step === "survey" && (
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">Help us improve</h3>
              <p className="text-sm text-primary/60 mb-6">
                Before you go, we'd love to know why you're cancelling <strong>{productTitle}</strong>.
              </p>

              <div className="space-y-2 mb-6">
                {cancelReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedReason === reason.id
                        ? "border-primary/40 bg-muted"
                        : "border-border hover:border-primary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                        selectedReason === reason.id ? "border-primary bg-primary" : "border-border"
                      }`}
                    />
                    <span className="text-sm text-primary">{reason.label}</span>
                  </label>
                ))}
              </div>

              {selectedReason === "other" && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please tell us more..."
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 mb-4 resize-none"
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border border-border rounded-lg text-sm font-medium text-primary/60 hover:text-primary transition-colors"
                >
                  Keep subscription
                </button>
                <button
                  onClick={handleSurveyNext}
                  disabled={!selectedReason}
                  className="flex-1 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "retention" && (
            <div className="p-8">
              {chosenReason?.offer === "pause" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--necta-focus-card))] flex items-center justify-center mb-4">
                    <PauseCircle className="h-6 w-6 text-[hsl(var(--necta-focus))]" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Taking a break? Pause instead.</h3>
                  <p className="text-sm text-primary/60 mb-6">
                    You can pause your subscription for up to 3 months. We'll remind you before it resumes — no charge until then.
                  </p>
                  <button
                    onClick={() => { onPauseInstead(); handleClose(); }}
                    className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors mb-3"
                  >
                    Pause my subscription instead
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="w-full py-3 text-sm text-primary/50 hover:text-primary transition-colors"
                  >
                    No thanks, continue cancelling
                  </button>
                </>
              )}

              {chosenReason?.offer === "discount" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <span className="text-xl">🎁</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Special offer — just for you</h3>
                  <p className="text-sm text-primary/60 mb-4">
                    We'd love to keep you on board. Get <strong>15% off your next 3 orders</strong> if you stay subscribed.
                  </p>
                  <div className="bg-muted rounded-xl p-4 mb-6 text-center">
                    <p className="text-xs text-primary/50 mb-1">Your discount code</p>
                    <p className="text-2xl font-bold text-primary tracking-wider">STAY15</p>
                    <p className="text-xs text-primary/40 mt-1">Applied automatically at checkout</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors mb-3"
                  >
                    Apply discount & stay
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="w-full py-3 text-sm text-primary/50 hover:text-primary transition-colors"
                  >
                    No thanks, continue cancelling
                  </button>
                </>
              )}

              {chosenReason?.offer === "skip" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-xl">📦</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Too much stock? Skip your next delivery.</h3>
                  <p className="text-sm text-primary/60 mb-6">
                    Skip one or more deliveries and we'll pause billing until you're ready. Your subscription stays active — no need to cancel.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors mb-3"
                  >
                    Skip next delivery instead
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="w-full py-3 text-sm text-primary/50 hover:text-primary transition-colors"
                  >
                    No thanks, continue cancelling
                  </button>
                </>
              )}
            </div>
          )}

          {step === "confirm" && (
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Confirm cancellation</h3>
              <p className="text-sm text-primary/60 mb-4">
                You're about to cancel <strong>{productTitle}</strong>. Please note:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-primary/70">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Cancellation takes effect after a <strong>7-day notice period</strong>
                </li>
                <li className="flex items-start gap-2 text-sm text-primary/70">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Any charges already scheduled in the next 7 days will still be processed
                </li>
                <li className="flex items-start gap-2 text-sm text-primary/70">
                  <span className="text-amber-500 mt-0.5">•</span>
                  You can reactivate your subscription at any time
                </li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Keep my subscription
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Confirm cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CancelSubscriptionModal;
