import { Clock, ArrowLeft, ArrowRight, Tag, Share2, Twitter, Linkedin, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ServicePageLayout from '../components/ServicePageLayout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogPosts, type Section } from '../data/blogPosts';
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
  content_json: Section[];
  published: boolean;
  created_at: string;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(((?:https?:\/\/)?[^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const href = match[2];
    const isInternal = href.startsWith('/') || /^https?:\/\/vladenza\.com/.test(href);
    const to = isInternal && !href.startsWith('/') ? href.replace(/^https?:\/\/vladenza\.com/, '') : href;
    const linkClass = 'text-[#F97316] font-medium underline underline-offset-2 hover:text-[#EA580C] transition-colors';
    parts.push(
      isInternal ? (
        <Link key={match.index} to={to} className={linkClass}>{match[1]}</Link>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{match[1]}</a>
      )
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

function RenderSection({ section, sectionIndex }: { section: Section; sectionIndex?: number }) {
  switch (section.type) {
    case 'intro':
      return (
        <p className="text-[19px] text-gray-700 leading-[1.75] font-normal border-l-[3px] border-[#F97316] pl-6 my-8">
          {renderInline(section.text ?? '')}
        </p>
      );
    case 'h2': {
      const h2Count = sectionIndex ?? 0;
      return (
        <h2 id={`section-${h2Count}`} className="text-[26px] font-bold text-gray-900 mt-14 mb-5 leading-[1.2] scroll-mt-28 tracking-tight">
          {section.text}
        </h2>
      );
    }
    case 'h3':
      return <h3 className="text-[17px] font-bold text-gray-900 mt-9 mb-3 leading-snug">{section.text}</h3>;
    case 'p':
      return <p className="text-gray-600 leading-[1.8] my-4 text-[15px]">{renderInline(section.text ?? '')}</p>;
    case 'ul':
      return (
        <ul className="my-5 flex flex-col gap-2.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-[15px]">
              <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-5 flex flex-col gap-2.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-[15px]">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'blockquote':
      return (
        <blockquote className="my-10 relative">
          <div className="absolute -left-1 top-0 bottom-0 w-1 rounded-full bg-[#F97316]" />
          <p className="text-gray-700 text-[18px] leading-[1.6] font-medium italic pl-6 pr-2">{section.text}</p>
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-7 bg-orange-50/60 border border-orange-100/80 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-2">{section.label}</div>
          <p className="text-gray-700 text-[14px] leading-relaxed">{section.text}</p>
        </div>
      );
    case 'table':
      return (
        <div className="my-7 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-950 text-left">
                {(section.headers ?? []).map((h) => (
                  <th key={h} className="px-4 py-3.5 text-white text-xs font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(section.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3.5 text-gray-600 leading-snug ${ci === 0 ? 'font-medium text-gray-900' : ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cta':
      return (
        <div className="my-12 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-[#1a1208] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
            <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 80% 50%, #F97316 0%, transparent 60%)'}} />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F97316] mb-2">{section.label}</p>
              <p className="text-white text-xl sm:text-2xl font-bold leading-snug max-w-md">{section.text}</p>
              {section.subtext && <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">{section.subtext}</p>}
            </div>
            <Link to={section.href ?? '/'} className="relative flex-shrink-0 bg-[#F97316] hover:bg-[#EA580C] active:bg-[#C2410C] transition-colors text-white font-semibold px-7 py-3.5 rounded-xl text-sm whitespace-nowrap shadow-lg shadow-orange-900/30">
              {section.button}
            </Link>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function usePost(slug: string | undefined) {
  const preloaded = typeof window === 'undefined'
    ? (globalThis as Record<string, unknown>).__SSR_PRELOADED_POST__ as DbPost | undefined
    : undefined;
  const [post, setPost] = useState<DbPost | ReturnType<typeof blogPosts.find> | null | undefined>(
    () => preloaded ?? blogPosts.find((p) => p.slug === slug)
  );
  const [loading, setLoading] = useState(!preloaded && !blogPosts.find((p) => p.slug === slug));

  useEffect(() => {
    if (!slug) { setPost(null); setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      if (data) {
        setPost(data as DbPost);
      } else {
        setPost(blogPosts.find(p => p.slug === slug) ?? null);
      }
      setLoading(false);
    })();
  }, [slug]);

  return { post, loading };
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading } = usePost(slug);
  const [copied, setCopied] = useState(false);

  const staticIndex = blogPosts.findIndex((p) => p.slug === slug);
  const staticPost = blogPosts[staticIndex];

  useSEO({
    title: post ? `${(post as DbPost).title ?? staticPost?.title} | Vladenza Blog` : 'Blog Post | Vladenza',
    description: post ? ((post as DbPost).excerpt ?? staticPost?.excerpt ?? 'Read this article on SEO and link building from Vladenza.') : 'Read this article on SEO and link building from Vladenza.',
    canonical: `https://vladenza.com/blog/${slug}`,
    ogImage: post ? ((post as DbPost).image_url ?? staticPost?.image) : undefined,
  });

  const prevPost = staticIndex > 0 ? blogPosts[staticIndex - 1] : null;
  const nextPost = staticIndex < blogPosts.length - 1 ? blogPosts[staticIndex + 1] : null;
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (loading) {
    return (
      <ServicePageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
        </div>
      </ServicePageLayout>
    );
  }

  if (!post) {
    return (
      <ServicePageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl font-black text-gray-100 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-6">This article may have been moved or removed.</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 bg-[#F97316] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#EA580C] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Blog
          </button>
        </div>
      </ServicePageLayout>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const heroImage = (post as DbPost).image_url ?? (post as NonNullable<ReturnType<typeof blogPosts.find>>).image;
  const catColor = (post as DbPost).category_color ?? (post as NonNullable<ReturnType<typeof blogPosts.find>>).categoryColor;
  const readTime = (post as DbPost).read_time ?? (post as NonNullable<ReturnType<typeof blogPosts.find>>).readTime;
  const postDate = (post as DbPost).created_at
    ? new Date((post as DbPost).created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : (post as NonNullable<ReturnType<typeof blogPosts.find>>).date;
  const sections: Section[] = (post as DbPost).content_json ?? (post as NonNullable<ReturnType<typeof blogPosts.find>>).content ?? [];

  function handleCopy() {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <ServicePageLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-gray-700 transition-colors">Home</button>
          <span className="text-gray-200">/</span>
          <button onClick={() => navigate('/blog')} className="hover:text-gray-700 transition-colors">Blog</button>
          <span className="text-gray-200">/</span>
          <span className="text-gray-500 truncate max-w-[240px]">{post.title}</span>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-white pt-12 pb-0">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border ${catColor}`}>
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Clock size={11} /> {readTime}
            </div>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 text-xs">{postDate}</span>
          </div>

          <h1 className="text-3xl md:text-[44px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-5 max-w-3xl">
            {post.title}
          </h1>

          <p className="text-gray-500 text-[17px] leading-[1.6] max-w-2xl mb-7">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 pb-8 border-b border-gray-100">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>

          {/* Cover image */}
          <div className="rounded-2xl overflow-hidden mt-8 h-[280px] md:h-[400px] bg-gray-100">
            <img src={heroImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_220px] gap-14">

            {/* Article */}
            <article className="min-w-0 max-w-[720px]">
              {(() => {
                let h2Count = 0;
                return sections.map((section, i) => {
                  const idx = section.type === 'h2' ? h2Count++ : undefined;
                  return <RenderSection key={i} section={section} sectionIndex={idx} />;
                });
              })()}

              {/* Share */}
              <div className="mt-14 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Share2 size={13} /> Share
                  </span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Twitter size={12} /> X / Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Linkedin size={12} /> LinkedIn
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Link2 size={12} /> {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              </div>

              {/* Prev / Next */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <button
                    onClick={() => navigate(`/blog/${prevPost.slug}`)}
                    className="group flex flex-col gap-1.5 border border-gray-200 rounded-2xl p-5 hover:border-[#F97316]/30 hover:bg-orange-50/30 transition-all text-left"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                      <ArrowLeft size={10} /> Previous
                    </span>
                    <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#F97316] transition-colors line-clamp-2">{prevPost.title}</span>
                  </button>
                ) : <div />}
                {nextPost ? (
                  <button
                    onClick={() => navigate(`/blog/${nextPost.slug}`)}
                    className="group flex flex-col gap-1.5 border border-gray-200 rounded-2xl p-5 hover:border-[#F97316]/30 hover:bg-orange-50/30 transition-all text-left sm:items-end"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                      Next <ArrowRight size={10} />
                    </span>
                    <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#F97316] transition-colors line-clamp-2 sm:text-right">{nextPost.title}</span>
                  </button>
                ) : <div />}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              {sections.filter(s => s.type === 'h2').length > 0 && (
                <div className="sticky top-[104px]">
                  <div className="border-l border-gray-200 pl-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">In this article</h3>
                    <nav className="flex flex-col gap-0.5">
                      {sections
                        .filter((s) => s.type === 'h2')
                        .map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const el = document.getElementById(`section-${i}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="flex items-start gap-2 py-1.5 group text-left w-full"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#F97316]/30 flex-shrink-0 mt-[7px] group-hover:bg-[#F97316] transition-colors" />
                            <span className="text-xs text-gray-400 group-hover:text-[#F97316] transition-colors leading-snug">{s.text}</span>
                          </button>
                        ))}
                    </nav>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <a
                        href="/#contact"
                        className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2.5 px-4 rounded-xl text-xs text-center transition-colors block"
                      >
                        Get a Free Link Audit
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <section className="py-14 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">More to read</h2>
            <button
              onClick={() => navigate('/blog')}
              className="text-sm font-semibold text-[#F97316] flex items-center gap-1.5 hover:underline"
            >
              All articles <ArrowRight size={13} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rp) => (
              <button
                key={rp.id}
                onClick={() => navigate(`/blog/${rp.slug}`)}
                className="group bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 text-left"
              >
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={rp.image}
                    alt={rp.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[600ms] ease-out"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${rp.categoryColor}`}>{rp.category}</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1"><Clock size={9} /> {(rp as { readTime?: string }).readTime ?? '5 min'}</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-sm leading-snug group-hover:text-[#F97316] transition-colors line-clamp-2">{rp.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
