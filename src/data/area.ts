export interface Distance { value: string; unit: string; title: string; text: string }

export const distances: Distance[] = [
  { value: '200', unit: 'м', title: 'Сосновый бор', text: 'Три минуты пешком, можно гулять с коляской каждый день' },
  { value: '350', unit: 'м', title: 'Набережная реки', text: 'Свой выход к реке, вдоль неё 6 км велодорожки' },
  { value: '9', unit: 'мин', title: 'Станция метро', text: 'Пешком от подъезда до станции' },
  { value: '5', unit: 'мин', title: 'Школа на 1 100 мест', text: 'Пешком, рядом два детских сада' },
  { value: '15', unit: 'мин', title: 'Центр Казани', text: 'На машине, на общественном транспорте 25 минут' },
];
