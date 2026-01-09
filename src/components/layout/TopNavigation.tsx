import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Building2, 
  Receipt, 
  Calculator, 
  Users, 
  FileBarChart,
  TrendingUp,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { signOut, user } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userInitials = userName.substring(0, 2).toUpperCase();

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
                'nav-dashboard': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
                'nav-produtos': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
                'nav-fornecedores': { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.5)' },
                'nav-custos': { color: '#39FF14', glow: 'rgba(57, 255, 20, 0.5)' },
                'nav-impostos': { color: '#BF00FF', glow: 'rgba(191, 0, 255, 0.5)' },
                'nav-precificacao': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
                'nav-concorrencia': { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.5)' },
                'nav-relatorios': { color: '#00D1FF', glow: 'rgba(0, 209, 255, 0.5)' },
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

          {/* User Menu - Premium Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 focus:outline-none"
              >
                <Avatar 
                  className="w-9 h-9" 
                  style={{ 
                    border: '2px solid #00D1FF',
                    boxShadow: '0 0 8px rgba(0, 209, 255, 0.3)'
                  }}
                >
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback 
                    style={{ 
                      background: '#1a2332',
                      color: '#fff',
                      fontWeight: 500
                    }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span 
                  className="hidden lg:block text-sm max-w-[100px] truncate"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {userName}
                </span>
                <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              sideOffset={8}
              className="w-64 p-0 rounded-xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200"
              style={{
                background: 'rgba(11, 18, 32, 0.97)',
                border: '1px solid #00D1FF',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 209, 255, 0.15)',
              }}
            >
              {/* User Info Section */}
              <div className="px-5 py-4 flex flex-col items-center text-center">
                <Avatar 
                  className="w-14 h-14 mb-3" 
                  style={{ 
                    border: '2px solid #00D1FF',
                    boxShadow: '0 0 12px rgba(0, 209, 255, 0.4)'
                  }}
                >
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback 
                    style={{ 
                      background: '#1a2332',
                      color: '#fff',
                      fontSize: '1.25rem',
                      fontWeight: 500
                    }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-base font-medium text-white mb-0.5">
                  {userName}
                </h3>
                
                <p className="text-sm truncate max-w-full" style={{ color: '#9CA3AF' }}>
                  {userEmail}
                </p>
              </div>

              {/* Separator */}
              <DropdownMenuSeparator className="m-0" style={{ background: 'rgba(0, 209, 255, 0.2)' }} />

              {/* Logout Button */}
              <div className="p-3">
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 focus:outline-none"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(0, 209, 255, 0.4)',
                    color: '#00D1FF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.3)';
                    e.currentTarget.style.borderColor = '#00D1FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(0, 209, 255, 0.4)';
                  }}
                >
                  <LogOut className="w-4 h-4" style={{ color: '#00D1FF' }} />
                  <span className="font-medium text-sm">Voltar ao login</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
