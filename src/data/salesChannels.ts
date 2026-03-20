export interface SalesChannel {
  id: string;
  name: string;
  icon: string; // emoji
  commissionPercent: number;
  fixedFee: number;
  additionalCost: number;
  salesTax: number;
  cardFee: number;
  active: boolean;
}

export const DEFAULT_SALES_CHANNELS: SalesChannel[] = [
  {
    id: 'loja-propria',
    name: 'Loja Própria',
    icon: '🏪',
    commissionPercent: 0,
    fixedFee: 0,
    additionalCost: 0,
    salesTax: 6,
    cardFee: 4.99,
    active: true,
  },
  {
    id: 'mercado-livre-classico',
    name: 'Mercado Livre Clássico',
    icon: '🟡',
    commissionPercent: 11,
    fixedFee: 6,
    additionalCost: 0,
    salesTax: 12.5,
    cardFee: 0,
    active: true,
  },
  {
    id: 'mercado-livre-premium',
    name: 'Mercado Livre Premium',
    icon: '🟡',
    commissionPercent: 16,
    fixedFee: 6,
    additionalCost: 0,
    salesTax: 12.5,
    cardFee: 0,
    active: true,
  },
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '🟠',
    commissionPercent: 14,
    fixedFee: 0,
    additionalCost: 2,
    salesTax: 12.5,
    cardFee: 0,
    active: true,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    commissionPercent: 15,
    fixedFee: 0,
    additionalCost: 0,
    salesTax: 12.5,
    cardFee: 0,
    active: true,
  },
];

/**
 * Calculates total platform fee rate for a channel (as %).
 */
export const getChannelTotalFeePercent = (channel: SalesChannel): number => {
  return channel.commissionPercent + channel.salesTax + channel.cardFee;
};

/**
 * Calculates total fixed costs per unit for a channel.
 */
export const getChannelFixedCosts = (channel: SalesChannel): number => {
  return channel.fixedFee + channel.additionalCost;
};
