import { supabase } from './supabase';

// ─── Types ──────────────────────────────────────────────────────

export interface CrmCompany {
  id: string;
  name: string;
  website: string | null;
  domain: string | null;
  company_type: string | null;
  niche: string | null;
  country: string | null;
  lifecycle_stage: string;
  source: string | null;
  original_source: string | null;
  owner_id: string | null;
  archived_at: string | null;
  last_activity_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
  tags?: CrmTag[];
}

export interface CrmContact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  job_title: string | null;
  company_id: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  fiverr_username: string | null;
  telegram: string | null;
  country: string | null;
  source: string | null;
  original_source: string | null;
  lifecycle_stage: string;
  owner_id: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  historical_revenue: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  company?: CrmCompany | null;
  tags?: CrmTag[];
}

export interface CrmActivity {
  id: string;
  type: string;
  contact_id: string | null;
  company_id: string | null;
  owner_id: string | null;
  notes: string | null;
  activity_date: string;
  created_at: string;
  contact?: CrmContact | null;
  company?: CrmCompany | null;
}

export interface CrmNote {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  owner_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface CrmFollowUp {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  owner_id: string | null;
  due_date: string;
  due_time: string | null;
  note: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  contact?: CrmContact | null;
  company?: CrmCompany | null;
}

export interface CrmTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface CrmImport {
  id: string;
  file_name: string;
  source: string | null;
  rows_total: number;
  rows_created: number;
  rows_updated: number;
  rows_skipped: number;
  rows_error: number;
  status: string;
  created_at: string;
}

// ─── Constants ──────────────────────────────────────────────────

export const LIFECYCLE_STAGES = [
  'prospect',
  'lead',
  'qualified',
  'client',
  'former_client',
  'partner',
  'lost',
  'do_not_contact',
] as const;

export const COMPANY_TYPES = [
  'client',
  'agency',
  'saas',
  'ecommerce',
  'local_business',
  'publisher',
  'other',
] as const;

export const SOURCES = [
  'fiverr',
  'linkedin',
  'cold_email',
  'website',
  'google_ads',
  'meta_ads',
  'twitter',
  'referral',
  'direct',
  'partner',
  'manual',
  'other',
] as const;

export const ACTIVITY_TYPES = [
  'note',
  'email',
  'linkedin',
  'fiverr',
  'call',
  'meeting',
  'follow_up',
  'other',
] as const;

export const FOLLOW_UP_STATUSES = ['open', 'completed', 'cancelled'] as const;

export const LIFECYCLE_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  lead: 'Lead',
  qualified: 'Qualified',
  client: 'Client',
  former_client: 'Former Client',
  partner: 'Partner',
  lost: 'Lost',
  do_not_contact: 'Do Not Contact',
};

export const LIFECYCLE_BADGES: Record<string, string> = {
  prospect: 'text-blue-700 bg-blue-50 border-blue-200',
  lead: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  qualified: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  client: 'text-green-700 bg-green-50 border-green-200',
  former_client: 'text-gray-600 bg-gray-100 border-gray-200',
  partner: 'text-purple-700 bg-purple-50 border-purple-200',
  lost: 'text-red-700 bg-red-50 border-red-200',
  do_not_contact: 'text-red-900 bg-red-100 border-red-300',
};

export const SOURCE_LABELS: Record<string, string> = {
  fiverr: 'Fiverr',
  linkedin: 'LinkedIn',
  cold_email: 'Cold Email',
  website: 'Website',
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  twitter: 'X / Twitter',
  referral: 'Referral',
  direct: 'Direct',
  partner: 'Partner',
  manual: 'Manual',
  other: 'Other',
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  note: 'Note',
  email: 'Email',
  linkedin: 'LinkedIn',
  fiverr: 'Fiverr',
  call: 'Call',
  meeting: 'Meeting',
  follow_up: 'Follow-up',
  other: 'Other',
};

