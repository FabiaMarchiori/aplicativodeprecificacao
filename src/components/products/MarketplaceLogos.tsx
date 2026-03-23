import logoMercadoLivre from '@/assets/logo-mercado-livre.png';
import logoShopee from '@/assets/logo-shopee.png';
import logoAmazon from '@/assets/logo-amazon.png';
import { Store } from 'lucide-react';

export const MarketplaceLogo = ({ channelId, size = 20 }: { channelId: string; size?: number }) => {
  switch (channelId) {
    case 'mercado-livre-classico':
    case 'mercado-livre-premium':
      return <img src={logoMercadoLivre} alt="Mercado Livre" width={size} height={size} className="object-contain" />;
    case 'shopee':
      return <img src={logoShopee} alt="Shopee" width={size} height={size} className="object-contain" />;
    case 'amazon':
      return <img src={logoAmazon} alt="Amazon" width={size} height={size} className="object-contain" />;
    case 'loja-propria':
    default:
      return <Store style={{ width: size, height: size, color: 'hsl(217 80% 60%)' }} />;
  }
};

export const getChannelColor = (channelId: string): string => {
  switch (channelId) {
    case 'mercado-livre-classico':
      return '48 70% 50%';
    case 'mercado-livre-premium':
      return '45 65% 45%';
    case 'shopee':
      return '14 75% 50%';
    case 'amazon':
      return '30 80% 48%';
    case 'loja-propria':
    default:
      return '217 75% 55%';
  }
};
