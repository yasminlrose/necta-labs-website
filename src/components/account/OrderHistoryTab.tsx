import { Package, Clock } from "lucide-react";
import Link from "next/link";

const OrderHistoryTab = () => {
  return (
    <div className="space-y-5">
      <div className="text-center py-16 bg-white border border-border rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-7 w-7 text-amber-500" />
        </div>
        <h3 className="font-semibold text-primary mb-2">Your pre-order is on its way</h3>
        <p className="text-sm text-primary/50 max-w-xs mx-auto mb-1">
          Your order history will appear here once your first shipment dispatches in October 2026.
        </p>
        <p className="text-xs text-primary/35">
          You'll receive a dispatch confirmation email with tracking info.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 flex gap-3 items-start">
        <Package className="h-4 w-4 text-primary/40 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-primary/60">Pre-order confirmed</p>
          <p className="text-xs text-primary/40 mt-0.5">
            Have a question about your order?{" "}
            <a href="mailto:hello@nectalabs.com" className="underline hover:text-primary transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/pre-order"
          className="text-sm font-medium text-primary/50 hover:text-primary transition-colors underline"
        >
          Browse pre-orders
        </Link>
      </div>
    </div>
  );
};

export default OrderHistoryTab;