export const ACTIVITY_TYPE_ICONS: Record<string, string> = {
  note: '📝',
  email: '✉️',
  linkedin: 'in',
  fiverr: 'fi',
  call: '📞',
  meeting: '📅',
  follow_up: '🔁',
  other: '•',
};

// ─── Owner Check ────────────────────────────────────────────────

export async function isCrmOwner(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('crm_owners')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}

// ─── Companies ──────────────────────────────────────────────────

export async function fetchCompanies(opts: {
  page?: number;
  perPage?: number;
  search?: string;
  lifecycle?: string;
  source?: string;
  companyType?: string;
  includeArchived?: boolean;
}): Promise<{ data: CrmCompany[]; total: number }> {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let q = supabase.from('crm_companies').select(
    'id, name, website, domain, company_type, niche, country, lifecycle_stage, source, original_source, owner_id, archived_at, last_activity_at, next_follow_up_at, created_at, updated_at',
    { count: 'exact' }
  );

  if (!opts.includeArchived) q = q.is('archived_at', null);
  if (opts.lifecycle && opts.lifecycle !== 'all') q = q.eq('lifecycle_stage', opts.lifecycle);
  if (opts.source && opts.source !== 'all') q = q.eq('source', opts.source);
  if (opts.companyType && opts.companyType !== 'all') q = q.eq('company_type', opts.companyType);
  if (opts.search) {
    q = q.or(`name.ilike.%${opts.search}%,domain.ilike.%${opts.search}%,website.ilike.%${opts.search}%`);
  }
  q = q.order('created_at', { ascending: false }).range(from, to);

  const res = await q;
  return { data: (res.data ?? []) as CrmCompany[], total: res.count ?? 0 };
}

export async function fetchCompanyById(id: string): Promise<CrmCompany | null> {
  const { data } = await supabase
    .from('crm_companies')
    .select('*, crm_company_tags(tag_id)')
    .eq('id', id)
    .maybeSingle();
  return data as CrmCompany | null;
}

export async function createCompany(input: Partial<CrmCompany>): Promise<CrmCompany | null> {
  const { data } = await supabase
    .from('crm_companies')
    .insert({
      name: input.name ?? 'Untitled',
      website: input.website ?? null,
      domain: input.domain ?? null,
      company_type: input.company_type ?? 'other',
      niche: input.niche ?? null,
      country: input.country ?? null,
      lifecycle_stage: input.lifecycle_stage ?? 'prospect',
      source: input.source ?? null,
      original_source: input.original_source ?? null,
    })
    .select('*')
    .single();
  return data as CrmCompany | null;
}

export async function updateCompany(id: string, patch: Partial<CrmCompany>): Promise<boolean> {
  const { error } = await supabase.from('crm_companies').update(patch).eq('id', id);
  return !error;
}

