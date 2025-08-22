export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const products: Product[] = [
  {
    id: 'prod_StmAHFPBldFxcH',
    priceId: 'price_1RymREL6DzuVZFHtUUzyiCJl',
    name: 'Starter',
    description: 'For solopreneurs & micro-SMBs.',
    mode: 'subscription',
    price: 19,
  },
  {
    id: 'prod_StmAHFPBldFxcH',
    priceId: 'price_1RymRnL6DzuVZFHtDjvho20E',
    name: 'Growth',
    description: 'Designed for 1–5 location businesses.',
    mode: 'subscription',
    price: 49,
  },
  {
    id: 'prod_StmAHFPBldFxcH',
    priceId: 'price_1RymS0L6DzuVZFHtQYOTy31J',
    name: 'Pro / Agency',
    description: 'For franchises, agencies, or multi-location SMBs.',
    mode: 'subscription',
    price: 149,
  },
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
