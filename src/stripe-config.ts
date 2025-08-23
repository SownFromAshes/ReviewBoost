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
    id: 'prod_Starter_ID', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_Starter_Monthly', // Placeholder: Replace with actual Stripe Price ID
    name: 'Starter',
    description: 'For solopreneurs & micro-SMBs.',
    mode: 'subscription',
    price: 19,
  },
  {
    id: 'prod_Growth_ID', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_Growth_Monthly', // Placeholder: Replace with actual Stripe Price ID
    name: 'Growth',
    description: 'Designed for 1–5 location businesses.',
    mode: 'subscription',
    price: 49,
  },
  {
    id: 'prod_Pro_ID', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_Pro_Monthly', // Placeholder: Replace with actual Stripe Price ID
    name: 'Pro / Agency',
    description: 'For franchises, agencies, or multi-location SMBs.',
    mode: 'subscription',
    price: 149, // Or 199, depending on your final decision
  },
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
