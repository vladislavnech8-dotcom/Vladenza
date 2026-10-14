import { ArrowUpRight, Linkedin, Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { useLocale } from '../context/LocaleContext';
import { useSEO } from '../hooks/useSEO';
import { CONTACT_CONFIG, getBookingUrl, getWhatsappUrl } from '../lib/contactConfig';

const PORTRAIT_SRC = '/assets/visuals/photovladenza.png';

export default function ContactPage() {
  const { locale } = useLocale();
  const uk = locale === 'uk';

  useSEO({
    title: uk ? "Зв'язатися з Vladenza | Поговорімо" : "Contact Vladenza | Let's Talk",
    description: uk ? 'Є сайт, проблема чи ідея? Розкажіть, що відбувається. Обговоримо лінкбілдинг, SEO та діджитал-маркетинг.' : "Got a website, a problem or an idea? Tell us what's going on. Talk to Vladenza about link building, SEO and digital marketing.",
    canonical: `https://vladenza.com${uk ? '/uk/contact/' : '/contact/'}`,
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navigation onOpenModal={() => {}} />
      <main className="pt-[88px]">
        <section className="bg-cream py-10 sm:py-14 lg:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:items-start md:gap-14 lg:px-12 xl:gap-20">
            <div className="max-w-[480px]">
              <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">{uk ? 'КОНТАКТ' : 'CONTACT'}</p>
              <h1 className="max-w-md font-display text-[clamp(2.75rem,5vw,4.75rem)] font-bold leading-[.92] tracking-[-.05em] text-ink">
                {uk ? <>Ну що.<br /><span className="text-signal">Тепер ви.</span></> : <>Okay.<br /><span className="text-signal">Your turn.</span></>}
              </h1>
              <p className="mt-5 max-w-sm font-display text-xl leading-[1.08] text-ink/70 sm:text-2xl">
                {uk ? <>Розкажіть, над чим працюєте.<br />З рештою розберемося.</> : <>Tell us what you&apos;re working on.<br />We&apos;ll figure out the rest.</>}
              </p>
              <p className="mt-3 text-sm font-semibold text-ink/45">{uk ? 'Ідеальний бриф не потрібен.' : 'No perfect brief required.'}</p>

              <figure className="mt-7 max-w-[420px]">
                <div className="aspect-[4/3] overflow-hidden bg-[#d2d0cb] sm:aspect-[5/4]">
                  <img src={PORTRAIT_SRC} alt={uk ? 'Влад, засновник Vladenza' : 'Vlad, founder of Vladenza'} loading="lazy" decoding="async" className="h-full w-full object-cover object-[center_30%]" />
                </div>
                <figcaption className="flex items-end justify-between gap-4 pt-3.5">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-display text-base font-bold tracking-tight text-ink">VLAD</p>
                    <p className="text-xs font-semibold text-ink/65">{uk ? 'Засновник Vladenza' : 'Founder, Vladenza'}</p>
                  </div>
                  <a
                    href={CONTACT_CONFIG.FOUNDER_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-focus group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-bold text-ink/70 transition-colors hover:bg-ink/5 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    <Linkedin size={14} className="text-ink/55 transition-colors group-hover:text-signal" />
                    LinkedIn
                    <ArrowUpRight size={12} className="text-ink/40 transition-colors group-hover:text-signal" />
                  </a>
                </figcaption>
              </figure>
            </div>

            <div className="md:pt-4 lg:pt-8" id="contact-form">
              <LeadForm variant="contact" />
            </div>
          </div>
        </section>

        <section className="border-t border-white/15 bg-navy py-8 text-white sm:py-10">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[.18em] text-signal">{uk ? 'НЕ ЛЮБИТЕ ФОРМИ?' : "DON'T LIKE FORMS?"}</p>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.25rem)] font-bold leading-[.95] text-cream">{uk ? 'Розуміємо.' : 'Fair enough.'}</h2>

            <div className="mt-6 grid border-y border-white/20 sm:grid-cols-2">
              <a
                href={getBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group editorial-focus flex min-h-[108px] flex-col justify-between border-b border-white/20 py-4 pr-5 transition-colors hover:bg-white/5 focus-visible:bg-white/5 sm:border-r sm:py-5 sm:pr-6"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.16em] text-signal">{uk ? 'ЗАПЛАНУВАТИ ЗУСТРІЧ' : 'BOOK A MEETING'}</p>
                  <p className="mt-1.5 font-display text-xl text-cream">Vladenza Agency</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-cream/80 transition-colors group-hover:text-signal">
                  {uk ? 'Обрати зручний час' : 'Choose a Time'}
                  <ArrowUpRight size={14} />
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_CONFIG.EMAIL}`}
                className="group editorial-focus flex min-h-[108px] flex-col justify-between border-b border-white/20 py-4 transition-colors hover:bg-white/5 focus-visible:bg-white/5 sm:py-5 sm:pl-6"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.16em] text-signal">EMAIL</p>
                  <p className="mt-1.5 text-base font-semibold text-cream">{CONTACT_CONFIG.EMAIL}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-cream/80 transition-colors group-hover:text-signal">
                  {uk ? 'Написати нам' : 'Email us'}
                  <ArrowUpRight size={14} />
                </span>
              </a>

              <a
                href={CONTACT_CONFIG.TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group editorial-focus flex min-h-[108px] flex-col justify-between py-4 pr-5 transition-colors hover:bg-white/5 focus-visible:bg-white/5 sm:border-r sm:py-5 sm:pr-6"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.16em] text-signal">TELEGRAM</p>
                  <p className="mt-1.5 text-base font-semibold text-cream">{CONTACT_CONFIG.TELEGRAM_HANDLE}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-cream/80 transition-colors group-hover:text-signal">
                  {uk ? 'Написати в Telegram' : 'Message us'}
                  <Send size={13} />
                </span>
              </a>

              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group editorial-focus flex min-h-[108px] flex-col justify-between py-4 transition-colors hover:bg-white/5 focus-visible:bg-white/5 sm:border-t sm:border-white/20 sm:py-5 sm:pl-6"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.16em] text-signal">WHATSAPP</p>
                  <p className="mt-1.5 text-base font-semibold text-cream">{uk ? 'Написати' : 'Message us'}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-cream/80 transition-colors group-hover:text-signal">
                  {uk ? 'Відкрити WhatsApp' : 'Open WhatsApp'}
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
