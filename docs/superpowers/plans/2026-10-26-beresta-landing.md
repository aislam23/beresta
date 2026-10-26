# ЖК «Береста»: план реализации лендинга

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать на Astro 7 и опубликовать на GitHub Pages одностраничный лендинг ЖК «Береста», который повторяет утверждённый прототип v3 и использует 6 кадров, сгенерированных через Codex, с одним и тем же домом на всех.

**Architecture:** Статическая сборка Astro без UI-фреймворков. Все факты лежат в типизированных модулях `src/data/*`. Секции оформлены как отдельные `.astro`-компоненты со scoped-стилями, перенесёнными из прототипа. Клиентский JS есть только у форм и окна брони. Логика заявок (`phone.ts`, `leads.ts`) покрыта юнит-тестами, страница покрыта e2e-тестами Playwright, которые сверяют тексты с прототипом.

**Tech Stack:** Astro 7.4, TypeScript strict, Fonts API Astro + Fontsource (Manrope), `astro:assets` (`<Picture>`), Vitest 5, Playwright 1.64, sharp, Codex CLI (генерация картинок), GitHub Actions + Pages.

**Спека:** [docs/superpowers/specs/2026-10-26-beresta-landing-design.md](../specs/2026-10-26-beresta-landing-design.md). **Прототип (источник правды для вёрстки и текстов):** [docs/prototype/prototype-v3.html](../../prototype/prototype-v3.html).

---

## Общие правила для всех задач

Прочитай это перед любой задачей.

1. **Тексты переносятся из прототипа дословно.** Не придумывай новые фразы. Если для alt, aria-label или сообщения нужен новый текст, он уже есть в этом плане, бери его оттуда.
2. **Никаких плашек над заголовками:** без `.eyebrow`, `.tag`, `.pill`, бейджей. В прототипе остались CSS-правила `.eyebrow`, `.tag`, `.pill`. **Их не переносить.**
3. **Никаких длинных тире «—» в видимом тексте.** Диапазоны пишутся через короткое «–» (`3–5`, `26–31 м²`).
4. **CSS переносится из прототипа** по указанным в задаче строкам `docs/prototype/prototype-v3.html` в `<style>` компонента (стили Astro scoped). Медиа-запросы из строк 227–249 разносятся по компонентам: каждая задача перечисляет свои правила. Стили для элементов, которые рендерит **дочерний** компонент (например `<img>` внутри `Photo`), пишутся через `:global(...)`.
5. **Контраст AA:** везде, где в прототипе текст лежит на `var(--copper)`, ставь фон `var(--copper-strong)` и белый текст `#fff`, включая подписи (вместо `#F7E8D8`). У `.demo` цвет `#B5C3B1`.
6. **Неразрывные пробелы:** `&nbsp;` между числом и единицей там, где они стоят в тексте (`15&nbsp;минутах`, `6,6&nbsp;млн&nbsp;₽`), и в `лес за&nbsp;окном`. В данных из `src/data/*` используй символ ` `.
7. **Ссылки** внутри страницы только якорные (`#area`). Файлы из `public/` подключаются через `withBase()` из `src/lib/url.ts`.
8. Команды выполняются из корня репозитория `/Users/macbook/Desktop/beresta`. Ветка `feat/landing`.
9. Перед коммитом каждой задачи прогоняй `npm run check && npm run test`, а с задачи 5 ещё `npm run test:e2e`. Всё должно быть зелёным. Перед `test:e2e` останови `npm run dev`, если он запущен: Playwright переиспользует сервер на порту 4321 и проверит не ту сборку.
10. Коммиты на русском, в конце строка `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
11. **Специфичность scoped-стилей.** Astro добавляет к селекторам атрибут (`.photo[data-astro-cid-…]`, специфичность 0,2,0). Поэтому, когда родитель переопределяет стиль дочернего компонента, селектор пишется **с классом родителя**: `.hero :global(.hero-photo)`, а не просто `:global(.hero-photo)`. Иначе правило молча проиграет.
12. **`hidden`.** В `tokens.css` есть `[hidden] { display: none !important; }`. Не задавай `display: none` элементам, которые показываются через `hidden = false`.

### Порядок и параллельность

- Задачи 1–20 (код) идут последовательно, одна за другой.
- Задачи 21–23 (картинки) выполняет **координатор, а не субагент**, потому что в них есть контрольные точки с Артёмом. Они идут **параллельно** с задачами 6–20, но **в отдельном worktree**, чтобы коммиты не смешивались и не ловили `index.lock`:
  ```bash
  git worktree add ../beresta-images -b feat/images feat/landing   # после задачи 6
  ```
  В worktree трогаются только `docs/images/`, `scripts/`, `src/assets/photos/*.png`, `public/og.jpg`. Перед задачей 24 координатор мержит: `git -C /Users/macbook/Desktop/beresta merge --no-ff feat/images` (в паузе между задачами субагентов), затем `git worktree remove ../beresta-images`. Точки кадрирования (`focus` в `src/assets/photos/index.ts`) настраиваются уже после мержа, в задаче 25. Задача 21 нужна до 22, задача 22 нужна до 23.
- Задачи 24–25 идут в конце.

### Карта файлов

```
astro.config.mjs  package.json  tsconfig.json  vitest.config.ts  playwright.config.ts
src/pages/index.astro
src/layouts/Base.astro
src/styles/tokens.css  src/styles/global.css
src/data/complex.ts  area.ts  yard.ts  audiences.ts  flats.ts  houses.ts  buy.ts  developer.ts  faq.ts  pickOptions.ts
src/lib/phone.ts  leads.ts  forms.ts  url.ts
src/assets/photos/index.ts  (+ 01-hero.png … 06-construction.png из задач 22–23)
src/components/Header Footer MobileBar Logo BarkDivider Section NumCard Photo PlaceholderScene
               Hero Area AreaMap Yard YardIcon Audiences Flats FlatCard FloorPlan Houses Buy
               Developer Faq PickForm BookingDialog  (.astro)
tests/unit/phone.test.ts  leads.test.ts  data.test.ts
tests/e2e/copy.ts  helpers.ts  page.spec.ts  sections.spec.ts  forms.spec.ts
docs/images/building-bible.md  shots.md
scripts/gen-image.sh  pick-take.sh  make-og.mjs
public/og.jpg  public/favicon.svg
.github/workflows/ci.yml  deploy.yml
```

---

### Task 1: Каркас Astro и инструменты

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `src/pages/index.astro`, `tests/e2e/page.spec.ts`, `tests/unit/smoke.test.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Ветка**

```bash
git checkout -b feat/landing
```

- [ ] **Step 2: package.json**

```json
{
  "name": "beresta",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: Зависимости**

```bash
npm install astro@7.4.2 sharp
npm install -D @astrojs/check typescript vitest @playwright/test
npx playwright install chromium
```

Expected: в `package.json` появились `dependencies` и `devDependencies`, создан `package-lock.json`.

- [ ] **Step 4: astro.config.mjs**

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://aislam23.github.io',
  base: '/beresta',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['cyrillic', 'latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
```

Если `astro build` ругается на ключ `fonts`, сверь синтаксис с документацией (context7, библиотека `/withastro/docs`, запрос «fonts fontsource»). Не отключай шрифты.

- [ ] **Step 5: tsconfig.json, vitest.config.ts, playwright.config.ts**

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
});
```

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:4321/beresta/';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
});
```

- [ ] **Step 6: .gitignore** (дописать)

```
test-results/
playwright-report/
src/assets/photos/takes/
```

- [ ] **Step 7: Падающие смоук-тесты**

`tests/unit/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('vitest работает', () => expect(1 + 1).toBe(2));
});
```

`tests/e2e/page.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('страница открывается по base /beresta/', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('ЖК «Береста» в Казани: квартиры у соснового бора');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
});
```

Run: `npm run test:e2e`
Expected: FAIL, страницы ещё нет.

- [ ] **Step 8: Временная страница**

`src/pages/index.astro`:
```astro
---
---
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>ЖК «Береста» в Казани: квартиры у соснового бора</title>
  </head>
  <body><p>Береста</p></body>
</html>
```

- [ ] **Step 9: Проверка**

Run: `npm run check && npm run test && npm run test:e2e`
Expected: `astro check` 0 errors, vitest 1 passed, playwright 2 passed (desktop + mobile).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Каркас Astro, Vitest и Playwright

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Данные из брифа

Все факты страницы. Строки взяты из прототипа v3 дословно. ` ` означает неразрывный пробел.

**Files:**
- Create: `src/data/complex.ts`, `area.ts`, `yard.ts`, `audiences.ts`, `flats.ts`, `houses.ts`, `buy.ts`, `developer.ts`, `faq.ts`, `pickOptions.ts`
- Test: `tests/unit/data.test.ts`
- Delete: `tests/unit/smoke.test.ts`

- [ ] **Step 1: Падающий тест**

`tests/unit/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { complex, heroNums, nav } from '../../src/data/complex';
import { flats, bookingLabel } from '../../src/data/flats';
import { houses } from '../../src/data/houses';
import { distances } from '../../src/data/area';
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
    expect(distances).toHaveLength(5);
    expect(audiences).toHaveLength(4);
    expect(faq).toHaveLength(5);
    expect(buyOptions).toHaveLength(6);
    expect(developerNums).toHaveLength(4);
    expect(budgetOptions).toHaveLength(5);
    expect(purchaseOptions).toHaveLength(6);
    expect(nav.map((n) => n.href)).toEqual(['#area', '#yard', '#flats', '#buy', '#dev']);
  });
  it('в данных нет длинного тире', () => {
    const all = JSON.stringify({ complex, heroNums, flats, houses, distances, audiences, faq, buyOptions, developerNums });
    expect(all).not.toContain('—');
  });
});
```

Run: `npm run test`
Expected: FAIL, модулей нет.

- [ ] **Step 2: complex.ts**

```ts
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
```

- [ ] **Step 3: area.ts, yard.ts**

`src/data/area.ts`:
```ts
export interface Distance { value: string; unit: string; title: string; text: string }

export const distances: Distance[] = [
  { value: '200', unit: 'м', title: 'Сосновый бор', text: 'Три минуты пешком, можно гулять с коляской каждый день' },
  { value: '350', unit: 'м', title: 'Набережная реки', text: 'Свой выход к реке, вдоль неё 6 км велодорожки' },
  { value: '9', unit: 'мин', title: 'Станция метро', text: 'Пешком от подъезда до станции' },
  { value: '5', unit: 'мин', title: 'Школа на 1 100 мест', text: 'Пешком, рядом два детских сада' },
  { value: '15', unit: 'мин', title: 'Центр Казани', text: 'На машине, на общественном транспорте 25 минут' },
];
```

`src/data/yard.ts`:
```ts
export type YardIconName = 'parking' | 'playground' | 'lobby' | 'storage';

export interface YardFeature { icon: YardIconName; title: string; text: string }

export const yardFeatures: YardFeature[] = [
  { icon: 'parking', title: 'Подземный паркинг на 320 мест', text: 'Машино-место стоит от 1,9 млн ₽.' },
  { icon: 'playground', title: 'Площадки для всех возрастов', text: 'Отдельно для малышей и для детей постарше. Рядом воркаут-зона и место для барбекю.' },
  { icon: 'lobby', title: 'Лобби с консьержем', text: 'Входная группа высотой 5 метров. Колясочная и велосипедная на первом этаже каждого подъезда.' },
  { icon: 'storage', title: 'Кладовки от 4 м²', text: 'В подвале. Туда помещаются зимние шины и санки.' },
];

export const groundFloor = ['Кофейня', 'Пекарня', 'Пункт выдачи', 'Частный детский сад'];
```

- [ ] **Step 4: audiences.ts, flats.ts, houses.ts**

`src/data/audiences.ts`:
```ts
import type { ShotId } from '../assets/photos';

export interface Audience {
  shot: ShotId;
  tone: 'mist' | 'warm' | 'green' | 'dawn';
  alt: string;
  placeholder: string;
  title: string;
  text: string;
  fitTitle: string;
  fitText: string;
}

export const audiences: Audience[] = [
  {
    shot: '03-family', tone: 'warm',
    alt: 'Мама с коляской на тропинке в сосновом бору, за деревьями виден дом',
    placeholder: 'Кадр 03 · мама с коляской на тропинке в бору, дом на фоне',
    title: 'Семья с малышом',
    text: 'До бора 200 метров, с коляской можно гулять каждый день. Школа в пяти минутах пешком, рядом два детских сада.',
    fitTitle: '2-комнатная, 56–64 м²', fitText: 'семейная ипотека от 6%',
  },
  {
    shot: '04-workfromhome', tone: 'mist',
    alt: 'Рабочий стол у большого окна, за окном сосны и соседний корпус',
    placeholder: 'Кадр 04 · рабочий стол у окна с видом на сосны, утро',
    title: 'Работаю из дома',
    text: 'Кофейня на первом этаже, вдоль реки 6 км велодорожки. Если нужно в офис, до метро 9 минут пешком.',
    fitTitle: 'Студия или 1-комнатная', fitText: 'IT-ипотека от 6%',
  },
  {
    shot: '05-kitchen', tone: 'green',
    alt: 'Кухня-гостиная со светлым деревом и окнами на две стороны',
    placeholder: 'Кадр 05 · просторная кухня-гостиная, семья с подростками',
    title: 'Детям нужно по комнате',
    text: 'В трёхкомнатной две ванные, окна выходят на обе стороны дома. Старую квартиру можно зачесть через trade-in.',
    fitTitle: '3-комнатная, 78–88 м²', fitText: 'trade-in, паркинг от 1,9 млн ₽',
  },
  {
    shot: '06-construction', tone: 'dawn',
    alt: 'Корпус 3 строится, рядом башенный кран и готовые корпуса 1 и 2, рассвет',
    placeholder: 'Кадр 06 · корпус 3 на стадии строительства, кран, рассвет',
    title: 'Вложить деньги',
    text: 'Студии в корпусе 3 продаются по стартовым ценам. Дом сдаётся в IV квартале 2027 года, после этого квартиру можно продать или сдавать.',
    fitTitle: 'Студия от 6,6 млн ₽', fitText: 'рассрочка 0% до сдачи дома',
  },
];
```

`src/data/flats.ts`:
```ts
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
  { id: 'studio', title: 'Студия', area: '26–31 м²', priceFrom: '6,6', feature: 'Кухня-ниша и французский балкон' },
  { id: 'one', title: '1-комнатная', area: '38–44 м²', priceFrom: '9,4', feature: 'Кухня-гостиная 16 м²' },
  { id: 'two', title: '2-комнатная', area: '56–64 м²', priceFrom: '13,5', feature: 'Мастер-спальня с гардеробной' },
  { id: 'three', title: '3-комнатная', area: '78–88 м²', priceFrom: '18,7', feature: 'Две ванные, окна на две стороны' },
  { id: 'penthouse', title: 'Пентхаус', area: '118–140 м²', priceFrom: '33', feature: 'Терраса 40 м², потолки 3,6 м. Только в корпусе 3', dark: true },
];

/** Подпись в окне брони. Пробелы обычные: строка же уходит в заявку. */
export const bookingLabel = (f: Flat) => `${f.title} · от ${f.priceFrom} млн ₽`;