export async function archiveCompany(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('crm_companies')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function unarchiveCompany(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('crm_companies')
    .update({ archived_at: null })
    .eq('id', id);
  return !error;
}

// ─── Contacts ───────────────────────────────────────────────────

export async function fetchContacts(opts: {
  page?: number;
  perPage?: number;
  search?: string;
  lifecycle?: string;
  source?: string;
  companyId?: string;
  includeArchived?: boolean;
}): Promise<{ data: CrmContact[]; total: number }> {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let q = supabase.from('crm_contacts').select(
    'id, first_name, last_name, full_name, job_title, company_id, email, phone, linkedin_url, fiverr_username, telegram, country, source, original_source, lifecycle_stage, owner_id, last_contacted_at, next_follow_up_at, historical_revenue, archived_at, created_at, updated_at, company:id ( id, name, domain )',
    { count: 'exact' }
  );

  if (!opts.includeArchived) q = q.is('archived_at', null);
  if (opts.lifecycle && opts.lifecycle !== 'all') q = q.eq('lifecycle_stage', opts.lifecycle);
  if (opts.source && opts.source !== 'all') q = q.eq('source', opts.source);
  if (opts.companyId) q = q.eq('company_id', opts.companyId);
  if (opts.search) {
    q = q.or(`full_name.ilike.%${opts.search}%,email.ilike.%${opts.search}%,fiverr_username.ilike.%${opts.search}%,linkedin_url.ilike.%${opts.search}%`);
  }
  q = q.order('created_at', { ascending: false }).range(from, to);

  const res = await q;
  return { data: (res.data ?? []) as CrmContact[], total: res.count ?? 0 };
}

export async function fetchContactById(id: string): Promise<CrmContact | null> {
  const { data } = await supabase
    .from('crm_contacts')
    .select('*, company:company_id ( id, name, domain, website, niche, country, lifecycle_stage )')
    .eq('id', id)
    .maybeSingle();
  return data as CrmContact | null;
}

export async function createContact(input: Partial<CrmContact>): Promise<CrmContact | null> {
  const fullName = input.full_name || [input.first_name, input.last_name].filter(Boolean).join(' ') || null;
  const { data } = await supabase
    .from('crm_contacts')
    .insert({
      first_name: input.first_name ?? null,
      last_name: input.last_name ?? null,
      full_name: fullName,
      job_title: input.job_title ?? null,
      company_id: input.company_id ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      linkedin_url: input.linkedin_url ?? null,
      fiverr_username: input.fiverr_username ?? null,
      telegram: input.telegram ?? null,
      country: input.country ?? null,
      source: input.source ?? null,
      original_source: input.original_source ?? null,
      lifecycle_stage: input.lifecycle_stage ?? 'prospect',
      historical_revenue: input.historical_revenue ?? 0,
    })
    .select('*')
    .single();
  return data as CrmContact | null;
}

export async function updateContact(id: string, patch: Partial<CrmContact>): Promise<boolean> {
  const updatePatch: Record<string, unknown> = { ...patch };
  if (patch.first_name !== undefined || patch.last_name !== undefined) {
    const existing = await fetchContactById(id);
    const fn = patch.first_name ?? existing?.first_name ?? '';
    const ln = patch.last_name ?? existing?.last_name ?? '';
    updatePatch.full_name = [fn, ln].filter(Boolean).join(' ') || null;
  }
  const { error } = await supabase.from('crm_contacts').update(updatePatch).eq('id', id);
  return !error;
}

export async function archiveContact(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('crm_contacts')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function unarchiveContact(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('crm_contacts')
    .update({ archived_at: null })
    .eq('id', id);
  return !error;
}

// ─── Activities ─────────────────────────────────────────────────

export async function fetchActivities(opts: {
  contactId?: string;
  companyId?: string;
  limit?: number;
}): Promise<CrmActivity[]> {
  let q = supabase
    .from('crm_activities')
    .select('id, type, contact_id, company_id, owner_id, notes, activity_date, created_at, contact:contact_id ( id, full_name ), company:company_id ( id, name )')
    .order('activity_date', { ascending: false });

  if (opts.contactId) q = q.eq('contact_id', opts.contactId);
  if (opts.companyId) q = q.eq('company_id', opts.companyId);
  if (opts.limit) q = q.limit(opts.limit);

  const { data } = await q;
  return (data ?? []) as CrmActivity[];
}

export async function createActivity(input: {
  type: string;
  contact_id?: string | null;
  company_id?: string | null;
  notes?: string;
  activity_date?: string;
}): Promise<CrmActivity | null> {
  const { data } = await supabase
    .from('crm_activities')
    .insert({
      type: input.type,
      contact_id: input.contact_id ?? null,
      company_id: input.company_id ?? null,
      notes: input.notes ?? null,
      activity_date: input.activity_date ?? new Date().toISOString(),
    })
    .select('*')
    .single();
  return data as CrmActivity | null;
}

// ─── Notes ──────────────────────────────────────────────────────

export async function fetchNotes(opts: {
  contactId?: string;
  companyId?: string;
}): Promise<CrmNote[]> {
  let q = supabase
    .from('crm_notes')
    .select('*')
    .order('created_at', { ascending: false });
  if (opts.contactId) q = q.eq('contact_id', opts.contactId);
  if (opts.companyId) q = q.eq('company_id', opts.companyId);
  const { data } = await q;
  return (data ?? []) as CrmNote[];
}

export async function createNote(input: {
  body: string;
  contact_id?: string | null;
  company_id?: string | null;
}): Promise<CrmNote | null> {
  const { data } = await supabase
    .from('crm_notes')
    .insert({
      body: input.body,
      contact_id: input.contact_id ?? null,
      company_id: input.company_id ?? null,
    })
    .select('*')
    .single();
  return data as CrmNote | null;
}

export async function deleteNote(id: string): Promise<boolean> {
  const { error } = await supabase.from('crm_notes').delete().eq('id', id);
  return !error;
}

// ─── Follow-ups ─────────────────────────────────────────────────

export async function fetchFollowUps(opts: {
  contactId?: string;
  companyId?: string;
  status?: string;
}): Promise<CrmFollowUp[]> {
  let q = supabase
    .from('crm_follow_ups')
    .select('id, contact_id, company_id, owner_id, due_date, due_time, note, status, completed_at, created_at, updated_at, contact:contact_id ( id, full_name, email ), company:company_id ( id, name )')
    .order('due_date', { ascending: true });
  if (opts.contactId) q = q.eq('contact_id', opts.contactId);
  if (opts.companyId) q = q.eq('company_id', opts.companyId);
  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status);
  const { data } = await q;
  return (data ?? []) as CrmFollowUp[];
}

export async function fetchFollowUpsByDateRange(fromDate: string, toDate: string): Promise<CrmFollowUp[]> {
  const { data } = await supabase
    .from('crm_follow_ups')
    .select('id, contact_id, company_id, owner_id, due_date, due_time, note, status, completed_at, created_at, updated_at, contact:contact_id ( id, full_name, email ), company:company_id ( id, name )')
    .eq('status', 'open')
    .gte('due_date', fromDate)
    .lte('due_date', toDate)
    .order('due_date', { ascending: true });
  return (data ?? []) as CrmFollowUp[];
}

export async function fetchOverdueFollowUps(): Promise<CrmFollowUp[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('crm_follow_ups')
    .select('id, contact_id, company_id, owner_id, due_date, due_time, note, status, completed_at, created_at, updated_at, contact:contact_id ( id, full_name, email ), company:company_id ( id, name )')
    .eq('status', 'open')
    .lt('due_date', today)
    .order('due_date', { ascending: true });
  return (data ?? []) as CrmFollowUp[];
}

export async function createFollowUp(input: {
  contact_id?: string | null;
  company_id?: string | null;
  due_date: string;
  due_time?: string | null;
  note?: string;
}): Promise<CrmFollowUp | null> {
  const { data } = await supabase
    .from('crm_follow_ups')
    .insert({
      contact_id: input.contact_id ?? null,
      company_id: input.company_id ?? null,
      due_date: input.due_date,
      due_time: input.due_time ?? null,
      note: input.note ?? null,
    })
    .select('*')
    .single();
  return data as CrmFollowUp | null;
}

export async function updateFollowUpStatus(id: string, status: string): Promise<boolean> {
  const patch: Record<string, unknown> = { status };
  if (status === 'completed') patch.completed_at = new Date().toISOString();
  const { error } = await supabase.from('crm_follow_ups').update(patch).eq('id', id);
  return !error;
}

// ─── Tags ───────────────────────────────────────────────────────

export async function fetchTags(): Promise<CrmTag[]> {
  const { data } = await supabase.from('crm_tags').select('*').order('name', { ascending: true });
  return (data ?? []) as CrmTag[];
}

export async function createTag(name: string, color = 'gray'): Promise<CrmTag | null> {
  const { data } = await supabase
    .from('crm_tags')
    .insert({ name, color })
    .select('*')
    .single();
  return data as CrmTag | null;
}

export async function deleteTag(id: string): Promise<boolean> {
  const { error } = await supabase.from('crm_tags').delete().eq('id', id);
  return !error;
}

export async function setCompanyTags(companyId: string, tagIds: string[]): Promise<void> {
  await supabase.from('crm_company_tags').delete().eq('company_id', companyId);
  if (tagIds.length > 0) {
    await supabase
      .from('crm_company_tags')
      .insert(tagIds.map((tag_id) => ({ company_id: companyId, tag_id })));
  }
}

export async function setContactTags(contactId: string, tagIds: string[]): Promise<void> {
  await supabase.from('crm_contact_tags').delete().eq('contact_id', contactId);
  if (tagIds.length > 0) {
    await supabase
      .from('crm_contact_tags')
      .insert(tagIds.map((tag_id) => ({ contact_id: contactId, tag_id })));
  }
}

export async function fetchCompanyTags(companyId: string): Promise<CrmTag[]> {
  const { data } = await supabase
    .from('crm_company_tags')
    .select('tag_id, crm_tags(id, name, color)')
    .eq('company_id', companyId);
  return (data ?? []).map((r: Record<string, unknown>) => r.crm_tags as CrmTag).filter(Boolean);
}

export async function fetchContactTags(contactId: string): Promise<CrmTag[]> {
  const { data } = await supabase
    .from('crm_contact_tags')
    .select('tag_id, crm_tags(id, name, color)')
    .eq('contact_id', contactId);
  return (data ?? []).map((r: Record<string, unknown>) => r.crm_tags as CrmTag).filter(Boolean);
}

// ─── Import History ─────────────────────────────────────────────

export async function fetchImports(): Promise<CrmImport[]> {
  const { data } = await supabase
    .from('crm_imports')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as CrmImport[];
}

export async function createImportRecord(input: {
  file_name: string;
  source?: string;
  rows_total: number;
  rows_created: number;
  rows_updated: number;
  rows_skipped: number;
  rows_error: number;
}): Promise<CrmImport | null> {
  const { data } = await supabase
    .from('crm_imports')
    .insert(input)
    .select('*')
    .single();
  return data as CrmImport | null;
}

// ─── Dashboard Stats ────────────────────────────────────────────

export interface CrmStats {
  totalCompanies: number;
  totalContacts: number;
  prospects: number;
  clients: number;
  formerClients: number;
  followUpsDueToday: number;
  followUpsOverdue: number;
  noActivity90: number;
  noActivity180: number;
}

export async function fetchCrmStats(): Promise<CrmStats> {
  const today = new Date().toISOString().slice(0, 10);
  const d90 = new Date(Date.now() - 90 * 86400000).toISOString();
  const d180 = new Date(Date.now() - 180 * 86400000).toISOString();

  const [companies, contacts, prospects, clients, formerClients, dueToday, overdue, noAct90, noAct180] = await Promise.all([
    supabase.from('crm_companies').select('id', { count: 'exact', head: true }).is('archived_at', null),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null).eq('lifecycle_stage', 'prospect'),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null).eq('lifecycle_stage', 'client'),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null).eq('lifecycle_stage', 'former_client'),
    supabase.from('crm_follow_ups').select('id', { count: 'exact', head: true }).eq('status', 'open').eq('due_date', today),
    supabase.from('crm_follow_ups').select('id', { count: 'exact', head: true }).eq('status', 'open').lt('due_date', today),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null).or('last_contacted_at.is.null,last_contacted_at.lt.' + d90),
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).is('archived_at', null).or('last_contacted_at.is.null,last_contacted_at.lt.' + d180),
  ]);

  return {
    totalCompanies: companies.count ?? 0,
    totalContacts: contacts.count ?? 0,
    prospects: prospects.count ?? 0,
    clients: clients.count ?? 0,
    formerClients: formerClients.count ?? 0,
    followUpsDueToday: dueToday.count ?? 0,
    followUpsOverdue: overdue.count ?? 0,
    noActivity90: noAct90.count ?? 0,
    noActivity180: noAct180.count ?? 0,
  };
}

