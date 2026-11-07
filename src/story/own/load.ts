/** Load a city of our own story: its logic (public/story/CITYnn.json) plus our dialogue in the current language. */
import { getLocale } from '../../i18n';
import type { CityLogic } from './ir';
import { buildCity } from './source';

export async function loadOwnCity(city: number): Promise<Uint8Array> {
  const res = await fetch(`/story/CITY${String(city).padStart(2, '0')}.json`);
  if (!res.ok) throw new Error(`city ${city}: ${res.status}`);
  return buildCity(city, (await res.json()) as CityLogic, getLocale());
}
