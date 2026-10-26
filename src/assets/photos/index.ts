import type { ImageMetadata } from 'astro';

export type ShotId = '01-hero' | '02-yard' | '03-family' | '04-workfromhome' | '05-kitchen' | '06-construction';

// Кадры кладутся сюда как <id>.png (задачи 22–23). Пока файла нет, Photo рисует заглушку.
const files = import.meta.glob<{ default: ImageMetadata }>('./*.png', { eager: true });

export function getShot(id: ShotId): ImageMetadata | undefined {
  return files[`./${id}.png`]?.default;
}

/** Точка кадрирования для object-fit: cover. Уточняется в задаче 25 (шаг 0) по готовым кадрам. */
export const focus: Record<ShotId, string> = {
  '01-hero': '50% 60%',
  '02-yard': '50% 50%',
  '03-family': '50% 50%',
  '04-workfromhome': '50% 50%',
  '05-kitchen': '50% 50%',
  '06-construction': '50% 50%',
};
