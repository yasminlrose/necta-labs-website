import { useState } from "react";
import { Download, QrCode, Instagram, FileText, Image as ImageIcon, Video, Copy, CheckCircle2 } from "lucide-react";

interface Asset {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "image" | "video" | "zip";
  size: string;
  url?: string;
}

const ASSET_CATEGORIES = [
  {
    id: "pos",
    title: "Point-of-Sale Signage",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "#D6EBEA",
    assets: [
      { id: "a1", title: "Counter card — A5 landscape", description: "NECTA product & pricing overview for counter display", type: "pdf", size: "2.4 MB" },
      { id: "a2", title: "Menu insert — 100×210mm",      description: "Slim insert to add to your existing drinks menu",   type: "pdf", size: "1.8 MB" },
      { id: "a3", title: "Table tent — A6",              description: "Two-sided tent card for table top placement",        type: "pdf", size: "2.1 MB" },
      { id: "a4", title: "Window sticker — 30cm",        description: "Printed vinyl sticker — 'NECTA available here'",    type: "pdf", size: "3.5 MB" },
    ] as Asset[],
  },
  {
    id: "social",
    title: "Social Media Assets",
    icon: <Instagram className="h-4 w-4" />,
    color: "#E0DAEF",
    assets: [
      { id: "b1", title: "Instagram post pack (×12)",   description: "12 branded posts covering all 4 products",    type: "zip", size: "18 MB" },
      { id: "b2", title: "Instagram story templates",    description: "8 editable Canva story templates",            type: "zip", size: "12 MB" },
      { id: "b3", title: "TikTok video — FOCUS (30s)",   description: "Short-form video for your venue TikTok",      type: "video", size: "45 MB" },
      { id: "b4", title: "TikTok video — CALM (30s)",    description: "Short-form video for your venue TikTok",      type: "video", size: "42 MB" },
    ] as Asset[],
  },
  {
    id: "training",
    title: "Staff Training",
    icon: <FileText className="h-4 w-4" />,
    color: "#F2DDD4",
    assets: [
      { id: "c1", title: "Staff training guide",        description: "Product knowledge, preparation & customer FAQs", type: "pdf", size: "4.2 MB" },
      { id: "c2", title: "How to make NECTA drinks",    description: "Quick-reference card for baristas",              type: "pdf", size: "1.1 MB" },
      { id: "c3", title: "Ingredient deep-dive",        description: "Full ingredient science for knowledgeable staff", type: "pdf", size: "6.8 MB" },
    ] as Asset[],
  },
  {
    id: "email",
    title: "Email Templates",
    icon: <FileText className="h-4 w-4" />,
    color: "#F0DEDA",
    assets: [
      { id: "d1", title: "Customer announcement email", description: "Announce NECTA to your mailing list",           type: "pdf", size: "0.5 MB" },
      { id: "d2", title: "Monthly promotion template",  description: "Promote seasonal flavours & offers",            type: "pdf", size: "0.5 MB" },
    ] as Asset[],
  },
];

const typeIcon = (type: Asset["type"]) => {
  if (type === "pdf")   return <FileText className="h-3.5 w-3.5 text-red-400" />;
  if (type === "image") return <ImageIcon className="h-3.5 w-3.5 text-blue-400" />;
  if (type === "video") return <Video className="h-3.5 w-3.5 text-purple-400" />;
  return <Download className="h-3.5 w-3.5 text-primary/50" />;
};

const MarketingTab = () => {
  const [copied, setCopied] = useState(false);
  const qrUrl = "https://nectalabs.com?ref=stockist";

  const handleCopyQr = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (asset: Asset) => {
    // TODO: Replace with real signed download URLs from Supabase Storage or CDN
    alert(`Download "${asset.title}" (${asset.size})\n\nConnect your asset storage to enable downloads.`);
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
            <h3 className="font-semibold text-primary text-sm">Your stockist QR code</h3>
            <p className="text-xs text-primary/50">Direct customers to NECTA — tracks sales to your venue</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mock QR code visual */}
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
            <div className="flex gap-2">
              <button
                onClick={handleCopyQr}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                {copied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 transition-colors">
                <Download className="h-3.5 w-3.5" /> Download QR
              </button>
            </div>
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
                  {typeIcon(asset.type)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{asset.title}</p>
                    <p className="text-xs text-primary/50">{asset.description} · {asset.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(asset)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-primary hover:border-primary/30 hover:bg-muted transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-center text-primary/30">
        All assets are brand-approved. Do not modify logos or colour usage without approval from NECTA Labs.
      </p>
    </div>
  );
};

export default MarketingTab;
