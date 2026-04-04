import { useState } from "react";
import { User, Mail, Phone, Lock, MapPin, Bell, Share2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => (
  <div className="bg-white border border-border rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-primary text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

const AccountSettingsTab = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    full_name: (user?.user_metadata?.full_name as string) ?? "",
    email: user?.email ?? "",
    phone: (user?.user_metadata?.phone as string) ?? "",
  });

  const [address, setAddress] = useState({
    line1: (user?.user_metadata?.address_line1 as string) ?? "",
    line2: (user?.user_metadata?.address_line2 as string) ?? "",
    city: (user?.user_metadata?.address_city as string) ?? "",
    postcode: (user?.user_metadata?.address_postcode as string) ?? "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPwd, setShowPwd] = useState({ current: false, new: false });

  const [prefs, setPrefs] = useState({
    marketing_emails: true,
    order_updates: true,
    product_news: true,
    restock_alerts: false,
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const referralLink = `https://nectalabs.com/ref/${user?.id?.slice(0, 8) ?? "xxxxx"}`;

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileSuccess(false);
    const { error } = await supabase.auth.updateUser({
      email: profile.email !== user?.email ? profile.email : undefined,
      data: {
        full_name: profile.full_name,
        phone: profile.phone,
      },
    });
    setProfileLoading(false);
    if (!error) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleAddressSave = async () => {
    setAddressLoading(true);
    setAddressSuccess(false);
    const { error } = await supabase.auth.updateUser({
      data: {
        address_line1: address.line1,
        address_line2: address.line2,
        address_city: address.city,
        address_postcode: address.postcode,
      },
    });
    setAddressLoading(false);
    if (!error) {
      setAddressSuccess(true);
      setTimeout(() => setAddressSuccess(false), 3000);
    }
  };

  const handlePasswordChange = async () => {
    setPwdError("");
    if (passwords.new.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwdError("New passwords do not match.");
      return;
    }
    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    setPwdLoading(false);
    if (error) {
      setPwdError(error.message);
    } else {
      setPwdSuccess(true);
      setPasswords({ current: "", new: "", confirm: "" });
      setTimeout(() => setPwdSuccess(false), 3000);
    }
  };

  const handlePrefsToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Profile */}
      <SettingsSection title="Profile" icon={<User className="h-3.5 w-3.5 text-primary/60" />}>
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Full name"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Phone number (optional)"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {profileSuccess ? (
              <><CheckCircle2 className="h-4 w-4" /> Saved</>
            ) : profileLoading ? (
              "Saving…"
            ) : (
              "Save profile"
            )}
          </button>
        </div>
      </SettingsSection>

      {/* Shipping address */}
      <SettingsSection title="Default shipping address" icon={<MapPin className="h-3.5 w-3.5 text-primary/60" />}>
        <div className="space-y-3">
          {(["line1", "line2", "city", "postcode"] as const).map((field) => (
            <input
              key={field}
              type="text"
              value={address[field]}
              onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
              placeholder={
                field === "line1" ? "Address line 1"
                : field === "line2" ? "Address line 2 (optional)"
                : field === "city" ? "City"
                : "Postcode"
              }
              className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          ))}
          <button
            onClick={handleAddressSave}
            disabled={addressLoading}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {addressSuccess ? (
              <><CheckCircle2 className="h-4 w-4" /> Saved</>
            ) : addressLoading ? (
              "Saving…"
            ) : (
              "Save address"
            )}
          </button>
        </div>
      </SettingsSection>

      {/* Password */}
      <SettingsSection title="Change password" icon={<Lock className="h-3.5 w-3.5 text-primary/60" />}>
        <div className="space-y-3">
          {([
            { key: "current" as const, placeholder: "Current password", show: showPwd.current, toggle: () => setShowPwd((p) => ({ ...p, current: !p.current })) },
            { key: "new" as const, placeholder: "New password", show: showPwd.new, toggle: () => setShowPwd((p) => ({ ...p, new: !p.new })) },
          ]).map(({ key, placeholder, show, toggle }) => (
            <div key={key} className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
              <input
                type={show ? "text" : "password"}
                value={passwords[key]}
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
              />
              <button
                type="button"
                onClick={toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          ))}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Confirm new password"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
          <button
            onClick={handlePasswordChange}
            disabled={pwdLoading || !passwords.new}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pwdSuccess ? (
              <><CheckCircle2 className="h-4 w-4" /> Password updated</>
            ) : pwdLoading ? (
              "Updating…"
            ) : (
              "Change password"
            )}
          </button>
        </div>
      </SettingsSection>

      {/* Email preferences */}
      <SettingsSection title="Email preferences" icon={<Bell className="h-3.5 w-3.5 text-primary/60" />}>
        <div className="space-y-4">
          {([
            { key: "order_updates" as const, label: "Order & delivery updates", desc: "Tracking info, dispatch notifications", required: true },
            { key: "marketing_emails" as const, label: "Offers & promotions", desc: "Discounts, seasonal deals, subscriber exclusives" },
            { key: "product_news" as const, label: "New products & launches", desc: "Be first to know about new flavours and formats" },
            { key: "restock_alerts" as const, label: "Back-in-stock alerts", desc: "Get notified when favourite products return" },
          ]).map(({ key, label, desc, required }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">{label}</p>
                <p className="text-xs text-primary/50">{desc}</p>
                {required && <p className="text-xs text-primary/30 mt-0.5">Required — cannot be disabled</p>}
              </div>
              <button
                onClick={() => !required && handlePrefsToggle(key)}
                disabled={required}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
                  prefs[key] ? "bg-primary" : "bg-border"
                } ${required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    prefs[key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
          {prefsSaved && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Preferences saved
            </p>
          )}
        </div>
      </SettingsSection>

      {/* Refer a friend */}
      <SettingsSection title="Refer a friend" icon={<Share2 className="h-3.5 w-3.5 text-primary/60" />}>
        <p className="text-sm text-primary/60 mb-4">
          Share your unique referral link. When a friend makes their first order, you both earn a reward.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-lg text-xs text-primary/70 font-mono select-all"
          />
          <button
            onClick={() => navigator.clipboard.writeText(referralLink)}
            className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-primary/40 mt-2">
          Referral rewards coming soon — your link is ready when the programme launches.
        </p>
      </SettingsSection>
    </div>
  );
};

export default AccountSettingsTab;
