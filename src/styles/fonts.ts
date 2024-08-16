import localFont from 'next/font/local';

export const SatoshiFont = localFont({
  src: '../../public/fonts/Satoshi-Variable.woff2',
  variable: '--satoshi-variable',
  fallback: ['sans-serif'],
});