export const flatsNotes = [
  { tone: 'copper' as const, title: 'Бронь онлайн за 15 000 ₽', text: 'Квартиру снимаем с продажи на 7 дней. Сумма войдёт в стоимость квартиры. Если передумаете, деньги вернём.' },
  { tone: 'pine' as const, title: 'Машино-место от 1,9 млн ₽', text: 'Подземный паркинг на 320 мест. Кладовки в подвале от 4 м².' },
];
```

`src/data/houses.ts`:
```ts
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
```

- [ ] **Step 5: buy.ts, developer.ts, faq.ts, pickOptions.ts**

`src/data/buy.ts`:
```ts
export interface BuyOption { big?: string; title: string; text: string; accent?: boolean }

export const buyOptions: BuyOption[] = [
  { big: '6%', title: 'Семейная ипотека', text: 'Для семей с детьми.' },
  { big: '6%', title: 'IT-ипотека', text: 'Для сотрудников аккредитованных IT-компаний.' },
  { big: '0%', title: 'Рассрочка до сдачи дома', text: 'Первый взнос от 30%, остаток выплачиваете до сдачи дома без процентов.' },
  { title: 'Рыночная ипотека', text: 'В банках-партнёрах застройщика.' },
  { title: 'Trade-in', text: 'Старую квартиру зачтём в стоимость новой. Продавать её заранее самому не придётся.' },
  { title: 'Бронь онлайн', text: '15 000 ₽ на 7 дней. За это время можно спокойно оформить ипотеку.', accent: true },
];
```

`src/data/developer.ts`:
```ts
import type { Num } from './complex';

export const developerNums: Num[] = [
  { value: '14', label: 'сданных домов', tone: 'plain' },
  { value: '3 800', label: 'квартир передали владельцам', tone: 'pine' },
  { value: '2011', label: 'год, с которого работаем', tone: 'plain' },
  { value: '0', label: 'переносов срока больше чем на квартал', tone: 'copper' },
];

export const escrow = {
  title: 'До сдачи дома деньги лежат в банке',
  text: 'Квартиры продаются через эскроу-счета. Вы платите в банк, и банк держит деньги на счёте. Застройщик получает их только после сдачи дома. Если дом не сдадут, банк вернёт деньги вам.',
  flow: [
    { title: 'Вы', text: 'оплачиваете квартиру' },
    { title: 'Банк', text: 'хранит деньги на эскроу' },
    { title: 'Дом сдан', text: 'банк переводит деньги застройщику' },
  ],
};
```

`src/data/faq.ts`:
```ts
export const faq = [
  { q: 'А если дом не сдадут вовремя?', a: 'У застройщика 14 сданных домов, и ни один срок не переносили больше чем на квартал. Корпус 1 готов на 95%. Деньги до сдачи лежат на эскроу-счёте в банке, и застройщик не может их потратить.' },
  { q: 'Это же далеко от центра?', a: '15 минут на машине и 25 минут на общественном транспорте. До метро 9 минут пешком.' },
  { q: 'Окраина, наверное, ничего рядом нет?', a: 'Школа на 1 100 мест в пяти минутах пешком, два детских сада, поликлиника и ТЦ «Сосны» уже работают. На первых этажах будут кофейня, пекарня, пункт выдачи и детский сад.' },
  { q: 'Дорого.', a: 'Есть семейная и IT-ипотека от 6%, рассрочка 0% до сдачи дома при взносе от 30% и trade-in, если у вас уже есть квартира. Самые низкие цены сейчас в корпусе 3.' },
  { q: 'Будет шумно и много машин?', a: 'Двор закрыт для машин, паркинг на 320 мест под землёй.' },
];
```

`src/data/pickOptions.ts`:
```ts
export const budgetOptions = ['До 8 млн ₽', '8–12 млн ₽', '12–18 млн ₽', 'Больше 18 млн ₽', 'Пока не знаю'];
export const purchaseOptions = ['Семейная ипотека', 'IT-ипотека', 'Обычная ипотека', 'Рассрочка', 'Trade-in', 'Пока не решили'];
```

`audiences.ts` импортирует тип `ShotId` из `src/assets/photos/index.ts`, а этот файл появится только в задаче 6. Поэтому создай его сейчас с минимальным содержимым, а задача 6 его дополнит:

`src/assets/photos/index.ts`:
```ts
export type ShotId = '01-hero' | '02-yard' | '03-family' | '04-workfromhome' | '05-kitchen' | '06-construction';
```

- [ ] **Step 6: Проверка**

```bash
rm tests/unit/smoke.test.ts
npm run check && npm run test
```
Expected: 4 passed, 0 errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Данные из брифа в src/data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Проверка телефона (TDD)

**Files:**
- Create: `src/lib/phone.ts`
- Test: `tests/unit/phone.test.ts`

- [ ] **Step 1: Падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { normalizePhone } from '../../src/lib/phone';

describe('normalizePhone', () => {
  it.each([
    ['+7 900 123-45-67', '+79001234567'],
    ['8 (843) 000-12-12', '+78430001212'],
    ['7 900 123 45 67', '+79001234567'],
    ['9001234567', '+79001234567'],
    ['  +7(495)1234567 ', '+74951234567'],
  ])('%s → %s', (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });

  it.each([
    [''],
    ['12345'],
    ['+7 100 123-45-67'],
    ['+1 900 123 4567'],
    ['+7 900 123-45-678'],
    ['телефон'],
  ])('«%s» не номер', (raw) => {
    expect(normalizePhone(raw)).toBeNull();
  });
});
```

Run: `npx vitest run tests/unit/phone.test.ts`
Expected: FAIL, «Cannot find module».

- [ ] **Step 2: Реализация**

```ts
/** Приводит российский номер к виду +7XXXXXXXXXX. Возвращает null, если это не номер. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  let national: string;
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) national = digits.slice(1);
  else if (digits.length === 10) national = digits;
  else return null;
  // мобильные начинаются с 9, городские с 3, 4 или 8
  if (!/^[3489]/.test(national)) return null;
  return `+7${national}`;
}
```

- [ ] **Step 3: Проверка**

Run: `npx vitest run tests/unit/phone.test.ts`
Expected: 11 passed.

- [ ] **Step 4: Commit**

```bash
git add src/lib/phone.ts tests/unit/phone.test.ts
git commit -m "Нормализация телефона

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Заявки: validateLead и submitLead (TDD)

**Files:**
- Create: `src/lib/leads.ts`
- Test: `tests/unit/leads.test.ts`

- [ ] **Step 1: Падающий тест**

```ts
import { describe, it, expect, vi } from 'vitest';
import { validateLead, submitLead, LEAD_ERRORS } from '../../src/lib/leads';

const good = { kind: 'pick' as const, name: 'Анна', phone: '8 900 123-45-67', consent: true, budget: 'До 8 млн ₽', purchase: 'Семейная ипотека' };

