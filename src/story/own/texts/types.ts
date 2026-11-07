/**
 * Our dialogue for a run of a city script. Lines are separated by "\n" and pages by a blank line.
 * In a run that stays on screen (a question before a menu) the last page is the question.
 * Text may use the script codes: *cN colour (7 = default), *h0 the player's name, *b1 a button.
 *
 * `who`: left out = the character who talks there in the city logic; 'me' = the player; null = nobody
 * (a notice, a deck description).
 */
export interface Written {
  who?: string | null;
  es: string;
  en: string;
}

export type CityTexts = Record<string, Written>;
