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
