export type YardIconName = 'parking' | 'playground' | 'lobby' | 'storage';

export interface YardFeature { icon: YardIconName; title: string; text: string }

export const yardFeatures: YardFeature[] = [
  { icon: 'parking', title: 'Подземный паркинг на 320 мест', text: 'Машино-место стоит от 1,9 млн ₽.' },
  { icon: 'playground', title: 'Площадки для всех возрастов', text: 'Отдельно для малышей и для детей постарше. Рядом воркаут-зона и место для барбекю.' },
  { icon: 'lobby', title: 'Лобби с консьержем', text: 'Входная группа высотой 5 метров. Колясочная и велосипедная на первом этаже каждого подъезда.' },
  { icon: 'storage', title: 'Кладовки от 4 м²', text: 'В подвале. Туда помещаются зимние шины и санки.' },
];

export const groundFloor = ['Кофейня', 'Пекарня', 'Пункт выдачи', 'Частный детский сад'];
