import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Upload, ArrowLeft, LogOut,
  RefreshCw, Loader2, AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isCrmOwner, fetchCrmStats, fetchFollowUpsByDateRange, fetchOverdueFollowUps,
  fetchContacts, fetchContactById, fetchActivities, fetchNotes, fetchFollowUps,
  createNote, deleteNote, createCompany, updateCompany, createContact, updateContact,
  checkContactDuplicates, bulkCreateContacts, createImportRecord,
  type CrmStats, type CrmFollowUp, type CrmContact,
  LIFECYCLE_LABELS, LIFECYCLE_BADGES, SOURCE_LABELS, ACTIVITY_TYPE_LABELS,
} from '../lib/crm';
import { supabase } from '../lib/supabase';

type CrmSection = 'overview' | 'companies' | 'contacts' | 'import';

type NoteRow = Record<string, string>;

export default function CrmPage() {
  const { user, signOut } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [section, setSection] = useState<CrmSection>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    isCrmOwner(user.id).then((ok) => {
      setIsOwner(ok);
      setAuthChecked(true);
    });
  }, [user?.id]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-6">You do not have permission to access the CRM.</p>
          <Link to="/admin" className="text-sm font-semibold text-[#F97316] hover:underline">Back to Admin</Link>
        </div>
      </div>
    );
  }

  const NAV: { id: CrmSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { id: 'companies', label: 'Companies', icon: <Building2 size={15} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={15} /> },
    { id: 'import', label: 'Import', icon: <Upload size={15} /> },
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-[#F97316] flex items-center justify-center text-white font-bold text-xs">C</span>
          <div>
            <div className="font-black text-white text-sm tracking-tight leading-none">Vladenza CRM</div>
            <div className="text-gray-600 text-[10px] mt-0.5">Private — Owner Only</div>
          </div>
        </Link>
        <button onClick={() => setMobileNavOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
          <LogOut size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon }) => (
          <button key={id} onClick={() => { setSection(id); setCompanyId(null); setContactId(null); setMobileNavOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all text-left ${
              section === id && !companyId && !contactId
                ? 'bg-[#F97316]/15 text-[#F97316]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            {icon} {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 w-full transition-all mb-1">
          <ArrowLeft size={15} /> Back to Admin
        </Link>
        <div className="px-3 py-2 mb-1">
          <div className="text-white text-xs font-medium truncate">{user?.email}</div>
        </div>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 w-full transition-all">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex flex-col w-56 bg-gray-950 flex-shrink-0 sticky top-0 h-screen">
        {sidebar}
      </aside>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative w-56 bg-gray-950 flex flex-col z-10">{sidebar}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button onClick={() => setMobileNavOpen(true)} className="text-gray-600 hover:text-gray-900">
            <LayoutDashboard size={20} />
          </button>
          <span className="font-bold text-gray-900 text-sm">CRM</span>
          <div className="w-5" />
        </header>

        <main className="flex-1">
          {section === 'overview' && !companyId && !contactId && <OverviewSection />}
          {section === 'companies' && !companyId && !contactId && <CompaniesSection onOpenCompany={(id) => setCompanyId(id)} />}
          {section === 'companies' && companyId && <CompanyDetail companyId={companyId} onBack={() => setCompanyId(null)} onOpenContact={(id) => { setContactId(id); }} />}
          {section === 'contacts' && !contactId && !companyId && <ContactsSection onOpenContact={(id) => setContactId(id)} />}
          {section === 'contacts' && contactId && <ContactDetail contactId={contactId} onBack={() => setContactId(null)} onOpenCompany={(id) => { setCompanyId(id); setSection('companies'); }} />}
          {section === 'import' && <ImportSection />}
        </main>
      </div>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────

function OverviewSection() {
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [dueToday, setDueToday] = useState<CrmFollowUp[]>([]);
  const [overdue, setOverdue] = useState<CrmFollowUp[]>([]);
  const [recentContacts, setRecentContacts] = useState<CrmContact[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const [s, dt, od, rc] = await Promise.all([
      fetchCrmStats(),
      fetchFollowUpsByDateRange(today, today),
      fetchOverdueFollowUps(),
      fetchContacts({ page: 1, perPage: 5 }),
    ]);
    setStats(s);
    setDueToday(dt);
    setOverdue(od);
    setRecentContacts(rc.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>;
  }

  const cards = [
    { label: 'Companies', value: stats?.totalCompanies ?? 0, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Contacts', value: stats?.totalContacts ?? 0, color: 'text-gray-700 bg-gray-50 border-gray-200' },
    { label: 'Prospects', value: stats?.prospects ?? 0, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { label: 'Clients', value: stats?.clients ?? 0, color: 'text-green-700 bg-green-50 border-green-200' },
    { label: 'Former Clients', value: stats?.formerClients ?? 0, color: 'text-gray-600 bg-gray-100 border-gray-200' },
    { label: 'Due Today', value: stats?.followUpsDueToday ?? 0, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    { label: 'Overdue', value: stats?.followUpsOverdue ?? 0, color: 'text-red-700 bg-red-50 border-red-200' },
    { label: 'No Activity 90d+', value: stats?.noActivity90 ?? 0, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">CRM Overview</h1>
          <p className="text-gray-500 text-sm">Your customer relationship snapshot</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
            <div className="text-2xl font-black leading-none">{c.value}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mt-1.5 opacity-80">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue follow-ups */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Overdue Follow-ups
            <span className="text-xs text-gray-400 font-normal">({overdue.length})</span>
          </h2>
          {overdue.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No overdue follow-ups.</p>
          ) : (
            <div className="space-y-2">
              {overdue.slice(0, 8).map((f) => (
                <FollowUpRow key={f.id} followUp={f} overdue />
              ))}
            </div>
          )}
        </div>

        {/* Due today */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Due Today
            <span className="text-xs text-gray-400 font-normal">({dueToday.length})</span>
          </h2>
          {dueToday.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No follow-ups due today.</p>
          ) : (
            <div className="space-y-2">
              {dueToday.slice(0, 8).map((f) => (
                <FollowUpRow key={f.id} followUp={f} />
              ))}
            </div>
          )}
        </div>

        {/* Recently added contacts */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Recently Added</h2>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No contacts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.full_name || c.email || c.fiverr_username || 'Unnamed'}</div>
                    <div className="text-xs text-gray-400 truncate">{c.email || c.fiverr_username || ''}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[c.lifecycle_stage] ?? ''}`}>
                    {LIFECYCLE_LABELS[c.lifecycle_stage] ?? c.lifecycle_stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* No activity 90+ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">No Recent Activity (90+ days)</h2>
          <div className="text-center py-6">
            <div className="text-3xl font-black text-amber-600">{stats?.noActivity90 ?? 0}</div>
            <div className="text-xs text-gray-400 mt-1">contacts with no activity in 90+ days</div>
            <div className="text-xs text-gray-400 mt-3">{stats?.noActivity180 ?? 0} contacts at 180+ days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpRow({ followUp: f, overdue }: { followUp: CrmFollowUp; overdue?: boolean }) {
  const [completing, setCompleting] = useState(false);
  const name = f.contact?.full_name || f.contact?.email || f.company?.name || 'Unknown';

  async function complete() {
    setCompleting(true);
    const { error } = await supabase.from('crm_follow_ups').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', f.id);
    if (!error) {
      // optimistic — parent will reload on refresh
    }
    setCompleting(false);
  }

  return (
    <div className={`flex items-center justify-between gap-3 py-2 px-3 rounded-lg ${overdue ? 'bg-red-50/50' : 'bg-gray-50/50'}`}>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
        <div className="text-xs text-gray-400 truncate">{f.note || 'No note'}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] font-semibold ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
          {f.due_date}
        </span>
        <button onClick={complete} disabled={completing}
          className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md hover:bg-green-100 transition disabled:opacity-40">
          {completing ? <Loader2 size={10} className="animate-spin" /> : 'Done'}
        </button>
      </div>
    </div>
  );
}

// ─── Companies List ─────────────────────────────────────────────

function CompaniesSection({ onOpenCompany }: { onOpenCompany: (id: string) => void }) {
  const [companies, setCompanies] = useState<CrmContact['company'][]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const perPage = 25;

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('crm_companies').select('id, name, website, domain, company_type, niche, country, lifecycle_stage, source, original_source, archived_at, last_activity_at, next_follow_up_at, created_at, updated_at', { count: 'exact' }).is('archived_at', null);
    if (lifecycle !== 'all') q = q.eq('lifecycle_stage', lifecycle);
    if (search) q = q.or(`name.ilike.%${search}%,domain.ilike.%${search}%`);
    q = q.order('created_at', { ascending: false }).range((page - 1) * perPage, page * perPage - 1);
    const res = await q;
    setCompanies(res.data ?? []);
    setTotal(res.count ?? 0);
    setLoading(false);
  }, [page, search, lifecycle]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Companies</h1>
          <p className="text-gray-500 text-sm">{total} total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 rounded-lg transition">
          + New Company
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search companies..."
          className="flex-1 min-w-[200px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        <select value={lifecycle} onChange={(e) => { setLifecycle(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
          <option value="all">All Stages</option>
          {Object.entries(LIFECYCLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : companies.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No companies yet. Create your first one.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Domain</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Stage</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Source</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c!.id} onClick={() => onOpenCompany(c!.id)} className="border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{c!.name}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{c!.domain || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c!.company_type || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[c!.lifecycle_stage] ?? ''}`}>
                        {LIFECYCLE_LABELS[c!.lifecycle_stage] ?? c!.lifecycle_stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{SOURCE_LABELS[c!.source ?? ''] ?? c!.source ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} perPage={perPage} onChange={setPage} />
        </>
      )}

      {showCreate && <CompanyModal onClose={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}

// ─── Company Detail (360) ────────────────────────────────────────

function CompanyDetail({ companyId, onBack, onOpenContact }: { companyId: string; onBack: () => void; onOpenContact: (id: string) => void }) {
  const [company, setCompany] = useState<CrmContact['company'] | null>(null);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [activities, setActivities] = useState<unknown[]>([]);
  const [notes, setNotes] = useState<unknown[]>([]);
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [tab, setTab] = useState<'overview' | 'contacts' | 'activity' | 'notes' | 'follow_ups' | 'opportunities' | 'projects' | 'finance'>('overview');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, ct, act, nt, fu] = await Promise.all([
      supabase.from('crm_companies').select('*').eq('id', companyId).maybeSingle(),
      supabase.from('crm_contacts').select('id, first_name, last_name, full_name, job_title, email, phone, linkedin_url, fiverr_username, lifecycle_stage, last_contacted_at, next_follow_up_at, created_at').eq('company_id', companyId).is('archived_at', null).order('created_at', { ascending: false }),
      supabase.from('crm_activities').select('id, type, notes, activity_date, contact:contact_id ( full_name )').eq('company_id', companyId).order('activity_date', { ascending: false }).limit(20),
      supabase.from('crm_notes').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
      supabase.from('crm_follow_ups').select('id, due_date, due_time, note, status, contact:contact_id ( full_name )').eq('company_id', companyId).order('due_date', { ascending: true }),
    ]);
    setCompany(c.data);
    setContacts(ct.data ?? []);
    setActivities(act.data ?? []);
    setNotes(nt.data ?? []);
    setFollowUps(fu.data ?? []);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>;
  }

  if (!company) {
    return <div className="p-8 text-center text-gray-500">Company not found.</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: `Contacts (${contacts.length})` },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
    { id: 'follow_ups', label: 'Follow-ups' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'projects', label: 'Projects' },
    { id: 'finance', label: 'Finance' },
  ] as const;

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-4 transition">
        <ArrowLeft size={14} /> Back to Companies
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{company.name}</h1>
            <div className="flex items-center gap-3 flex-wrap text-sm text-gray-400">
              {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316]">{company.website}</a>}
              {company.niche && <span>· {company.niche}</span>}
              {company.country && <span>· {company.country}</span>}
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
            Edit
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[company.lifecycle_stage] ?? ''}`}>
            {LIFECYCLE_LABELS[company.lifecycle_stage] ?? company.lifecycle_stage}
          </span>
          {company.source && <span className="text-[11px] text-gray-400">Source: {SOURCE_LABELS[company.source] ?? company.source}</span>}
          {company.original_source && <span className="text-[11px] text-gray-400">Original: {SOURCE_LABELS[company.original_source] ?? company.original_source}</span>}
        </div>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${tab === t.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard label="Company Type" value={company.company_type || '—'} />
          <InfoCard label="Domain" value={company.domain || '—'} />
          <InfoCard label="Niche / Industry" value={company.niche || '—'} />
          <InfoCard label="Country" value={company.country || '—'} />
          <InfoCard label="Last Activity" value={company.last_activity_at ? new Date(company.last_activity_at).toLocaleDateString() : '—'} />
          <InfoCard label="Next Follow-up" value={company.next_follow_up_at ? new Date(company.next_follow_up_at).toLocaleDateString() : '—'} />
        </div>
      )}

      {tab === 'contacts' && (
        <div className="space-y-2">
          {contacts.length === 0 ? (
            <EmptyState icon={<Users size={28} />} text="No contacts linked to this company yet." />
          ) : (
            contacts.map((c) => (
              <div key={c.id} onClick={() => onOpenContact(c.id)} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 transition">
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.full_name || 'Unnamed'}</div>
                  <div className="text-xs text-gray-400">{c.job_title || c.email || '—'}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[c.lifecycle_stage] ?? ''}`}>{LIFECYCLE_LABELS[c.lifecycle_stage] ?? c.lifecycle_stage}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="space-y-2">
          {activities.length === 0 ? (
            <EmptyState icon={<LayoutDashboard size={28} />} text="No activities recorded yet." />
          ) : (
            (activities as Array<Record<string, unknown>>).map((a) => (
              <div key={a.id as string} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#F97316]">{ACTIVITY_TYPE_LABELS[a.type as string] ?? a.type}</span>
                  <span className="text-xs text-gray-400">{new Date(a.activity_date as string).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{a.notes as string || 'No notes'}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'notes' && <NotesTab companyId={companyId} notes={notes as NoteRow[]} onReload={load} />}

      {tab === 'follow_ups' && (
        <div className="space-y-2">
          {followUps.length === 0 ? (
            <EmptyState icon={<RefreshCw size={28} />} text="No follow-ups scheduled." />
          ) : (
            followUps.map((f) => (
              <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{f.contact?.full_name || 'Company follow-up'}</div>
                  <div className="text-xs text-gray-400">{f.note || 'No note'}</div>
                </div>
                <span className="text-xs text-gray-500">{f.due_date}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'opportunities' && <EmptyState icon={<LayoutDashboard size={28} />} text="No linked opportunities yet." />}
      {tab === 'projects' && <EmptyState icon={<LayoutDashboard size={28} />} text="Project integration will be available after CRM integration." />}
      {tab === 'finance' && <EmptyState icon={<LayoutDashboard size={28} />} text="Finance integration will be available in a future phase." />}

      {showEdit && <CompanyModal company={company} onClose={() => { setShowEdit(false); load(); }} />}
    </div>
  );
}

// ─── Contacts List ──────────────────────────────────────────────

function ContactsSection({ onOpenContact }: { onOpenContact: (id: string) => void }) {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState('all');
  const [source, setSource] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const perPage = 25;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, total: t } = await fetchContacts({ page, perPage, search, lifecycle, source });
    setContacts(data);
    setTotal(t);
    setLoading(false);
  }, [page, search, lifecycle, source]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Contacts</h1>
          <p className="text-gray-500 text-sm">{total} total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 rounded-lg transition">
          + New Contact
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, Fiverr..."
          className="flex-1 min-w-[200px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        <select value={lifecycle} onChange={(e) => { setLifecycle(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
          <option value="all">All Stages</option>
          {Object.entries(LIFECYCLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
          <option value="all">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[
          { l: 'All', v: 'all' }, { l: 'Prospects', v: 'prospect' }, { l: 'Clients', v: 'client' },
          { l: 'Former Clients', v: 'former_client' }, { l: 'Fiverr', v: 'fiverr' },
        ].map((p) => (
          <button key={p.v} onClick={() => { setLifecycle(p.v === 'all' ? 'all' : p.v); setSource(p.v === 'fiverr' ? 'fiverr' : 'all'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              (lifecycle === p.v || (p.v === 'all' && lifecycle === 'all' && source === 'all'))
                ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            {p.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : contacts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No contacts yet. Create your first one or import from CSV.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Source</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Stage</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} onClick={() => onOpenContact(c.id)} className="border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.full_name || c.fiverr_username || c.email || 'Unnamed'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{(c as Record<string, unknown>).company ? ((c as Record<string, { company?: { name?: string } }>).company?.name ?? '—') : '—'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{SOURCE_LABELS[c.source ?? ''] ?? c.source ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[c.lifecycle_stage] ?? ''}`}>{LIFECYCLE_LABELS[c.lifecycle_stage] ?? c.lifecycle_stage}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} perPage={perPage} onChange={setPage} />
        </>
      )}

      {showCreate && <ContactModal onClose={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}

// ─── Contact Detail ─────────────────────────────────────────────

function ContactDetail({ contactId, onBack, onOpenCompany }: { contactId: string; onBack: () => void; onOpenCompany: (id: string) => void }) {
  const [contact, setContact] = useState<CrmContact | null>(null);
  const [activities, setActivities] = useState<unknown[]>([]);
  const [notes, setNotes] = useState<unknown[]>([]);
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [tab, setTab] = useState<'profile' | 'activity' | 'notes' | 'follow_ups'>('profile');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const c = await fetchContactById(contactId);
    setContact(c);
    const [act, nt, fu] = await Promise.all([
      fetchActivities({ contactId, limit: 20 }),
      fetchNotes({ contactId }),
      fetchFollowUps({ contactId }),
    ]);
    setActivities(act);
    setNotes(nt);
    setFollowUps(fu);
    setLoading(false);
  }, [contactId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>;
  if (!contact) return <div className="p-8 text-center text-gray-500">Contact not found.</div>;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
    { id: 'follow_ups', label: 'Follow-ups' },
  ] as const;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-4 transition">
        <ArrowLeft size={14} /> Back to Contacts
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{contact.full_name || 'Unnamed Contact'}</h1>
            <div className="text-sm text-gray-400">{contact.job_title || '—'}</div>
            {contact.company && (
              <button onClick={() => onOpenCompany(contact.company_id!)} className="text-sm text-[#F97316] hover:underline mt-1">
                {contact.company.name}
              </button>
            )}
          </div>
          <button onClick={() => setShowEdit(true)} className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Edit</button>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${LIFECYCLE_BADGES[contact.lifecycle_stage] ?? ''}`}>{LIFECYCLE_LABELS[contact.lifecycle_stage] ?? contact.lifecycle_stage}</span>
          {contact.source && <span className="text-[11px] text-gray-400">Source: {SOURCE_LABELS[contact.source] ?? contact.source}</span>}
          {contact.original_source && <span className="text-[11px] text-gray-400">Original: {SOURCE_LABELS[contact.original_source] ?? contact.original_source}</span>}
        </div>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${tab === t.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard label="Email" value={contact.email || '—'} />
          <InfoCard label="Phone" value={contact.phone || '—'} />
          <InfoCard label="LinkedIn" value={contact.linkedin_url ? <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">{contact.linkedin_url}</a> : '—'} />
          <InfoCard label="Fiverr Username" value={contact.fiverr_username || '—'} />
          <InfoCard label="Telegram" value={contact.telegram || '—'} />
          <InfoCard label="Country" value={contact.country || '—'} />
          <InfoCard label="Last Contacted" value={contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleDateString() : '—'} />
          <InfoCard label="Next Follow-up" value={contact.next_follow_up_at ? new Date(contact.next_follow_up_at).toLocaleDateString() : '—'} />
          {contact.historical_revenue > 0 && <InfoCard label="Historical Revenue" value={`$${contact.historical_revenue.toLocaleString()}`} />}
        </div>
      )}

      {tab === 'activity' && (
        <div className="space-y-2">
          {activities.length === 0 ? (
            <EmptyState icon={<LayoutDashboard size={28} />} text="No activities recorded yet." />
          ) : (
            (activities as Array<Record<string, unknown>>).map((a) => (
              <div key={a.id as string} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#F97316]">{ACTIVITY_TYPE_LABELS[a.type as string] ?? a.type}</span>
                  <span className="text-xs text-gray-400">{new Date(a.activity_date as string).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{a.notes as string || 'No notes'}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'notes' && <NotesTab contactId={contactId} notes={notes as NoteRow[]} onReload={load} />}

      {tab === 'follow_ups' && (
        <div className="space-y-2">
          {followUps.length === 0 ? (
            <EmptyState icon={<RefreshCw size={28} />} text="No follow-ups scheduled." />
          ) : (
            followUps.map((f) => (
              <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{f.note || 'Follow-up'}</div>
                  <div className="text-xs text-gray-400">Due: {f.due_date} {f.due_time || ''}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${f.status === 'completed' ? 'text-green-700 bg-green-50 border-green-200' : f.status === 'cancelled' ? 'text-gray-500 bg-gray-100 border-gray-200' : 'text-orange-700 bg-orange-50 border-orange-200'}`}>{f.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {showEdit && <ContactModal contact={contact} onClose={() => { setShowEdit(false); load(); }} />}
    </div>
  );
}

// ─── Import ──────────────────────────────────────────────────────

function ImportSection() {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'done'>('upload');
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [defaultSource, setDefaultSource] = useState('fiverr');
  const [importResult, setImportResult] = useState<{ created: number; errors: number; skipped: number; duplicates: number } | null>(null);
  const [fileName, setFileName] = useState('');
  const [dupInfo, setDupInfo] = useState<{ newRows: number; potentialDuplicates: number } | null>(null);
  const [importMode, setImportMode] = useState<'skip' | 'update' | 'new'>('skip');
  const [importing, setImporting] = useState(false);

  function handleFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length === 0) return;
      const headerLine = lines[0];
      const delimiter = headerLine.includes('\t') ? '\t' : ',';
      const hdrs = headerLine.split(delimiter).map((h) => h.trim().replace(/"/g, ''));
      setHeaders(hdrs);
      const rows: Array<Record<string, string>> = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(delimiter).map((v) => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        hdrs.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
        rows.push(row);
      }
      setCsvData(rows);
      // Auto-map common fields
      const autoMap: Record<string, string> = {};
      const fields = ['first_name', 'last_name', 'full_name', 'email', 'phone', 'linkedin_url', 'fiverr_username', 'telegram', 'country', 'company', 'website', 'job_title', 'source', 'original_source', 'historical_revenue', 'notes'];
      for (const f of fields) {
        const match = hdrs.find((h) => h.toLowerCase().replace(/\s+/g, '_') === f || h.toLowerCase().includes(f));
        if (match) autoMap[f] = match;
      }
      setMapping(autoMap);
      setStep('mapping');
    };
    reader.readAsText(file);
  }

  async function runDuplicateCheck() {
    const mappedRows = csvData.map((r) => {
      const mapped: Record<string, string> = {};
      for (const [field, header] of Object.entries(mapping)) {
        mapped[field] = r[header] ?? '';
      }
      return mapped;
    });
    const result = await checkContactDuplicates(mappedRows);
    setDupInfo({ newRows: result.newRows, potentialDuplicates: result.potentialDuplicates });
    setStep('preview');
  }

  async function runImport() {
    setImporting(true);
    const mappedRows = csvData.map((r) => {
      const mapped: Record<string, string> = {};
      for (const [field, header] of Object.entries(mapping)) {
        mapped[field] = r[header] ?? '';
      }
      return mapped;
    });

    let toImport = mappedRows;
    let skipped = 0;

    if (importMode === 'skip' && dupInfo) {
      // Skip rows that match existing contacts
      const { duplicates } = await checkContactDuplicates(mappedRows);
      const dupEmails = new Set(duplicates.filter((d) => d.field === 'email').map((d) => d.value));
      const dupFiverr = new Set(duplicates.filter((d) => d.field === 'fiverr_username').map((d) => d.value));
      const dupLinkedin = new Set(duplicates.filter((d) => d.field === 'linkedin_url').map((d) => d.value));
      toImport = mappedRows.filter((r) =>
        !(r.email && dupEmails.has(r.email)) &&
        !(r.fiverr_username && dupFiverr.has(r.fiverr_username)) &&
        !(r.linkedin_url && dupLinkedin.has(r.linkedin_url))
      );
      skipped = mappedRows.length - toImport.length;
    }

    const { created, errors } = await bulkCreateContacts(toImport, defaultSource);

    await createImportRecord({
      file_name: fileName,
      source: defaultSource,
      rows_total: csvData.length,
      rows_created: created,
      rows_updated: 0,
      rows_skipped: skipped,
      rows_error: errors,
    });

    setImportResult({ created, errors, skipped, duplicates: dupInfo?.potentialDuplicates ?? 0 });
    setImporting(false);
    setStep('done');
  }

  if (step === 'upload') {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Import Contacts</h1>
        <p className="text-gray-500 text-sm mb-6">Upload a CSV file to bulk import contacts. Perfect for historical Fiverr data.</p>
        <label className="block">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition">
            <Upload size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Click to upload CSV</p>
            <p className="text-xs text-gray-400 mt-1">Max thousands of rows supported</p>
          </div>
          <input type="file" accept=".csv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Expected columns</h3>
          <p className="text-xs text-gray-400">Fiverr Username, Name, First Name, Last Name, Email, Website, Company, Country, LinkedIn URL, Last Order Date, Historical Revenue, Service, Notes, Source</p>
        </div>
      </div>
    );
  }

  if (step === 'mapping') {
    const fields = ['first_name', 'last_name', 'full_name', 'email', 'phone', 'linkedin_url', 'fiverr_username', 'telegram', 'country', 'company', 'website', 'job_title', 'source', 'original_source', 'historical_revenue', 'notes'];
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Map Columns</h1>
        <p className="text-gray-500 text-sm mb-6">Match CSV columns to CRM fields. {csvData.length} rows detected.</p>
        <div className="space-y-2 mb-6">
          {fields.map((field) => (
            <div key={field} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">{field}</span>
              <select value={mapping[field] ?? ''} onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                <option value="">— Skip —</option>
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Default Source (for missing values)</label>
          <select value={defaultSource} onChange={(e) => setDefaultSource(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
            {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button onClick={runDuplicateCheck} className="text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-5 py-2.5 rounded-lg transition">
          Check Duplicates & Preview
        </button>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Preview & Import</h1>
        <p className="text-gray-500 text-sm mb-6">{csvData.length} rows from {fileName}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-black text-gray-900">{csvData.length}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Total Rows</div>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-4">
            <div className="text-2xl font-black text-green-700">{dupInfo?.newRows ?? 0}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">New</div>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-4">
            <div className="text-2xl font-black text-amber-700">{dupInfo?.potentialDuplicates ?? 0}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Potential Duplicates</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-black text-gray-400">0</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Invalid</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Duplicate Handling</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { v: 'skip', l: 'Skip duplicates' },
              { v: 'update', l: 'Update existing (coming soon)' },
              { v: 'new', l: 'Import all as new' },
            ].map((o) => (
              <button key={o.v} onClick={() => setImportMode(o.v as 'skip' | 'update' | 'new')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${importMode === o.v ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'} ${o.v === 'update' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={runImport} disabled={importing}
          className="text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-5 py-2.5 rounded-lg transition disabled:opacity-40 flex items-center gap-2">
          {importing && <Loader2 size={14} className="animate-spin" />}
          {importing ? 'Importing...' : `Import ${importMode === 'skip' ? dupInfo?.newRows ?? 0 : csvData.length} contacts`}
        </button>
      </div>
    );
  }

  // done
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Import Complete</h1>
      <p className="text-gray-500 text-sm mb-6">{fileName}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-green-200 rounded-xl p-4"><div className="text-2xl font-black text-green-700">{importResult?.created ?? 0}</div><div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Created</div></div>
        <div className="bg-white border border-amber-200 rounded-xl p-4"><div className="text-2xl font-black text-amber-700">{importResult?.skipped ?? 0}</div><div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Skipped</div></div>
        <div className="bg-white border border-red-200 rounded-xl p-4"><div className="text-2xl font-black text-red-700">{importResult?.errors ?? 0}</div><div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Errors</div></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="text-2xl font-black text-gray-400">{importResult?.duplicates ?? 0}</div><div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">Duplicates Found</div></div>
      </div>
      <button onClick={() => { setStep('upload'); setCsvData([]); setImportResult(null); setDupInfo(null); }}
        className="text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-5 py-2.5 rounded-lg transition">
        Import Another File
      </button>
    </div>
  );
}

// ─── Shared Components ──────────────────────────────────────────

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-gray-900 font-medium break-all">{value}</div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
      <div className="text-gray-300 mx-auto mb-3 flex justify-center">{icon}</div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition">
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition">
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

function NotesTab({ companyId, contactId, notes, onReload }: { companyId?: string; contactId?: string; notes: NoteRow[]; onReload: () => void }) {
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!body.trim()) return;
    setSaving(true);
    await createNote({ body, company_id: companyId ?? null, contact_id: contactId ?? null });
    setBody('');
    setSaving(false);
    onReload();
  }

  async function remove(id: string) {
    await deleteNote(id);
    onReload();
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a note..."
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        <button onClick={add} disabled={saving || !body.trim()} className="text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 rounded-lg transition disabled:opacity-40">
          {saving ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
        </button>
      </div>
      <div className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-700">{n.body}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => remove(n.id)} className="text-xs text-gray-300 hover:text-red-500 transition">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Company Modal ──────────────────────────────────────────────

function CompanyModal({ company, onClose }: { company?: CrmContact['company'] | null; onClose: () => void }) {
  const [form, setForm] = useState({
    name: company?.name ?? '',
    website: company?.website ?? '',
    domain: company?.domain ?? '',
    company_type: company?.company_type ?? 'other',
    niche: company?.niche ?? '',
    country: company?.country ?? '',
    lifecycle_stage: company?.lifecycle_stage ?? 'prospect',
    source: company?.source ?? '',
    original_source: company?.original_source ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    if (company?.id) {
      await updateCompany(company.id, form);
    } else {
      await createCompany(form);
    }
    setSaving(false);
    onClose();
  }

  return (
    <Modal title={company?.id ? 'Edit Company' : 'New Company'} onClose={onClose}>
      <div className="space-y-3">
        <FormField label="Company Name" required>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Website">
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
          <FormField label="Domain">
            <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Company Type">
            <select value={form.company_type} onChange={(e) => setForm({ ...form, company_type: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              {['client', 'agency', 'saas', 'ecommerce', 'local_business', 'publisher', 'other'].map((t) => <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
            </select>
          </FormField>
          <FormField label="Niche / Industry">
            <input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Country">
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
          <FormField label="Lifecycle Stage">
            <select value={form.lifecycle_stage} onChange={(e) => setForm({ ...form, lifecycle_stage: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              {Object.entries(LIFECYCLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Source">
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              <option value="">— None —</option>
              {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Original Source">
            <select value={form.original_source} onChange={(e) => setForm({ ...form, original_source: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              <option value="">— None —</option>
              {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
        </div>
        <button onClick={save} disabled={saving || !form.name.trim()} className="w-full text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] py-2.5 rounded-lg transition disabled:opacity-40">
          {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Company'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Contact Modal ─────────────────────────────────────────────

function ContactModal({ contact, onClose }: { contact?: CrmContact | null; onClose: () => void }) {
  const [form, setForm] = useState({
    first_name: contact?.first_name ?? '',
    last_name: contact?.last_name ?? '',
    job_title: contact?.job_title ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    linkedin_url: contact?.linkedin_url ?? '',
    fiverr_username: contact?.fiverr_username ?? '',
    telegram: contact?.telegram ?? '',
    country: contact?.country ?? '',
    source: contact?.source ?? 'fiverr',
    original_source: contact?.original_source ?? 'fiverr',
    lifecycle_stage: contact?.lifecycle_stage ?? 'prospect',
    company_id: contact?.company_id ?? '',
    historical_revenue: contact?.historical_revenue?.toString() ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const input: Partial<CrmContact> = {
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      job_title: form.job_title || null,
      email: form.email || null,
      phone: form.phone || null,
      linkedin_url: form.linkedin_url || null,
      fiverr_username: form.fiverr_username || null,
      telegram: form.telegram || null,
      country: form.country || null,
      source: form.source || null,
      original_source: form.original_source || null,
      lifecycle_stage: form.lifecycle_stage,
      company_id: form.company_id || null,
      historical_revenue: form.historical_revenue ? parseFloat(form.historical_revenue) : 0,
    };
    if (contact?.id) {
      await updateContact(contact.id, input);
    } else {
      await createContact(input);
    }
    setSaving(false);
    onClose();
  }

  return (
    <Modal title={contact?.id ? 'Edit Contact' : 'New Contact'} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First Name">
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
          <FormField label="Last Name">
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <FormField label="Job Title">
          <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        </FormField>
        <FormField label="Email">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
          <FormField label="Country">
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="LinkedIn URL">
            <input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
          <FormField label="Fiverr Username">
            <input value={form.fiverr_username} onChange={(e) => setForm({ ...form, fiverr_username: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <FormField label="Telegram">
          <input value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Source">
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Original Source">
            <select value={form.original_source} onChange={(e) => setForm({ ...form, original_source: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Lifecycle Stage">
            <select value={form.lifecycle_stage} onChange={(e) => setForm({ ...form, lifecycle_stage: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
              {Object.entries(LIFECYCLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Historical Revenue ($)">
            <input type="number" value={form.historical_revenue} onChange={(e) => setForm({ ...form, historical_revenue: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
          </FormField>
        </div>
        <button onClick={save} disabled={saving} className="w-full text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] py-2.5 rounded-lg transition disabled:opacity-40">
          {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Contact'}
        </button>
      </div>
    </Modal>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}{required && ' *'}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
