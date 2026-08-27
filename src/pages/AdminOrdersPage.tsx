import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Mail, Save, X, Package, Clock,
  CheckCircle2, ArrowRight, ExternalLink,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────── */

interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface Requirement {
  placementId?: string;
  targetUrl: string;
  anchor: string;
  niche: string;
  notes: string;
  willProvideLater: boolean;
}

interface AdminOrder {
  id: string;
  orderRef: string;
  orderNumber: string;
  packageName: string;
  amount: number;
  currency: string;
  type: string;
  name: string;
  email: string;
  website: string;
  company: string;
  message: string;
  status: string;
  orderStatus: string;
  orderItems: OrderItem[];
  requirements: Requirement[];
  requirementsStatus: string;
  cartSnapshot: { items?: OrderItem[]; total?: number; currency?: string } | null;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string | null;
  wfpTransactionId: string;
  adminNotes: string;
  statusChangedBy: string;
}

type LoadingState = 'loading' | 'loaded' | 'error';

/* ─── Status badges ─────────────────────────────────────────────── */

const PAYMENT_BADGES: Record<string, { label: string; cls: string }> = {
  paid:      { label: 'Paid',      cls: 'text-green-700 bg-green-50 border-green-200' },
  refunded:  { label: 'Refunded',  cls: 'text-purple-700 bg-purple-50 border-purple-200' },
  cancelled: { label: 'Cancelled',  cls: 'text-gray-500 bg-gray-100 border-gray-200' },
};

