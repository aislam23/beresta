import { test, expect } from '@playwright/test';
import { copy } from './copy';
import { textOf } from './helpers';

test.beforeEach(async ({ page }) => { await page.goto('./'); });

test('шапка: логотип, навигация, телефон, кнопка подбора', async ({ page, isMobile }) => {
  const header = page.locator('header');
  await expect(header.getByRole('link', { name: '«Береста», в начало страницы' })).toHaveAttribute('href', '#hero');
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

test('район', async ({ page }) => {
  const s = page.locator('#area');
  expect(await textOf(s.locator('h2'))).toBe(copy.area.h2);
  expect(await textOf(s.locator('.lead'))).toBe(copy.area.lead);
  await expect(s.locator('.dist-row')).toHaveCount(5);
  await expect(s.getByRole('img', { name: 'Схема района: бор, набережная, метро, школа и ТЦ вокруг комплекса' })).toBeVisible();
});

test('двор', async ({ page }) => {
  const s = page.locator('#yard');
  expect(await textOf(s.locator('h2'))).toBe(copy.yard.h2);
  expect(await textOf(s.locator('.lead'))).toBe(copy.yard.lead);
  await expect(s.locator('.feat h3')).toHaveText(['Подземный паркинг на 320 мест', 'Площадки для всех возрастов', 'Лобби с консьержем', 'Кладовки от 4 м²']);
  // toHaveText нормализует пробелы через \s+, а \s включает NBSP, поэтому «4 м²» совпадает с «4\u00a0м²»
  await expect(s.locator('.feat svg[aria-hidden="true"]')).toHaveCount(4);
  await expect(s.locator('.shop')).toHaveCount(4);
});
