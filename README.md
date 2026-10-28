# ЖК «Береста»: лендинг

Учебный лендинг вымышленного жилого комплекса «Береста» (Казань). Бриф: [brief.md](brief.md). Сайт: https://aislam23.github.io/beresta/

Стек: Astro 7, статическая сборка, публикация на GitHub Pages через GitHub Actions (`.github/workflows/deploy.yml`, деплой при пуше в `main`).

## Команды

```bash
npm install
npm run dev        # локально: http://localhost:4321/beresta/
npm run build      # сборка в dist/
npm run check      # проверка типов
npm run test       # юнит-тесты (Vitest)
npm run test:e2e   # e2e (Playwright, 1280 и 375)
```

## Картинки

Кадры генерируются через Codex с одним эталоном дома: описание дома в `docs/images/building-bible.md`, сцены в `docs/images/shots.md`.

```bash
scripts/gen-image.sh 02-yard 1   # дубль в src/assets/photos/takes/
scripts/pick-take.sh 02-yard 1   # выбранный дубль становится кадром
node scripts/make-og.mjs         # public/og.jpg из эталона
```

Документы проекта: спека `docs/superpowers/specs/`, план `docs/superpowers/plans/`, утверждённый прототип `docs/prototype/prototype-v3.html`.
