// Делает public/og.jpg 1200×630 из эталонного кадра. Запуск: node scripts/make-og.mjs
import sharp from 'sharp';

const root = new URL('..', import.meta.url);
const out = new URL('public/og.jpg', root);

await sharp(new URL('src/assets/photos/01-hero.png', root).pathname)
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out.pathname);
console.log(out.pathname);
