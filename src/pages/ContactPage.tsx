import { useState } from 'react';
import { ArrowUpRight, Linkedin, Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { useLocale } from '../context/LocaleContext';
import { useSEO } from '../hooks/useSEO';

const BOOKING_URL = '#booking-url-pending';
const WHATSAPP_URL = '#whatsapp-url-pending';
const LINKEDIN_URL = 'https://www.linkedin.com/company/vladenza';
const TELEGRAM_URL = 'https://t.me/vladenza';
const PORTRAIT_SRC = '/assets/visuals/contact-portrait.jpg';

export default function ContactPage() {
  const { locale } = useLocale();
  const uk = locale === 'uk';
  const [portraitError, setPortraitError] = useState(false);

  useSEO({
    title: uk ? "Зв'язатися з Vladenza | Поговорімо" : "Contact Vladenza | Let's Talk",
    description: uk ? 'Є сайт, проблема чи ідея? Розкажіть, що відбувається. Обговоримо лінкбілдинг, SEO та діджитал-маркетинг.' : "Got a website, a problem or an idea? Tell us what's going on. Talk to Vladenza about link building, SEO and digital marketing.",
    canonical: `https://vladenza.com${uk ? '/uk/contact/' : '/contact/'}`,
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navigation onOpenModal={() => {}} />
      <main className="pt-[88px]">
        <section className="bg-cream py-12 sm:py-16 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:items-start md:gap-14 lg:px-16">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">{uk ? 'КОНТАКТ' : 'CONTACT'}</p>
              <h1 className="max-w-xl font-display text-[clamp(3.25rem,7vw,6.25rem)] font-bold leading-[.9] tracking-[-.05em] text-ink">
                {uk ? <>Ну що.<br /><span className="text-signal">Тепер ви.</span></> : <>Okay.<br /><span className="text-signal">Your turn.</span></>}
              </h1>
              <p className="mt-7 max-w-md font-display text-2xl leading-tight text-ink/75 sm:text-3xl">
                {uk ? <>Розкажіть, над чим працюєте.<br />З рештою розберемося.</> : <>Tell us what you&apos;re working on.<br />We&apos;ll figure out the rest.</>}
              </p>
              <p className="mt-5 text-sm font-semibold text-ink/45">{uk ? 'Ідеальний бриф не потрібен.' : 'No perfect brief required.'}</p>

              <figure className="relative mt-10 max-w-[420px] border-2 border-ink bg-navy">
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#101F52]">
                  {portraitError ? (
                    <p className="px-8 text-center text-xs font-bold uppercase tracking-[.16em] text-cream/45">{uk ? 'Портрет буде додано' : 'Portrait coming soon'}</p>
                  ) : (
                    <img src={PORTRAIT_SRC} alt={uk ? 'Влад, засновник Vladenza' : 'Vlad, founder of Vladenza'} className="h-full w-full object-cover" onError={() => setPortraitError(true)} />
                  )}
                </div>
                <figcaption className="flex items-end justify-between gap-4 border-t-2 border-ink bg-cream px-4 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-signal">VLAD</p>
                    <p className="mt-1 text-sm font-semibold text-ink">Founder, Vladenza</p>
                  </div>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="editorial-focus inline-flex items-center gap-1 text-xs font-bold text-ink/60 transition-colors hover:text-signal">
                    <Linkedin size={13} /> LinkedIn <ArrowUpRight size={12} />
                  </a>
                </figcaption>
              </figure>
            </div>

            <div className="md:pt-14">
              <LeadForm variant="contact" />
            </div>
          </div>
        </section>

        <section className="bg-navy py-14 text-white md:py-18">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">{uk ? 'НЕ ЛЮБИТЕ ФОРМИ?' : "DON'T LIKE FORMS?"}</p>
            <h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.92] text-cream">{uk ? 'Розуміємо.' : 'Fair enough.'}</h2>

            <div className="mt-10 border-y border-white/20">
              <a href={BOOKING_URL} className="group editorial-focus flex flex-col gap-2 border-b border-white/20 py-6 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between sm:px-3">
                <div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{uk ? 'ЗАПЛАНУВАТИ ДЗВІНОК' : 'BOOK A CALL'}</p><p className="mt-2 font-display text-2xl text-cream">Google Meet</p></div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-cream/75 group-hover:text-signal">{uk ? 'Оберіть зручний час' : 'Pick a time that works'} <ArrowUpRight size={16} /></span>
              </a>
              <a href="mailto:info@vladenza.com" className="group editorial-focus flex items-center justify-between border-b border-white/20 py-5 sm:px-3">
                <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/45">EMAIL</p><p className="mt-1 text-base font-semibold text-cream">info@vladenza.com</p></div><ArrowUpRight size={16} className="text-signal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="group editorial-focus flex items-center justify-between border-b border-white/20 py-5 sm:px-3">
                <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/45">TELEGRAM</p><p className="mt-1 text-base font-semibold text-cream">@vladenza</p></div><Send size={15} className="text-signal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <a href={WHATSAPP_URL} className="group editorial-focus flex items-center justify-between py-5 sm:px-3">
                <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/45">WHATSAPP</p><p className="mt-1 text-base font-semibold text-cream">{uk ? 'Написати' : 'Message us'}</p></div><ArrowUpRight size={16} className="text-signal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
