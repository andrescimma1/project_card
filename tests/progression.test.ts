/**
 * Progression tables extracted from the user's disc (npm run extract:progression → src/data/progression.json).
 * Locations and formats: docs/research/07-progresion.md and docs/research/progresion/.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { progression as T } from '../src/engine/progression/tables';
import { decodeProgressionTables } from '../src/engine/progression/decodeTables';
import { readDrvFile } from '../tools/extract/drv';

describe('packs (SLUS 0x8006E35C, 16 × 18 bytes)', () => {
  it('has the 16 packs in table order', () => {
    expect(T.packs.map((p) => p.name)).toEqual([
      'Basic Pack', 'Hyper Pack', 'Super Pack', 'Great Pack', 'Red Pack', 'Blue Pack', 'Green Pack', 'Black Pack',
      'Yellow Pack', 'Option Pack', 'S-Red Pack', 'S-Blue Pack', 'S-Green Pack', 'S-Black Pack', 'S-Yellow Pack', 'S-Option Pack',
    ]);
  });

  it('per specialty [U/A, C, R] bounds, then Option max/min and the rare window (signed)', () => {
    expect(T.packs[0].params).toEqual([0, 13, 99, 0, 14, 99, 0, 12, 99, 0, 13, 99, 0, 13, 99, 0, 0, 1]);
    expect(T.packs[3].params.slice(0, 3)).toEqual([34, -18, 0]);
    expect(T.packs[15].params.slice(15)).toEqual([29, 10, 6]);
  });
});

describe('fusion (EVOSEG)', () => {
  it('specialty mix table 6×6 (0 Fire … 4 Rare, 5 Option)', () => {
    expect(T.fusion.mix).toEqual([
      [5, 2, 3, 4, 1, 0],
      [2, 5, 4, 0, 2, 1],
      [3, 4, 5, 1, 3, 2],
      [4, 0, 1, 5, 0, 3],
      [1, 2, 3, 0, 5, 4],
      [0, 1, 2, 3, 4, 5],
    ]);
  });

  it('result id ranges per category', () => {
    expect(T.fusion.ranges).toEqual([[0, 33], [34, 68], [69, 102], [103, 138], [139, 171], [191, 272], [294, 300]]);
  });

  it('20 special fusions, e.g. WarGreymon + MetalGarurumon = Omnimon', () => {
    expect(T.fusion.specials).toHaveLength(20);
    expect(T.fusion.specials[2]).toMatchObject({ a: 2, b: 37, result: 1 });
    expect(T.fusion.specials[17]).toMatchObject({ a: 12, b: 117, result: 4 });
  });

  it('Partner Fusion: 5 card → Digi-Part combos per partner, in EVOSEG partner order', () => {
    expect(T.fusion.partnerOrder).toEqual([175, 182, 190, 183, 184, 187]);
    expect(T.fusion.partnerFusion[0][0]).toEqual({ card: 0, part: 9 });
    expect(T.fusion.partnerFusion[5][4]).toEqual({ card: 79, part: 35 });
  });
});

describe('partners and Digi-Parts', () => {
  it('starting Digi-Part and the 5 starting card pairs of each starter partner', () => {
    expect(T.partners.initialPart).toEqual([10, 15, 0, 38, 100, 20]);
    expect(T.partners.starterPairs[0]).toEqual([[11, 116], [25, 131], [28, 137], [31, 138], [249, 258]]);
    expect(T.partners.starterPairs[2][4]).toEqual([251, 259]);
  });

  it('128 Digi-Parts with effect, value and learning level per partner (SLUS order, -1 never)', () => {
    expect(T.digiParts).toHaveLength(128);
    expect(T.digiParts[0]).toMatchObject({ name: 'HP+50.', type: 0, value: 50 });
    expect(T.digiParts[109]).toMatchObject({ type: 7, b2: 28, b3: 1, value: 1000, speed: 1 });
    expect(T.digiParts[127]).toMatchObject({ type: 8, b1: 1, levels: [-1, 90, 99, 96, 70, -1] });
    expect(T.digiParts[60].text).toContain('Tripled');
  });

  it('support templates: 18 conditions and 36 actions (1-based in the part record)', () => {
    expect(T.supportTemplates.conditions).toHaveLength(18);
    expect(T.supportTemplates.actions).toHaveLength(36);
    expect(T.supportTemplates.conditions[0].operands[0].ref?.id).toBe(2);
  });

  it('rank titles (SLUS 0x8006E058/78/98), collector category sizes (0x8006E0B8) and the 36 final titles (ENDSEG)', () => {
    expect(T.ranks.tamer[0]).toBe('Beginner Tamer');
    expect(T.ranks.collector[7]).toBe('Legendary Collector');
    expect(T.ranks.battle2p[7]).toBe('Battle Emperor');
    expect(T.ranks.categorySizes).toEqual([34, 35, 34, 36, 33, 110]);
    expect(T.finalTitles).toHaveLength(36);
    expect([T.finalTitles[0], T.finalTitles[26], T.finalTitles[35]]).toEqual(['Emperor Cassiopeia', 'Red Knight', 'Jamming King']);
  });

  it('city names (OPENSEG 0x801F0684) and 4 arena names per city (0x801F06D4)', () => {
    expect(T.world.cities).toHaveLength(12);
    expect([T.world.cities[0], T.world.cities[11]]).toEqual(['Beginner City', 'Infinity Tower']);
    expect(T.world.arenas[2]).toEqual(['Jungle Arena', 'Extra Arena', 'Beet Arena', '']);
    expect(T.world.arenas[5][3]).toBe('Haunted Arena');
  });

  it('the 10 keywords Wizardmon accepts (SAISEG 0x801F36E0), in index order', () => {
    expect(T.world.keywords).toHaveLength(10);
    expect([T.world.keywords[0], T.world.keywords[9]]).toEqual(['OMNIMON-1', 'JIJIMON']);
  });

  it('32 EXP bonuses; Lucky Name is in the table', () => {
    expect(T.bonuses).toHaveLength(32);
    expect(T.bonuses[30]).toMatchObject({ id: 30, exp: 1, name: 'Lucky Name' });
    expect(T.bonuses[31]).toMatchObject({ exp: 10, name: 'Super Bonus' });
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'P.DRV')))('re-decode from the disc', () => {
  it('matches the committed JSON', () => {
    const p = join(disc!, 'P.DRV');
    const tables = decodeProgressionTables(new Uint8Array(readFileSync(join(disc!, 'SLUS_013.28'))), {
      KAWSEG: readDrvFile(p, 'KAWSEG.BIN'),
      EVOSEG: readDrvFile(p, 'EVOSEG.BIN'),
      OPENSEG: readDrvFile(p, 'OPENSEG.BIN'),
      ENDSEG: readDrvFile(p, 'ENDSEG.BIN'),
      SAISEG: readDrvFile(p, 'SAISEG.BIN'),
    });
    expect(tables).toEqual(T);
  });
});
