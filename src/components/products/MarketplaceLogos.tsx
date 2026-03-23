import { Store, ShoppingBag, Package, Award, Tag } from 'lucide-react';

export const MarketplaceLogo = ({ channelId, size = 20 }: { channelId: string; size?: number }) => {
  const color = `hsl(${getChannelColor(channelId)})`;
  switch (channelId) {
    case 'mercado-livre-classico':
      return <Tag style={{ width: size, height: size, color }} />;
    case 'mercado-livre-premium':
      return <Award style={{ width: size, height: size, color }} />;
    case 'shopee':
      return <ShoppingBag style={{ width: size, height: size, color }} />;
    case 'amazon':
      return <Package style={{ width: size, height: size, color }} />;
    case 'loja-propria':
    default:
      return <Store style={{ width: size, height: size, color }} />;
  }
};

export const getChannelColor = (channelId: string): string => {
  switch (channelId) {
    case 'mercado-livre-classico':
      return '48 80% 52%';
    case 'mercado-livre-premium':
      return '45 75% 48%';
    case 'shopee':
      return '14 75% 50%';
    case 'amazon':
      return '30 80% 48%';
    case 'loja-propria':
    default:
      return '217 80% 56%';
  }
};
