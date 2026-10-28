export type PlaceId = 'forest' | 'river' | 'metro' | 'school' | 'kids' | 'clinic' | 'mall' | 'center';

/**
 * Места на карте района. Расстояния из брифа; у садов, поликлиники и ТЦ расстояний в брифе нет.
 * x, y — где точка стоит на картинке 08-area-map, в процентах от ширины и высоты.
 */
export interface Place {
  id: PlaceId;
  title: string;
  value?: string;
  unit?: string;
  text: string;
  x: number;
  y: number;
}

/** Где на карте сами дома: отсюда начинается маршрут до места. */
export const home = { x: 45, y: 42 };

export const places: Place[] = [
  { id: 'forest', title: 'Сосновый бор', value: '200', unit: 'м', text: 'Три минуты пешком, можно гулять с коляской каждый день', x: 14, y: 22 },
  { id: 'river', title: 'Набережная реки', value: '350', unit: 'м', text: 'Свой выход к реке, вдоль неё 6 км велодорожки', x: 34, y: 62.5 },
  { id: 'metro', title: 'Станция метро', value: '9', unit: 'мин', text: 'Пешком от подъезда до станции', x: 88.5, y: 10.5 },
  { id: 'school', title: 'Школа на 1 100 мест', value: '5', unit: 'мин', text: 'Пешком от подъезда', x: 82.5, y: 42.5 },
  { id: 'kids', title: 'Два детских сада', text: 'Рядом со школой, уже работают', x: 78.5, y: 27.5 },
  { id: 'clinic', title: 'Поликлиника', text: 'Уже работает', x: 55, y: 14 },
  { id: 'mall', title: 'ТЦ «Сосны»', text: 'Уже работает', x: 84.5, y: 65 },
  { id: 'center', title: 'Центр Казани', value: '15', unit: 'мин', text: 'На машине, на общественном транспорте 25 минут', x: 97.5, y: 29 },
];
