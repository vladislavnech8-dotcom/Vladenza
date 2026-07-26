import { useEffect, useState } from 'react';
import { Package, Clock, RefreshCw, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

interface RecentOrder {
  id: string;
  service_type: string;
  status: string;
  target_url: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, { cls: string; label: string }> = {
  pending:     { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  in_progress: { cls: 'bg-blue-50 text-blue-700 border-blue-200',   label: 'In Progress' },
  completed:   { cls: 'bg-green-50 text-green-700 border-green-200', label: 'Completed' },
  cancelled:   { cls: 'bg-gray-100 text-gray-500 border-gray-200',   label: 'Cancelled' },
};

interface Props { onGoToOrders: () => void; }

export default function SectionDashboard({ onGoToOrders }: Props) {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('client_orders')
        .select('id, service_type, status, target_url, created_at')
        .order('created_at', { ascending: false });

      if (data) {
        setRecent(data.slice(0, 5));
        setStats({
          total:       data.length,
          pending:     data.filter(o => o.status === 'pending').length,
          in_progress: data.filter(o => o.status === 'in_progress').length,
          completed:   data.filter(o => o.status === 'completed').length,
        });
      }
      setLoading(false);
    })();
  }, []);

  const statCards = [
    { label: 'Total Orders',  value: stats.total,       Icon: Package,      bg: 'bg-gray-100',   color: 'text-gray-700' },
    { label: 'Pending',       value: stats.pending,      Icon: Clock,        bg: 'bg-amber-50',   color: 'text-amber-600' },
    { label: 'In Progress',   value: stats.in_progress,  Icon: RefreshCw,    bg: 'bg-blue-50',    color: 'text-blue-600' },
    { label: 'Completed',     value: stats.completed,    Icon: CheckCircle2, bg: 'bg-green-50',   color: 'text-green-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your link building dashboard</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {statCards.map(({ label, value, Icon, bg, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={17} className={color} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{loading ? '–' : value}</div>
            <div className="text-gray-500 text-xs mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">Recent Orders</span>
          <button onClick={onGoToOrders}
            className="flex items-center gap-1 text-[#F97316] text-xs font-semibold hover:gap-2 transition-all">
            View all <ArrowRight size={13} />
          </button>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-12 flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Sparkles size={20} className="text-[#F97316]" />
            </div>
            <p className="text-gray-600 font-medium text-sm">No orders yet</p>
            <p className="text-gray-400 text-xs">Place your first order to get started.</p>
            <button onClick={onGoToOrders}
              className="mt-1 flex items-center gap-1.5 bg-[#F97316] hover:bg-[#ea6c0a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              Place Order <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map(o => {
              const s = STATUS_STYLE[o.status] ?? STATUS_STYLE.pending;
              return (
                <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 text-sm font-medium">{o.service_type}</div>
                    <div className="text-gray-400 text-xs truncate mt-0.5 max-w-xs">{o.target_url || '—'}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-gray-400 text-xs hidden sm:block">
                      {new Date(o.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
