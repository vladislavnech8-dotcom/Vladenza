import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, Loader2, RefreshCw, Tag, TrendingUp, Calendar, Percent, DollarSign } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount: number | null;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  applicable_product_ids: string[] | null;
  created_at: string;
  updated_at: string;
}

interface PromoOrder {
  order_ref: string;
  order_number: string;
  amount: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

const PRODUCT_OPTIONS = [
  { value: 'niche-edit-good-place', label: 'Niche Edit — Good' },
  { value: 'niche-edit-better-place', label: 'Niche Edit — Better' },
  { value: 'niche-edit-picky-mode', label: 'Niche Edit — Picky' },
  { value: 'guest-post-start', label: 'Guest Post — Start' },
  { value: 'guest-post-grow', label: 'Guest Post — Grow' },
  { value: 'guest-post-scale', label: 'Guest Post — Scale' },
  { value: 'crowd-marketing-start', label: 'Crowd — Start' },
  { value: 'crowd-marketing-grow', label: 'Crowd — Grow' },
  { value: 'crowd-marketing-scale', label: 'Crowd — Scale' },
];

const BLANK_PROMO: Omit<PromoCode, 'id' | 'created_at' | 'updated_at' | 'used_count'> = {
  code: '',
  discount_type: 'percentage',
  discount_value: 10,
  max_discount_amount: null,
  min_order_amount: 0,
  max_uses: null,
  active: true,
  valid_from: null,
  valid_until: null,
  applicable_product_ids: null,
};

export default function PromoCodesPanel() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PromoCode | null | 'new'>(null);
  const [selectedPromoOrders, setSelectedPromoOrders] = useState<PromoCode | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setPromos((data as PromoCode[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promo code?')) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    setPromos(prev => prev.filter(p => p.id !== id));
  };

  const toggleActive = async (promo: PromoCode) => {
    const val = !promo.active;
    await supabase.from('promo_codes').update({ active: val, updated_at: new Date().toISOString() }).eq('id', promo.id);
    setPromos(prev => prev.map(p => p.id === promo.id ? { ...p, active: val } : p));
  };

  if (selectedPromoOrders) {
    return <PromoOrdersView promo={selectedPromoOrders} onBack={() => setSelectedPromoOrders(null)} />;
  }

  if (editing !== null) {
    return (
      <PromoEditor
        initial={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Promo Codes</h2>
          <p className="text-gray-500 text-sm mt-0.5">{promos.length} codes · {promos.filter(p => p.active).length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => setEditing('new')} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-3 py-2 rounded-lg transition">
            <Plus size={13} /> New Code
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : promos.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <Tag size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No promo codes yet.</p>
          <button onClick={() => setEditing('new')} className="mt-4 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition inline-flex items-center gap-2">
            <Plus size={14} /> Create first promo code
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Code</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Discount</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Uses / Limit</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Expires</th>
                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(p => {
                const exhausted = p.max_uses !== null && p.used_count >= p.max_uses;
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-gray-900 font-mono">{p.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-medium">
                        {p.discount_type === 'percentage' ? `${p.discount_value}%` : `$${p.discount_value}`}
                      </span>
                      {p.max_discount_amount && p.discount_type === 'percentage' && (
                        <span className="text-[10px] text-gray-400 block">max ${p.max_discount_amount}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${exhausted ? 'text-red-500' : 'text-gray-700'}`}>
                        {p.used_count} / {p.max_uses ?? '∞'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition ${
                          p.active && !exhausted
                            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            : 'text-gray-500 bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {exhausted ? 'Exhausted' : p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">
                        {p.valid_until ? new Date(p.valid_until).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setSelectedPromoOrders(p)} className="text-xs text-gray-500 hover:text-blue-600 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition">Orders</button>
                      <button onClick={() => setEditing(p)} className="text-xs text-gray-500 hover:text-[#F97316] font-semibold px-2 py-1 rounded hover:bg-orange-50 transition ml-1">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-gray-400 hover:text-red-500 font-semibold px-2 py-1 rounded hover:bg-red-50 transition ml-1">
                        <Trash2 size={13} className="inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PromoEditor({ initial, onSave, onCancel }: { initial: PromoCode | null; onSave: () => void; onCancel: () => void }) {
  const isNew = !initial?.id;
  const [form, setForm] = useState({
    code: initial?.code ?? '',
    discount_type: initial?.discount_type ?? 'percentage',
    discount_value: initial?.discount_value ?? 10,
    max_discount_amount: initial?.max_discount_amount ?? null,
    min_order_amount: initial?.min_order_amount ?? 0,
    max_uses: initial?.max_uses ?? null,
    active: initial?.active ?? true,
    valid_from: initial?.valid_from ?? null,
    valid_until: initial?.valid_until ?? null,
    applicable_product_ids: initial?.applicable_product_ids ?? null,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(initial?.applicable_product_ids ?? []);

  const upd = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) => setForm(prev => ({ ...prev, [key]: val }));
  const showToast = (type: 'success' | 'error', msg: string) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

  const toggleProduct = (value: string) => {
    setSelectedProducts(prev => {
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      upd('applicable_product_ids', next.length === 0 ? null : next);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.code.trim()) { showToast('error', 'Code is required'); return; }
    setSaving(true);
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discount_value: Number(form.discount_value),
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
      min_order_amount: Number(form.min_order_amount) || 0,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      applicable_product_ids: selectedProducts.length === 0 ? null : selectedProducts,
      updated_at: new Date().toISOString(),
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('promo_codes').insert(payload));
    } else {
      ({ error } = await supabase.from('promo_codes').update(payload).eq('id', initial!.id));
    }
    setSaving(false);
    if (error) showToast('error', error.message || 'Save failed');
    else { showToast('success', 'Saved!'); setTimeout(onSave, 800); }
  };

  return (
    <div className="flex flex-col gap-0 h-full">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          ← Back
        </button>
        <div className="flex-1" />
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {isNew ? 'Create' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Promo Code Details</div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => upd('code', e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                placeholder="WELCOME10"
                className="w-full text-base font-bold font-mono border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-300 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Discount Type</label>
                <div className="relative">
                  <select
                    value={form.discount_type}
                    onChange={e => upd('discount_type', e.target.value as 'percentage' | 'fixed')}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none pr-9"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  {form.discount_type === 'percentage' ? 'Percentage Value' : 'Fixed Amount ($)'}
                </label>
                <input
                  type="number"
                  value={form.discount_value}
                  onChange={e => upd('discount_value', Number(e.target.value))}
                  min="0"
                  max={form.discount_type === 'percentage' ? 100 : undefined}
                  step="0.01"
                  placeholder="10"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {form.discount_type === 'percentage' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Discount Amount ($) — optional cap</label>
                <input
                  type="number"
                  value={form.max_discount_amount ?? ''}
                  onChange={e => upd('max_discount_amount', e.target.value ? Number(e.target.value) : null)}
                  min="0"
                  step="0.01"
                  placeholder="No cap"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Order Amount ($)</label>
                <input
                  type="number"
                  value={form.min_order_amount || ''}
                  onChange={e => upd('min_order_amount', Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Uses (blank = unlimited)</label>
                <input
                  type="number"
                  value={form.max_uses ?? ''}
                  onChange={e => upd('max_uses', e.target.value ? Number(e.target.value) : null)}
                  min="1"
                  placeholder="∞"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Valid From (optional)</label>
                <input
                  type="date"
                  value={form.valid_from ? form.valid_from.slice(0, 10) : ''}
                  onChange={e => upd('valid_from', e.target.value ? new Date(e.target.value).toISOString() : null)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Valid Until (optional)</label>
                <input
                  type="date"
                  value={form.valid_until ? form.valid_until.slice(0, 10) : ''}
                  onChange={e => upd('valid_until', e.target.value ? new Date(e.target.value + 'T23:59:59').toISOString() : null)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Applicable Services</div>
            <p className="text-xs text-gray-500 mb-3">Leave all unchecked to apply to all services.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRODUCT_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(opt.value)}
                    onChange={() => toggleProduct(opt.value)}
                    className="w-4 h-4 accent-[#F97316]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Status</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => upd('active', e.target.checked)}
                className="w-4 h-4 accent-[#F97316]"
              />
              <span className="text-sm font-medium text-gray-800">{form.active ? 'Active' : 'Inactive'}</span>
            </label>
          </div>

          {!isNew && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Usage</div>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {initial!.used_count} / {initial!.max_uses ?? '∞'} used
                </span>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preview</div>
            <div className="flex items-center gap-2 text-sm">
              {form.discount_type === 'percentage' ? <Percent size={14} className="text-gray-400" /> : <DollarSign size={14} className="text-gray-400" />}
              <span className="font-medium text-gray-700">
                {form.discount_type === 'percentage' ? `${form.discount_value}% off` : `$${form.discount_value} off`}
              </span>
            </div>
            {form.max_discount_amount && form.discount_type === 'percentage' && (
              <p className="text-xs text-gray-400 mt-1">Max discount: ${form.max_discount_amount}</p>
            )}
            {form.min_order_amount > 0 && (
              <p className="text-xs text-gray-400 mt-1">Min order: ${form.min_order_amount}</p>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function PromoOrdersView({ promo, onBack }: { promo: PromoCode; onBack: () => void }) {
  const [orders, setOrders] = useState<PromoOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('order_ref, order_number, amount, name, email, status, created_at')
        .eq('promo_code_id', promo.id)
        .order('created_at', { ascending: false });
      setOrders((data as PromoOrder[]) ?? []);
      setLoading(false);
    })();
  }, [promo.id]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          ← Back to promo codes
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3">
          <Tag size={18} className="text-[#F97316]" />
          <span className="text-lg font-bold font-mono text-gray-900">{promo.code}</span>
          <span className="text-sm text-gray-500">
            {promo.discount_type === 'percentage' ? `${promo.discount_value}% off` : `$${promo.discount_value} off`}
          </span>
        </div>
        <div className="flex gap-6 mt-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <p className="text-lg font-bold text-gray-900">{orders.length}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Usage</span>
            <p className="text-lg font-bold text-gray-900">{promo.used_count} / {promo.max_uses ?? '∞'}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No orders have used this promo code yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Order #</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Amount</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.order_ref} className="border-b border-gray-50">
                  <td className="px-4 py-3"><span className="text-sm font-mono text-gray-700">{o.order_number || o.order_ref}</span></td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{o.name}</span>
                    <span className="text-xs text-gray-400 block">{o.email}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm font-bold text-gray-700">${o.amount}</span></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                      o.status === 'paid' ? 'text-green-700 bg-green-50 border-green-200'
                      : o.status === 'failed' ? 'text-red-700 bg-red-50 border-red-200'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
