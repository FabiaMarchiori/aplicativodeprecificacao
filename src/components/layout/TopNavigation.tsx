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

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'fixed-costs', label: 'Custos Fixos', icon: Building2 },
  { id: 'taxes', label: 'Impostos', icon: Receipt },
  { id: 'pricing', label: 'Precificação', icon: Calculator },
  { id: 'competition', label: 'Concorrência', icon: Users },
  { id: 'reports', label: 'Relatórios', icon: FileBarChart },
];

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/50" style={{ background: 'linear-gradient(180deg, hsl(210 45% 10% / 0.98), hsl(210 45% 7% / 0.95))' }}>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(190 75% 32%), hsl(205 85% 45%))', boxShadow: '0 0 25px hsl(190 75% 45% / 0.4)' }}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gradient">PrecifyPro</h1>
              <p className="text-xs text-muted-foreground">Gestão de Precificação</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-button flex items-center gap-2 whitespace-nowrap ${isActive ? 'active' : ''}`}
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