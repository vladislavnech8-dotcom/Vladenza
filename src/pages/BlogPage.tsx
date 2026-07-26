import { Clock, ArrowUpRight, Search, Tag, ArrowRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import ServicePageLayout from '../components/ServicePageLayout';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

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
  published: boolean;
  created_at: string;
}

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  image: string;
  tags: string[];
  date?: string;
};

function useAllPosts(): { posts: Post[]; loading: boolean } {
  const [dbPosts, setDbPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('blog_posts')
      .select('id,slug,title,excerpt,category,category_color,read_time,image_url,tags,published,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setDbPosts((data as DbPost[]) ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const dbSlugs = new Set(dbPosts.map(p => p.slug));
  const staticFiltered = blogPosts.filter(p => !dbSlugs.has(p.slug));

  const posts = [
    ...dbPosts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryColor: p.category_color,
      readTime: p.read_time,
      image: p.image_url,
      tags: p.tags,
    })),
    ...staticFiltered.map(p => ({
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryColor: p.categoryColor,
      readTime: p.readTime,
      image: p.image,
      tags: p.tags,
      date: p.date,
    })),
  ];

  return { posts, loading };
}

const CATEGORY_LIST = [
  'All Posts',
  'Link Building',
  'SEO Strategy',
  'AI & LLM SEO',
  'Crowd Marketing',
  'SaaS SEO',
  'iGaming SEO',
  'White Label SEO',
];

function CategoryBadge({ category, color }: { category: string; color: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border ${color}`}>
      {category}
    </span>
  );
}

function PostCard({ post, onNavigate }: { post: Post; onNavigate: (slug: string) => void }) {
  return (
    <button
      onClick={() => onNavigate(post.slug)}
      className="group bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col text-left"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[600ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3.5 left-3.5">
          <CategoryBadge category={post.category} color={post.categoryColor} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <Clock size={10} /> {post.readTime}
        </div>
        <h3 className="text-gray-900 font-bold text-[15px] leading-snug group-hover:text-[#F97316] transition-colors duration-200 flex-1 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-1 text-[#F97316] text-xs font-semibold mt-auto pt-1">
          Read article <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-3 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded-full mt-2" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { posts: allPosts, loading } = useAllPosts();
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [search, setSearch] = useState('');

  useSEO({
    title: 'SEO Blog — Link Building & AI Search Strategies | Vladenza',
    description: 'Expert articles on link building, guest posting, niche edits, GEO, AI/LLM visibility, and technical SEO. Practical playbooks from the Vladenza team.',
    canonical: 'https://vladenza.com/blog',
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Posts': allPosts.length };
    for (const p of allPosts) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [allPosts]);

  const filtered = useMemo(() => {
    let list = allPosts;
    if (activeCategory !== 'All Posts') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allPosts, activeCategory, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <ServicePageLayout>

      {/* Hero */}
      <section className="relative pt-16 pb-14 lg:pt-24 lg:pb-16 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,#fff8f3 0%,#ffffff 40%)' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none opacity-[0.04]" style={{ background: 'radial-gradient(ellipse at top right, #F97316, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-0.5 rounded-full bg-[#F97316]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">Blog & Resources</span>
            </div>
            <h1 className="text-4xl md:text-[52px] font-bold text-gray-900 leading-[1.05] tracking-tight mb-5">
              SEO insights from<br />
              <span className="text-[#F97316]">practitioners</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
              Tactical breakdowns, data-driven research, and honest takes on link building, AI search, and organic growth.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16 bg-gray-50/50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10">

            {/* Posts */}
            <div>
              {loading ? (
                <div className="flex flex-col gap-6">
                  <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row animate-pulse">
                    <div className="md:w-[48%] h-64 md:h-72 bg-gray-100 flex-shrink-0" />
                    <div className="p-8 flex flex-col justify-center flex-1 gap-4">
                      <div className="h-3 w-20 bg-gray-100 rounded-full" />
                      <div className="h-6 w-3/4 bg-gray-100 rounded" />
                      <div className="h-4 w-full bg-gray-100 rounded" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                </div>
              ) : featured ? (
                <>
                  {/* Featured */}
                  <button
                    onClick={() => navigate(`/blog/${featured.slug}`)}
                    className="group w-full bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] transition-all duration-300 text-left flex flex-col md:flex-row mb-8"
                  >
                    <div className="relative md:w-[48%] h-64 md:h-auto overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[600ms] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:to-black/20" />
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.12em] bg-[#F97316] text-white px-3 py-1 rounded-full shadow-sm">Featured</span>
                    </div>
                    <div className="p-8 lg:p-10 flex flex-col justify-center flex-1 gap-4">
                      <div className="flex items-center gap-3">
                        <CategoryBadge category={featured.category} color={featured.categoryColor} />
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock size={11} /> {featured.readTime}
                        </div>
                      </div>
                      <h2 className="text-gray-900 font-bold text-2xl leading-[1.2] group-hover:text-[#F97316] transition-colors duration-200">{featured.title}</h2>
                      <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3">{featured.excerpt}</p>
                      <div className="flex items-center gap-1.5 text-[#F97316] text-sm font-semibold">
                        Read article <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </div>
                    </div>
                  </button>

                  {/* Grid */}
                  {rest.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {rest.map((post) => (
                        <PostCard key={post.id} post={post} onNavigate={(s) => navigate(`/blog/${s}`)} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                  <Search size={32} className="mb-3 opacity-30" />
                  <p className="text-sm">No articles found</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-5">

              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-all shadow-sm"
                />
              </div>

              {/* Categories */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-bold text-sm mb-4 flex items-center gap-2">
                  <Tag size={13} className="text-[#F97316]" />
                  Categories
                </h3>
                <div className="flex flex-col gap-1">
                  {CATEGORY_LIST.map((cat) => {
                    const count = categoryCounts[cat] ?? 0;
                    if (count === 0 && cat !== 'All Posts') return null;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 text-left w-full ${
                          isActive
                            ? 'bg-[#F97316] text-white font-semibold'
                            : 'text-gray-600 hover:bg-orange-50/60 hover:text-gray-900'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Most Read */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-bold text-sm mb-4">Most Read</h3>
                <div className="flex flex-col gap-4">
                  {allPosts.slice(0, 4).map((post, i) => (
                    <button
                      key={post.id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="flex gap-3 group text-left"
                    >
                      <div className="text-2xl font-black text-gray-100 flex-shrink-0 w-7 leading-none group-hover:text-[#F97316]/20 transition-colors">{i + 1}</div>
                      <div>
                        <h4 className="text-gray-700 text-xs font-semibold leading-snug group-hover:text-[#F97316] transition-colors line-clamp-2">{post.title}</h4>
                        <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px]">
                          <Clock size={9} /> {post.readTime}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gray-950 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(circle at 70% 30%, #F97316, transparent 60%)' }} />
                <div className="relative">
                  <p className="text-white font-bold text-sm mb-1.5">Need link building?</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">Get a free strategy session with our team.</p>
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
                  >
                    Get Started <ArrowRight size={12} />
                  </a>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
