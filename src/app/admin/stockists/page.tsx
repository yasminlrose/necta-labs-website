'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, ExternalLink, Lock } from 'lucide-react';

interface Application {
  id: string;
  created_at: string;
  business_name: string;
  business_type: string;
  website: string | null;
  instagram: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  city: string;
  postcode: string;
  vat_number: string | null;
  monthly_units: string | null;
  why_necta: string;
  heard_about: string | null;
  status: 'pending' | 'approved' | 'denied';
}

const STATUS_STYLES = {
  pending:  { color: 'bg-amber-50 text-amber-700',  icon: <Clock className="h-3 w-3" />,        label: 'Pending'  },
  approved: { color: 'bg-green-50 text-green-700',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Approved' },
  denied:   { color: 'bg-red-50 text-red-600',      icon: <XCircle className="h-3 w-3" />,      label: 'Denied'   },
};

export default function AdminStockistsPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');

  const fetchApps = async (pwd: string) => {
    setLoading(true);
    const res = await fetch('/api/admin/stockists', {
      headers: { 'x-admin-password': pwd },
    });
    setLoading(false);
    if (res.status === 401) { setAuthError('Wrong password'); return; }
    const data = await res.json();
    setApps(data.applications ?? []);
    setAuthed(true);
    sessionStorage.setItem('admin_pwd', pwd);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pwd');
    if (saved) fetchApps(saved);
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'denied') => {
    setActing(id);
    const pwd = sessionStorage.getItem('admin_pwd') ?? '';
    await fetch('/api/admin/stockists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pwd },
      body: JSON.stringify({ id, status }),
    });
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setActing(null);
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-gray-400" />
            <h1 className="font-bold text-gray-900">Admin — Stockist Applications</h1>
          </div>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchApps(password)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-gray-400"
          />
          {authError && <p className="text-xs text-red-500 mb-3">{authError}</p>}
          <button
            onClick={() => fetchApps(password)}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);
  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    approved: apps.filter((a) => a.status === 'approved').length,
    denied: apps.filter((a) => a.status === 'denied').length,
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stockist Applications</h1>
            <p className="text-sm text-gray-500 mt-1">{counts.pending} pending review</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('admin_pwd'); setAuthed(false); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'all', 'approved', 'denied'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-900'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-gray-400">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400">No {filter === 'all' ? '' : filter} applications yet</p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((app) => {
            const s = STATUS_STYLES[app.status];
            return (
              <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-gray-900">{app.business_name}</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{app.business_type} · {app.city}, {app.postcode}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        disabled={acting === app.id}
                        onClick={() => handleAction(app.id, 'approved')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        disabled={acting === app.id}
                        onClick={() => handleAction(app.id, 'denied')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Deny
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Contact</p>
                    <p className="font-medium text-gray-800">{app.contact_name}</p>
                    <a href={`mailto:${app.contact_email}`} className="text-xs text-blue-600 hover:underline">{app.contact_email}</a>
                  </div>
                  {app.contact_phone && (
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="font-medium text-gray-800">{app.contact_phone}</p>
                    </div>
                  )}
                  {app.monthly_units && (
                    <div>
                      <p className="text-xs text-gray-400">Est. monthly units</p>
                      <p className="font-medium text-gray-800">{app.monthly_units}</p>
                    </div>
                  )}
                  {app.vat_number && (
                    <div>
                      <p className="text-xs text-gray-400">VAT</p>
                      <p className="font-medium text-gray-800">{app.vat_number}</p>
                    </div>
                  )}
                  {app.heard_about && (
                    <div>
                      <p className="text-xs text-gray-400">Heard about us via</p>
                      <p className="font-medium text-gray-800">{app.heard_about}</p>
                    </div>
                  )}
                </div>

                {(app.website || app.instagram) && (
                  <div className="flex gap-3 mb-4">
                    {app.website && (
                      <a href={app.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ExternalLink className="h-3 w-3" /> Website
                      </a>
                    )}
                    {app.instagram && (
                      <a href={`https://instagram.com/${app.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ExternalLink className="h-3 w-3" /> @{app.instagram.replace('@','')}
                      </a>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Why they want to stock NECTA</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{app.why_necta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
