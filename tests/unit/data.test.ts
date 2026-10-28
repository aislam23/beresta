import { describe, it, expect } from 'vitest';
import { complex, heroNums, nav } from '../../src/data/complex';
import { flats, bookingLabel } from '../../src/data/flats';
import { houses } from '../../src/data/houses';
import { places } from '../../src/data/area';
import { audiences } from '../../src/data/audiences';
import { faq } from '../../src/data/faq';
import { buyOptions } from '../../src/data/buy';
import { developerNums } from '../../src/data/developer';
import { budgetOptions, purchaseOptions } from '../../src/data/pickOptions';

describe('данные', () => {
  it('квартир в корпусах столько же, сколько в комплексе', () => {
    expect(houses.reduce((s, h) => s + h.units, 0)).toBe(complex.units);
    expect(complex.units).toBe(490);
  });
  it('пять типов квартир, подпись брони', () => {
    expect(flats.map((f) => f.id)).toEqual(['studio', 'one', 'two', 'three', 'penthouse']);
    const p = flats.find((f) => f.id === 'penthouse')!;
    expect(bookingLabel(p)).toBe('Пентхаус · от 33 млн ₽');
  });
  it('количество карточек совпадает с прототипом', () => {
    expect(heroNums).toHaveLength(4);
    expect(places).toHaveLength(8);
    expect(audiences).toHaveLength(4);
    expect(faq).toHaveLength(5);
    expect(buyOptions).toHaveLength(6);
    expect(developerNums).toHaveLength(4);
    expect(budgetOptions).toHaveLength(5);
    expect(purchaseOptions).toHaveLength(6);
    expect(nav.map((n) => n.href)).toEqual(['#area', '#yard', '#flats', '#buy', '#dev']);
  });
  it('в данных нет длинного тире', () => {
    const modules = import.meta.glob('../../src/data/*.ts', { eager: true });
    expect(Object.keys(modules).length).toBeGreaterThan(0);
    for (const [path, mod] of Object.entries(modules)) {
      expect(JSON.stringify(mod), path).not.toContain('—');
    }
  });
});

describe('одни и те же факты совпадают в разных блоках', () => {
  const nb = (s: string) => s.replace(/ /g, ' ');
  it('цифры первого экрана совпадают с блоком «Район» и ценой студии', () => {
    const byTitle = (t: string) => places.find((d) => d.title === t)!;
    expect([heroNums[0].value, heroNums[0].unit]).toEqual([byTitle('Сосновый бор').value, byTitle('Сосновый бор').unit]);
    expect([heroNums[1].value, heroNums[1].unit]).toEqual([byTitle('Центр Казани').value, byTitle('Центр Казани').unit]);
    expect([heroNums[2].value, heroNums[2].unit]).toEqual([byTitle('Станция метро').value, byTitle('Станция метро').unit]);
    expect(heroNums[3].value).toBe(flats.find((f) => f.id === 'studio')!.priceFrom);
  });
  it('готовность корпуса 1 одинакова в карточке и в ответе FAQ', () => {
    const h1 = houses.find((h) => h.n === 1)!;
    expect(nb(h1.status)).toContain(`${h1.readiness}%`);
    expect(nb(faq[0].a)).toContain(`Корпус 1 готов на ${h1.readiness}%`);
  });
});
