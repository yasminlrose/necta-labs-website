import { Package, Mail } from "lucide-react";

const OrdersTab = () => (
  <div className="space-y-5">
    <div className="bg-white border border-border rounded-2xl p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
        <Package className="h-6 w-6 text-primary/30" />
      </div>
      <h3 className="font-semibold text-primary mb-2">No orders yet</h3>
      <p className="text-sm text-primary/50 mb-6 max-w-xs mx-auto">
        Your wholesale orders will appear here once confirmed. Use Quick Reorder to submit your first order, or email us directly.
      </p>
      <a
        href="mailto:wholesale@nectalabs.com?subject=Wholesale%20order%20enquiry"
        className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
      >
        <Mail className="h-4 w-4" />
        wholesale@nectalabs.com
      </a>
    </div>
    <p className="text-xs text-center text-primary/30">
      All pricing is ex-works, exclusive of VAT · Net 30 payment terms
    </p>
  </div>
);

export default OrdersTab;
