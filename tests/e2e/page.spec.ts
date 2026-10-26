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

test('все секции на месте и якоря шапки ведут к ним', async ({ page }) => {
  for (const id of ['hero', 'area', 'yard', 'who', 'flats', 'houses', 'buy', 'dev', 'faq', 'pick']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  const hrefs = await page.locator('header nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const href of hrefs) await expect(page.locator(href!)).toHaveCount(1);
});

test('нет плашек над заголовками и длинных тире', async ({ page }) => {
  await expect(page.locator('.eyebrow, .tag, .pill')).toHaveCount(0);
  // textContent, а не innerText: так проверяются и закрытое окно брони, и скрытые блоки успеха
  const text = (await page.locator('body').textContent()) ?? '';
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
