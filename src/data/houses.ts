export interface House {
  n: number;
  floors: number;
  units: number;
  due: string;
  status: string;
  /** Готовность в процентах, если известна из брифа. */
  readiness?: number;
  /** Сколько из 5 делений шкалы закрашено. */
  steps?: number;
  stepLabels?: [string, string, string];
}

export const houses: House[] = [
  { n: 1, floors: 9, units: 126, due: 'IV кв. 2026', status: 'Готовность 95%. Идёт благоустройство двора.', readiness: 95 },
  { n: 2, floors: 12, units: 168, due: 'II кв. 2027', status: 'Отделывают фасад.', steps: 3, stepLabels: ['каркас', 'фасад', 'сдача'] },
  { n: 3, floors: 14, units: 196, due: 'IV кв. 2027', status: 'Старт продаж по начальным ценам. Пентхаусы есть только в этом доме.', steps: 1, stepLabels: ['старт', 'фасад', 'сдача'] },
];
