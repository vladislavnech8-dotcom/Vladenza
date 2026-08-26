import { useEffect, useState, useCallback } from 'react';
import { supabase, SeoSettings } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LogOut, Save, RefreshCw, Globe, Share2, Search, Code2, ChevronDown, CheckCircle2, AlertCircle, Layers, ExternalLink, FileText, Plus, Trash2, Eye, EyeOff, CreditCard as Edit3, ArrowLeft, Tag, Clock, Image, AlignLeft, List, Hash, Quote, Table2, Lightbulb, X, ChevronUp, ChevronRight, Briefcase, Link2, Loader2, LayoutGrid } from 'lucide-react';
import { fetchAllPlacements, PLACEMENT_NICHE_PRESETS, type Placement, type PlacementServiceType, type PlacementStatus } from '../data/placements';

/* ─── Types ─────────────────────────────────────────────────────── */

type AdminSection = 'seo' | 'blog' | 'cases' | 'orders' | 'placements';
type SeoTab = 'basic' | 'opengraph' | 'advanced';

interface DbPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_color: string;
  read_time: string;
  image_url: string;
  tags: string[];
  content_json: ContentSection[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentSection {
  type: 'intro' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'blockquote' | 'callout' | 'table';
  text?: string;
  items?: string[];
  label?: string;
  headers?: string[];
  rows?: string[][];
}

const BLANK_POST: Omit<DbPost, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  title: '',
  excerpt: '',
  category: '',
  category_color: 'text-[#F97316] bg-orange-50 border-orange-200',
  read_time: '5 min read',
  image_url: '',
  tags: [],
  content_json: [],
  published: false,
};

const SECTION_TYPES: { type: ContentSection['type']; label: string; icon: React.ReactNode }[] = [
  { type: 'intro', label: 'Вступление', icon: <AlignLeft size={13} /> },
  { type: 'h2', label: 'Заголовок H2', icon: <Hash size={13} /> },
  { type: 'h3', label: 'Заголовок H3', icon: <Hash size={13} /> },
  { type: 'p', label: 'Абзац', icon: <AlignLeft size={13} /> },
  { type: 'ul', label: 'Список •', icon: <List size={13} /> },
  { type: 'ol', label: 'Нумер. список', icon: <List size={13} /> },
  { type: 'blockquote', label: 'Цитата', icon: <Quote size={13} /> },
  { type: 'callout', label: 'Callout', icon: <Lightbulb size={13} /> },
  { type: 'table', label: 'Таблица', icon: <Table2 size={13} /> },
];

