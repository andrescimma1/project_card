/**
 * Interface sounds for the whole app from one place (event delegation), instead of a handler in every
 * component. Buttons can say what they are with `data-sfx`:
 *   confirm | cancel | nav | tab | none (the component emits its own cue)
 * and `data-sfx-hover="card"` gives a card-lift sound on hover. Without it: `data-primary` confirms,
 * close/back/skip words cancel, everything else is navigation.
 */
import { gameEvents, type CueName } from './bus';

const INTERACTIVE = 'button, a[href], select, summary, [role="tab"], input[type="checkbox"], input[type="range"]';
const CANCEL_WORDS = /^(cerrar|cancelar|volver|salir|saltar|abandonar|ocultar|atrás)/i;

function clickCue(el: HTMLElement): CueName | null {
  const kind = el.dataset.sfx;
  if (kind === 'none') return null;
  if (kind === 'confirm') return 'UI_CONFIRM';
  if (kind === 'cancel') return 'UI_CANCEL';
  if (kind === 'tab') return 'UI_TAB';
  if (kind === 'nav') return 'UI_NAV';
  if (el.matches('input[type="range"]')) return null;
  if (el.hasAttribute('data-primary')) return 'UI_CONFIRM';
  if (CANCEL_WORDS.test((el.textContent ?? '').trim())) return 'UI_CANCEL';
  return 'UI_NAV';
}

export function installUiSounds(doc: Document): () => void {
  let hovered: Element | null = null;
  let keyboard = false;

  const over = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const el = (e.target as Element | null)?.closest?.(`${INTERACTIVE}, [data-sfx-hover]`) ?? null;
    if (el === hovered) return;
    hovered = el;
    if (!el || (el as HTMLButtonElement).disabled || (el as HTMLElement).dataset.sfx === 'none-hover') return;
    gameEvents.emit((el as HTMLElement).dataset.sfxHover === 'card' ? 'CARD_HOVER' : 'UI_HOVER');
  };

  const click = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
    if (!el || el.matches('select')) return;
    const cue = clickCue(el);
    if (cue) gameEvents.emit(cue);
  };

  // disabled buttons get no click; the pointer still lands on them
  const down = (e: PointerEvent) => {
    keyboard = false;
    const el = (e.target as Element | null)?.closest?.('button, [aria-disabled="true"]') as HTMLButtonElement | null;
    if (el && (el.disabled || el.getAttribute('aria-disabled') === 'true')) gameEvents.emit('UI_DENIED');
  };

  const change = (e: Event) => {
    if ((e.target as Element).matches('select')) gameEvents.emit('UI_NAV');
  };

  const key = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key.startsWith('Arrow')) keyboard = true;
  };

  const focus = (e: FocusEvent) => {
    if (!keyboard) return;
    const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
    if (el) gameEvents.emit('UI_HOVER');
  };

  // an error message appearing anywhere
  const seen = new WeakSet<Element>();
  const alerts = new MutationObserver((records) => {
    for (const r of records)
      for (const n of r.addedNodes) {
        if (!(n instanceof Element)) continue;
        const el = n.matches('[role="alert"]') ? n : n.querySelector('[role="alert"]');
        // data-sfx="none": the component already made its own sound
        if (el && !seen.has(el) && el.textContent?.trim() && (el as HTMLElement).dataset.sfx !== 'none') {
          seen.add(el);
          gameEvents.emit('UI_ERROR');
          return;
        }
      }
  });
  alerts.observe(doc.body, { childList: true, subtree: true });

  doc.addEventListener('pointerover', over, true);
  doc.addEventListener('click', click, true);
  doc.addEventListener('pointerdown', down, true);
  doc.addEventListener('change', change, true);
  doc.addEventListener('keydown', key, true);
  doc.addEventListener('focusin', focus, true);
  return () => {
    alerts.disconnect();
    doc.removeEventListener('pointerover', over, true);
    doc.removeEventListener('click', click, true);
    doc.removeEventListener('pointerdown', down, true);
    doc.removeEventListener('change', change, true);
    doc.removeEventListener('keydown', key, true);
    doc.removeEventListener('focusin', focus, true);
  };
}
