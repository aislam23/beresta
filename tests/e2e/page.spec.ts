import { test, expect } from '@playwright/test';

test('страница открывается по base /beresta/', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('ЖК «Береста» в Казани: квартиры у соснового бора');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
});