const ORDER_BADGES: Record<string, { label: string; cls: string }> = {
  requirements_pending: { label: 'Waiting for requirements', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  ready_for_review:      { label: 'Ready for review',         cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  in_progress:           { label: 'In progress',              cls: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  completed:            { label: 'Completed',                 cls: 'text-green-700 bg-green-50 border-green-200' },
  cancelled:           { label: 'Cancelled',                 cls: 'text-gray-500 bg-gray-100 border-gray-200' },
};

const REQ_BADGES: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  partial:  { label: 'Partial',  cls: 'text-orange-700 bg-orange-50 border-orange-200' },
  received: { label: 'Received', cls: 'text-green-700 bg-green-50 border-green-200' },
};

const ORDER_STATUS_OPTIONS = [
  { value: 'requirements_pending', label: 'Waiting for requirements' },
  { value: 'ready_for_review',     label: 'Ready for review' },
  { value: 'in_progress',          label: 'In progress' },
  { value: 'completed',           label: 'Completed' },
  { value: 'cancelled',           label: 'Cancelled' },
];

/* ─── Helper functions ──────────────────────────────────────────── */

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

function getItems(order: AdminOrder): OrderItem[] {
  if (Array.isArray(order.orderItems) && order.orderItems.length > 0) return order.orderItems;
  if (order.cartSnapshot?.items && Array.isArray(order.cartSnapshot.items)) return order.cartSnapshot.items;
  return [];
}

function getBadge(map: Record<string, { label: string; cls: string }>, key: string) {
  return map[key] ?? { label: key, cls: 'text-gray-500 bg-gray-50 border-gray-200' };
}

/* ─── Orders list panel ─────────────────────────────────────────── */

export default function AdminOrdersPage() {
  const { session, signOut } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterOrder, setFilterOrder] = useState('all');
  const [filterReq, setFilterReq] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const load = useCallback(async () => {
    setLoadingState('loading');
    setErrorMsg('');

    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: '20',
        search,
        paymentStatus: filterPayment,
        orderStatus: filterOrder,
        requirementsStatus: filterReq,
      });

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders?${params}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setErrorMsg(data.error || 'Access denied');
          setLoadingState('error');
          return;
        }
        setErrorMsg(data.error || 'Failed to load orders');
        setLoadingState('error');
        return;
      }

      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setLoadingState('loaded');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setLoadingState('error');
    }
  }, [page, search, filterPayment, filterOrder, filterReq, session]);

  useEffect(() => { load(); }, [load]);

  function handleSearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  function clearFilters() {
    setSearch('');
    setSearchInput('');
    setFilterPayment('all');
    setFilterOrder('all');
    setFilterReq('all');
    setPage(1);
  }

  const hasFilters = search || filterPayment !== 'all' || filterOrder !== 'all' || filterReq !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <Package size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Orders Panel</span>
            <span className="text-gray-500 text-xs ml-2">{total} total</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5">
              <ArrowRight size={13} className="rotate-180" /> Admin
            </a>
            <div className="w-px h-4 bg-gray-700" />
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-white transition">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by order number, email, name, or website..."
                className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Search
            </button>
            <button
              onClick={load}
              className="px-3 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition flex items-center gap-1.5"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <FilterSelect label="Payment" value={filterPayment} onChange={(v) => { setFilterPayment(v); setPage(1); }} options={[
              { value: 'all', label: 'All payments' },
              { value: 'paid', label: 'Paid' },
              { value: 'refunded', label: 'Refunded' },
              { value: 'cancelled', label: 'Cancelled' },
            ]} />
            <FilterSelect label="Order" value={filterOrder} onChange={(v) => { setFilterOrder(v); setPage(1); }} options={[
              { value: 'all', label: 'All statuses' },
              ...ORDER_STATUS_OPTIONS,
            ]} />
            <FilterSelect label="Requirements" value={filterReq} onChange={(v) => { setFilterReq(v); setPage(1); }} options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'partial', label: 'Partial' },
              { value: 'received', label: 'Received' },
            ]} />
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 ml-1">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loadingState === 'loading' && (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="text-gray-300 animate-spin" />
          </div>
        )}

        {loadingState === 'error' && (
          <div className="bg-white border border-red-100 rounded-xl py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{errorMsg}</p>
            <p className="text-gray-400 text-xs">Make sure you are signed in with an admin account.</p>
          </div>
        )}

        {loadingState === 'loaded' && orders.length === 0 && (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
            <p className="text-gray-400 text-sm">No orders found.</p>
            {hasFilters && <p className="text-gray-300 text-xs mt-1">Try clearing your filters.</p>}
          </div>
        )}

        {loadingState === 'loaded' && orders.length > 0 && (
          <>
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Order #</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Date</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Customer</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Packages</th>
                      <th className="text-right font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Total</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Payment</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Order</th>
                      <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Req.</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const payBadge = getBadge(PAYMENT_BADGES, order.status);
                      const ordBadge = getBadge(ORDER_BADGES, order.orderStatus);
                      const reqBadge = getBadge(REQ_BADGES, order.requirementsStatus);
                      const items = getItems(order);

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-900 text-xs">{order.orderNumber || order.orderRef.slice(0, 20)}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-900 text-xs font-medium">{order.name || '—'}</div>
                            <div className="text-gray-400 text-xs truncate max-w-[180px]">{order.email}</div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-col gap-0.5">
                              {items.length > 0 ? items.map((item, i) => (
                                <span key={i} className="text-gray-600 text-xs">
                                  {item.name} ×{item.quantity}
                                </span>
                              )) : <span className="text-gray-300 text-xs">—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900 text-xs whitespace-nowrap">
                            {formatMoney(order.amount, order.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${payBadge.cls}`}>
                              {payBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${ordBadge.cls}`}>
                              {ordBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${reqBadge.cls}`}>
                              {reqBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <ChevronDown size={14} className="text-gray-300 -rotate-90" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition flex items-center gap-1"
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition flex items-center gap-1"
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Order detail drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          session={session}
          onClose={() => setSelectedOrder(null)}
          onUpdated={(updated) => {
            setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o));
            setSelectedOrder(prev => prev ? { ...prev, ...updated } : null);
          }}
        />
      )}
    </div>
  );
}

/* ─── Filter select ─────────────────────────────────────────────── */

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Order detail drawer ───────────────────────────────────────── */

function OrderDetailDrawer({ order, session, onClose, onUpdated }: {
  order: AdminOrder;
  session: { access_token: string } | null;
  onClose: () => void;
  onUpdated: (updates: Partial<AdminOrder>) => void;
}) {
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notesValue, setNotesValue] = useState(order.adminNotes);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const items = getItems(order);
  const payBadge = getBadge(PAYMENT_BADGES, order.status);
  const ordBadge = getBadge(ORDER_BADGES, order.orderStatus);
  const reqBadge = getBadge(REQ_BADGES, order.requirementsStatus);

  async function updateStatus(newStatus: string) {
    setStatusUpdating(true);
    setUpdateError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order.id, action: 'updateStatus', value: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onUpdated({ orderStatus: newStatus, statusChangedBy: order.email });
    } catch {
      setUpdateError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  }

  async function saveNotes() {
    setNotesSaving(true);
    setNotesSaved(false);
    setUpdateError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order.id, action: 'updateNotes', value: notesValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onUpdated({ adminNotes: notesValue });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {
      setUpdateError('Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{order.orderNumber || 'Order'}</h2>
            <p className="text-gray-400 text-xs">{order.orderRef}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${payBadge.cls}`}>
              {payBadge.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${ordBadge.cls}`}>
              {ordBadge.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${reqBadge.cls}`}>
              Req: {reqBadge.label}
            </span>
          </div>

          {/* Customer info */}
          <Section title="Customer">
            <DetailRow label="Name" value={order.name || '—'} />
            <DetailRow label="Email" value={
              <a href={`mailto:${order.email}`} className="text-orange-600 hover:underline flex items-center gap-1">
                {order.email} <Mail size={11} />
              </a>
            } />
            <DetailRow label="Company" value={order.company || '—'} />
            <DetailRow label="Website" value={
              order.website ? (
                <a href={order.website.startsWith('http') ? order.website : `https://${order.website}`}
                   target="_blank" rel="noopener noreferrer"
                   className="text-orange-600 hover:underline flex items-center gap-1">
                  {order.website} <ExternalLink size={11} />
                </a>
              ) : '—'
            } />
          </Section>

          {/* Order info */}
          <Section title="Order Details">
            <DetailRow label="Order Number" value={order.orderNumber || '—'} />
            <DetailRow label="Created" value={formatDate(order.createdAt)} />
            <DetailRow label="Paid" value={formatDate(order.paidAt)} />
            <DetailRow label="Total" value={formatMoney(order.amount, order.currency)} />
            <DetailRow label="WFP Transaction ID" value={order.wfpTransactionId || '—'} />
            <DetailRow label="Last Updated" value={formatDate(order.updatedAt)} />
            {order.statusChangedBy && (
              <DetailRow label="Status changed by" value={order.statusChangedBy} />
            )}
          </Section>

          {/* Purchased items */}
          <Section title="Purchased Items">
            {items.length > 0 ? (
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                      <span className="text-xs text-gray-400">×{item.quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatMoney(item.unitPrice, order.currency)} each
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-xs">No items found.</p>
            )}
          </Section>

          {/* Submitted requirements */}
          <Section title="Customer Requirements">
            {Array.isArray(order.requirements) && order.requirements.length > 0 ? (
              <div className="flex flex-col gap-3">
                {order.requirements.map((req, i) => {
                  const isPending = req.willProvideLater || (!req.targetUrl?.trim() && !req.anchor?.trim() && !req.niche?.trim());
                  return (
                    <div key={i} className={`border rounded-lg p-4 ${isPending ? 'bg-amber-50/40 border-amber-200' : 'bg-green-50/30 border-green-200'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">Placement {i + 1}</span>
                        {isPending ? (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock size={9} /> Pending
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={9} /> Complete
                          </span>
                        )}
                      </div>
                      {isPending ? (
                        <p className="text-xs text-amber-600 italic">
                          {req.willProvideLater ? 'Customer will provide details later.' : 'No data submitted yet.'}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          <ReqField label="Target URL" value={req.targetUrl} link />
                          <ReqField label="Anchor Text" value={req.anchor} />
                          <ReqField label="Niche / Topic" value={req.niche} />
                          {req.notes && <ReqField label="Notes" value={req.notes} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock size={14} /> No requirements submitted yet.
              </div>
            )}
          </Section>

          {/* Status changer */}
          <Section title="Change Order Status">
            <div className="flex gap-2 flex-wrap">
              {ORDER_STATUS_OPTIONS.map(opt => {
                const isActive = order.orderStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    disabled={isActive || statusUpdating}
                    onClick={() => updateStatus(opt.value)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition disabled:opacity-50 ${
                      isActive
                        ? `${getBadge(ORDER_BADGES, opt.value).cls} cursor-default`
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {statusUpdating && !isActive ? <Loader2 size={11} className="animate-spin inline" /> : opt.label}
                  </button>
                );
              })}
            </div>
            {updateError && <p className="text-red-500 text-xs mt-2">{updateError}</p>}
          </Section>

          {/* Admin notes */}
          <Section title="Admin Notes">
            <div className="flex flex-col gap-2">
              <textarea
                value={notesValue}
                onChange={(e) => { setNotesValue(e.target.value); setNotesSaved(false); }}
                rows={3}
                placeholder="Add internal notes about this order..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={saveNotes}
                  disabled={notesSaving}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  {notesSaving ? <Loader2 size={12} className="animate-spin" /> : notesSaved ? <CheckCircle2 size={12} /> : <Save size={12} />}
                  {notesSaving ? 'Saving...' : notesSaved ? 'Saved!' : 'Save Notes'}
                </button>
              </div>
            </div>
          </Section>

          {/* Contact customer */}
          <div className="pt-2">
            <a
              href={`mailto:${order.email}?subject=Order ${order.orderNumber || order.orderRef}`}
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <Mail size={14} /> Contact Customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Small components ─────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
      <span className="text-xs text-gray-900 font-medium text-right break-all">{value}</span>
    </div>
  );
}

function ReqField({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</span>
      {link && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer"
           className="block text-xs text-orange-600 hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-xs text-gray-700 break-all">{value || '—'}</p>
      )}
    </div>
  );
}
