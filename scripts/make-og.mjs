// Делает public/og.jpg 1200×630 из эталонного кадра. Запуск: node scripts/make-og.mjs
import sharp from 'sharp';

await sharp('src/assets/photos/01-hero.png')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og.jpg');
console.log('public/og.jpg');
