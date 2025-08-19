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
    priceId: 'price_1Rxyc9L6DzuVZFHtbSySHzrO',
    name: 'ReviewBoostSC',
    description: 'Boost your business reviews with ReviewBoostSC.',
    mode: 'subscription',
    price: 29.99,
  },
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};