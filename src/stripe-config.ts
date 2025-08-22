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
    id: 'prod_SunRK1PuWIi83y',
    priceId: 'price_1RyxqPL6DzuVZFHtTAokGNrQ',
    name: 'ReviewBoostSC Test',
    description: 'Testing',
    mode: 'subscription',
    price: 19,
  },
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};