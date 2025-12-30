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

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 md:gap-2 nav-scroll flex-1 ml-2 md:ml-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-button flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${tab.colorClass} ${
                    isActive ? 'ring-2 ring-white/30 ring-offset-1 md:ring-offset-2 ring-offset-background' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
