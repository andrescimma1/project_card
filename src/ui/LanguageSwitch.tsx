/** Language selector of the top bar. The choice is saved in this browser; the whole app re-renders in it. */
import { LOCALES, m, setLocale, useLocale } from '../i18n';

export function LanguageSwitch() {
  const locale = useLocale();
  return (
    <div role="group" aria-label={m().common.language} className="flex shrink-0 items-center gap-0.5 rounded-md bg-black/25 p-0.5 shadow-[inset_0_0_0_1px_#6f5638]">
      {LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          data-sfx="nav"
          aria-pressed={locale === l.id}
          title={l.label}
          onClick={() => setLocale(l.id)}
          className={`rounded px-2 py-0.5 font-display text-[14px] font-bold transition-colors ${locale === l.id ? 'bg-gold text-ink' : 'text-faded hover:text-bone'}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
