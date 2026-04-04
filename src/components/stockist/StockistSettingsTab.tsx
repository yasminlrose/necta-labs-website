import { useState } from "react";
import { Building2, MapPin, CreditCard, Users, FileDown, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const VENUE_TYPES = [
  "Cafe / Coffee Shop", "Gym / Fitness Studio", "Hotel / Spa",
  "Bar / Restaurant", "Wellness Retailer", "Office / Workplace", "Other",
];

const StockistSettingsTab = () => {
  const { user } = useAuth();

  const [business, setBusiness] = useState({
    business_name: (user?.user_metadata?.business_name as string) ?? "",
    venue_type: (user?.user_metadata?.venue_type as string) ?? "",
    contact_name: (user?.user_metadata?.full_name as string) ?? "",
    email: user?.email ?? "",
    phone: (user?.user_metadata?.phone as string) ?? "",
    vat_number: (user?.user_metadata?.vat_number as string) ?? "",
  });

  const [address, setAddress] = useState({
    line1: (user?.user_metadata?.billing_line1 as string) ?? "",
    line2: (user?.user_metadata?.billing_line2 as string) ?? "",
    city: (user?.user_metadata?.billing_city as string) ?? "",
    postcode: (user?.user_metadata?.billing_postcode as string) ?? "",
  });

  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizSuccess, setBizSuccess] = useState(false);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrSuccess, setAddrSuccess] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const teamMembers = [
    { name: "Sarah Johnson", email: "sarah@example-cafe.com", role: "Admin" },
    { name: "Tom Wilson",    email: "tom@example-cafe.com",   role: "View only" },
  ];

  const handleSaveBusiness = async () => {
    setBizLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        business_name: business.business_name,
        venue_type: business.venue_type,
        full_name: business.contact_name,
        phone: business.phone,
        vat_number: business.vat_number,
      },
    });
    setBizLoading(false);
    if (!error) { setBizSuccess(true); setTimeout(() => setBizSuccess(false), 3000); }
  };

  const handleSaveAddress = async () => {
    setAddrLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        billing_line1: address.line1,
        billing_line2: address.line2,
        billing_city: address.city,
        billing_postcode: address.postcode,
      },
    });
    setAddrLoading(false);
    if (!error) { setAddrSuccess(true); setTimeout(() => setAddrSuccess(false), 3000); }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) { setPwdError("Passwords don't match."); return; }
    if (passwords.new.length < 8) { setPwdError("Minimum 8 characters."); return; }
    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    setPwdLoading(false);
    if (error) { setPwdError(error.message); }
    else { setPwdSuccess(true); setPasswords({ new: "", confirm: "" }); setTimeout(() => setPwdSuccess(false), 3000); }
  };

  const fieldClass = "w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors";
  const saveBtn = (loading: boolean, success: boolean, label = "Save changes") => (
    <button
      onClick={label === "Save changes" ? undefined : undefined}
      className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      disabled={loading}
    >
      {success ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : loading ? "Saving…" : label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Business details */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="h-4 w-4 text-primary/50" />
          <h3 className="font-semibold text-primary text-sm">Business details</h3>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={business.business_name}
            onChange={(e) => setBusiness({ ...business, business_name: e.target.value })}
            placeholder="Business name"
            className={fieldClass}
          />
          <select
            value={business.venue_type}
            onChange={(e) => setBusiness({ ...business, venue_type: e.target.value })}
            className={fieldClass + " appearance-none bg-white"}
          >
            <option value="">Venue type</option>
            {VENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            value={business.contact_name}
            onChange={(e) => setBusiness({ ...business, contact_name: e.target.value })}
            placeholder="Primary contact name"
            className={fieldClass}
          />
          <input
            type="tel"
            value={business.phone}
            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
            placeholder="Phone number"
            className={fieldClass}
          />
          <input
            type="text"
            value={business.vat_number}
            onChange={(e) => setBusiness({ ...business, vat_number: e.target.value })}
            placeholder="VAT number (optional)"
            className={fieldClass}
          />
          <button
            onClick={handleSaveBusiness}
            disabled={bizLoading}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {bizSuccess ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : bizLoading ? "Saving…" : "Save business details"}
          </button>
        </div>
      </div>

      {/* Billing address */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="h-4 w-4 text-primary/50" />
          <h3 className="font-semibold text-primary text-sm">Billing address</h3>
        </div>
        <div className="space-y-3">
          {(["line1", "line2", "city", "postcode"] as const).map((f) => (
            <input
              key={f}
              type="text"
              value={address[f]}
              onChange={(e) => setAddress({ ...address, [f]: e.target.value })}
              placeholder={f === "line1" ? "Address line 1" : f === "line2" ? "Address line 2 (optional)" : f === "city" ? "City" : "Postcode"}
              className={fieldClass}
            />
          ))}
          <button
            onClick={handleSaveAddress}
            disabled={addrLoading}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {addrSuccess ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : addrLoading ? "Saving…" : "Save address"}
          </button>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-primary/50" />
          <h3 className="font-semibold text-primary text-sm">Payment terms</h3>
        </div>
        <div className="px-4 py-3 bg-muted rounded-xl">
          <p className="text-sm font-medium text-primary">Net 30 (Invoice)</p>
          <p className="text-xs text-primary/50 mt-0.5">Invoice sent upon dispatch · Due within 30 days</p>
        </div>
        <p className="text-xs text-primary/40 mt-3">
          To update payment terms or set up direct debit, contact your account manager.
        </p>
      </div>

      {/* Team access */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary/50" />
            <h3 className="font-semibold text-primary text-sm">Team access</h3>
          </div>
          <button className="text-xs text-primary border border-border px-3 py-1.5 rounded-lg hover:border-primary/30 transition-colors">
            + Invite
          </button>
        </div>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div key={member.email} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-primary">{member.name}</p>
                <p className="text-xs text-primary/50">{member.email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.role === "Admin" ? "bg-primary/10 text-primary" : "bg-muted text-primary/50"}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-primary/40 mt-3">
          View-only users can see orders and invoices but cannot place or edit orders.
        </p>
      </div>

      {/* Past invoices download */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileDown className="h-4 w-4 text-primary/50" />
          <h3 className="font-semibold text-primary text-sm">Invoice archive</h3>
        </div>
        <p className="text-sm text-primary/60 mb-4">Download all past invoices as a single ZIP file for your accounting records.</p>
        <button
          onClick={() => alert("Invoice archive download will be enabled once Shopify B2B is connected.")}
          className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm font-medium text-primary hover:border-primary/30 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Download all invoices (2025–2026)
        </button>
      </div>

      {/* Password */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="h-4 w-4 text-primary/50" />
          <h3 className="font-semibold text-primary text-sm">Change password</h3>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              type={showPwd ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="New password"
              className="w-full pl-10 pr-10 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            placeholder="Confirm new password"
            className={fieldClass}
          />
          {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
          <button
            onClick={handlePasswordChange}
            disabled={pwdLoading || !passwords.new}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pwdSuccess ? <><CheckCircle2 className="h-4 w-4" /> Updated</> : pwdLoading ? "Updating…" : "Change password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockistSettingsTab;