// ─── Duplicate Detection ────────────────────────────────────────

export interface DuplicateMatch {
  contactId: string;
  field: string;
  value: string;
  existingName: string;
}

export async function checkContactDuplicates(rows: Array<Record<string, string>>): Promise<{
  duplicates: DuplicateMatch[];
  newRows: number;
  potentialDuplicates: number;
}> {
  const emails = rows.map((r) => r.email).filter(Boolean);
  const fiverrUsernames = rows.map((r) => r.fiverr_username).filter(Boolean);
  const linkedinUrls = rows.map((r) => r.linkedin_url).filter(Boolean);

  const matches: DuplicateMatch[] = [];

  if (emails.length > 0) {
    const { data } = await supabase.from('crm_contacts').select('id, email, full_name').in('email', emails);
    if (data) {
      for (const c of data) {
        matches.push({ contactId: c.id, field: 'email', value: c.email, existingName: c.full_name ?? '' });
      }
    }
  }

  if (fiverrUsernames.length > 0) {
    const { data } = await supabase.from('crm_contacts').select('id, fiverr_username, full_name').in('fiverr_username', fiverrUsernames);
    if (data) {
      for (const c of data) {
        matches.push({ contactId: c.id, field: 'fiverr_username', value: c.fiverr_username, existingName: c.full_name ?? '' });
      }
    }
  }

  if (linkedinUrls.length > 0) {
    const { data } = await supabase.from('crm_contacts').select('id, linkedin_url, full_name').in('linkedin_url', linkedinUrls);
    if (data) {
      for (const c of data) {
        matches.push({ contactId: c.id, field: 'linkedin_url', value: c.linkedin_url, existingName: c.full_name ?? '' });
      }
    }
  }

  const duplicateEmails = new Set(matches.filter((m) => m.field === 'email').map((m) => m.value));
  const duplicateFiverr = new Set(matches.filter((m) => m.field === 'fiverr_username').map((m) => m.value));
  const duplicateLinkedin = new Set(matches.filter((m) => m.field === 'linkedin_url').map((m) => m.value));

  const potentialDuplicates = rows.filter((r) =>
    (r.email && duplicateEmails.has(r.email)) ||
    (r.fiverr_username && duplicateFiverr.has(r.fiverr_username)) ||
    (r.linkedin_url && duplicateLinkedin.has(r.linkedin_url))
  ).length;

  return {
    duplicates: matches,
    newRows: rows.length - potentialDuplicates,
    potentialDuplicates,
  };
}

export async function bulkCreateContacts(rows: Array<Record<string, string>>, defaultSource?: string): Promise<{
  created: number;
  errors: number;
}> {
  const toInsert = rows.map((r) => ({
    first_name: r.first_name || null,
    last_name: r.last_name || null,
    full_name: r.full_name || [r.first_name, r.last_name].filter(Boolean).join(' ') || null,
    job_title: r.job_title || null,
    email: r.email || null,
    phone: r.phone || null,
    linkedin_url: r.linkedin_url || null,
    fiverr_username: r.fiverr_username || null,
    telegram: r.telegram || null,
    country: r.country || null,
    source: r.source || defaultSource || 'fiverr',
    original_source: r.original_source || defaultSource || 'fiverr',
    lifecycle_stage: 'prospect',
    historical_revenue: r.historical_revenue ? parseFloat(r.historical_revenue) || 0 : 0,
  }));

  let created = 0;
  let errors = 0;
  const batchSize = 100;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { error } = await supabase.from('crm_contacts').insert(batch);
    if (error) {
      errors += batch.length;
    } else {
      created += batch.length;
    }
  }
  return { created, errors };
}
