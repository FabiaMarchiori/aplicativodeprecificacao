import React from 'react';

export const MarketplaceLogo = ({ channelId, size = 20 }: { channelId: string; size?: number }) => {
  const s = size;
  switch (channelId) {
    case 'mercado-livre-classico':
    case 'mercado-livre-premium':
      // Mercado Livre – stylized handshake icon (their actual brand mark)
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#FFE600"/>
          <path d="M9.5 18.5C9.5 14 12 11.5 16 11.5C20 11.5 22.5 14 22.5 18.5" stroke="#2D3277" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M12 18.5C12 16 13.5 14 16 14C18.5 14 20 16 20 18.5" stroke="#2D3277" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M14.5 18.5C14.5 17.5 15.2 16.5 16 16.5C16.8 16.5 17.5 17.5 17.5 18.5" stroke="#2D3277" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        </svg>
      );
    case 'shopee':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#EE4D2D"/>
          <path d="M16 7c-2.5 0-4.5 1.7-4.9 4h2c.4-1.2 1.5-2 2.9-2s2.5.8 2.9 2h2C20.5 8.7 18.5 7 16 7z" fill="#fff"/>
          <path d="M10.5 13c0 3.8 2.5 7 5.5 8.5 3-1.5 5.5-4.7 5.5-8.5h-11z" fill="#fff"/>
          <text x="16" y="19.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#EE4D2D" fontFamily="Arial, sans-serif">S</text>
        </svg>
      );
    case 'amazon':
      // Amazon – smile arrow under text
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#131921"/>
          <text x="16" y="15.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF" fontFamily="Arial, sans-serif">a</text>
          <path d="M9 20c3 2.5 7 3.5 10 3 2-.3 3.5-1.2 4.5-2" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <path d="M21.5 18.5l2 2.5-2.8 1" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      );
    case 'loja-propria':
    default:
      // Storefront icon – colored with brand blue
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="hsl(217 80% 52% / 0.15)"/>
          <path d="M8 14l2-5h12l2 5" stroke="hsl(217 80% 60%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="14" width="14" height="10" rx="1" stroke="hsl(217 80% 60%)" strokeWidth="1.5" fill="none"/>
          <rect x="13" y="19" width="6" height="5" rx="0.5" stroke="hsl(217 80% 60%)" strokeWidth="1.2" fill="none"/>
          <circle cx="12" cy="14" r="2" fill="hsl(217 80% 52% / 0.15)" stroke="hsl(217 80% 60%)" strokeWidth="1"/>
          <circle cx="16" cy="14" r="2" fill="hsl(217 80% 52% / 0.15)" stroke="hsl(217 80% 60%)" strokeWidth="1"/>
          <circle cx="20" cy="14" r="2" fill="hsl(217 80% 52% / 0.15)" stroke="hsl(217 80% 60%)" strokeWidth="1"/>
        </svg>
      );
  }
};

export const getChannelColor = (channelId: string): string => {
  switch (channelId) {
    case 'mercado-livre-classico':
      return '48 80% 52%';
    case 'mercado-livre-premium':
      return '45 75% 48%';
    case 'shopee':
      return '12 78% 50%';
    case 'amazon':
      return '30 90% 50%';
    case 'loja-propria':
    default:
      return '217 80% 56%';
  }
};
