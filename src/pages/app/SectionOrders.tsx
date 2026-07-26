import { useState, useCallback, useEffect, FormEvent } from 'react';
import { Plus, Loader2, ChevronDown, Globe, FileText, CreditCard as Edit3, MapPin, Search, Cpu, ArrowRight, Package, CheckCircle2, Clock, RefreshCw, XCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ClientOrder {
  id: string;
  service_type: string;
  target_url: string;
  anchor_text: string;
  quantity: number;
  budget: string;
  notes: string;
  status: string;
  created_at: string;
}

const SERVICES = [
  { id: 'Crowd Links',    full: 'Forum / Crowd Links',    Icon: Globe,    desc: 'Forum & community placements' },
  { id: 'Guest Posting',  full: 'Guest Posting',           Icon: FileText, desc: 'Editorial link placements' },
  { id: 'Niche Edits',    full: 'Niche Edits',             Icon: Edit3,    desc: 'Links in existing articles' },
  { id: 'Local SEO',      full: 'Local SEO Links',         Icon: MapPin,   desc: 'Local directories & citations' },
  { id: 'SEO Audit',      full: 'SEO Audit',               Icon: Search,   desc: 'Full technical site analysis' },
  { id: 'AI Visibility',  full: 'AI / LLM Visibility',     Icon: Cpu,      desc: 'ChatGPT & LLM presence' },
];

const BUDGETS = ['Under $100', '$100–500', '$500–1,000', '$1,000–3,000', '$3,000+'];

const STATUS_MAP: Record<string, { label: string; cls: string; bar: string; Icon: typeof Clock }> = {
  pending:     { label: 'Pending',     cls: 'text-amber-600 bg-amber-50',  bar: 'bg-amber-400',  Icon: Clock },
  in_progress: { label: 'In Progress', cls: 'text-blue-600 bg-blue-50',    bar: 'bg-blue-500',   Icon: RefreshCw },
  completed:   { label: 'Completed',   cls: 'text-green-700 bg-green-50',  bar: 'bg-green-500',  Icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',   cls: 'text-gray-500 bg-gray-100',   bar: 'bg-gray-300',   Icon: XCircle },
};

export default function SectionOrders() {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('client_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as ClientOrder[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[1.6rem] font-bold text-gray-900 leading-tight">My Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track and manage your link building campaigns</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} /> New Order
          </button>
        )}
      </div>

      {showForm && (
        <NewOrderPanel
          onCreated={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <Empty onNew={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map(o => (
            <OrderRow
              key={o.id}
              order={o}
              expanded={expandedId === o.id}
              onToggle={() => setExpandedId(id => id === o.id ? null : o.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── New Order Panel ─────────────────────────────────────────────── */
function NewOrderPanel({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [service, setService] = useState(SERVICES[0]);
  const [targetUrl, setTargetUrl] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!targetUrl.trim()) { setError('Please enter a target URL.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('client_orders').insert({
      service_type: service.full,
      target_url:   targetUrl.trim(),
      anchor_text:  anchorText.trim(),
      quantity,
      budget,
      notes: notes.trim(),
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    onCreated();
  }

  const fieldCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#F97316]/60 focus:bg-white/8 transition';

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <div>
          <h2 className="text-white font-bold text-lg">New order brief</h2>
          <p className="text-gray-600 text-xs mt-0.5">Choose a service and describe your needs</p>
        </div>
        <button onClick={onCancel} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-300 transition">
          <X size={15} />
        </button>
      </div>

      {/* Service picker */}
      <div className="px-6 pb-5">
        <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-widest">Select service</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SERVICES.map(s => {
            const active = service.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setService(s)}
                className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-[#F97316]/10 border-[#F97316]/40 text-white'
                    : 'bg-white/3 border-white/8 text-gray-400 hover:bg-white/5 hover:text-gray-300 hover:border-white/15'
                }`}
              >
                <s.Icon size={16} className={`mt-0.5 flex-shrink-0 ${active ? 'text-[#F97316]' : ''}`} />
                <div>
                  <div className="text-sm font-semibold leading-none">{s.id}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-white/5 mb-5" />

      {/* Form fields */}
      <form onSubmit={handleSubmit} className="px-6 pb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-gray-500 text-xs font-medium mb-1.5">Target URL <span className="text-[#F97316]">*</span></label>
            <input
              value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
              placeholder="https://yoursite.com/page-to-rank"
              className={fieldCls}
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5">Anchor text</label>
            <input
              value={anchorText} onChange={e => setAnchorText(e.target.value)}
              placeholder="best link building service"
              className={fieldCls}
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5">Quantity</label>
            <input
              type="number" min={1} max={500} value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className={fieldCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-gray-500 text-xs font-medium mb-1.5">Budget range</label>
            <div className="flex gap-2 flex-wrap">
              {BUDGETS.map(b => (
                <button key={b} type="button" onClick={() => setBudget(b === budget ? '' : b)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    budget === b
                      ? 'bg-[#F97316]/10 border-[#F97316]/40 text-[#F97316]'
                      : 'bg-white/3 border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-gray-500 text-xs font-medium mb-1.5">Notes & requirements</label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Niche, preferred sites, language, DR requirements, restrictions…"
              className={`${fieldCls} resize-none`}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mt-4">{error}</p>
        )}

        <div className="flex items-center gap-3 mt-5">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            Submit Order
          </button>
          <button type="button" onClick={onCancel}
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors px-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Order Row ───────────────────────────────────────────────────── */
function OrderRow({ order, expanded, onToggle }: { order: ClientOrder; expanded: boolean; onToggle: () => void }) {
  const s = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const StatusIcon = s.Icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group hover:bg-gray-50/80 transition-colors"
      >
        {/* Status bar */}
        <div className={`w-1 h-8 rounded-full flex-shrink-0 ${s.bar}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-900 font-semibold text-sm">{order.service_type}</span>
            <span className="text-gray-400 text-xs hidden sm:inline truncate max-w-xs">{order.target_url}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${s.cls}`}>
              <StatusIcon size={10} /> {s.label}
            </span>
            <span className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <ChevronDown size={15} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/40">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 mb-3">
            <Field label="Target URL"  value={order.target_url || '—'} wide />
            <Field label="Anchor"      value={order.anchor_text || '—'} />
            <Field label="Quantity"    value={String(order.quantity)} />
            <Field label="Budget"      value={order.budget || '—'} />
          </div>
          {order.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 font-medium truncate">{value}</p>
    </div>
  );
}

function Empty({ onNew }: { onNew: () => void }) {
  return (
    <div className="border border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center text-center gap-2">
      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-1">
        <Package size={18} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-900 text-sm">No orders yet</p>
      <p className="text-gray-400 text-sm">Click the button above to place your first request.</p>
      <button onClick={onNew}
        className="mt-3 flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
        <Plus size={14} /> New Order
      </button>
    </div>
  );
}
