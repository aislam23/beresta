import type { Locator } from '@playwright/test';

/** innerText без NBSP, переводов строк и двойных пробелов. */
export const norm = (s: string) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
export const textOf = async (l: Locator) => norm(await l.innerText());