const CATEGORY_PRESETS = [
  { label: 'Link Building', color: 'text-[#F97316] bg-orange-50 border-orange-200' },
  { label: 'AI & LLM SEO', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'iGaming SEO', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label: 'SEO Strategy', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { label: 'Crowd Marketing', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { label: 'SaaS SEO', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'SEO Audit', color: 'text-gray-600 bg-gray-50 border-gray-200' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function blankSection(type: ContentSection['type']): ContentSection {
  if (type === 'ul' || type === 'ol') return { type, items: [''] };
  if (type === 'callout') return { type, label: 'Заметка', text: '' };
  if (type === 'table') return { type, headers: ['Колонка 1', 'Колонка 2'], rows: [['', '']] };
  return { type, text: '' };
}

/* ─── Section editor ─────────────────────────────────────────────── */

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  section: ContentSection;
  index: number;
  total: number;
  onChange: (s: ContentSection) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}) {
  const ta = (val: string) => onChange({ ...section, text: val });
  const [collapsed, setCollapsed] = useState(false);

  const typeLabel = SECTION_TYPES.find(t => t.type === section.type)?.label ?? section.type;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex-1">{typeLabel}</span>
        <button onClick={() => onMove('up')} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition">
          <ChevronUp size={13} className="text-gray-500" />
        </button>
        <button onClick={() => onMove('down')} disabled={index === total - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition">
          <ChevronDown size={13} className="text-gray-500" />
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-gray-200 transition">
          <ChevronRight size={13} className={`text-gray-500 transition-transform ${collapsed ? '' : 'rotate-90'}`} />
        </button>
        <button onClick={onRemove} className="p-1 rounded hover:bg-red-50 transition">
          <X size={13} className="text-red-400" />
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2">
          {/* Text-based sections */}
          {(section.type === 'intro' || section.type === 'h2' || section.type === 'h3' || section.type === 'p' || section.type === 'blockquote') && (
            <textarea
              value={section.text ?? ''}
              onChange={e => ta(e.target.value)}
              rows={section.type === 'h2' || section.type === 'h3' ? 1 : 3}
              placeholder={section.type === 'h2' ? 'Заголовок раздела...' : section.type === 'h3' ? 'Подзаголовок...' : 'Текст...'}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none placeholder-gray-300"
            />
          )}

          {/* Callout */}
          {section.type === 'callout' && (
            <div className="space-y-2">
              <input
                type="text"
                value={section.label ?? ''}
                onChange={e => onChange({ ...section, label: e.target.value })}
                placeholder="Заголовок callout (напр. «Key insight»)"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
              <textarea
                value={section.text ?? ''}
                onChange={e => ta(e.target.value)}
                rows={2}
                placeholder="Текст callout..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
              />
            </div>
          )}

          {/* List sections */}
          {(section.type === 'ul' || section.type === 'ol') && (
            <div className="space-y-1.5">
              {(section.items ?? []).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-300 w-4 flex-shrink-0 text-right">{section.type === 'ol' ? `${i + 1}.` : '•'}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const items = [...(section.items ?? [])];
                      items[i] = e.target.value;
                      onChange({ ...section, items });
                    }}
                    placeholder={`Пункт ${i + 1}...`}
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                  <button
                    onClick={() => {
                      const items = (section.items ?? []).filter((_, idx) => idx !== i);
                      onChange({ ...section, items });
                    }}
                    className="p-1 hover:text-red-500 text-gray-300 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onChange({ ...section, items: [...(section.items ?? []), ''] })}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 mt-1 transition"
              >
                <Plus size={11} /> Добавить пункт
              </button>
            </div>
          )}

          {/* Table */}
          {section.type === 'table' && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Заголовки колонок</div>
              <div className="flex gap-2 flex-wrap">
                {(section.headers ?? []).map((h, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <input
                      type="text"
                      value={h}
                      onChange={e => {
                        const headers = [...(section.headers ?? [])];
                        headers[i] = e.target.value;
                        onChange({ ...section, headers });
                      }}
                      className="text-xs border border-gray-200 rounded px-2 py-1 w-28 focus:outline-none focus:ring-1 focus:ring-gray-900/10 font-semibold"
                    />
                    <button
                      onClick={() => {
                        const headers = (section.headers ?? []).filter((_, idx) => idx !== i);
                        const rows = (section.rows ?? []).map(r => r.filter((_, idx) => idx !== i));
                        onChange({ ...section, headers, rows });
                      }}
                      className="text-gray-300 hover:text-red-400 transition"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const headers = [...(section.headers ?? []), 'Колонка'];
                    const rows = (section.rows ?? []).map(r => [...r, '']);
                    onChange({ ...section, headers, rows });
                  }}
                  className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition"
                >
                  <Plus size={10} /> колонку
                </button>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1 mt-3">Строки</div>
              {(section.rows ?? []).map((row, ri) => (
                <div key={ri} className="flex gap-2 items-center">
                  {row.map((cell, ci) => (
                    <input
                      key={ci}
                      type="text"
                      value={cell}
                      onChange={e => {
                        const rows = (section.rows ?? []).map((r, rIdx) =>
                          rIdx === ri ? r.map((c, cIdx) => cIdx === ci ? e.target.value : c) : r
                        );
                        onChange({ ...section, rows });
                      }}
                      className="text-xs border border-gray-200 rounded px-2 py-1 w-28 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
                    />
                  ))}
                  <button
                    onClick={() => onChange({ ...section, rows: (section.rows ?? []).filter((_, idx) => idx !== ri) })}
                    className="text-gray-300 hover:text-red-400 transition flex-shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onChange({ ...section, rows: [...(section.rows ?? []), (section.headers ?? []).map(() => '')] })}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition mt-1"
              >
                <Plus size={11} /> Добавить строку
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Blog editor form ───────────────────────────────────────────── */

function BlogEditor({
  initial,
  onSave,
  onCancel,
  userId,
}: {
  initial: Partial<DbPost> | null;
  onSave: () => void;
  onCancel: () => void;
  userId: string;
}) {
  const isNew = !initial?.id;
  const [form, setForm] = useState<Omit<DbPost, 'id' | 'created_at' | 'updated_at'>>({
    ...BLANK_POST,
    ...(initial ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [slugManual, setSlugManual] = useState(!!initial?.slug);

  const upd = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (val: string) => {
    upd('title', val);
    if (!slugManual) upd('slug', slugify(val));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) upd('tags', [...form.tags, t]);
    setTagInput('');
  };

  const addSection = (type: ContentSection['type']) => {
    upd('content_json', [...form.content_json, blankSection(type)]);
    setShowAddSection(false);
  };

  const updateSection = useCallback((i: number, s: ContentSection) => {
    setForm(prev => {
      const arr = [...prev.content_json];
      arr[i] = s;
      return { ...prev, content_json: arr };
    });
  }, []);

  const removeSection = useCallback((i: number) => {
    setForm(prev => ({ ...prev, content_json: prev.content_json.filter((_, idx) => idx !== i) }));
  }, []);

  const moveSection = useCallback((i: number, dir: 'up' | 'down') => {
    setForm(prev => {
      const arr = [...prev.content_json];
      const ni = dir === 'up' ? i - 1 : i + 1;
      if (ni < 0 || ni >= arr.length) return prev;
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return { ...prev, content_json: arr };
    });
  }, []);

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.slug) {
      showToast('error', 'Заголовок и slug обязательны');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      published: publish !== undefined ? publish : form.published,
      updated_at: new Date().toISOString(),
      created_by: userId,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    } else {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', initial!.id!));
    }

    setSaving(false);
    if (error) {
      showToast('error', error.message || 'Ошибка при сохранении');
    } else {
      showToast('success', 'Сохранено!');
      setTimeout(onSave, 800);
    }
  };

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Editor toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={15} /> Назад
        </button>
        <div className="flex-1" />
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
        >
          <Save size={14} />
          {form.published ? 'Снять с публикации' : 'Сохранить черновик'}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Eye size={14} />}
          Опубликовать
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: main fields + content */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Заголовок статьи</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Введите заголовок..."
              className="w-full text-xl font-bold border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-200"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">URL Slug</label>
            <div className="flex gap-2 items-center border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gray-900/10 bg-white">
              <span className="text-sm text-gray-400 flex-shrink-0">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={e => { setSlugManual(true); upd('slug', e.target.value); }}
                placeholder="my-article-slug"
                className="flex-1 text-sm focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Краткое описание (excerpt)</label>
            <textarea
              value={form.excerpt}
              onChange={e => upd('excerpt', e.target.value)}
              rows={2}
              placeholder="Краткое описание статьи для листинга и соц. сетей..."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none placeholder-gray-300"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Image size={11} /> Hero изображение (URL)</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => upd('image_url', e.target.value)}
              placeholder="https://images.pexels.com/..."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-300"
            />
            {form.image_url && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-gray-100">
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Content builder */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Содержимое статьи</label>
            <div className="flex flex-col gap-2">
              {form.content_json.map((section, i) => (
                <SectionEditor
                  key={i}
                  section={section}
                  index={i}
                  total={form.content_json.length}
                  onChange={s => updateSection(i, s)}
                  onRemove={() => removeSection(i)}
                  onMove={dir => moveSection(i, dir)}
                />
              ))}

              {/* Add section */}
              <div className="relative">
                <button
                  onClick={() => setShowAddSection(!showAddSection)}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-600 rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition"
                >
                  <Plus size={15} /> Добавить блок
                </button>
                {showAddSection && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 grid grid-cols-3 gap-1">
                    {SECTION_TYPES.map(st => (
                      <button
                        key={st.type}
                        onClick={() => addSection(st.type)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition text-left"
                      >
                        {st.icon} {st.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: meta sidebar */}
        <div className="flex flex-col gap-4">
          {/* Publish status */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Статус</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${form.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-sm font-medium text-gray-800">{form.published ? 'Опубликовано' : 'Черновик'}</span>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
              <FileText size={10} /> Категория
            </div>
            <div className="flex flex-col gap-1.5">
              {CATEGORY_PRESETS.map(c => (
                <button
                  key={c.label}
                  onClick={() => { upd('category', c.label); upd('category_color', c.color); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition w-full ${
                    form.category === c.label ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${c.color}`}>{c.label}</span>
                </button>
              ))}
              <input
                type="text"
                value={form.category}
                onChange={e => upd('category', e.target.value)}
                placeholder="Или введите вручную..."
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
              />
            </div>
          </div>

          {/* Read time */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
              <Clock size={10} /> Время чтения
            </div>
            <input
              type="text"
              value={form.read_time}
              onChange={e => upd('read_time', e.target.value)}
              placeholder="5 min read"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
            />
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
              <Tag size={10} /> Теги
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tag}
                  <button onClick={() => upd('tags', form.tags.filter(t => t !== tag))} className="hover:text-red-500 transition">
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                placeholder="Тег + Enter"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
              />
              <button onClick={addTag} className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition">
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${
          toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Blog list ──────────────────────────────────────────────────── */

function BlogList({ onEdit, onNew }: { onEdit: (p: DbPost) => void; onNew: () => void }) {
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as DbPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить статью? Это действие необратимо.')) return;
    setDeleting(id);
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const togglePublish = async (post: DbPost) => {
    const val = !post.published;
    await supabase.from('blog_posts').update({ published: val, updated_at: new Date().toISOString() }).eq('id', post.id);
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: val } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Статьи блога</h2>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} статей в базе</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          <Plus size={14} /> Новая статья
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <FileText size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Статей пока нет</p>
          <p className="text-gray-400 text-sm mt-1">Нажмите «Новая статья», чтобы начать</p>
          <button onClick={onNew} className="mt-4 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition inline-flex items-center gap-2">
            <Plus size={14} /> Создать первую статью
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition"
            >
              {post.image_url && (
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${post.category_color}`}>{post.category || 'Без категории'}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${post.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="text-[10px] text-gray-400">{post.published ? 'Опубликовано' : 'Черновик'}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">{post.title || 'Без заголовка'}</div>
                <div className="text-xs text-gray-400 font-mono truncate">/blog/{post.slug}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  title={post.published ? 'Снять с публикации' : 'Опубликовать'}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                >
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Case Studies types & helpers ──────────────────────────────── */

interface CaseStat { label: string; value: string; }
interface PlacementRow { domain: string; dr: string; traffic: string; type: string; quality: string; notes: string; }

interface DbCase {
  id: string;
  slug: string;
  published: boolean;
  title: string;
  niche: string;
  service: string;
  period: string;
  metric: string;
  metric_sub: string;
  color: string;
  image_url: string;
  challenge: string;
  solution: string;
  result: string;
  tags: string[];
  bars: number[];
  stats: CaseStat[];
  screenshots: string[];
  placement_report: PlacementRow[];
  body: ContentSection[];
  created_at: string;
  updated_at: string;
}

const BLANK_CASE: Omit<DbCase, 'id' | 'created_at' | 'updated_at'> = {
  slug: '', published: false, title: '', niche: '', service: '', period: '',
  metric: '', metric_sub: '', color: '#F97316', image_url: '',
  challenge: '', solution: '', result: '',
  tags: [], bars: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  stats: [{ label: '', value: '' }],
  screenshots: [], placement_report: [], body: [],
};

const NICHE_PRESETS = ['iGaming', 'SaaS', 'Crypto', 'Health', 'Automotive', 'FinTech', 'Dating', 'Software', 'Local SEO', 'E-commerce'];
const COLOR_PRESETS = [
  { label: 'Orange', hex: '#F97316' }, { label: 'Green', hex: '#16a34a' },
  { label: 'Blue', hex: '#2563eb' }, { label: 'Sky', hex: '#0ea5e9' },
  { label: 'Red', hex: '#dc2626' }, { label: 'Amber', hex: '#d97706' },
  { label: 'Rose', hex: '#e11d48' }, { label: 'Teal', hex: '#059669' },
];

function blankPlacement(): PlacementRow {
  return { domain: '', dr: '', traffic: '', type: '', quality: '', notes: '' };
}

/* ─── CaseEditor ─────────────────────────────────────────────────── */

function CaseEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<DbCase> | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isNew = !initial?.id;
  const [form, setForm] = useState<Omit<DbCase, 'id' | 'created_at' | 'updated_at'>>({
    ...BLANK_CASE, ...(initial ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [showAddSection, setShowAddSection] = useState(false);
  const [screenshotInput, setScreenshotInput] = useState('');

  const upd = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (val: string) => {
    upd('title', val);
    if (!slugManual) upd('slug', slugify(val));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) upd('tags', [...form.tags, t]);
    setTagInput('');
  };

  const addSection = (type: ContentSection['type']) => {
    upd('body', [...form.body, blankSection(type)]);
    setShowAddSection(false);
  };
  const updateSection = useCallback((i: number, s: ContentSection) => {
    setForm(prev => { const arr = [...prev.body]; arr[i] = s; return { ...prev, body: arr }; });
  }, []);
  const removeSection = useCallback((i: number) => {
    setForm(prev => ({ ...prev, body: prev.body.filter((_, idx) => idx !== i) }));
  }, []);
  const moveSection = useCallback((i: number, dir: 'up' | 'down') => {
    setForm(prev => {
      const arr = [...prev.body];
      const ni = dir === 'up' ? i - 1 : i + 1;
      if (ni < 0 || ni >= arr.length) return prev;
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return { ...prev, body: arr };
    });
  }, []);

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.slug) { showToast('error', 'Заголовок и slug обязательны'); return; }
    setSaving(true);
    const payload = { ...form, published: publish !== undefined ? publish : form.published };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('case_studies').insert(payload));
    } else {
      ({ error } = await supabase.from('case_studies').update(payload).eq('id', initial!.id!));
    }
    setSaving(false);
    if (error) showToast('error', error.message || 'Ошибка при сохранении');
    else { showToast('success', 'Сохранено!'); setTimeout(onSave, 800); }
  };

  const barsStr = form.bars.join(', ');

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={15} /> Назад
        </button>
        <div className="flex-1" />
        <button onClick={() => handleSave(false)} disabled={saving}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50">
          <Save size={14} /> {form.published ? 'Снять с публикации' : 'Сохранить черновик'}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
          {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Eye size={14} />}
          Опубликовать
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Basic info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Основная информация</div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Заголовок кейса *</label>
              <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)}
                placeholder="Например: Crypto Exchange Moves from Page 2 to Page 1"
                className="w-full text-base font-semibold border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-300" />
            </div>

            <div className="flex gap-2 items-center border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gray-900/10 bg-white">
              <span className="text-sm text-gray-400 flex-shrink-0">/case-studies/</span>
              <input type="text" value={form.slug} onChange={e => { setSlugManual(true); upd('slug', e.target.value); }}
                placeholder="my-case-slug" className="flex-1 text-sm focus:outline-none font-mono" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Ниша</label>
                <input type="text" value={form.niche} onChange={e => upd('niche', e.target.value)}
                  placeholder="iGaming, SaaS..." list="niche-list"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                <datalist id="niche-list">{NICHE_PRESETS.map(n => <option key={n} value={n} />)}</datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Услуга</label>
                <input type="text" value={form.service} onChange={e => upd('service', e.target.value)}
                  placeholder="Guest Posting + Niche Edits"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Период</label>
                <input type="text" value={form.period} onChange={e => upd('period', e.target.value)}
                  placeholder="9 months"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Метрика (герой)</label>
                <input type="text" value={form.metric} onChange={e => upd('metric', e.target.value)}
                  placeholder="+300"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Подпись метрики</label>
                <input type="text" value={form.metric_sub} onChange={e => upd('metric_sub', e.target.value)}
                  placeholder="Referring Domains"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Image size={11} /> Hero изображение (URL)</label>
              <input type="url" value={form.image_url} onChange={e => upd('image_url', e.target.value)}
                placeholder="https://images.pexels.com/..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-300" />
              {form.image_url && (
                <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-100">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>

          {/* Challenge / Solution / Result */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Challenge / Solution / Result</div>
            {(['challenge', 'solution', 'result'] as const).map(field => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block capitalize">{field}</label>
                <textarea value={form[field]} onChange={e => upd(field, e.target.value)} rows={3}
                  placeholder={field === 'challenge' ? 'Опиши проблему клиента...' : field === 'solution' ? 'Что мы сделали...' : 'Что получилось...'}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none placeholder-gray-300" />
              </div>
            ))}
          </div>

          {/* Key stats */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Ключевые метрики (4 штуки)</div>
              <button onClick={() => upd('stats', [...form.stats, { label: '', value: '' }])}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition">
                <Plus size={11} /> Добавить
              </button>
            </div>
            {form.stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={s.value} onChange={e => { const arr = [...form.stats]; arr[i] = { ...arr[i], value: e.target.value }; upd('stats', arr); }}
                  placeholder="Значение (напр. +300)" className="w-28 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10 font-bold" />
                <input type="text" value={s.label} onChange={e => { const arr = [...form.stats]; arr[i] = { ...arr[i], label: e.target.value }; upd('stats', arr); }}
                  placeholder="Метка (напр. Referring domains)" className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10" />
                <button onClick={() => upd('stats', form.stats.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition flex-shrink-0">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Sparkline bars */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">График роста (9 точек, числа через запятую)</div>
            <input type="text" defaultValue={barsStr}
              onBlur={e => {
                const parsed = e.target.value.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
                if (parsed.length > 0) upd('bars', parsed);
              }}
              placeholder="1, 2, 4, 6, 8, 10, 13, 16, 20"
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 font-mono" />
            <div className="mt-3 flex items-end gap-1 h-10">
              {form.bars.map((b, i) => {
                const max = Math.max(...form.bars, 1);
                return <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${(b / max) * 100}%`, backgroundColor: form.color }} />;
              })}
            </div>
          </div>

          {/* Screenshots */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Скриншоты результатов</div>
            <div className="flex gap-2">
              <input type="url" value={screenshotInput} onChange={e => setScreenshotInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { if (screenshotInput.trim()) upd('screenshots', [...form.screenshots, screenshotInput.trim()]); setScreenshotInput(''); } }}
                placeholder="Вставь URL изображения + Enter"
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder-gray-300" />
              <button onClick={() => { if (screenshotInput.trim()) { upd('screenshots', [...form.screenshots, screenshotInput.trim()]); setScreenshotInput(''); } }}
                className="px-3 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition text-sm"><Plus size={14} /></button>
            </div>
            {form.screenshots.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {form.screenshots.map((src, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100 h-28">
                    <img src={src} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = '0.3')} />
                    <button onClick={() => upd('screenshots', form.screenshots.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placement report */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Placement Report (таблица)</div>
              <button onClick={() => upd('placement_report', [...form.placement_report, blankPlacement()])}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition"><Plus size={11} /> Строка</button>
            </div>
            {form.placement_report.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                <Link2 size={20} className="text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Нажми «Строка» чтобы добавить плейсмент</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Domain', 'DR', 'Traffic', 'Type', 'Quality', 'Notes', ''].map(h => (
                        <th key={h} className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.placement_report.map((row, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        {(['domain', 'dr', 'traffic', 'type', 'quality', 'notes'] as const).map(field => (
                          <td key={field} className="px-1 py-1">
                            <input type="text" value={row[field]}
                              onChange={e => { const arr = [...form.placement_report]; arr[i] = { ...arr[i], [field]: e.target.value }; upd('placement_report', arr); }}
                              placeholder={field}
                              className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-900/10 min-w-[60px]" />
                          </td>
                        ))}
                        <td className="px-1 py-1">
                          <button onClick={() => upd('placement_report', form.placement_report.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition"><X size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Body builder */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Полный текст кейса</div>
            <div className="flex flex-col gap-2">
              {form.body.map((section, i) => (
                <SectionEditor key={i} section={section} index={i} total={form.body.length}
                  onChange={s => updateSection(i, s)} onRemove={() => removeSection(i)} onMove={dir => moveSection(i, dir)} />
              ))}
              <div className="relative">
                <button onClick={() => setShowAddSection(!showAddSection)}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-600 rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition">
                  <Plus size={15} /> Добавить блок
                </button>
                {showAddSection && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 grid grid-cols-3 gap-1">
                    {SECTION_TYPES.map(st => (
                      <button key={st.type} onClick={() => addSection(st.type)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition text-left">
                        {st.icon} {st.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Статус</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${form.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-sm font-medium text-gray-800">{form.published ? 'Опубликован' : 'Черновик'}</span>
            </div>
          </div>

          {/* Accent color */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Акцентный цвет</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {COLOR_PRESETS.map(c => (
                <button key={c.hex} onClick={() => upd('color', c.hex)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c.hex ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input type="color" value={form.color} onChange={e => upd('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={form.color} onChange={e => upd('color', e.target.value)}
                className="flex-1 text-xs font-mono border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10" />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5"><Tag size={10} /> Теги</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tag}
                  <button onClick={() => upd('tags', form.tags.filter(t => t !== tag))} className="hover:text-red-500 transition"><X size={9} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                placeholder="Тег + Enter"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10" />
              <button onClick={addTag} className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition"><Plus size={12} /></button>
            </div>
          </div>

          {/* Preview link */}
          {!isNew && form.slug && (
            <a href={`/case-studies/${form.slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition">
              <ExternalLink size={13} /> Просмотр на сайте
            </a>
          )}
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

/* ─── CaseList ───────────────────────────────────────────────────── */

function CaseList({ onEdit, onNew }: { onEdit: (c: DbCase) => void; onNew: () => void }) {
  const [cases, setCases] = useState<DbCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
    setCases((data as DbCase[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить кейс? Это действие необратимо.')) return;
    setDeleting(id);
    await supabase.from('case_studies').delete().eq('id', id);
    setCases(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  const togglePublish = async (c: DbCase) => {
    const val = !c.published;
    await supabase.from('case_studies').update({ published: val }).eq('id', c.id);
    setCases(prev => prev.map(x => x.id === c.id ? { ...x, published: val } : x));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Кейсы</h2>
          <p className="text-sm text-gray-500 mt-0.5">{cases.length} в базе данных</p>
        </div>
        <button onClick={onNew} className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition">
          <Plus size={14} /> Новый кейс
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Кейсов пока нет</p>
          <p className="text-gray-400 text-sm mt-1">Нажмите «Новый кейс», чтобы начать</p>
          <button onClick={onNew} className="mt-4 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition inline-flex items-center gap-2">
            <Plus size={14} /> Создать первый кейс
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cases.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
              <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              {c.image_url && (
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border border-gray-200 text-gray-500">{c.niche || 'Без ниши'}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="text-[10px] text-gray-400">{c.published ? 'Опубликован' : 'Черновик'}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">{c.title || 'Без заголовка'}</div>
                <div className="text-xs text-gray-400 font-mono truncate">/case-studies/{c.slug}</div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <div className="text-lg font-black" style={{ color: c.color }}>{c.metric}</div>
                <div className="text-[10px] text-gray-400">{c.metric_sub}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(c)} title={c.published ? 'Снять с публикации' : 'Опубликовать'}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                  {c.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => onEdit(c)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SEO Settings panel (unchanged logic) ───────────────────────── */

const SEO_TABS: { id: SeoTab; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: 'Основные', icon: <Search size={15} /> },
  { id: 'opengraph', label: 'Open Graph', icon: <Share2 size={15} /> },
  { id: 'advanced', label: 'Дополнительно', icon: <Code2 size={15} /> },
];

const SEO_PAGES: { value: string; label: string }[] = [
  { value: 'home', label: 'Главная (/)' },
  { value: 'services/seo-audit', label: 'SEO Аудит' },
  { value: 'services/guest-posting', label: 'Guest Posting' },
  { value: 'services/niche-edits', label: 'Niche Edits' },
  { value: 'services/crowd-links', label: 'Crowd Links' },
  { value: 'services/ai-llm', label: 'AI/LLM SEO' },
  { value: 'services/local-seo-links', label: 'Local SEO Links' },
  { value: 'services/link-packages/igaming', label: 'Пакеты — iGaming' },
  { value: 'services/link-packages/saas', label: 'Пакеты — SaaS' },
  { value: 'services/link-packages/auto', label: 'Пакеты — Auto' },
  { value: 'services/link-packages/health', label: 'Пакеты — Health' },
  { value: 'services/link-packages/proxy', label: 'Пакеты — Proxy' },
  { value: 'services/link-packages/renovations', label: 'Пакеты — Renovations' },
  { value: 'case-studies', label: 'Кейсы' },
  { value: 'blog', label: 'Блог' },
  { value: 'services/white-label', label: 'White Label' },
  { value: 'reviews', label: 'Отзывы' },
  { value: 'sitemap', label: 'Карта сайта' },
];

function SeoPanel({ userId }: { userId: string }) {
  const [selectedPage, setSelectedPage] = useState('home');
  const [settings, setSettings] = useState<Partial<SeoSettings>>({
    page: 'home', title: '', description: '', og_title: '', og_description: '',
    og_image: '', robots: 'index, follow', canonical: '', keywords: '', schema_json: '',
  });
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SeoTab>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { fetchSettings(selectedPage); }, [selectedPage]);

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    setSettingsId(null);
    setSettings({ page, title: '', description: '', og_title: '', og_description: '', og_image: '', robots: 'index, follow', canonical: '', keywords: '', schema_json: '' });
  };

  const fetchSettings = async (page: string) => {
    setLoading(true);
    const { data } = await supabase.from('seo_settings').select('*').eq('page', page).maybeSingle();
    if (data) { setSettings(data); setSettingsId(data.id); }
    else { setSettings({ page, title: '', description: '', og_title: '', og_description: '', og_image: '', robots: 'index, follow', canonical: '', keywords: '', schema_json: '' }); setSettingsId(null); }
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...settings, page: selectedPage, updated_by: userId, updated_at: new Date().toISOString() };
    let error;
    if (settingsId) {
      ({ error } = await supabase.from('seo_settings').update(payload).eq('id', settingsId));
    } else {
      const res = await supabase.from('seo_settings').insert({ ...payload }).select().maybeSingle();
      error = res.error;
      if (res.data) setSettingsId(res.data.id);
    }
    setSaving(false);
    if (error) showToast('error', 'Ошибка при сохранении');
    else showToast('success', 'Настройки сохранены');
  };

  const update = (field: keyof SeoSettings, value: string) => setSettings(prev => ({ ...prev, [field]: value }));
  const titleLen = settings.title?.length ?? 0;
  const descLen = settings.description?.length ?? 0;
  const titleColor = titleLen === 0 ? 'text-gray-400' : titleLen <= 60 ? 'text-emerald-600' : 'text-amber-500';
  const descColor = descLen === 0 ? 'text-gray-400' : descLen <= 160 ? 'text-emerald-600' : 'text-amber-500';

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">SEO настройки</h1>
          <p className="text-sm text-gray-500 mt-0.5">Управление мета-тегами и разметкой страниц</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSettings} disabled={loading} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Обновить
          </button>
          <button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Сохранить
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-3">
        <Globe size={15} className="text-gray-400" />
        <span className="text-sm text-gray-600 font-medium">Страница:</span>
        <div className="relative">
          <select value={selectedPage} onChange={e => handlePageChange(e.target.value)} className="appearance-none text-sm bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900">
            {SEO_PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {!settingsId && !loading && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">Не заполнено</span>
        )}
        {settingsId && !loading && (
          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">Заполнено</span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {SEO_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12"><span className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>
          ) : (
            <>
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <Field label="Title" hint="Отображается во вкладке браузера и поисковой выдаче" counter={<span className={`text-xs font-medium ${titleColor}`}>{titleLen}/60</span>}>
                    <input type="text" value={settings.title ?? ''} onChange={e => update('title', e.target.value)} placeholder="Заголовок страницы..." className="input" />
                  </Field>
                  <Field label="Meta Description" hint="Краткое описание (до 160 символов)" counter={<span className={`text-xs font-medium ${descColor}`}>{descLen}/160</span>}>
                    <textarea value={settings.description ?? ''} onChange={e => update('description', e.target.value)} rows={3} placeholder="Описание страницы..." className="input resize-none" />
                  </Field>
                  <Field label="Keywords" hint="Ключевые слова через запятую (опционально)">
                    <input type="text" value={settings.keywords ?? ''} onChange={e => update('keywords', e.target.value)} placeholder="seo, link building..." className="input" />
                  </Field>
                  <Field label="Robots" hint="Директива для поисковых роботов">
                    <div className="relative">
                      <select value={settings.robots ?? 'index, follow'} onChange={e => update('robots', e.target.value)} className="input appearance-none pr-9">
                        <option value="index, follow">index, follow</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="index, nofollow">index, nofollow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Canonical URL" hint="Каноническая ссылка">
                    <input type="url" value={settings.canonical ?? ''} onChange={e => update('canonical', e.target.value)} placeholder="https://example.com/" className="input" />
                  </Field>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Превью в Google</p>
                    <p className="text-[#1a0dab] text-base leading-snug font-normal truncate">{settings.title || 'Заголовок страницы'}</p>
                    <p className="text-[#006621] text-xs">seoagency.com{selectedPage !== 'home' ? `/${selectedPage}` : ''}</p>
                    <p className="text-[#545454] text-sm leading-relaxed line-clamp-2">{settings.description || 'Описание страницы появится здесь...'}</p>
                  </div>
                </div>
              )}
              {activeTab === 'opengraph' && (
                <div className="space-y-5">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm text-blue-700">Open Graph теги управляют тем, как страница выглядит при шеринге в соц. сетях.</div>
                  <Field label="OG Title"><input type="text" value={settings.og_title ?? ''} onChange={e => update('og_title', e.target.value)} placeholder="Заголовок для соц. сетей..." className="input" /></Field>
                  <Field label="OG Description"><textarea value={settings.og_description ?? ''} onChange={e => update('og_description', e.target.value)} rows={3} placeholder="Описание для соц. сетей..." className="input resize-none" /></Field>
                  <Field label="OG Image URL" hint="Рекомендуется 1200x630px">
                    <input type="url" value={settings.og_image ?? ''} onChange={e => update('og_image', e.target.value)} placeholder="https://example.com/og-image.jpg" className="input" />
                  </Field>
                  {settings.og_image && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 max-w-sm">
                      <img src={settings.og_image} alt="OG preview" className="w-full h-auto object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                      <div className="p-3 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-800 truncate">{settings.og_title || settings.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{settings.og_description || settings.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'advanced' && (
                <div className="space-y-5">
                  <Field label="JSON-LD Schema" hint="Структурированная разметка для поисковиков (schema.org). Вставь валидный JSON.">
                    <textarea value={settings.schema_json ?? ''} onChange={e => update('schema_json', e.target.value)} rows={12}
                      placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebSite"\n}'}
                      className="input resize-y font-mono text-xs" spellCheck={false} />
                  </Field>
                  {settings.schema_json && (() => {
                    try { JSON.parse(settings.schema_json); return <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5"><CheckCircle2 size={15} /> JSON валиден</div>; }
                    catch { return <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5"><AlertCircle size={15} /> Невалидный JSON</div>; }
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </>
  );
}

/* ─── Root AdminPage ─────────────────────────────────────────────── */

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<AdminSection>('seo');
  const [editingPost, setEditingPost] = useState<DbPost | null | 'new'>(null);
  const [editingCase, setEditingCase] = useState<DbCase | null | 'new'>(null);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null | 'new'>(null);

  const NAV: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'seo',    label: 'SEO настройки', icon: <Search size={15} /> },
    { id: 'blog',   label: 'Блог',          icon: <FileText size={15} /> },
    { id: 'cases',  label: 'Кейсы',         icon: <Briefcase size={15} /> },
    { id: 'orders', label: 'Заказы',         icon: <Link2 size={15} /> },
    { id: 'placements', label: 'Placements',  icon: <LayoutGrid size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <Layers size={14} className="text-white" />
              </div>
              <span className="font-semibold text-white text-sm">Admin Panel</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <nav className="flex items-center gap-0.5">
              {NAV.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setSection(n.id); setEditingPost(null); setEditingCase(null); setEditingPlacement(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${section === n.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {n.icon} {n.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
              <Globe size={13} /> Сайт <ExternalLink size={11} />
            </a>
            <div className="w-px h-4 bg-gray-700" />
            <span className="text-xs text-gray-500 hidden sm:block">{user?.email}</span>
            <button onClick={signOut} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10">
              <LogOut size={13} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {section === 'seo' && <SeoPanel userId={user?.id ?? ''} />}

        {section === 'blog' && (
          <>
            {editingPost === null && (
              <BlogList
                onEdit={p => setEditingPost(p)}
                onNew={() => setEditingPost('new')}
              />
            )}
            {editingPost !== null && (
              <BlogEditor
                initial={editingPost === 'new' ? null : editingPost}
                userId={user?.id ?? ''}
                onSave={() => setEditingPost(null)}
                onCancel={() => setEditingPost(null)}
              />
            )}
          </>
        )}

        {section === 'cases' && (
          <>
            {editingCase === null && (
              <CaseList
                onEdit={c => setEditingCase(c)}
                onNew={() => setEditingCase('new')}
              />
            )}
            {editingCase !== null && (
              <CaseEditor
                initial={editingCase === 'new' ? null : editingCase}
                onSave={() => setEditingCase(null)}
                onCancel={() => setEditingCase(null)}
              />
            )}
          </>
        )}
        {section === 'orders' && <ClientOrdersPanel />}

        {section === 'placements' && (
          <>
            {editingPlacement === null && (
              <PlacementsList
                onEdit={p => setEditingPlacement(p)}
                onNew={() => setEditingPlacement('new')}
              />
            )}
            {editingPlacement !== null && (
              <PlacementEditor
                initial={editingPlacement === 'new' ? null : editingPlacement}
                onSave={() => setEditingPlacement(null)}
                onCancel={() => setEditingPlacement(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ─── Client Orders Panel ─────────────────────────────────────────── */

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
  user_id: string;
}

const ORDER_STATUSES = [
  { value: 'pending',     label: 'Pending',     cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'in_progress', label: 'In Progress', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'completed',   label: 'Completed',   cls: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'cancelled',   label: 'Cancelled',   cls: 'text-gray-500 bg-gray-100 border-gray-200' },
];

function ClientOrdersPanel() {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  async function setStatus(id: string, status: string) {
    setUpdatingId(id);
    await supabase.from('client_orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdatingId(null);
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const counts = {
    all:         orders.length,
    pending:     orders.filter(o => o.status === 'pending').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed:   orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Client Orders</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage and track all incoming orders</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[
          { value: 'all',         label: `All (${counts.all})` },
          { value: 'pending',     label: `Pending (${counts.pending})` },
          { value: 'in_progress', label: `In Progress (${counts.in_progress})` },
          { value: 'completed',   label: `Completed (${counts.completed})` },
        ].map(f => (
          <button key={f.value} onClick={() => setFilterStatus(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <p className="text-gray-500 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(order => {
            const statusMeta = ORDER_STATUSES.find(s => s.value === order.status) ?? ORDER_STATUSES[0];
            const expanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                  onClick={() => setExpandedId(id => id === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{order.service_type}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusMeta.cls}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5 truncate max-w-sm">{order.target_url || '—'}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 text-right">
                    <span className="text-gray-400 text-xs hidden md:block">
                      {new Date(order.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <ChevronDown size={15} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/40">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-4">
                      <OrderField label="Target URL"   value={order.target_url || '—'} wide />
                      <OrderField label="Anchor Text"  value={order.anchor_text || '—'} />
                      <OrderField label="Quantity"     value={String(order.quantity)} />
                      <OrderField label="Budget"       value={order.budget || '—'} />
                    </div>
                    {order.notes && (
                      <div className="mb-4 p-3 bg-white border border-gray-200 rounded-xl">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{order.notes}</p>
                      </div>
                    )}

                    {/* Status changer */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 font-medium mr-1">Set status:</span>
                      {ORDER_STATUSES.map(s => (
                        <button key={s.value}
                          disabled={order.status === s.value || updatingId === order.id}
                          onClick={() => setStatus(order.id, s.value)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40 ${
                            order.status === s.value
                              ? `${s.cls} cursor-default`
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                          }`}>
                          {updatingId === order.id && order.status !== s.value ? (
                            <Loader2 size={11} className="animate-spin inline" />
                          ) : s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 font-medium break-all">{value}</p>
    </div>
  );
}

function Field({ label, hint, counter, children }: {
  label: string; hint?: string; counter?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        {counter}
      </div>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

/* ─── Placements Panel ─────────────────────────────────────────────── */

const SERVICE_TYPE_OPTIONS: { value: PlacementServiceType; label: string }[] = [
  { value: 'niche_edit', label: 'Niche Edit' },
  { value: 'guest_post', label: 'Guest Post' },
  { value: 'crowd_link', label: 'Crowd Link' },
];

function PlacementsList({ onEdit, onNew }: { onEdit: (p: Placement) => void; onNew: () => void }) {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [nicheFilter, setNicheFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchAllPlacements();
    setPlacements(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = placements.filter(p => {
    if (serviceFilter !== 'all' && p.service_type !== serviceFilter) return false;
    if (nicheFilter !== 'all' && p.niche !== nicheFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.domain.toLowerCase().includes(q) && !p.placement_url.toLowerCase().includes(q) && !(p.title ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'dr': return b.dr - a.dr;
      case 'traffic': return b.traffic - a.traffic;
      case 'sort_order': return a.sort_order - b.sort_order;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const niches = Array.from(new Set(placements.map(p => p.niche).filter(Boolean))).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Placements</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage link placement examples across all services</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={onNew} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-3 py-2 rounded-lg transition">
            <Plus size={13} /> Add Placement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search domain, title, URL..."
            className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10"
          />
        </div>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10">
          <option value="all">All Services</option>
          {SERVICE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={nicheFilter} onChange={e => setNicheFilter(e.target.value)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10">
          <option value="all">All Niches</option>
          {niches.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 ml-auto">
          <option value="newest">Newest</option>
          <option value="dr">Highest DR</option>
          <option value="traffic">Highest Traffic</option>
          <option value="sort_order">Manual Order</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-14 text-center">
          <p className="text-gray-500 text-sm">No placements found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Screenshot</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Domain</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Service</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Niche</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">DR</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3 hidden lg:table-cell">Traffic</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-3">Feat</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-3">Home</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Status</th>
                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.screenshot_url ? (
                        <img src={p.screenshot_url} alt={p.domain} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image size={12} className="text-gray-300" /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{p.domain}</span>
                    {p.title && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.title}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-gray-600">{SERVICE_TYPE_OPTIONS.find(o => o.value === p.service_type)?.label ?? p.service_type}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500">{p.niche}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-bold text-gray-700">{p.dr}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-gray-500">{p.traffic.toLocaleString()}</span></td>
                  <td className="px-2 py-3 text-center">{p.featured && <CheckCircle2 size={13} className="text-[#F97316] inline" />}</td>
                  <td className="px-2 py-3 text-center">{p.homepage_featured && <CheckCircle2 size={13} className="text-emerald-500 inline" />}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${p.status === 'active' ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-500 bg-gray-100 border-gray-200'}`}>
                      {p.status === 'active' ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(p)} className="text-xs text-gray-500 hover:text-[#F97316] font-semibold px-2 py-1 rounded hover:bg-orange-50 transition">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PlacementEditor({ initial, onSave, onCancel }: {
  initial: Placement | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isNew = !initial?.id;
  const [form, setForm] = useState({
    service_type: (initial?.service_type ?? 'niche_edit') as PlacementServiceType,
    domain: initial?.domain ?? '',
    placement_url: initial?.placement_url ?? '',
    title: initial?.title ?? '',
    niche: initial?.niche ?? '',
    dr: initial?.dr ?? 0,
    traffic: initial?.traffic ?? 0,
    keywords: initial?.keywords ?? null as number | null,
    screenshot_url: initial?.screenshot_url ?? '',
    status: (initial?.status ?? 'active') as PlacementStatus,
    featured: initial?.featured ?? false,
    homepage_featured: initial?.homepage_featured ?? false,
    sort_order: initial?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [saveAndAdd, setSaveAndAdd] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  async function handleSave() {
    if (!form.domain.trim() || !form.placement_url.trim()) {
      showToast('error', 'Domain and Placement URL are required');
      return;
    }
    setSaving(true);
    const payload = { ...form, keywords: form.keywords || null };
    const { error } = isNew
      ? await supabase.from('placements').insert(payload)
      : await supabase.from('placements').update(payload).eq('id', initial!.id);
    setSaving(false);
    if (error) {
      showToast('error', error.message);
      return;
    }
    if (saveAndAdd) {
      setForm({
        service_type: form.service_type, domain: '', placement_url: '', title: '',
        niche: form.niche, dr: 0, traffic: 0, keywords: null,
        screenshot_url: '', status: 'active', featured: false,
        homepage_featured: false, sort_order: form.sort_order,
      });
      setSaveAndAdd(false);
      showToast('success', 'Placement saved. Add another.');
    } else {
      onSave();
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm('Delete this placement? This cannot be undone.')) return;
    setSaving(true);
    const { error } = await supabase.from('placements').delete().eq('id', initial.id);
    setSaving(false);
    if (error) { showToast('error', error.message); return; }
    onSave();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="text-xl font-bold text-gray-900">{isNew ? 'New Placement' : 'Edit Placement'}</h2>
      </div>

      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 max-w-2xl">
        {/* Service Type */}
        <Field label="Service Type *">
          <div className="flex gap-2">
            {SERVICE_TYPE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setForm(f => ({ ...f, service_type: o.value }))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${form.service_type === o.value ? 'bg-[#F97316] border-[#F97316] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Domain */}
        <Field label="Domain *">
          <input type="text" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
            placeholder="example.com"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
        </Field>

        {/* Placement URL */}
        <Field label="Live Placement URL *">
          <input type="url" value={form.placement_url} onChange={e => setForm(f => ({ ...f, placement_url: e.target.value }))}
            placeholder="https://..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
        </Field>

        {/* Title */}
        <Field label="Placement / Article Title" hint="Optional">
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Article or page title..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
        </Field>

        {/* Niche */}
        <Field label="Niche *">
          <input type="text" value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
            list="niche-presets" placeholder="e.g. Tech, Marketing, Health..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
          <datalist id="niche-presets">
            {PLACEMENT_NICHE_PRESETS.map(n => <option key={n} value={n} />)}
          </datalist>
        </Field>

        {/* DR + Traffic + Keywords */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="DR">
            <input type="number" value={form.dr} onChange={e => setForm(f => ({ ...f, dr: parseInt(e.target.value) || 0 }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
          </Field>
          <Field label="Organic Traffic">
            <input type="number" value={form.traffic} onChange={e => setForm(f => ({ ...f, traffic: parseInt(e.target.value) || 0 }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
          </Field>
          <Field label="Keywords" hint="Optional">
            <input type="number" value={form.keywords ?? ''} onChange={e => setForm(f => ({ ...f, keywords: e.target.value ? parseInt(e.target.value) : null }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
          </Field>
        </div>

        {/* Screenshot URL */}
        <Field label="Screenshot URL" hint="Paste an external image URL. Preview shows below.">
          <input type="url" value={form.screenshot_url} onChange={e => setForm(f => ({ ...f, screenshot_url: e.target.value }))}
            placeholder="https://..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
        </Field>

        {/* Screenshot preview */}
        {form.screenshot_url && (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={form.screenshot_url} alt="Preview" className="w-full max-h-48 object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]/20" />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.homepage_featured} onChange={e => setForm(f => ({ ...f, homepage_featured: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]/20" />
            <span className="text-sm text-gray-700">Show on Homepage</span>
          </label>
        </div>

        {/* Status + Sort Order */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PlacementStatus }))}
              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10">
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
          <Field label="Sort Order" hint="Lower shows first">
            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316]/10 focus:border-[#F97316]/40" />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-5 py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
          <button onClick={() => { setSaveAndAdd(true); handleSave(); }} disabled={saving}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 px-5 py-2.5 rounded-lg transition disabled:opacity-50">
            <Plus size={14} /> Save & Add Another
          </button>
          {!isNew && (
            <button onClick={handleDelete} disabled={saving}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg transition ml-auto">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
