import { Link2, FileText, Zap, Clock, File as FileEdit, Target, DollarSign, ArrowRight } from 'lucide-react';

const nicheEditPoints = [
  { icon: Zap, label: 'Typical delivery: 3–7 days' },
  { icon: FileEdit, label: 'Existing content is updated' },
  { icon: Target, label: 'Context based on the existing article' },
  { icon: DollarSign, label: 'Usually lower cost' },
];

const guestPostPoints = [
  { icon: Clock, label: 'Typical delivery: 10–21 days' },
  { icon: FileText, label: 'New article is created' },
  { icon: Target, label: 'More control over the full topic' },
  { icon: DollarSign, label: 'Usually higher cost' },
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
        <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Link2 size={18} className="text-[#F97316]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Niche Edits</h3>
              <p className="text-xs text-gray-400">Existing article</p>
            </div>
          </div>
          <ul className="flex flex-col gap-3 mb-6 flex-1">
            {nicheEditPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <p.icon size={15} className="text-[#F97316] flex-shrink-0" />
                {p.label}
              </li>
            ))}
          </ul>
          <button
            onClick={onScrollToPackages}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200"
          >
            View Niche Edit Packages <ArrowRight size={14} />
          </button>
        </div>

        {/* Guest Posts card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Guest Posts</h3>
              <p className="text-xs text-gray-400">New article</p>
            </div>
          </div>
          <ul className="flex flex-col gap-3 mb-6 flex-1">
            {guestPostPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <p.icon size={15} className="text-blue-500 flex-shrink-0" />
                {p.label}
              </li>
            ))}
          </ul>
          <a
            href="/services/guest-posting"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-50"
          >
            View Guest Posts <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
        You don't have to choose one. Many ongoing campaigns use both depending on the backlink profile, target pages, competitors, and budget.
      </p>
    </div>
  );
}
