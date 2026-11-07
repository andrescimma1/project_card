/**
 * Lift the logic of the 12 cities from the original scripts (copied from your disc by
 * `npm run extract:scripts`) into public/story/CITYxx.json: jumps, flags, menus, battles and rewards,
 * without any of the game's text. Our own dialogue is written in src/story/own/texts.
 *   npx tsx tools/lift-scripts.ts [folder for the authoring sheets]
 * The authoring sheets list each run of dialogue with the original text, to know what each one is
 * about while writing ours: they contain the game's dialogue, so write them outside the repository.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lift, type LogicItem } from '../src/story/own/ir';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sheets = process.argv[2];
const out = join(root, 'public', 'story');
mkdirSync(out, { recursive: true });
if (sheets) mkdirSync(sheets, { recursive: true });

/** Lines that every city repeats, written once in our texts (key = shared text). Matched by the original text. */
const SHARED: [RegExp, string][] = [
  [/^Battle Arena is closed for now\.\/Please come back later\.$/, 'arenaClosed'],
  [/^Battle Arena is now open!\/Those ready to rumble, come on down!$/, 'arenaOpen'],
  [/^Are you sure you want to\/enter Battle Arena\?$/, 'enterArena'],
  [/^Are you sure you want to\/enter Extra Arena\?$/, 'enterExtraArena'],
  [/^Are you sure you want to\/leave the Arena\?$/, 'leaveArena'],
  [/^Congratulations on winning!$/, 'congrats'],
  [/^We look forward to seeing you again\.$/, 'farewell'],
  [/^Who do you want to talk to\?$/, 'whoTalk'],
  [/^Where do you want to go\?\/Push \*b1 to go to map\.$/, 'whereGo'],
  [/^Pick a Menu Option\.$/, 'pickOption'],
];

const flat = (pages: string[][]) =>
  pages
    .map((p) => p.map((l) => l.replace(/\*c[0-9a-f]/gi, '').trim()).join('/'))
    .join('//')
    .replace(/\s*\/\s*/g, '/');

for (let city = 0; city < 12; city++) {
  const name = `CITY${String(city).padStart(2, '0')}`;
  const bytes = new Uint8Array(readFileSync(join(root, 'public', 'scripts', `${name}.MSD`)));
  const { logic, texts } = lift(bytes);
  const sheet: string[] = [];
  for (const it of logic.code) {
    if (it[0] !== 'u') continue;
    const u = it as Extract<LogicItem, ['u', ...unknown[]]>;
    const key = SHARED.find(([re]) => re.test(flat(texts[u[1]])))?.[1];
    if (key) u[4] = key;
    sheet.push(`## ${u[1]} ${u[2]}${u[3] ? ` [${u[3]}]` : ''}${key ? ` = ${key}` : ''}`, ...texts[u[1]].map((p) => '  ' + p.join(' / ')), '');
  }
  writeFileSync(join(out, `${name}.json`), JSON.stringify(logic));
  if (sheets) writeFileSync(join(sheets, `${name}.md`), sheet.join('\n'));
  const units = logic.code.filter((x) => x[0] === 'u').length;
  console.log(`${name}: ${logic.code.length} items, ${units} runs of dialogue`);
}
