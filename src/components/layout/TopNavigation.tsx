import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Building2, 
  Receipt, 
  Calculator, 
  Users, 
  FileBarChart,
  TrendingUp
} from 'lucide-react';

type TabType = 'dashboard' | 'products' | 'suppliers' | 'fixed-costs' | 'taxes' | 'pricing' | 'competition' | 'reports';

interface TopNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ElementType; colorClass: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, colorClass: 'nav-dashboard' },
  { id: 'products', label: 'Produtos', icon: Package, colorClass: 'nav-produtos' },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck, colorClass: 'nav-fornecedores' },
  { id: 'fixed-costs', label: 'Custos Fixos', icon: Building2, colorClass: 'nav-custos' },
  { id: 'taxes', label: 'Impostos', icon: Receipt, colorClass: 'nav-impostos' },
  { id: 'pricing', label: 'Precificação', icon: Calculator, colorClass: 'nav-precificacao' },
  { id: 'competition', label: 'Concorrência', icon: Users, colorClass: 'nav-concorrencia' },
  { id: 'reports', label: 'Relatórios', icon: FileBarChart, colorClass: 'nav-relatorios' },
];

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(0, 209, 255, 0.15)'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20 gap-3">
          {/* Logo - Neon Gradient Glow */}
          <div 
            className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, #FF007A, #00D1FF)',
              boxShadow: '0 0 15px rgba(255, 0, 122, 0.5), 0 0 30px rgba(0, 209, 255, 0.3)'
            }}
          >
            <TrendingUp 
              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" 
              style={{ 
                color: '#FFFFFF', 
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' 
              }} 
            />
          </div>

          {/* Navigation Tabs - Transparent with Neon Glow */}
          <nav className="flex items-center gap-1.5 md:gap-2 nav-scroll flex-1 ml-2 md:ml-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              // Color mapping for each tab
              const colorMap: Record<string, { color: string; glow: string }> = {
                'nav-dashboard': { color: '#FF007A', glow: 'rgba(255, 0, 122, 0.5)' },
                'nav-produtos': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
                'nav-fornecedores': { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.5)' },
                'nav-custos': { color: '#39FF14', glow: 'rgba(57, 255, 20, 0.5)' },
                'nav-impostos': { color: '#BF00FF', glow: 'rgba(191, 0, 255, 0.5)' },
                'nav-precificacao': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
                'nav-concorrencia': { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.5)' },
                'nav-relatorios': { color: '#FF007A', glow: 'rgba(255, 0, 122, 0.5)' },
              };
              
              const tabColor = colorMap[tab.colorClass] || { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' };
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap px-3 py-2 md:px-4 md:py-2.5 lg:px-5 text-xs md:text-sm font-semibold transition-all duration-300 rounded-lg md:rounded-xl uppercase tracking-wider"
                  style={{
                    background: 'transparent',
                    color: tabColor.color,
                    border: isActive ? `1px solid ${tabColor.color}` : '1px solid transparent',
                    borderBottom: isActive ? `2px solid ${tabColor.color}` : '1px solid transparent',
                    boxShadow: isActive 
                      ? `0 0 20px ${tabColor.glow}, 0 0 40px ${tabColor.glow}, inset 0 0 15px ${tabColor.glow}`
                      : 'none',
                    textShadow: isActive ? `0 0 10px ${tabColor.glow}` : 'none',
                    opacity: isActive ? 1 : 0.7,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.boxShadow = `0 0 15px ${tabColor.glow}`;
                      e.currentTarget.style.borderColor = tabColor.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ 
                      filter: isActive ? `drop-shadow(0 0 8px ${tabColor.color})` : `drop-shadow(0 0 4px ${tabColor.glow})`
                    }} 
                  />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
