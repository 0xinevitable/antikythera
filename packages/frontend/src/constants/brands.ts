import { Colors } from './colors';

export const Brands = {
  Aptos: {
    name: 'Aptos',
    color: Colors.Aptos,
    src: '/assets/logo-aptos.png',
  },
  AptosNames: {
    name: 'Aptos Names',
    color: Colors.AptosNeon,
    src: '/assets/logo-aptos-neon.png',
  },
  Nodit: {
    name: 'Nodit',
    color: Colors.Nodit,
    src: '/assets/logo-nodit.png',
  },
  ThalaSwap: {
    name: 'Thala Swap',
    color: Colors.Thala,
    src: '/assets/logo-thala.png',
  },
  DefiLlama: {
    name: 'DefiLlama',
    color: Colors.DefiLlama,
    src: '/assets/logo-defillama.png',
  },
  KanaSwap: {
    name: 'KanaSwap',
    color: Colors.KanaLabs,
    src: '/assets/logo-kanalabs.png',
  },
  Echelon: {
    name: 'Echelon',
    color: Colors.Echelon,
    src: '/assets/logo-echelon.png',
  },
};

export type BrandInfo = (typeof Brands)[keyof typeof Brands];
