export type PlanType = 'studio' | 'one' | 'two' | 'three' | 'penthouse';

export interface Flat {
  id: PlanType;
  title: string;
  area: string;
  priceFrom: string;
  feature: string;
  dark?: boolean;
}

export const flats: Flat[] = [
  { id: 'studio', title: 'Студия', area: '26–31 м²', priceFrom: '7,6', feature: 'Кухня-ниша и французский балкон' },
  { id: 'one', title: '1-комнатная', area: '38–44 м²', priceFrom: '10,4', feature: 'Кухня-гостиная 16 м²' },
  { id: 'two', title: '2-комнатная', area: '56–64 м²', priceFrom: '14,5', feature: 'Мастер-спальня с гардеробной' },
  { id: 'three', title: '3-комнатная', area: '78–88 м²', priceFrom: '19,7', feature: 'Две ванные, окна на две стороны' },
  { id: 'penthouse', title: 'Пентхаус', area: '118–140 м²', priceFrom: '34', feature: 'Терраса 40 м², потолки 3,6 м. Только в корпусе 3', dark: true },
];

/** Подпись в окне брони. Пробелы обычные: строка же уходит в заявку. */
export const bookingLabel = (f: Flat) => `${f.title} · от ${f.priceFrom} млн ₽`;

export const flatsNotes = [
  { tone: 'copper' as const, title: 'Бронь онлайн за 15 000 ₽', text: 'Квартиру снимаем с продажи на 7 дней. Сумма войдёт в стоимость квартиры. Если передумаете, деньги вернём.' },
  { tone: 'pine' as const, title: 'Машино-место от 1,9 млн ₽', text: 'Подземный паркинг на 320 мест. Кладовки в подвале от 4 м².' },
];
