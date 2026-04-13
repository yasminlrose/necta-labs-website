import { useState } from "react";
import { Download, QrCode, Instagram, FileText, Copy, CheckCircle2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EmailTemplateGenerator from "@/components/stockist/EmailTemplateGenerator";

interface Asset {
  id: string;
  title: string;
  description: string;
  type: "image" | "pdf" | "coming-soon";
  size?: string;
  url?: string;
  filename?: string;
}

const ASSET_CATEGORIES = [
  {
    id: "pos",
    title: "Point-of-Sale Signage",
    icon: <FileText className="h-4 w-4" />,
    color: "#F2DDD4",
    assets: [
      { id: "pos-counter", title: "Counter card — A5",    description: "Product & pricing overview for counter display", type: "pdf", size: "PDF", url: "/necta_counter_card_v2.pdf",  filename: "NECTA-counter-card.pdf" },
      { id: "pos-menu",    title: "Menu insert — DL size", description: "Slim insert for your existing drinks menu",      type: "pdf", size: "PDF", url: "/necta_menu_insert_v2.pdf",   filename: "NECTA-menu-insert.pdf" },
      { id: "pos-tent",    title: "Table tent — A6",       description: "Two-sided tent card for table placement",        type: "pdf", size: "PDF", url: "/necta_table_tent.pdf",        filename: "NECTA-table-tent.pdf" },
      { id: "pos-window",  title: "Window sticker",        description: "'NECTA available here' vinyl sticker",           type: "coming-soon" },
    ] as Asset[],
  },
  {
    id: "social",
    title: "Social Media Assets",
    icon: <Instagram className="h-4 w-4" />,
    color: "#E0DAEF",
    assets: [
      { id: "social-posts",   title: "Instagram post pack",      description: "Branded posts covering all 4 products", type: "coming-soon" },
      { id: "social-stories", title: "Instagram story templates", description: "Editable Canva story templates",        type: "coming-soon" },
    ] as Asset[],
  },
  {
    id: "training",
    title: "Staff Training",
    icon: <FileText className="h-4 w-4" />,
    color: "#F0DEDA",
    assets: [
      { id: "training-guide", title: "Staff training guide",     description: "Product knowledge, preparation & FAQs",     type: "pdf", size: "PDF", url: "/necta_staff_training_v2.pdf",       filename: "NECTA-staff-training.pdf" },
      { id: "training-bar",   title: "Barista quick-reference",  description: "Quick-reference card for how to serve NECTA", type: "pdf", size: "PDF", url: "/necta_barista_quick_reference.pdf", filename: "NECTA-barista-quick-reference.pdf" },
    ] as Asset[],
  },
];

const MarketingTab = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const stockistRef = user?.id ?? "stockist";
  const qrUrl = `https://www.nectalabs.com?ref=${stockistRef}`;

  const handleCopyQr = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* QR code */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <QrCode className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary text-sm">Your stockist referral link</h3>
            <p className="text-xs text-primary/50">Share with customers to direct them to NECTA Labs</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
            <div className="grid grid-cols-5 gap-0.5 opacity-40">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,7,12,17].includes(i) ? "bg-primary" : "bg-white"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono text-primary/50 break-all mb-3">{qrUrl}</p>
            <button
              onClick={handleCopyQr}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
            </button>
          </div>
        </div>
      </div>

      {/* Asset categories */}
      {ASSET_CATEGORIES.map((cat) => (
        <div key={cat.id} className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <h3 className="font-semibold text-primary text-sm">{cat.title}</h3>
          </div>
          <div className="space-y-2">
            {cat.assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="flex items-start gap-2 min-w-0">
                  <FileText className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{asset.title}</p>
                    <p className="text-xs text-primary/50">
                      {asset.description}{asset.size ? ` · ${asset.size}` : ""}
                    </p>
                  </div>
                </div>
                {asset.type === "coming-soon" ? (
                  <span className="flex-shrink-0 px-2.5 py-1 bg-muted text-primary/40 rounded-lg text-xs font-medium">
                    Coming soon
                  </span>
                ) : (
                  <a
                    href={asset.url}
                    download={asset.filename}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 hover:bg-muted transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Email Templates */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 pb-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D6EBEA" }}>
            <Mail className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-primary text-sm">Email Templates</h3>
        </div>
        <p className="text-xs text-primary/50 px-5 pt-1.5 pb-4">
          Customise and download a branded email to announce NECTA to your customers.
        </p>
        <EmailTemplateGenerator stockistRef={stockistRef} />
      </div>

      {/* Request assets */}
      <div className="bg-muted/50 border border-border rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Mail className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary mb-1">Need something specific?</p>
          <p className="text-xs text-primary/50 mb-3">
            POS signage, branded assets, and training materials are being finalised. Email us and we'll send you what you need.
          </p>
          <a
            href="mailto:wholesale@nectalabs.com?subject=Marketing%20assets%20request"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/70 transition-colors"
          >
            wholesale@nectalabs.com
          </a>
        </div>
      </div>

      <p className="text-xs text-center text-primary/30">
        All assets are brand-approved. Do not modify logos or colour usage without approval from NECTA Labs.
      </p>
    </div>
  );
};

export default MarketingTab;
