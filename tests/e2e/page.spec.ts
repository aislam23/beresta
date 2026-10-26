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
