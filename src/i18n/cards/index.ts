/** Card texts by language (src/i18n/cards/<lang>.ts), keyed by the original text of the disc. */
import type { Locale } from '..';
import { cardTexts as en } from './en';
import { cardTexts as es } from './es';

export const CARD_TEXTS: Record<Locale, Record<string, string>> = { es, en };
