import { ArrowRight, ArrowDown } from 'lucide-react';

const nicheEditPoints = [
  { emoji: '\u26a1', label: '3\u20137 day delivery' },
  { emoji: '\ud83d\udcdd', label: 'Existing content updated' },
  { emoji: '\ud83c\udfaf', label: 'Context limited by existing article' },
  { emoji: '\ud83d\udcb0', label: 'Usually lower cost' },
  { emoji: '\ud83d\udccd', label: 'Good for adding links to already relevant pages' },
];

const guestPostPoints = [
  { emoji: '\ud83d\udd52', label: '10\u201321 day delivery' },
  { emoji: '\ud83d\udcc4', label: 'New article created' },
  { emoji: '\ud83c\udfaf', label: 'More control over topic and context' },
  { emoji: '\ud83d\udcb0', label: 'Usually higher cost' },
  { emoji: '\ud83d\udcf0', label: 'Good for dedicated content around the link' },
];

export default function NicheEditsVsGuestPosts({
  onScrollToPackages,
}: {
  onScrollToPackages: () => void;
}) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5">
        {/* Niche Edits card */}
        <div className="bg-white border-2 border-[#F97316]/20 rounded-2xl p-7 flex flex-col hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-xl">
              {'\ud83d\udd17'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Niche Edits</h3>
              <p className="text-xs text-gray-400">Existing article</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5 mb-5 flex-1">
            {nicheEditPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <div className="bg-orange-50/50 rounded-lg px-3 py-2.5 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] mb-1">Choose this when</div>
            <p className="text-xs text-gray-500 leading-relaxed">You already know the target page and want links from relevant existing content.</p>
          </div>
          <button
            onClick={onScrollToPackages}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200"
          >
            View Niche Edit Packages <ArrowDown size={14} />
          </button>
        </div>

        {/* Guest Posts card */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 flex flex-col hover:border-blue-400 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
              {'\u270d\ufe0f'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Guest Posts</h3>
              <p className="text-xs text-gray-400">New article</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5 mb-5 flex-1">
            {guestPostPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <div className="bg-blue-50/50 rounded-lg px-3 py-2.5 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">Choose this when</div>
            <p className="text-xs text-gray-500 leading-relaxed">You want a new article built around a specific topic, keyword, or landing page.</p>
          </div>
          <a
            href="/services/guest-posting"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-50"
          >
            Explore Guest Posts <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
        You don't have to choose one. Many ongoing campaigns use both depending on the backlink profile, target pages, competitors, and budget.
      </p>
    </div>
  );
}
