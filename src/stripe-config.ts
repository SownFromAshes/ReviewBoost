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
    id: 'prod_Sv7cMUjJb9M6o2', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_1RzHN6PoAh9wZtczVvlJXaba', // Placeholder: Replace with actual Stripe Price ID
    name: 'Starter',
    description: 'For solopreneurs & micro-SMBs.',
    mode: 'subscription',
    price: 19,
  },
  {
    id: 'prod_Sv7cA2Fr3pSB1y', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_1RzHNcPoAh9wZtczlZ85bPP7', // Placeholder: Replace with actual Stripe Price ID
    name: 'Growth',
    description: 'Designed for 1–5 location businesses.',
    mode: 'subscription',
    price: 49,
  },
  {
    id: 'prod_Sv7dzbMIwOP9Lc', // Placeholder: Replace with actual Stripe Product ID
    priceId: 'price_1RzHNsPoAh9wZtcz9STEJwli', // Placeholder: Replace with actual Stripe Price ID
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
