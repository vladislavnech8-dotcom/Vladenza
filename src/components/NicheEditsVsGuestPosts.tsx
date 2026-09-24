import { ArrowRight, ArrowDown } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    nicheEditsTitle: 'Link Insertions',
    nicheEditsSubtitle: 'Existing article',
    nicheEditPoints: [
      { emoji: '⚡', label: '3–7 day delivery' },
      { emoji: '📝', label: 'Existing content updated' },
      { emoji: '🎯', label: 'Context limited by existing article' },
      { emoji: '💰', label: 'Usually lower cost' },
      { emoji: '📍', label: 'Good for adding links to already relevant pages' },
    ],
    chooseThisWhen: 'Choose this when',
    nicheEditWhen: 'You already know the target page and want links from relevant existing content.',
    viewNicheEditPackages: 'View Link Insertion Packages',
    guestPostsTitle: 'Guest Posts',
    guestPostsSubtitle: 'New article',
    guestPostPoints: [
      { emoji: '🕒', label: '10–21 day delivery' },
      { emoji: '📄', label: 'New article created' },
      { emoji: '🎯', label: 'More control over topic and context' },
      { emoji: '💰', label: 'Usually higher cost' },
      { emoji: '📰', label: 'Good for dedicated content around the link' },
    ],
    guestPostWhen: 'You want a new article built around a specific topic, keyword, or landing page.',
    exploreGuestPosts: 'Explore Guest Posts',
    bottomParagraph: "You don't have to choose one. Many ongoing campaigns use both depending on the backlink profile, target pages, competitors, and budget.",
  },
  uk: {
    nicheEditsTitle: 'Розміщення посилань',
    nicheEditsSubtitle: 'Існуюча стаття',
    nicheEditPoints: [
      { emoji: '⚡', label: 'Доставка за 3–7 днів' },
      { emoji: '📝', label: 'Оновлення існуючого контенту' },
      { emoji: '🎯', label: 'Контекст обмежений існуючою статтею' },
      { emoji: '💰', label: 'Зазвичай нижча вартість' },
      { emoji: '📍', label: 'Підходить для додавання посилань до вже релевантних сторінок' },
    ],
    chooseThisWhen: 'Обирайте, коли',
    nicheEditWhen: 'Ви вже знаєте цільову сторінку і хочете посилання з релевантного існуючого контенту.',
    viewNicheEditPackages: 'Переглянути пакети розміщення посилань',
    guestPostsTitle: 'Гостьові публікації',
    guestPostsSubtitle: 'Нова стаття',
    guestPostPoints: [
      { emoji: '🕒', label: 'Доставка за 10–21 днів' },
      { emoji: '📄', label: 'Створення нової статті' },
      { emoji: '🎯', label: 'Більший контроль над темою та контекстом' },
      { emoji: '💰', label: 'Зазвичай вища вартість' },
      { emoji: '📰', label: 'Підходить для окремого контенту навколо посилання' },
    ],
    guestPostWhen: 'Ви хочете нову статтю, створену навколо конкретної теми, ключового слова або цільової сторінки.',
    exploreGuestPosts: 'Переглянути гостьові публікації',
    bottomParagraph: 'Вам не обовʼязково обирати щось одне. Багато поточних кампаній використовують обидва варіанти залежно від профілю посилань, цільових сторінок, конкурентів та бюджету.',
  },
};

export default function NicheEditsVsGuestPosts({
  onScrollToPackages,
}: {
  onScrollToPackages: () => void;
}) {
  const { locale, localizePath } = useLocale();
  const c = content[locale];

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5">
        {/* Link Insertions card */}
        <div className="bg-white border-2 border-[#F97316]/20 rounded-2xl p-7 flex flex-col hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-xl">
              🔗
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{c.nicheEditsTitle}</h3>
              <p className="text-xs text-gray-400">{c.nicheEditsSubtitle}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5 mb-5 flex-1">
            {c.nicheEditPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <div className="bg-orange-50/50 rounded-lg px-3 py-2.5 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] mb-1">{c.chooseThisWhen}</div>
            <p className="text-xs text-gray-500 leading-relaxed">{c.nicheEditWhen}</p>
          </div>
          <button
            onClick={onScrollToPackages}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200"
          >
            {c.viewNicheEditPackages} <ArrowDown size={14} />
          </button>
        </div>

        {/* Guest Posts card */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 flex flex-col hover:border-blue-400 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{c.guestPostsTitle}</h3>
              <p className="text-xs text-gray-400">{c.guestPostsSubtitle}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5 mb-5 flex-1">
            {c.guestPostPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <div className="bg-blue-50/50 rounded-lg px-3 py-2.5 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">{c.chooseThisWhen}</div>
            <p className="text-xs text-gray-500 leading-relaxed">{c.guestPostWhen}</p>
          </div>
          <a
            href={localizePath('/services/guest-posting')}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-50"
          >
            {c.exploreGuestPosts} <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
        {c.bottomParagraph}
      </p>
    </div>
  );
}
