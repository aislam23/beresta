export type Tone = 'plain' | 'pine' | 'copper';

export interface Num {
  value: string;
  unit?: string;
  label: string;
  tone: Tone;
}

export const complex = {
  name: 'Береста',
  city: 'Казань',
  streetAddress: 'ул. Сосновая, 12',
  address: 'Казань, ул. Сосновая, 12',
  phone: { display: '+7 843 000-12-12', href: 'tel:+78430001212' },
  developer: 'СК «Высота-16»',
  tagline: 'Жилой комплекс у соснового бора и реки',
  disclaimer:
    'Учебный проект. Жилой комплекс, застройщик, адрес, телефон и цифры вымышлены. Заявки с сайта никуда не отправляются.',
  units: 490,
} as const;

export const nav = [
  { href: '#area', label: 'Район' },
  { href: '#yard', label: 'Двор' },
  { href: '#flats', label: 'Квартиры' },
  { href: '#buy', label: 'Как купить' },
  { href: '#dev', label: 'Застройщик' },
] as const;

export const heroNums: Num[] = [
  { value: '200', unit: 'м', label: 'до соснового бора', tone: 'plain' },
  { value: '15', unit: 'мин', label: 'до центра на машине', tone: 'pine' },
  { value: '9', unit: 'мин', label: 'пешком до метро', tone: 'plain' },
  { value: '6,6', unit: 'млн ₽', label: 'цена студии от', tone: 'copper' },
];
