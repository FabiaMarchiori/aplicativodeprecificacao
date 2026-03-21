import React from 'react';

export const MarketplaceLogo = ({ channelId, size = 20 }: { channelId: string; size?: number }) => {
  const s = size;
  switch (channelId) {
    case 'mercado-livre-classico':
    case 'mercado-livre-premium':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4z" fill="#FFE600"/>
          <path d="M16 6.5c-2.8 0-5.3 1.2-7 3.1.6.5 2.5 1.8 7 1.8s6.4-1.3 7-1.8c-1.7-1.9-4.2-3.1-7-3.1z" fill="#2D3277"/>
          <path d="M9 9.6C7.4 11.3 6.5 13.5 6.5 16c0 5.2 4.3 9.5 9.5 9.5s9.5-4.3 9.5-9.5c0-2.5-.9-4.7-2.5-6.4-.6.5-2.5 1.8-7 1.8S9.6 10.1 9 9.6z" fill="#3483FA"/>
          <path d="M12 17.5c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          <circle cx="12.5" cy="15" r="1.2" fill="#fff"/>
          <circle cx="19.5" cy="15" r="1.2" fill="#fff"/>
        </svg>
      );
    case 'shopee':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#EE4D2D"/>
          <path d="M16 7c-2.5 0-4.6 1.8-5 4.2h2.2c.3-1.2 1.4-2 2.8-2s2.5.8 2.8 2H21c-.4-2.4-2.5-4.2-5-4.2z" fill="#fff"/>
          <path d="M10 13c0 4 2.7 7.5 6 9 3.3-1.5 6-5 6-9H10z" fill="#fff"/>
          <text x="16" y="20" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EE4D2D">S</text>
        </svg>
      );
    case 'amazon':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#232F3E"/>
          <path d="M8 19.5c2.5 2 6 3.2 8.5 3.2 3.5 0 6.8-1.5 9.2-4" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M23 17l2.5 1.5-1 2.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <text x="16" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FF9900">a</text>
        </svg>
      );
    case 'loja-propria':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="hsl(225 16% 12%)"/>
          <path d="M8 14l2-5h12l2 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="14" width="14" height="10" rx="1" stroke="#fff" strokeWidth="1.5" fill="none"/>
          <rect x="13" y="19" width="6" height="5" rx="0.5" stroke="#fff" strokeWidth="1.2" fill="none"/>
          <circle cx="12" cy="14" r="2" fill="hsl(225 16% 12%)" stroke="#fff" strokeWidth="1"/>
          <circle cx="16" cy="14" r="2" fill="hsl(225 16% 12%)" stroke="#fff" strokeWidth="1"/>
          <circle cx="20" cy="14" r="2" fill="hsl(225 16% 12%)" stroke="#fff" strokeWidth="1"/>
        </svg>
      );
  }
};

export const getChannelColor = (channelId: string): string => {
  switch (channelId) {
    case 'mercado-livre-classico':
    case 'mercado-livre-premium':
      return '50 100% 50%';
    case 'shopee':
      return '14 85% 55%';
    case 'amazon':
      return '36 100% 50%';
    case 'loja-propria':
    default:
      return 'var(--color-blue)';
  }
};
