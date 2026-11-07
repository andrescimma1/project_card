/**
 * The rules engine returns some messages as plain (Spanish) strings: deck validation, fusion, trade,
 * relics. The engine is not changed; this recognises each of its messages and gives the text of the
 * current language and our vocabulary (i18n locales <lang>/game.ts). Unknown messages pass through.
 */
import { TERMS } from '../ui/vocab/terms';
import { m } from '.';

type Rule = [RegExp, (g: string[]) => string];

function rules(): Rule[] {
  const G = m().game;
  const T = TERMS;
  return [
    [/^El mazo debe tener (\d+) cartas \(tiene (\d+)\)\.$/, ([n, has]) => G.deck.size(+n, +has)],
    [/^Carta desconocida: (.+)\.$/, ([id]) => G.deck.unknownCard(id)],
    [/^Más de (\d+) copias de (.+)\.$/, ([n, name]) => G.deck.tooMany(+n, name)],
    [/^El mazo necesita cartas Digimon\.$/, () => G.deck.needsCreatures(T.creatures.toLowerCase())],
    [/^Mazo (\d+) inválido: (.*)$/, ([k, why]) => G.deck.invalid(k, why.split(/(?<=\.) /).map((x) => localizeMessage(x)).join(' '))],
    [/^Acción ilegal en la fase "([^"]+)"/, ([phase]) => G.illegalAction(phase)],
    [/^Esa carta no se puede fusionar\.$/, () => G.fusion.cannot],
    [/^Esta tienda no fusiona cartas de ese nivel\.$/, () => G.fusion.level],
    [/^No te quedan copias libres: las demás están en un mazo\.$/, () => G.fusion.noFreeCopies],
    [/^Ya tienes el máximo de esa carta\.$/, () => G.fusion.maxed],
    [/^Las cartas Armor solo aparecen por Digi-Egg\.$/, () => G.story.eggOnly(T.levels.A, T.egg.toLowerCase())],
    [/^El mazo ya tiene (\d+) cartas\.$/, ([n]) => G.deck.full(+n)],
    [/^Máximo (\d+) copias por mazo\.$/, ([n]) => G.story.maxCopiesPerDeck(+n)],
    [/^Solo tienes (\d+) de esa carta\.$/, ([n]) => G.story.youOnlyHave(+n)],
    [/^Solo tienes (\d+) de (.+)\.$/, ([n, name]) => G.story.youOnlyHaveOf(+n, name)],
    [/^Esa Digi-Part no la tienes\.$/, () => G.parts.notOwned(T.part.toLowerCase())],
    [/^Esa Digi-Part ya está equipada\.$/, () => G.parts.equipped(T.part.toLowerCase())],
    [/^Cada compañero lleva (\d+) Digi-Parts como máximo\.$/, ([n]) => G.parts.max(+n, T.partner.toLowerCase(), T.parts.toLowerCase())],
    [/^No se puede repetir el tipo de Digi-Part en un compañero\.$/, () => G.parts.sameType(T.part.toLowerCase(), T.partner.toLowerCase())],
    [/^Ese Digi-Egg no lo tienes\.$/, () => G.parts.noEgg(T.egg.toLowerCase())],
    [/^No se puede intercambiar con la misma partida\.$/, () => G.trade.sameSave],
    [/^El intercambio está desactivado\.$/, () => G.trade.disabled],
    [/^El jugador (\d) todavía no puede intercambiar\.$/, ([k]) => G.trade.playerLocked(+k)],
    [/^Esta carta no está identificada\.$/, () => G.trade.unidentified],
    [/^Esta carta no se puede intercambiar\.$/, () => G.trade.cannot],
    [/^Solo puedes ofrecer (\d+) cartas\.$/, ([n]) => G.trade.maxOffer(+n)],
    [/^No puedes transferir más copias de esta carta\.$/, () => G.trade.noMoreCopies],
    [/^No se puede intercambiar 0 cartas\.$/, () => G.trade.nothing],
  ];
}

export function localizeMessage(msg: string): string;
export function localizeMessage(msg: string | null): string | null;
export function localizeMessage(msg: string | null): string | null {
  if (!msg) return msg;
  for (const [re, fn] of rules()) {
    const hit = re.exec(msg);
    if (hit) return fn(hit.slice(1));
  }
  return msg;
}