describe('validateLead', () => {
  it('пустая форма даёт три ошибки', () => {
    const r = validateLead({ kind: 'pick' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toEqual({ name: LEAD_ERRORS.name, phone: LEAD_ERRORS.phone, consent: LEAD_ERRORS.consent });
  });
  it('имя короче двух символов после обрезки пробелов', () => {
    const r = validateLead({ ...good, name: '  А ' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toEqual(['name']);
  });
  it('имя длиннее 60 символов', () => {
    const r = validateLead({ ...good, name: 'А'.repeat(61) });
    expect(r.ok).toBe(false);
  });
  it('без согласия нельзя', () => {
    const r = validateLead({ ...good, consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.consent).toBe(LEAD_ERRORS.consent);
  });
  it('валидная заявка нормализуется', () => {
    const r = validateLead({ ...good, name: '  Анна  ' });
    expect(r).toEqual({ ok: true, lead: { kind: 'pick', name: 'Анна', phone: '+79001234567', budget: 'До 8 млн ₽', purchase: 'Семейная ипотека', flatType: undefined, consent: true } });
  });
  it('бронь несёт тип квартиры', () => {
    const r = validateLead({ kind: 'booking', name: 'Олег', phone: '+7 843 000-12-12', consent: true, flatType: 'penthouse' });
    expect(r.ok && r.lead.flatType).toBe('penthouse');
  });
});

describe('submitLead', () => {
  it('демо-отправка возвращает ok', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const r = validateLead(good);
    if (!r.ok) throw new Error('fixture');
    await expect(submitLead(r.lead, 0)).resolves.toEqual({ ok: true });
    expect(info).toHaveBeenCalledOnce();
  });
});
```

Run: `npx vitest run tests/unit/leads.test.ts`
Expected: FAIL.

- [ ] **Step 2: Реализация**

```ts
import { normalizePhone } from './phone';

export type LeadKind = 'pick' | 'booking';
export type LeadField = 'name' | 'phone' | 'consent';
export type LeadErrors = Partial<Record<LeadField, string>>;

export interface Lead {
  kind: LeadKind;
  name: string;
  /** +7XXXXXXXXXX */
  phone: string;
  budget?: string;
  purchase?: string;
  flatType?: string;
  consent: true;
}

export interface LeadInput {
  kind: LeadKind;
  name?: string;
  phone?: string;
  budget?: string;
  purchase?: string;
  flatType?: string;
  consent?: boolean;
}

export const LEAD_ERRORS = {
  name: 'Напишите, как к вам обращаться',
  phone: 'Проверьте номер телефона',
  consent: 'Нужно согласие на обработку данных',
} as const;

export function validateLead(input: LeadInput): { ok: true; lead: Lead } | { ok: false; errors: LeadErrors } {
  const errors: LeadErrors = {};
  const name = (input.name ?? '').trim();
  if (name.length < 2 || name.length > 60) errors.name = LEAD_ERRORS.name;
  const phone = normalizePhone(input.phone ?? '');
  if (!phone) errors.phone = LEAD_ERRORS.phone;
  if (input.consent !== true) errors.consent = LEAD_ERRORS.consent;
  if (!phone || Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    lead: { kind: input.kind, name, phone, budget: input.budget, purchase: input.purchase, flatType: input.flatType, consent: true },
  };
}

/**
 * Единственная точка отправки заявок. Сейчас это демо: данные никуда не уходят.
 * Когда появится CRM, меняется только тело этой функции.
 */
export async function submitLead(lead: Lead, delayMs = 600): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  console.info('[demo] заявка не отправлена, сайт учебный', lead);
  return { ok: true };
}
```

- [ ] **Step 3: Проверка**

Run: `npm run test`
Expected: все тесты зелёные.

- [ ] **Step 4: Commit**

```bash
git add src/lib/leads.ts tests/unit/leads.test.ts
git commit -m "Валидация и демо-отправка заявок

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Стили, базовый layout, общие компоненты, фикстура текстов

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/lib/url.ts`, `src/layouts/Base.astro`, `src/components/Logo.astro`, `BarkDivider.astro`, `Section.astro`, `NumCard.astro`, `public/favicon.svg`, `tests/e2e/copy.ts`, `tests/e2e/helpers.ts`
- Modify: `src/pages/index.astro`, `tests/e2e/page.spec.ts`

- [ ] **Step 1: Фикстура текстов и помощники**

`tests/e2e/helpers.ts`:
```ts
import type { Locator } from '@playwright/test';

/** innerText без NBSP, переводов строк и двойных пробелов. */
export const norm = (s: string) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
export const textOf = async (l: Locator) => norm(await l.innerText());
```

`tests/e2e/copy.ts` (строки из прототипа v3, обычные пробелы):
```ts
export const copy = {
  title: 'ЖК «Береста» в Казани: квартиры у соснового бора',
  hero: {
    h1: 'Город за спиной, лес за окном',
    lead: 'Три дома у соснового бора и реки, в 15 минутах от центра Казани. Машины стоят в подземном паркинге, во двор они не заезжают.',
    note: 'Менеджер соберёт варианты под ваш бюджет и ипотеку. Консультация занимает 30 минут.',
    cta: ['Подобрать 3–5 вариантов', 'Планировки и цены'],
  },
  area: { h2: 'Лес в 200 метрах, центр в 15 минутах', lead: 'Комплекс построен на краю города, у соснового бора. Школа, два детских сада, поликлиника и ТЦ «Сосны» уже работают.' },
  yard: { h2: 'Двор, куда детей можно отпустить гулять одних', lead: 'Въезд во двор закрыт, все машины уезжают в подземный паркинг.' },
  who: { h2: 'Кому подойдёт «Береста»', cards: ['Семья с малышом', 'Работаю из дома', 'Детям нужно по комнате', 'Вложить деньги'] },
  flats: {
    h2: 'Пять планировок, цены от 6,6 млн ₽',
    lead: 'Квартиры сдаются в white box: стены выровнены, сделаны стяжка и разводка. Чистовую отделку можно заказать за доплату. Средняя цена 245 000 ₽ за м².',
    cards: ['Студия', '1-комнатная', '2-комнатная', '3-комнатная', 'Пентхаус', 'Не знаете, что выбрать?'],
    helpText: 'Расскажите, сколько вас и какой бюджет. Менеджер пришлёт 3–5 квартир с расчётом платежа по ипотеке.',
  },
  houses: { h2: 'Первый дом сдаём в этом квартале', lead: 'Корпус 1 готов на 95%. В корпусе 3 только начались продажи.' },
  buy: { h2: 'Ипотека от 6% или рассрочка без переплаты' },
  dev: { h2: 'СК «Высота-16» строит в Казани с 2011 года', escrow: 'До сдачи дома деньги лежат в банке' },
  faq: {
    h2: 'О чём спрашивают перед покупкой',
    items: [
      ['А если дом не сдадут вовремя?', 'У застройщика 14 сданных домов, и ни один срок не переносили больше чем на квартал. Корпус 1 готов на 95%. Деньги до сдачи лежат на эскроу-счёте в банке, и застройщик не может их потратить.'],
      ['Это же далеко от центра?', '15 минут на машине и 25 минут на общественном транспорте. До метро 9 минут пешком.'],
      ['Окраина, наверное, ничего рядом нет?', 'Школа на 1 100 мест в пяти минутах пешком, два детских сада, поликлиника и ТЦ «Сосны» уже работают. На первых этажах будут кофейня, пекарня, пункт выдачи и детский сад.'],
      ['Дорого.', 'Есть семейная и IT-ипотека от 6%, рассрочка 0% до сдачи дома при взносе от 30% и trade-in, если у вас уже есть квартира. Самые низкие цены сейчас в корпусе 3.'],
      ['Будет шумно и много машин?', 'Двор закрыт для машин, паркинг на 320 мест под землёй.'],
    ],
  },
  pick: {
    h2: 'Подберём 3–5 квартир под ваш бюджет',
    lead: 'Оставьте телефон. Менеджер позвонит и пришлёт подборку с расчётом ежемесячного платежа.',
    success: 'Заявка принята',
    successText: 'Менеджер позвонит по номеру, который вы оставили.',
    demo: 'Это учебный сайт, поэтому заявка никуда не отправлена.',
  },
  booking: {
    title: 'Бронь на 7 дней',
    text: 'Квартиру снимем с продажи. 15 000 ₽ пойдут в счёт стоимости, а если передумаете, вернём их.',
    success: 'Бронь оформлена',
  },
  footer: { disclaimer: 'Учебный проект. Жилой комплекс, застройщик, адрес, телефон и цифры вымышлены. Заявки с сайта никуда не отправляются.' },
};
```

- [ ] **Step 2: Падающий тест layout**

Замени `tests/e2e/page.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { copy } from './copy';

test.beforeEach(async ({ page }) => { await page.goto('./'); });

test('мета и noindex', async ({ page }) => {
  await expect(page).toHaveTitle(copy.title);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://aislam23.github.io/beresta/og.jpg');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld['@type']).toBe('ApartmentComplex');
});

test('шрифт Manrope подключён', async ({ page }) => {
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toContain('Manrope');
});

test('ссылка «Перейти к содержимому» ведёт в main', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Перейти к содержимому' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});
```

Run: `npm run test:e2e`
Expected: FAIL.

- [ ] **Step 3: tokens.css**

Перенеси строки 10–23 прототипа и дополни токенами:

```css
:root {
  --paper: #F4EFE6; --paper-2: #EFE8DC; --card: #FBF8F2;
  --ink: #26282B; --ink-2: #5B5E62;
  --pine: #2E4A3B; --pine-2: #E3E8DA;
  --copper: #B9773F; --copper-strong: #9A5C2A; --copper-2: #F1E3D3;
  --line: rgba(38, 40, 43, .1);
  --r: 20px; --r-s: 12px;
  --wrap: 1200px; --gut: clamp(16px, 3vw, 32px);
  --hdr-h: 68px;
  --font: var(--font-manrope), system-ui, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { margin: 0; background: var(--paper); color: var(--ink); font: 400 16px/1.55 var(--font); -webkit-font-smoothing: antialiased; }
h1, h2, h3 { margin: 0; font-weight: 800; letter-spacing: -.035em; line-height: 1.02; text-wrap: balance; }
h2 { font-size: clamp(30px, 4.2vw, 52px); }
h3 { font-size: 20px; letter-spacing: -.02em; line-height: 1.2; }
p { margin: 0; }
a { color: inherit; }
img { display: block; max-width: 100%; }
[hidden] { display: none !important; }
:focus-visible { outline: 3px solid var(--copper-strong); outline-offset: 3px; border-radius: 4px; }
```

- [ ] **Step 4: global.css**

Строки 24, 28, 30–35 прототипа (`.wrap`, `.lead`, `.btn*`), но **без** `.eyebrow`, и с правкой меди. Плюс `.sr-only` и ссылка-пропуск:

```css
.wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--gut); }
.lead { font-size: clamp(16px, 1.4vw, 19px); color: var(--ink-2); max-width: 620px; margin-top: 18px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; cursor: pointer; font: 700 15px/1 var(--font); padding: 16px 22px; border-radius: var(--r-s); text-decoration: none; transition: transform .15s, background .15s; }
.btn:active { transform: scale(.98); }
.btn:disabled { opacity: .6; cursor: progress; }
.btn-p { background: var(--pine); color: var(--paper); } .btn-p:hover { background: #243c30; }
.btn-s { background: #EAE3D6; color: var(--ink); } .btn-s:hover { background: #E2D9C9; }
.btn-c { background: var(--copper-strong); color: #fff; } .btn-c:hover { background: #87501f; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.skip { position: absolute; left: 12px; top: -60px; z-index: 100; background: var(--ink); color: var(--paper); padding: 12px 16px; border-radius: var(--r-s); font-weight: 700; text-decoration: none; }
.skip:focus { top: 12px; }
```

- [ ] **Step 5: url.ts, Logo, BarkDivider, NumCard, Section**

`src/lib/url.ts`:
```ts
/** Путь к файлу из public/ с учётом base ('/beresta'). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
```

`src/components/Logo.astro` (CSS из строк 54–55 прототипа, селекторы `.logo`, `.logo i`):
```astro
---
interface Props { href?: string }
const { href = '#hero' } = Astro.props;
---
<a class="logo" href={href} aria-label="«Береста», в начало страницы"><i aria-hidden="true"></i>береста</a>
<style>
  .logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 21px; letter-spacing: -.03em; text-decoration: none; }
  .logo i { display: block; width: 20px; height: 4px; border-radius: 2px; background: var(--ink); box-shadow: 6px 7px 0 -1px var(--ink); }
</style>
```

`src/components/BarkDivider.astro`: разметка `<div class="wrap" aria-hidden="true"><div class="bark"></div></div>`, CSS `.bark` из строк 38–41 прототипа без изменений.

`src/components/NumCard.astro` (CSS из строк 79–84 прототипа, классы `.num.g` / `.num.c` переименованы в `.tone-pine` / `.tone-copper`, медная карточка на `--copper-strong` с белым текстом):
```astro
---
import type { Num } from '../data/complex';
interface Props { num: Num; class?: string }
const { num, class: cls } = Astro.props;
---
<div class:list={['num', `tone-${num.tone}`, cls]}>
  <b>{num.value}{num.unit && <small>{num.unit}</small>}</b>{num.label}
</div>
<style>
  .num { background: var(--card); border-radius: 18px; padding: 18px 20px; font-size: 14px; line-height: 1.35; color: var(--ink-2); border: 1px solid var(--line); }
  .num b { display: block; font-size: clamp(28px, 3vw, 40px); font-weight: 800; letter-spacing: -.045em; line-height: 1; margin-bottom: 6px; color: var(--ink); }
  .num b small { font-size: .48em; letter-spacing: 0; margin-left: 2px; }
  .tone-pine { background: var(--pine); color: #D7E0D2; border-color: transparent; } .tone-pine b { color: var(--paper); }
  .tone-copper { background: var(--copper-strong); color: #fff; border-color: transparent; } .tone-copper b { color: #fff; }
</style>
```

`src/components/Section.astro`:
```astro
---
interface Props {
  id: string;
  /** Может содержать <br> и &nbsp; — строка из кода, не от пользователя. */
  title: string;
  lead?: string;
  tone?: 'paper' | 'paper-2';
  flushTop?: boolean;
}
const { id, title, lead, tone = 'paper', flushTop = false } = Astro.props;
---
<section id={id} class:list={['section', `tone-${tone}`, { 'flush-top': flushTop }]} aria-labelledby={`${id}-title`}>
  <div class="wrap">
    <div class="head">
      <h2 id={`${id}-title`} set:html={title} />
      {lead && <p class="lead" set:html={lead} />}
    </div>
    <slot />
  </div>
</section>
<style>
  .section { padding: clamp(64px, 9vw, 120px) 0; scroll-margin-top: var(--hdr-h); }
  .tone-paper-2 { background: var(--paper-2); }
  .flush-top { padding-top: 0; }
  .head { margin-bottom: clamp(32px, 4vw, 56px); }
</style>
```

- [ ] **Step 6: Base.astro**

```astro
---
import { Font } from 'astro:assets';
import '../styles/tokens.css';
import '../styles/global.css';
import { complex, heroNums } from '../data/complex';
import { withBase } from '../lib/url';

const title = 'ЖК «Береста» в Казани: квартиры у соснового бора';
const description = 'Три дома у соснового бора и реки, в 15 минутах от центра Казани. Двор без машин, школа в пяти минутах пешком, студии от 6,6 млн ₽. Учебный проект.';
const ogImage = new URL(withBase('og.jpg'), Astro.site).href;
const ld = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: `ЖК «${complex.name}»`,
  description,
  numberOfAccommodationUnits: complex.units,
  telephone: complex.phone.display,
  address: { '@type': 'PostalAddress', addressLocality: complex.city, streetAddress: complex.streetAddress, addressCountry: 'RU' },
};
void heroNums;
---
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href={withBase('favicon.svg')} />
    <Font cssVariable="--font-manrope" preload />
    <script type="application/ld+json" set:html={JSON.stringify(ld)} />
  </head>
  <body>
    <a class="skip" href="#main">Перейти к содержимому</a>
    <slot />
  </body>
</html>
```

Убери строку `void heroNums;` и импорт `heroNums`, если `astro check` не ругается на неиспользуемый импорт. Импорт нужен только `complex`.

`public/favicon.svg` (знак логотипа):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2E4A3B"/><rect x="6" y="11" width="14" height="4" rx="2" fill="#F4EFE6"/><rect x="12" y="18" width="14" height="4" rx="2" fill="#F4EFE6"/></svg>
```

- [ ] **Step 7: index.astro на новом layout**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <main id="main">
    <!-- секции добавляются задачами 7–19 в этом порядке:
         Hero, Area, BarkDivider, Yard, Audiences, Flats, Houses, BarkDivider, Buy, Developer, Faq, PickForm -->
  </main>
</Base>
```

- [ ] **Step 8: Проверка и commit**

Run: `npm run check && npm run test && npm run test:e2e`
Expected: всё зелёное.

```bash
git add -A
git commit -m "Токены, базовый layout, общие компоненты, фикстура текстов

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Фото: реестр кадров, Photo, заглушка

**Files:**
- Modify: `src/assets/photos/index.ts`
- Create: `src/components/Photo.astro`, `src/components/PlaceholderScene.astro`

- [ ] **Step 1: Реестр**

`src/assets/photos/index.ts`:
```ts
import type { ImageMetadata } from 'astro';

export type ShotId = '01-hero' | '02-yard' | '03-family' | '04-workfromhome' | '05-kitchen' | '06-construction';

// Кадры кладутся сюда как <id>.png (задачи 22–23). Пока файла нет, Photo рисует заглушку.
const files = import.meta.glob<{ default: ImageMetadata }>('./*.png', { eager: true });

export function getShot(id: ShotId): ImageMetadata | undefined {
  return files[`./${id}.png`]?.default;
}

/** Точка кадрирования для object-fit: cover. Уточняется в задаче 23 по готовым кадрам. */
export const focus: Record<ShotId, string> = {
  '01-hero': '50% 60%',
  '02-yard': '50% 50%',
  '03-family': '50% 50%',
  '04-workfromhome': '50% 50%',
  '05-kitchen': '50% 50%',
  '06-construction': '50% 50%',
};
```

- [ ] **Step 2: PlaceholderScene.astro**

SVG дома и сосен из прототипа. Перенеси содержимое `<g id="pines">`, `<g id="towers">`, `<pattern id="win">` и `<g id="scene">` (строки 256–276) в один самодостаточный `<svg viewBox="0 0 1100 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">`: `<defs>` с этими элементами внутри и `<use href="#scene"/>`. Чтобы id не повторялись при нескольких заглушках на странице, добавь к каждому id суффикс из пропа: `const uid = Astro.props.uid` (например `ph-01-hero`), `id={`${uid}-pines`}` и ссылки `href={`#${uid}-pines`}`, `fill={`url(#${uid}-win)`}`.

Стиль: `svg { position: absolute; left: 0; bottom: 0; width: 100%; height: 78%; }`.

- [ ] **Step 3: Photo.astro**

```astro
---
import { Picture } from 'astro:assets';
import { getShot, focus, type ShotId } from '../assets/photos';
import PlaceholderScene from './PlaceholderScene.astro';

interface Props {
  shot: ShotId;
  alt: string;
  /** Подпись заглушки, видна только пока кадра нет. */
  placeholder: string;
  tone?: 'mist' | 'warm' | 'green' | 'dawn';
  sizes: string;
  eager?: boolean;
  scene?: boolean;
  class?: string;
}
const { shot, alt, placeholder, tone = 'mist', sizes, eager = false, scene = true, class: cls } = Astro.props;
const img = getShot(shot);
---
<div class:list={['photo', `tone-${tone}`, cls]} data-shot={img ? undefined : placeholder} style={`--focus: ${focus[shot]}`}>
  {img ? (
    <Picture src={img} alt={alt} widths={[640, 960, 1280, 1536]} sizes={sizes} formats={['avif', 'webp']} loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} />
  ) : (
    <div class="ph" role="img" aria-label={alt}>{scene && <PlaceholderScene uid={`ph-${shot}`} />}</div>
  )}
</div>
<style>
  .photo { position: relative; overflow: hidden; border-radius: var(--r); min-height: 260px; }
  .photo :global(picture), .photo :global(img) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--focus); }
  .ph { position: absolute; inset: 0; }
  /* фоны заглушек: строки 44 и 47–49 прототипа */
  .tone-mist .ph { background: linear-gradient(180deg, #E3DDCF 0%, #CFD3C3 50%, #8E9F88 78%, #5F7461 100%); }
  .tone-warm .ph { background: linear-gradient(180deg, #F1E6D2 0%, #E4D5BC 55%, #B79D7C 100%); }
  .tone-green .ph { background: linear-gradient(180deg, #DCE3D3 0%, #B9C6AE 55%, #6F8468 100%); }
  .tone-dawn .ph { background: radial-gradient(70% 60% at 70% 55%, #F3C99C 0%, rgba(243, 201, 156, 0) 70%), linear-gradient(180deg, #C9CFD0 0%, #E6D7C2 60%, #B99B78 100%); }
  .photo[data-shot]::after { content: attr(data-shot); position: absolute; right: 12px; top: 12px; max-width: 70%; font-size: 11px; font-weight: 600; line-height: 1.3; background: rgba(38, 40, 43, .72); color: #F4EFE6; padding: 6px 9px; border-radius: 8px; text-align: right; }
</style>
```

Проверь по документации Astro (context7 `/withastro/docs`, запрос «Picture component widths sizes formats»), что у `<Picture>` такие пропы. Если `fetchpriority` не пробрасывается в `<img>`, используй проп `pictureAttributes`/атрибуты по документации.

- [ ] **Step 4: Проверка и commit**

Run: `npm run check && npm run build`
Expected: 0 errors, сборка проходит (Photo ещё нигде не используется).

```bash
git add -A
git commit -m "Компонент Photo с реестром кадров и заглушкой

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Шапка, подвал, мобильная плашка

**Files:**
- Create: `src/components/Header.astro`, `Footer.astro`, `MobileBar.astro`, `tests/e2e/sections.spec.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Падающий тест**

`tests/e2e/sections.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { copy } from './copy';
import { textOf } from './helpers';

test.beforeEach(async ({ page }) => { await page.goto('./'); });

test('шапка: логотип, навигация, телефон, кнопка подбора', async ({ page, isMobile }) => {
  const header = page.locator('header');
  await expect(header.getByRole('link', { name: 'Подобрать квартиру' })).toHaveAttribute('href', '#pick');
  if (!isMobile) {
    const nav = header.getByRole('navigation', { name: 'Разделы' });
    await expect(nav.getByRole('link')).toHaveText(['Район', 'Двор', 'Квартиры', 'Как купить', 'Застройщик']);
    await expect(header.getByRole('link', { name: '+7 843 000-12-12' })).toHaveAttribute('href', 'tel:+78430001212');
  }
});

test('подвал: адрес и пометка об учебном проекте', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer).toContainText('Казань, ул. Сосновая, 12');
  expect(await textOf(footer.locator('.disc'))).toBe(copy.footer.disclaimer);
});

test('мобильная плашка видна только на телефоне', async ({ page, isMobile }) => {
  const bar = page.locator('.mbar');
  if (isMobile) await expect(bar).toBeVisible(); else await expect(bar).toBeHidden();
});
```

Run: `npx playwright test tests/e2e/sections.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Header.astro**

Разметка по строкам 279–290 прототипа, данные из `nav` и `complex.phone`. `<nav aria-label="Разделы">`. Логотип через `<Logo />`. CSS по строкам 51–61 прототипа, кроме `.logo` (он уже в Logo.astro). Медиа: `@media (max-width:980px) { .nav { display: none } }` и `@media (max-width:640px) { .hdr-r .tel { display: none } }`. Высоту шапки бери из `var(--hdr-h)`.

- [ ] **Step 3: Footer.astro**

Разметка по строкам 637–644 прототипа: `<Logo />`, `complex.tagline`, «Офис продаж» + `complex.address`, телефон + `complex.developer`, `<p class="disc">{complex.disclaimer}</p>`. CSS по строкам 206–211. Медиа: `@media (max-width:640px) { footer .wrap { grid-template-columns: 1fr } }`.

- [ ] **Step 4: MobileBar.astro**

Строка 646 прототипа, телефон из `complex.phone.href`. CSS: строка 225 и медиа из строк 247–248.

- [ ] **Step 5: index.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import MobileBar from '../components/MobileBar.astro';
---
<Base>
  <Header />
  <main id="main">
    <!-- секции: Hero, Area, BarkDivider, Yard, Audiences, Flats, Houses, BarkDivider, Buy, Developer, Faq, PickForm -->
  </main>
  <Footer />
  <MobileBar />
</Base>
```

- [ ] **Step 6: Проверка и commit**

Run: `npm run check && npm run test:e2e`
Expected: зелёное.

```bash
git add -A
git commit -m "Шапка, подвал, мобильная плашка

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Первый экран

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест** (дописать в `sections.spec.ts`)

```ts
test('первый экран', async ({ page }) => {
  const hero = page.locator('#hero');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await textOf(hero.locator('h1'))).toBe(copy.hero.h1);
  expect(await textOf(hero.locator('.lead'))).toBe(copy.hero.lead);
  expect(await textOf(hero.locator('.note'))).toBe(copy.hero.note);
  await expect(hero.getByRole('link', { name: copy.hero.cta[0] })).toHaveAttribute('href', '#pick');
  await expect(hero.getByRole('link', { name: copy.hero.cta[1] })).toHaveAttribute('href', '#flats');
  await expect(hero.locator('.num')).toHaveCount(4);
});
```

Run: `npx playwright test -g "первый экран"` → FAIL.

- [ ] **Step 2: Hero.astro**

```astro
---
import Photo from './Photo.astro';
import NumCard from './NumCard.astro';
import { heroNums } from '../data/complex';
---
<section id="hero" class="hero" aria-labelledby="hero-title">
  <Photo
    class="hero-photo"
    shot="01-hero"
    alt="Три корпуса «Бересты» над соснами в утреннем тумане"
    placeholder="Кадр 01 · эталон: три корпуса 9/12/14 этажей над соснами, туман с реки"
    sizes="100vw"
    eager
  />
  <div class="fog" aria-hidden="true"></div>
  <div class="wrap">
    <div class="hero-card">
      <h1 id="hero-title">Город за спиной, <span>лес за&nbsp;окном</span></h1>
      <p class="lead">Три дома у соснового бора и реки, в 15&nbsp;минутах от центра Казани. Машины стоят в подземном паркинге, во двор они не заезжают.</p>
      <div class="cta">
        <a class="btn btn-p" href="#pick">Подобрать 3–5&nbsp;вариантов</a>
        <a class="btn btn-s" href="#flats">Планировки и цены</a>
      </div>
      <p class="note">Менеджер соберёт варианты под ваш бюджет и ипотеку. Консультация занимает 30&nbsp;минут.</p>
    </div>
    <div class="nums">
      {heroNums.map((n) => <NumCard num={n} />)}
    </div>
  </div>
</section>
```

CSS: строки 62–78 прототипа (`.hero`, `.hero-ph` → `:global(.hero-photo)`, `.fog`, `.hero .wrap`, `.hero-card`, `.hero h1` с `margin: 0`, `.hero h1 span`, `.hero .lead`, `.hero .cta`, `.hero .note`, `.nums`). **Не переносить `.tag`.** Фото получает `position: absolute; inset: 0; border-radius: 0; min-height: 0;` через `.hero :global(.hero-photo)`, а фон-туман из строки 64 (`.hero-ph{...}`) через `.hero :global(.hero-photo .ph)`. У `.hero` добавь `overflow: hidden`: туман `.fog` выходит за края на 10% и иначе даст горизонтальный скролл. Медиа: `.nums` 2 колонки при 980px (строка 229); при 640px строки 237–239 (`.hero`, `.hero :global(.hero-photo) { bottom: auto; height: 420px }`, `.hero-card`).

- [ ] **Step 3: index.astro** — добавить `<Hero />` первым в `<main>`.

- [ ] **Step 4: Проверка, визуальное сравнение, commit**

Run: `npm run check && npm run test:e2e` → зелёное.
Открой `npm run dev` и сравни первый экран с прототипом на 1280 и 375 (координатор может сделать это в браузере). Отличаться должны только цвет медной карточки и отсутствие тега.

```bash
git add -A
git commit -m "Первый экран

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Район и схема

**Files:**
- Create: `src/components/Area.astro`, `src/components/AreaMap.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('район', async ({ page }) => {
  const s = page.locator('#area');
  expect(await textOf(s.locator('h2'))).toBe(copy.area.h2);
  expect(await textOf(s.locator('.lead'))).toBe(copy.area.lead);
  await expect(s.locator('.dist-row')).toHaveCount(5);
  await expect(s.getByRole('img', { name: 'Схема района: бор, набережная, метро, школа и ТЦ вокруг комплекса' })).toBeVisible();
});
```

- [ ] **Step 2: AreaMap.astro**

Перенеси `<svg viewBox="0 0 600 520">` из строк 330–351 прототипа как есть, добавив `role="img"` и `aria-label="Схема района: бор, набережная, метро, школа и ТЦ вокруг комплекса"`. В `<text>` поставь `font-family="var(--font-manrope), sans-serif"` через CSS (`text { font-family: var(--font) }`). Обёртка `.map` с CSS из строки 87 и медиа `.map { min-height: 380px }` при 980px.

- [ ] **Step 3: Area.astro**

```astro
---
import Section from './Section.astro';
import AreaMap from './AreaMap.astro';
import { distances } from '../data/area';
---
<Section id="area" title="Лес в 200&nbsp;метрах,<br>центр в 15&nbsp;минутах" lead="Комплекс построен на краю города, у соснового бора. Школа, два детских сада, поликлиника и ТЦ «Сосны» уже работают.">
  <div class="area">
    <AreaMap />
    <ul class="dist">
      {distances.map((d) => (
        <li class="dist-row"><b>{d.value}<small>{' '}{d.unit}</small></b><span><strong>{d.title}</strong>{d.text}</span></li>
      ))}
    </ul>
  </div>
</Section>
```

CSS: строки 86 и 89–95 (`.area`, `.dist`, `.dist-row*`), у `.dist` добавить `list-style: none; margin: 0; padding: 0;`. Медиа: `.area { grid-template-columns: 1fr }` при 980px, `.dist-row { grid-template-columns: 90px 1fr }` при 640px.

- [ ] **Step 4: index.astro** — после `<Hero />` добавить `<Area />` и `<BarkDivider />`.

- [ ] **Step 5: Проверка и commit**

Run: `npm run check && npm run test:e2e` → зелёное.

```bash
git add -A
git commit -m "Секция «Район» со схемой

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Двор и иконки

**Files:**
- Create: `src/components/Yard.astro`, `src/components/YardIcon.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('двор', async ({ page }) => {
  const s = page.locator('#yard');
  expect(await textOf(s.locator('h2'))).toBe(copy.yard.h2);
  expect(await textOf(s.locator('.lead'))).toBe(copy.yard.lead);
  await expect(s.locator('.feat h3')).toHaveText(['Подземный паркинг на 320 мест', 'Площадки для всех возрастов', 'Лобби с консьержем', 'Кладовки от 4 м²']);
  // toHaveText нормализует пробелы через \s+, а \s включает NBSP, поэтому «4 м²» совпадает с «4\u00a0м²»
  await expect(s.locator('.feat svg[aria-hidden="true"]')).toHaveCount(4);
  await expect(s.locator('.shop')).toHaveCount(4);
});
```

- [ ] **Step 2: YardIcon.astro**

Пропы `name: YardIconName`. Один `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` и содержимое по имени:
- `parking`: `<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>`
- `playground`: `<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M4 13h16"/>`
- `lobby`: `<path d="M5 21V4h14v17"/><path d="M3 21h18"/><path d="M14 12h.01"/>`
- `storage`: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18"/><path d="M10 8h4M10 16h4"/>`

- [ ] **Step 3: Yard.astro**

```astro
---
import Section from './Section.astro';
import Photo from './Photo.astro';
import YardIcon from './YardIcon.astro';
import { yardFeatures, groundFloor } from '../data/yard';
---
<Section id="yard" title="Двор, куда детей можно<br>отпустить гулять одних" lead="Въезд во двор закрыт, все машины уезжают в подземный паркинг.">
  <div class="yard">
    <Photo class="yard-photo" shot="02-yard" tone="green" alt="Двор между корпусами без машин, дети на площадке, за домами сосны" placeholder="Кадр 02 · двор без машин между корпусами, дети на площадке, сосны за домами" sizes="(max-width: 980px) 100vw, 680px" />
    <ul class="yard-list">
      {yardFeatures.map((f) => (
        <li class="feat"><div class="ico"><YardIcon name={f.icon} /></div><div><h3>{f.title}</h3><p>{f.text}</p></div></li>
      ))}
    </ul>
    <ul class="yard-strip">
      {groundFloor.map((s) => <li class="shop">{s} <small>1 этаж</small></li>)}
    </ul>
  </div>
</Section>
```

CSS: строки 96–107 прототипа, `.yard .ph` → `.yard :global(.yard-photo) { grid-column: span 7; min-height: 460px }`, у списков `list-style: none; margin: 0; padding: 0`. Медиа: строки 229 (`.yard-strip` 2 колонки), 231 (`.yard :global(.yard-photo), .yard-list { grid-column: 1/-1 }`), 242.

- [ ] **Step 4: index.astro** — `<Yard />` после первого `<BarkDivider />`.

- [ ] **Step 5: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Двор»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Для кого

**Files:**
- Create: `src/components/Audiences.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('для кого', async ({ page }) => {
  const s = page.locator('#who');
  expect(await textOf(s.locator('h2'))).toBe(copy.who.h2);
  await expect(s.locator('.who-c h3')).toHaveText(copy.who.cards);
  await expect(s.locator('.fit')).toHaveCount(4);
});
```

- [ ] **Step 2: Audiences.astro**

```astro
---
import Section from './Section.astro';
import Photo from './Photo.astro';
import { audiences } from '../data/audiences';
---
<Section id="who" title="Кому подойдёт<br>«Береста»" flushTop>
  <div class="who">
    {audiences.map((a) => (
      <article class="who-c">
        <Photo class="who-photo" shot={a.shot} tone={a.tone} alt={a.alt} placeholder={a.placeholder} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 300px" scene={false} />
        <div class="body">
          <h3>{a.title}</h3>
          <p>{a.text}</p>
          <div class="fit"><b>{a.fitTitle}</b>{a.fitText}</div>
        </div>
      </article>
    ))}
  </div>
</Section>
```

CSS: строки 108–116, `.who-c .ph` → `.who-c :global(.who-photo) { border-radius: 0; min-height: 200px }`. Медиа: 2 колонки при 980px (строка 229), 1 колонка при 640px (строка 241).

- [ ] **Step 3: index.astro** — `<Audiences />` после `<Yard />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Для кого»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Схемы планировок

**Files:**
- Create: `src/components/FloorPlan.astro`
- Test: `tests/e2e/sections.spec.ts` (в задаче 13 вместе с карточками)

- [ ] **Step 1: FloorPlan.astro**

Пропы `type: PlanType` и `dark?: boolean`. Один `<svg viewBox="0 0 320 200" role="img" aria-label={label}>`, где `label` берётся из таблицы:

| type | aria-label |
|---|---|
| studio | `Схема студии: комната с кухней-нишей, ванная, французский балкон` |
| one | `Схема однокомнатной: кухня-гостиная 16 м², спальня, ванная` |
| two | `Схема двухкомнатной: кухня-гостиная, мастер-спальня с гардеробной, детская, ванная` |
| three | `Схема трёхкомнатной: кухня-гостиная, три комнаты, две ванные, окна на две стороны` |
| penthouse | `Схема пентхауса: гостиная, три спальни, две ванные, терраса 40 м²` |

Стиль: внешние стены `stroke: currentColor; stroke-width: 3`, перегородки `stroke-width: 1.5`, мокрые зоны залиты `var(--pine-2)` (в тёмной карточке `#3A4A40`), окна — разрывы во внешней стене с тонкой двойной линией, подписи помещений `font-size: 11px; font-weight: 600; fill: currentColor; opacity: .7`. Цвет линий `var(--ink)`, у `dark` `#E8E3DA`. Площади на схемах не подписывать, кроме «16 м²» у кухни-гостиной однокомнатной и «терраса 40 м²» у пентхауса (они есть в брифе).

Геометрия (прямоугольники `x y w h`, всё внутри рамки `10 10 300 180`):
- **studio**: комната `10 10 210 180` (подпись «Комната» в центре, «кухня» мелко у левой стены, ниша `10 10 60 70` пунктиром), ванная `220 10 90 80` (залита), прихожая `220 90 90 100`; французский балкон: на левой стене разрыв 60px с тремя короткими вертикальными штрихами снаружи.
- **one**: кухня-гостиная `10 10 170 110` («Кухня-гостиная 16 м²»), спальня `180 10 130 110`, ванная `10 120 80 70` (залита), прихожая `90 120 220 70`.
- **two**: кухня-гостиная `10 10 150 100`, мастер-спальня `160 10 150 100` с гардеробной `250 10 60 50` пунктиром, детская `10 110 120 80`, ванная `130 110 70 80` (залита), прихожая `200 110 110 80`.
- **three**: кухня-гостиная `10 10 140 90`, комната `150 10 160 90`, комната `10 100 110 90`, комната `200 100 110 90`, две ванные `120 100 80 45` и `120 145 80 45` (залиты); окна на верхней и нижней внешних стенах.
- **penthouse**: гостиная `10 10 150 110`, спальни `160 10 75 70`, `235 10 75 70`, `160 80 150 40`, ванные `160 120 70 30` и `230 120 80 30` (залиты), терраса `10 120 150 70` пунктиром с подписью «терраса 40 м²».

Задача на глаз: схема должна читаться с 2 метров и совпадать с описанием квартиры. Точность до пикселя не нужна.

- [ ] **Step 2: Commit** (проверка вместе с задачей 13)

```bash
npm run check
git add src/components/FloorPlan.astro
git commit -m "SVG-схемы пяти планировок

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Квартиры и цены

**Files:**
- Create: `src/components/Flats.astro`, `src/components/FlatCard.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('квартиры', async ({ page }) => {
  const s = page.locator('#flats');
  expect(await textOf(s.locator('h2'))).toBe(copy.flats.h2);
  expect(await textOf(s.locator('.head .lead'))).toBe(copy.flats.lead);
  await expect(s.locator('.flat h3, .flat-help h3')).toHaveText(copy.flats.cards);
  await expect(s.locator('.flat svg[role="img"]')).toHaveCount(5);
  await expect(s.locator('button[data-book]')).toHaveCount(5);
  await expect(s.locator('button[data-book][data-flat="penthouse"]')).toHaveAttribute('data-book', 'Пентхаус · от 33 млн ₽');
  expect(await textOf(s.locator('.flat-help p'))).toBe(copy.flats.helpText);
});
```

- [ ] **Step 2: FlatCard.astro**

```astro
---
import FloorPlan from './FloorPlan.astro';
import { bookingLabel, type Flat } from '../data/flats';
interface Props { flat: Flat }
const { flat } = Astro.props;
---
<article class:list={['flat', { pent: flat.dark }]}>
  <div class="plan"><FloorPlan type={flat.id} dark={flat.dark} /></div>
  <div class="top"><h3>{flat.title}</h3><span class="area-m">{flat.area}</span></div>
  <div class="price"><small>от</small> {flat.priceFrom} <small>млн&nbsp;₽</small></div>
  <p class="fx">{flat.feature}</p>
  <div class="acts">
    <button type="button" class="btn btn-c" data-book={bookingLabel(flat)} data-flat={flat.id} aria-haspopup="dialog">Забронировать</button>
    <a class="btn btn-s" href="#pick">Подобрать</a>
  </div>
</article>
```

CSS: строки 119–130 прототипа (`.flat`, `.plan` с `padding: 12px` вместо текста-заглушки, `.top`, `.area-m`, `.price`, `.fx`, `.acts`, `.pent*`). **Не переносить `.pill` (строка 131).**

- [ ] **Step 3: Flats.astro**

```astro
---
import Section from './Section.astro';
import FlatCard from './FlatCard.astro';
import { flats, flatsNotes } from '../data/flats';
---
<Section id="flats" tone="paper-2" title="Пять планировок,<br>цены от 6,6&nbsp;млн&nbsp;₽" lead="Квартиры сдаются в white box: стены выровнены, сделаны стяжка и разводка. Чистовую отделку можно заказать за доплату. Средняя цена 245&nbsp;000&nbsp;₽ за м².">
  <div class="flats">
    {flats.map((f) => <FlatCard flat={f} />)}
    <article class="flat-help">
      <h3>Не знаете, что выбрать?</h3>
      <p>Расскажите, сколько вас и какой бюджет. Менеджер пришлёт 3–5&nbsp;квартир с расчётом платежа по ипотеке.</p>
      <a class="btn btn-c" href="#pick">Получить подборку</a>
    </article>
  </div>
  <div class="flats-note">
    {flatsNotes.map((n) => <div class:list={['box', { c: n.tone === 'copper' }]}><b>{n.title}</b>{n.text}</div>)}
  </div>
</Section>
```

CSS: строка 118 (`.flats`), строки 132–135 (`.flats-note`, `.box`, `.box b`, `.box.c`). Инлайн-стили карточки «Не знаете, что выбрать?» из строки 485 прототипа оформи классом `.flat-help` (те же свойства, что у `.flat`, плюс `justify-content: center; background: var(--pine); color: var(--paper); border-color: transparent`, `h3 { font-size: 26px }`, `p { color: #C9D4C4 }`, кнопка `align-self: flex-start`). Медиа: `.flats` 2 колонки при 980px, 1 колонка при 640px; `.flats-note` 1 колонка при 640px.

- [ ] **Step 4: index.astro** — `<Flats />` после `<Audiences />`.

- [ ] **Step 5: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Квартиры и цены»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Сроки

**Files:**
- Create: `src/components/Houses.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('сроки', async ({ page }) => {
  const s = page.locator('#houses');
  expect(await textOf(s.locator('h2'))).toBe(copy.houses.h2);
  expect(await textOf(s.locator('.lead'))).toBe(copy.houses.lead);
  await expect(s.locator('.house .when')).toHaveText(['IV кв. 2026', 'II кв. 2027', 'IV кв. 2027']);
  await expect(s.getByRole('progressbar', { name: 'Готовность корпуса 1' })).toHaveAttribute('aria-valuenow', '95');
});
```

- [ ] **Step 2: Houses.astro**

Карточка на корпус из `houses`. Если есть `readiness`: класс `now` и `<div class="bar" role="progressbar" aria-label={`Готовность корпуса ${h.n}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={h.readiness}><i style={`width:${h.readiness}%`}></i></div>`. Иначе 5 делений `.steps`, где первые `h.steps` получают `.on`, плюс `.steps-l` из `stepLabels`. Строка `.n`: `<b>Корпус {h.n}</b><span>{h.floors} этажей · {h.units} квартир</span>`. Section: `id="houses" title="Первый дом сдаём<br>в этом квартале" lead="Корпус 1 готов на 95%. В корпусе 3 только начались продажи."`. CSS: строки 137–154, у `.bar i` убрать фиксированный `width: 95%`. Медиа: 2 колонки при 980px, 1 при 640px.

- [ ] **Step 3: index.astro** — `<Houses />` и `<BarkDivider />` после `<Flats />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Сроки»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Как купить

**Files:**
- Create: `src/components/Buy.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('как купить', async ({ page }) => {
  const s = page.locator('#buy');
  expect(await textOf(s.locator('h2'))).toBe(copy.buy.h2);
  await expect(s.locator('.buy-c h3')).toHaveText(['Семейная ипотека', 'IT-ипотека', 'Рассрочка до сдачи дома', 'Рыночная ипотека', 'Trade-in', 'Бронь онлайн']);
  await expect(s.getByRole('link', { name: 'Выбрать квартиру' })).toHaveAttribute('href', '#flats');
});
```

- [ ] **Step 2: Buy.astro**

Section `id="buy" title="Ипотека от 6%<br>или рассрочка без переплаты"`. Карточки из `buyOptions` (разметка строк 540–545 прототипа): `big` → `<b class="big">`, `accent` → класс `acc` и ссылка `<a class="btn" href="#flats">Выбрать квартиру</a>`. CSS: строки 155–162, у `.buy-c.acc` фон `var(--copper-strong)`, `p { color: #fff }`. Медиа: 2 колонки при 980px, 1 при 640px.

- [ ] **Step 3: index.astro** — `<Buy />` после второго `<BarkDivider />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Как купить»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Застройщик и эскроу

**Files:**
- Create: `src/components/Developer.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('застройщик', async ({ page }) => {
  const s = page.locator('#dev');
  expect(await textOf(s.locator('h2'))).toBe(copy.dev.h2);
  expect(await textOf(s.locator('.escrow h3'))).toBe(copy.dev.escrow);
  await expect(s.locator('.num')).toHaveCount(4);
  await expect(s.locator('.flow li')).toHaveCount(3);
});
```

- [ ] **Step 2: Developer.astro**

Section `id="dev" title="СК «Высота-16»<br>строит в Казани с 2011&nbsp;года" flushTop`. Слева `.dev-nums` из `developerNums` через `<NumCard class="dev-num" />` (крупный паддинг `.dev-nums :global(.dev-num) { padding: 24px }`). Справа `.escrow` из `escrow`: `h3`, `p`, шаги как `<ol class="flow">` из трёх `<li>`, стрелки между ними рисуются CSS (`li + li::before { content: '→' }`, цвет `var(--copper)`) вместо `<span>` прототипа: так у шагов нет лишнего текста для скринридера. CSS: строки 163–174 с поправкой под `ol`. Медиа: `.dev` 1 колонка при 980px; `.dev-nums` 1 колонка при 640px; `.flow` 1 колонка при 640px, стрелки повернуть (`transform: rotate(90deg)`).

- [ ] **Step 3: index.astro** — `<Developer />` после `<Buy />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Застройщик»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Частые вопросы

**Files:**
- Create: `src/components/Faq.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/sections.spec.ts`

- [ ] **Step 1: Падающий тест**

```ts
test('частые вопросы', async ({ page }) => {
  const s = page.locator('#faq');
  expect(await textOf(s.locator('h2'))).toBe(copy.faq.h2);
  await expect(s.locator('details')).toHaveCount(5);
  await expect(s.locator('summary')).toHaveText(copy.faq.items.map(([q]) => q));
  for (const d of await s.locator('details').all()) await d.evaluate((el) => ((el as HTMLDetailsElement).open = true));
  await expect(s.locator('details p')).toHaveText(copy.faq.items.map(([, a]) => a));
  await page.reload();
  await expect(s.locator('details').first()).toHaveAttribute('open', '');
  const second = s.locator('details').nth(1);
  await second.locator('summary').click();
  await expect(second.locator('p')).toBeVisible();
});
```

- [ ] **Step 2: Faq.astro**

Section `id="faq" tone="paper-2" title="О чём спрашивают<br>перед покупкой"`. `<div class="faq">` и `faq.map((f, i) => <details open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>)`. CSS: строки 175–183.

- [ ] **Step 3: index.astro** — `<Faq />` после `<Developer />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test:e2e
git add -A
git commit -m "Секция «Частые вопросы»

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: Форма подбора

**Files:**
- Create: `src/lib/forms.ts`, `src/components/PickForm.astro`, `tests/e2e/forms.spec.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Падающий тест**

`tests/e2e/forms.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { copy } from './copy';
import { textOf } from './helpers';

test.beforeEach(async ({ page }) => { await page.goto('./'); });

test.describe('форма подбора', () => {
  test('тексты', async ({ page }) => {
    const s = page.locator('#pick');
    expect(await textOf(s.locator('h2'))).toBe(copy.pick.h2);
    expect(await textOf(s.locator('.lead'))).toBe(copy.pick.lead);
  });

  test('пустая отправка показывает три ошибки и фокусирует имя', async ({ page }) => {
    const form = page.locator('#pick form');
    await form.getByRole('button', { name: 'Получить подборку' }).click();
    await expect(form.locator('.err:visible')).toHaveCount(3);
    await expect(form.getByLabel('Имя')).toBeFocused();
    await expect(form.getByLabel('Имя')).toHaveAttribute('aria-invalid', 'true');
  });

  test('неверный телефон', async ({ page }) => {
    const form = page.locator('#pick form');
    await form.getByLabel('Имя').fill('Анна');
    await form.getByLabel('Телефон').fill('123');
    await form.getByLabel('Согласен на обработку персональных данных').check();
    await form.getByRole('button', { name: 'Получить подборку' }).click();
    await expect(form.locator('.err:visible')).toHaveText(['Проверьте номер телефона']);
  });

  test('валидная заявка показывает «Заявка принята»', async ({ page }) => {
    const box = page.locator('#pick');
    const form = box.locator('form');
    await form.getByLabel('Имя').fill('Анна');
    await form.getByLabel('Телефон').fill('+7 900 123-45-67');
    await form.getByLabel('Бюджет').selectOption('8–12 млн ₽');
    await form.getByLabel('Согласен на обработку персональных данных').check();
    await form.getByRole('button', { name: 'Получить подборку' }).click();
    const ok = box.getByRole('heading', { name: copy.pick.success });
    await expect(ok).toBeVisible();
    await expect(ok).toBeFocused();
    await expect(form).toBeHidden();
    await expect(box).toContainText(copy.pick.demo);
  });
});
```

Run: `npx playwright test tests/e2e/forms.spec.ts` → FAIL.

- [ ] **Step 2: src/lib/forms.ts**

```ts
import { validateLead, submitLead, type LeadErrors, type LeadField, type LeadInput } from './leads';

const FIELDS: LeadField[] = ['name', 'phone', 'consent'];

function parts(form: HTMLFormElement) {
  const box = form.closest<HTMLElement>('[data-lead-box]');
  const success = box?.querySelector<HTMLElement>('[data-lead-success]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!box || !success || !submit) throw new Error('Форма заявки собрана без data-lead-box / data-lead-success / submit');
  return { box, success, submit };
}

function showErrors(form: HTMLFormElement, errors: LeadErrors) {
  for (const field of FIELDS) {
    const input = form.elements.namedItem(field) as HTMLInputElement | null;
    const msg = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (!input || !msg) continue;
    const text = errors[field];
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    msg.textContent = text ?? '';
    msg.hidden = !text;
  }
}

/** Подключает валидацию и демо-отправку к форме с data-kind="pick" | "booking". */
export function initLeadForm(form: HTMLFormElement, extra: () => Partial<LeadInput> = () => ({})) {
  const { success, submit } = parts(form);
  const kind = form.dataset.kind as LeadInput['kind'];
  const label = submit.textContent ?? '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const result = validateLead({
      kind,
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      budget: data.get('budget')?.toString(),
      purchase: data.get('purchase')?.toString(),
      consent: data.get('consent') === 'on',
      ...extra(),
    });
    if (!result.ok) {
      showErrors(form, result.errors);
      const first = FIELDS.find((f) => result.errors[f]);
      (form.elements.namedItem(first!) as HTMLElement | null)?.focus();
      return;
    }
    showErrors(form, {});
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    await submitLead(result.lead);
    submit.disabled = false;
    submit.textContent = label;
    form.hidden = true;
    success.hidden = false;
    success.querySelector<HTMLElement>('[data-lead-success-title]')?.focus();
  });
}

/** Возвращает форму в исходное состояние (для повторного открытия окна брони). */
export function resetLeadForm(form: HTMLFormElement) {
  const { success } = parts(form);
  form.reset();
  showErrors(form, {});
  form.hidden = false;
  success.hidden = true;
}
```

- [ ] **Step 3: PickForm.astro**

Разметка по строкам 600–634 прототипа со следующими изменениями:
- обёртка `<section id="pick" class="pick" aria-labelledby="pick-title">` с `.wrap` и `.final` внутри; внутренний столбец с формой получает `data-lead-box`;
- `h2`: `Подберём <span class="nowrap">3–5 квартир</span><br>под ваш бюджет` (`.nowrap { white-space: nowrap }`);
- `<form class="lead-form" data-kind="pick" novalidate>`;
- каждое поле: `<div class="field"><label for="pick-name">Имя</label><input id="pick-name" name="name" aria-required="true" aria-describedby="pick-name-err" placeholder="Как к вам обращаться" autocomplete="given-name"><p class="err" id="pick-name-err" data-error-for="name" hidden></p></div>`; то же для `phone` (`type="tel"`, `inputmode="tel"`, `autocomplete="tel"`, `placeholder="+7 900 000-00-00"`);
- селекты `name="budget"` (`id="pick-budget"`, label «Бюджет») и `name="purchase"` (`id="pick-purchase"`, label «Как планируете покупать») с опциями из `budgetOptions` / `purchaseOptions` (`src/data/pickOptions.ts`);
- чекбокс `<input type="checkbox" id="pick-consent" name="consent" aria-required="true" aria-describedby="pick-consent-err">` с label «Согласен на обработку персональных данных» и `<p class="err" ... data-error-for="consent" hidden>`;
- блок успеха `<div class="ok" data-lead-success hidden><h3 tabindex="-1" data-lead-success-title>Заявка принята</h3><p>Менеджер позвонит по номеру, который вы оставили.</p><p class="demo">Это учебный сайт, поэтому заявка никуда не отправлена.</p></div>`;
- скрипт:

```astro
<script>
  import { initLeadForm } from '../lib/forms';
  const form = document.querySelector<HTMLFormElement>('form[data-kind="pick"]');
  if (form) initLeadForm(form);
</script>
```

CSS делится на две части.

**Общие стили полей → `src/styles/global.css`**, потому что их использует и окно брони (задача 19). Возьми строки 190–199 прототипа (`form`, `label`, `input, select`, `placeholder`, `option`, `:focus`, `.row2`, `.agree`, `.agree input`) и оформи их под класс `.lead-form` с переменными цвета, чтобы одна и та же база работала на тёмном и светлом фоне:

```css
.lead-form { display: grid; gap: 12px; align-content: start;
  --f-label: #C9D4C4; --f-bg: rgba(255,255,255,.08); --f-bg-focus: rgba(255,255,255,.12);
  --f-border: rgba(255,255,255,.16); --f-text: var(--paper); --f-ph: #93A595; --f-err: #F6C9A0; }
.lead-form.light { --f-label: var(--ink-2); --f-bg: #fff; --f-bg-focus: #fff; --f-border: var(--line); --f-text: var(--ink); --f-ph: #8A8D91; --f-err: #A23B1F; }
.lead-form .field { display: grid; gap: 6px; font-size: 13px; font-weight: 600; color: var(--f-label); }
.lead-form input, .lead-form select { font: 500 16px var(--font); padding: 15px 16px; border-radius: 12px; border: 1px solid var(--f-border); background: var(--f-bg); color: var(--f-text); outline: none; }
.lead-form input::placeholder { color: var(--f-ph); }
.lead-form select option { color: var(--ink); }
.lead-form input:focus, .lead-form select:focus { border-color: var(--copper); background: var(--f-bg-focus); }
.lead-form input[aria-invalid="true"] { border-color: var(--f-err); }
.lead-form .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lead-form .agree { display: flex; gap: 10px; align-items: flex-start; font-weight: 500; font-size: 13px; color: var(--f-label); }
.lead-form .agree input { width: 18px; height: 18px; margin: 1px 0 0; padding: 0; accent-color: var(--copper-strong); }
.lead-form .err { margin: 0; font-size: 13px; font-weight: 600; color: var(--f-err); }
@media (max-width: 640px) { .lead-form .row2 { grid-template-columns: 1fr; } }
```

`.f-err` на тёмно-зелёном `#F6C9A0` даёт 5,9:1, на светлом `#A23B1F` даёт 5,9:1. У формы подбора класс `lead-form`, у формы брони `lead-form light`.

**Стили секции → `PickForm.astro`**: строки 185–189 (`.final`, `.final .lead`, `.final ul`, `.final li::before`, без `.final .eyebrow`), 200–202 (`.ok`, `.ok h3`, `.ok p`) **без `display: none` у `.ok`**, 204 (`.demo` с цветом `#B5C3B1`). Строки 203 (`.sent ...`) не переносить, видимость управляется `hidden`. Сама секция не использует `Section`, поэтому задай ей `.pick { padding: clamp(64px, 9vw, 120px) 0; scroll-margin-top: var(--hdr-h); }`. Медиа: `.final` 1 колонка при 980px.

- [ ] **Step 4: index.astro** — `<PickForm />` последним в `<main>`.

- [ ] **Step 5: Проверка и commit**

```bash
npm run check && npm run test && npm run test:e2e
git add -A
git commit -m "Форма подбора с валидацией и демо-отправкой

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: Окно брони

**Files:**
- Create: `src/components/BookingDialog.astro`
- Modify: `src/pages/index.astro`, `tests/e2e/forms.spec.ts`

- [ ] **Step 1: Падающий тест** (дописать в `forms.spec.ts`)

```ts
test.describe('бронь', () => {
  test('открывается с нужной квартирой, Esc закрывает, фокус возвращается', async ({ page }) => {
    const btn = page.locator('button[data-flat="penthouse"]');
    await btn.click();
    const dlg = page.getByRole('dialog', { name: copy.booking.title });
    await expect(dlg).toBeVisible();
    await expect(dlg.locator('[data-booking-what]')).toHaveText('Пентхаус · от 33 млн ₽');
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(btn).toBeFocused();
  });

  test('без согласия не бронирует, с согласием показывает «Бронь оформлена»', async ({ page }) => {
    await page.locator('button[data-flat="studio"]').click();
    const dlg = page.getByRole('dialog', { name: copy.booking.title });
    await dlg.getByLabel('Имя').fill('Олег');
    await dlg.getByLabel('Телефон').fill('8 843 000 12 12');
    await dlg.getByRole('button', { name: 'Перейти к оплате брони' }).click();
    await expect(dlg.locator('.err:visible')).toHaveText(['Нужно согласие на обработку данных']);
    await dlg.getByLabel('Согласен на обработку персональных данных').check();
    await dlg.getByRole('button', { name: 'Перейти к оплате брони' }).click();
    await expect(dlg.getByRole('heading', { name: copy.booking.success })).toBeVisible();
  });

  test('повторное открытие сбрасывает форму', async ({ page }) => {
    await page.locator('button[data-flat="one"]').click();
    const dlg = page.getByRole('dialog', { name: copy.booking.title });
    await dlg.getByRole('button', { name: 'Перейти к оплате брони' }).click();
    await dlg.getByRole('button', { name: 'Закрыть' }).click();
    await page.locator('button[data-flat="two"]').click();
    await expect(dlg.locator('.err:visible')).toHaveCount(0);
    await expect(dlg.locator('[data-booking-what]')).toHaveText('2-комнатная · от 13,5 млн ₽');
  });
});
```

- [ ] **Step 2: BookingDialog.astro**

Разметка по строкам 648–661 прототипа с изменениями:
- `<dialog id="booking" aria-labelledby="booking-title">`, внутри `<div class="dlg" data-lead-box>`;
- крестик `<button type="button" class="x" data-close aria-label="Закрыть">×</button>`;
- `<h3 id="booking-title">Бронь на 7 дней</h3>`, текст из прототипа (с `15&nbsp;000&nbsp;₽`);
- `.sum`: `<span data-booking-what></span><span>15&nbsp;000&nbsp;₽</span>`;
- `<form class="lead-form light" data-kind="booking" novalidate>` с полями `booking-name`, `booking-phone` и чекбоксом `booking-consent` «Согласен на обработку персональных данных» по той же схеме, что в PickForm (`.err`, `aria-describedby`, `aria-required`); кнопка «Перейти к оплате брони»;
- успех: `<div class="ok" data-lead-success hidden><h3 tabindex="-1" data-lead-success-title>Бронь оформлена</h3><p>Менеджер свяжется, чтобы подобрать конкретную квартиру и этаж.</p><p class="demo">Это учебный сайт: оплаты и бронирования нет.</p></div>`.

Скрипт:
```astro
<script>
  import { initLeadForm, resetLeadForm } from '../lib/forms';

  const dlg = document.getElementById('booking') as HTMLDialogElement | null;
  const form = dlg?.querySelector<HTMLFormElement>('form');
  const what = dlg?.querySelector<HTMLElement>('[data-booking-what]');
  if (dlg && form && what) {
    let opener: HTMLElement | null = null;
    let flatType = '';
    initLeadForm(form, () => ({ flatType }));

    document.querySelectorAll<HTMLButtonElement>('button[data-book]').forEach((btn) => {
      btn.addEventListener('click', () => {
        opener = btn;
        flatType = btn.dataset.flat ?? '';
        what.textContent = btn.dataset.book ?? '';
        resetLeadForm(form);
        dlg.showModal();
      });
    });
    dlg.querySelector('[data-close]')?.addEventListener('click', () => dlg.close());
    // клик по фону: у dialog нет паддинга, поэтому target === dlg только вне .dlg
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => opener?.focus());
  }
</script>
```

CSS: строки 212–218 и 221–223 прототипа (`dialog`, `::backdrop`, `.dlg`, `.dlg h3`, `.dlg p`, `.x`, `.sum`, `.dlg .ok`). Строки 219–220 (`.dlg label`, `.dlg input`) не нужны: поля берут общие стили `.lead-form.light` из `global.css`. Добавь `.ok { border-radius: 16px; padding: 20px; background: var(--pine-2) } .ok h3 { font-size: 22px; margin-bottom: 6px } .ok p, .demo { color: var(--ink-2) } .demo { font-size: 12px; margin-top: 8px }`.

- [ ] **Step 3: index.astro** — `<BookingDialog />` после `<MobileBar />`.

- [ ] **Step 4: Проверка и commit**

```bash
npm run check && npm run test && npm run test:e2e
git add -A
git commit -m "Окно брони

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: Сквозные проверки страницы

**Files:**
- Modify: `tests/e2e/page.spec.ts`

- [ ] **Step 1: Тесты** (дописать в `page.spec.ts`)

```ts
test('все секции на месте и якоря шапки ведут к ним', async ({ page }) => {
  for (const id of ['hero', 'area', 'yard', 'who', 'flats', 'houses', 'buy', 'dev', 'faq', 'pick']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  const hrefs = await page.locator('header nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const href of hrefs) await expect(page.locator(href!)).toHaveCount(1);
});

test('нет плашек над заголовками и длинных тире', async ({ page }) => {
  await expect(page.locator('.eyebrow, .tag, .pill')).toHaveCount(0);
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('—');
});

test('у всех картинок есть alt', async ({ page }) => {
  const alts = await page.locator('img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('alt')));
  for (const alt of alts) expect(alt?.trim()).toBeTruthy();
});

test('нет горизонтального скролла', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
```

- [ ] **Step 2: Проверка**

Run: `npm run test:e2e`
Expected: всё зелёное в обоих проектах. Если горизонтальный скролл есть на 375px, найди виновника: `[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth)` в DevTools. Почини его, тест не ослабляй.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Сквозные e2e-проверки страницы

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21 (координатор): Конвейер картинок

**Files:**
- Create: `docs/images/building-bible.md`, `docs/images/shots.md`, `scripts/gen-image.sh`, `scripts/pick-take.sh`, `scripts/make-og.mjs`

- [ ] **Step 1: building-bible.md**

```markdown
# Библия дома «Береста»

Этот блок вставляется в каждый промпт целиком и не меняется. Если дом на кадре не совпадает с описанием, перегенерируем кадр, а описание не трогаем.

<!-- bible:start -->
Residential complex "Beresta" on the edge of a city, next to a pine forest and a river. Exactly THREE residential buildings forming a U-shaped quarter around a car-free courtyard. Building 1: 9 floors. Building 2: 12 floors. Building 3: 14 floors. Seen from the river they step up in height from left to right: 9, 12, 14. Flat roofs. Facades: warm off-white fibre-cement panels with vertical light larch wood lamellas between window columns; large windows in graphite-grey frames, regular grid, same window rhythm on every floor; the top floor of building 3 has setback penthouse terraces with glass railings. Ground floor of each building: tall 5-metre glazed lobby entrances with a thin copper-toned canopy. No balconies sticking out, no colourful accents, no logos or signage, no text. Mature tall pine trees in the foreground and around. Calm, realistic architectural photography, natural morning light, soft river fog, colour palette: warm white, graphite, dark pine green, muted copper. Photorealistic, 35mm lens, no people unless stated, no cars in the courtyard.
<!-- bible:end -->
```

- [ ] **Step 2: shots.md**

```markdown
# Кадры

Каждый кадр горизонтальный, 1536×1024. Главное держим в центральной части кадра: края срезаются под разные экраны.

## 01-hero
Landscape 3:2. View from the river bank in early morning: calm water in the foreground with low mist drifting over it, a band of tall pines, and behind them all three buildings fully visible, stepping up 9, 12, 14 floors from left to right. Soft warm sunrise light from the right, light haze. Keep the buildings in the centre-right two thirds of the frame and leave calm sky in the upper third. No people.

## 02-yard
Landscape 3:2. Eye-level view inside the car-free courtyard between the buildings on a bright morning: a playground with wooden equipment for small kids, a few children playing, a parent on a bench, young trees and lawns, paved paths with a scooter. The buildings frame the courtyard on three sides; tall pines are visible above the roofline behind. Absolutely no cars.

## 03-family
Landscape 3:2. A young mother pushing a stroller along a sandy path in a sunlit pine forest, seen from behind at a slight angle. Between the tree trunks in the background the facade of building 1 (9 floors) is visible, softly out of focus. Morning light through the pines, light mist.

## 04-workfromhome
Landscape 3:2. Interior of a light studio apartment: a simple wooden desk with a laptop and a coffee cup by a large floor-to-ceiling window in a graphite frame. Through the window: tall pines and, partly, the facade of a neighbouring building of the complex with the same light panels and wood lamellas. Calm morning light, white walls, light oak floor. No people.

## 05-kitchen
Landscape 3:2. Interior of a spacious kitchen-living room in light wood and warm white, windows on two sides showing pine trees. A family with two teenagers at a dining table, natural candid moment, faces not in close-up. Minimal Scandinavian furniture, linen, oak floor, morning light.

## 06-construction
Landscape 3:2. Dawn view of the complex from the forest edge: buildings 1 and 2 are finished (9 and 12 floors, light facades with wood lamellas), building 3 (14 floors) is under construction with its concrete frame complete and facade panels installed on the lower half, a tower crane next to it. Warm sunrise sky, light mist, tall pines in the foreground. No people.
```

- [ ] **Step 3: gen-image.sh**

```bash
#!/usr/bin/env bash
# Генерирует один дубль кадра через Codex.
# Использование: scripts/gen-image.sh <shot-id> [номер-дубля]
set -euo pipefail

ID="${1:?Укажите id кадра, например 01-hero}"
TAKE="${2:-1}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

BIBLE="$(sed -n '/<!-- bible:start -->/,/<!-- bible:end -->/p' "$ROOT/docs/images/building-bible.md" | sed '1d;$d')"
SCENE="$(awk -v id="## $ID" '$0 == id {f = 1; next} /^## / {f = 0} f' "$ROOT/docs/images/shots.md")"
[ -n "$SCENE" ] || { echo "Нет кадра $ID в docs/images/shots.md" >&2; exit 1; }

OUT_DIR="$ROOT/src/assets/photos/takes"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/$ID.take-$TAKE.png"

REF_ARGS=()
REF_NOTE=""
if [ "$ID" != "01-hero" ]; then
  REF="$ROOT/src/assets/photos/01-hero.png"
  [ -f "$REF" ] || { echo "Сначала нужен утверждённый эталон src/assets/photos/01-hero.png" >&2; exit 1; }
  REF_ARGS=(-i "$REF")
  REF_NOTE="Use the attached image as the exact reference for the buildings: same number of buildings, same floor counts (9, 12, 14), same facade materials, colours and window rhythm. Do not invent new buildings."
fi

PROMPT="Generate exactly one photorealistic image with your image generation tool, landscape 1536x1024. Do not write or run code.
$REF_NOTE
BUILDINGS (never change): $BIBLE
SCENE: $SCENE
When the image is ready, save it as a PNG file to: $OUT"

MARK="$(mktemp)"
trap 'rm -f "$MARK"' EXIT

codex exec --skip-git-repo-check -s workspace-write -C "$ROOT" ${REF_ARGS[@]+"${REF_ARGS[@]}"} -- "$PROMPT"

if [ ! -f "$OUT" ]; then
  NEW="$(find "$HOME/.codex/generated_images" -type f -name '*.png' -newer "$MARK" -print0 | xargs -0 ls -t 2>/dev/null | head -1 || true)"
  [ -n "$NEW" ] || { echo "Codex не вернул картинку" >&2; exit 1; }
  cp "$NEW" "$OUT"
fi
echo "$OUT"
```

- [ ] **Step 4: pick-take.sh и make-og.mjs**

`scripts/pick-take.sh`:
```bash
#!/usr/bin/env bash
# Делает выбранный дубль кадром: scripts/pick-take.sh <shot-id> <номер-дубля>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/assets/photos/takes/${1:?id}.take-${2:?номер}.png"
[ -f "$SRC" ] || { echo "Нет файла $SRC" >&2; exit 1; }
cp "$SRC" "$ROOT/src/assets/photos/$1.png"
echo "src/assets/photos/$1.png"
```

`scripts/make-og.mjs`:
```js
// Делает public/og.jpg 1200×630 из эталонного кадра. Запуск: node scripts/make-og.mjs
import sharp from 'sharp';

await sharp('src/assets/photos/01-hero.png')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og.jpg');
console.log('public/og.jpg');
```

```bash
chmod +x scripts/gen-image.sh scripts/pick-take.sh
```

- [ ] **Step 5: Пробный запуск скрипта**

Run: `scripts/gen-image.sh 01-hero 1`
Expected: в конце путь `src/assets/photos/takes/01-hero.take-1.png`, файл открывается и это картинка 1536×1024 (`sips -g pixelWidth -g pixelHeight <файл>`). Если Codex сохраняет картинку в другом месте или отказывается, почини скрипт, прежде чем идти дальше.

- [ ] **Step 6: Commit**

```bash
git add docs/images scripts
git commit -m "Конвейер генерации кадров через Codex

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22 (координатор): Эталонный кадр. КОНТРОЛЬНАЯ ТОЧКА

- [ ] **Step 1:** Сделать ещё 3 дубля: `scripts/gen-image.sh 01-hero 2`, `… 3`, `… 4`. Их можно запускать параллельно в фоне.
- [ ] **Step 2:** Каждый дубль проверить по чек-листу: ровно 3 корпуса, высоты растут слева направо, светлый фасад с вертикальными деревянными ламелями, графитовые рамки, сосны на переднем плане, туман над водой, нет текста и логотипов, композиция переживёт кроп 16:9 и мобильный кроп. Дубли, не прошедшие проверку, выбросить и заменить новыми.
- [ ] **Step 3:** Показать Артёму прошедшие дубли (SendUserFile или страница сравнения в браузере) и спросить, какой берём. **Ждать ответа.**
- [ ] **Step 4:** `scripts/pick-take.sh 01-hero <N>`, `node scripts/make-og.mjs`.
- [ ] **Step 5:** Commit:

```bash
git add src/assets/photos/01-hero.png public/og.jpg
git commit -m "Эталонный кадр первого экрана и og.jpg

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23 (координатор): Остальные кадры. КОНТРОЛЬНАЯ ТОЧКА

- [ ] **Step 1:** Для каждого из `02-yard`, `03-family`, `04-workfromhome`, `05-kitchen`, `06-construction` по 2 дубля: `scripts/gen-image.sh <id> 1` и `… 2`. Можно параллельно в фоне. Эталон передаётся скриптом сам.
- [ ] **Step 2:** Чек-лист по каждому дублю: дом совпадает с эталоном (материалы, цвет, рамки, ритм окон; этажность там, где корпус виден целиком), во дворе нет машин, нет текста, логотипов и искажённых лиц или рук, в интерьерах за окном сосны или тот же фасад. Не прошёл, значит перегенерировать (до 3 попыток на кадр), потом спросить Артёма.
- [ ] **Step 3:** Показать Артёму лучший дубль каждого кадра рядом с эталоном. **Ждать утверждения.**
- [ ] **Step 4:** `scripts/pick-take.sh <id> <N>` для каждого.
- [ ] **Step 5:** commit в `feat/images`:

```bash
git add src/assets/photos
git commit -m "Кадры двора, аудиторий и стройки

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 24: CI и деплой

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

- [ ] **Step 1: ci.yml**

```yaml
name: CI

on:
  pull_request:
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run check
      - run: npm run test
      - run: npm run test:e2e
```

- [ ] **Step 2: deploy.yml** (по официальной инструкции Astro)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install, build, and upload
        uses: withastro/action@v6
        with:
          node-version: 24

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Перед коммитом сверь мажорные версии экшенов с документацией (context7 `/withastro/docs`, запрос «deploy github pages workflow»). Если у `actions/setup-node` есть мажор новее, бери его.

- [ ] **Step 3: Commit и PR**

```bash
git add .github
git commit -m "CI на pull request и деплой на GitHub Pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin feat/landing
gh pr create --title "Лендинг ЖК «Береста»" --body "Лендинг по спеке docs/superpowers/specs/2026-10-26-beresta-landing-design.md и прототипу v3.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

Expected: CI на PR зелёный. Если красный, починить в ветке.

---

### Task 25 (координатор): Финальная проверка и публикация. КОНТРОЛЬНЫЕ ТОЧКИ

- [ ] **Step 0:** Ветка `feat/images` уже смержена в `feat/landing` (см. «Порядок и параллельность»). Подобрать `focus` в `src/assets/photos/index.ts` под каждый кадр, глядя на страницу на 1280 и 375: главный объект не должен срезаться. `npm run test:e2e`, commit.
- [ ] **Step 1:** Визуальная сверка с прототипом на 1280, 768, 375 (`npm run preview`, браузер). Список расхождений с прототипом, кроме согласованных: тёмная медь, нет плашек, настоящие фото, схемы планировок, иконки двора, чекбокс в брони. Каждое найденное расхождение починить.
- [ ] **Step 2:** Код-ревью всей ветки (superpowers:requesting-code-review), замечания исправить.
- [ ] **Step 3:** Показать Артёму превью страницы. **Ждать «публикуем».**
- [ ] **Step 4:** Включить Pages и смержить:

```bash
gh api -X POST repos/aislam23/beresta/pages -f build_type=workflow
gh pr merge --squash --delete-branch
```

- [ ] **Step 5:** Дождаться зелёного деплоя (`gh run list --workflow deploy.yml --limit 1`), открыть `https://aislam23.github.io/beresta/` и проверить: шрифт, все 6 кадров, `og.jpg` по абсолютному адресу, формы, окно брони.
- [ ] **Step 6:** Lighthouse на опубликованной странице, мобильный профиль: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95. Ниже порога: разобраться и починить отдельным PR.
- [ ] **Step 7:** Отдать Артёму ссылку на сайт и результаты Lighthouse.
