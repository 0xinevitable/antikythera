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
  Econia: {
    name: 'Econia',
    color: Colors.Econia,
    src: '/assets/logo-econia.jpg',
  },
  Pontem: {
    name: 'Pontem',
    color: Colors.Pontem,
    src: '/assets/logo-pontem.jpg',
  },
  SushiSwap: {
    name: 'SushiSwap',
    color: Colors.Sushi,
    src: '/assets/logo-sushi.png',
  },
};

export type BrandInfo = (typeof Brands)[keyof typeof Brands];
