import { useState } from 'react';
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
  ChevronDown,
  Menu,
  X
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

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
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

export const Sidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleTabChange = (tab: TabType) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  const sidebarWidth = collapsed ? 'w-[84px]' : 'w-[240px]';

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] flex md:hidden items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
        style={{
          background: 'rgba(10, 14, 26, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 bottom-0 z-50 
          ${sidebarWidth} md:${sidebarWidth}
          flex flex-col
          transition-all duration-300 ease-in-out
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full'}
        `}
        style={{ 
          background: 'linear-gradient(180deg, rgba(6, 8, 18, 0.98) 0%, rgba(8, 12, 24, 0.98) 50%, rgba(4, 6, 14, 0.98) 100%)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '4px 0 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Logo */}
        <div 
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-5 py-6 border-b`}
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 140, 255, 0.9), rgba(0, 209, 255, 0.8))',
              boxShadow: '0 0 20px rgba(0, 180, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <TrendingUp 
              className="w-5 h-5" 
              style={{ 
                color: '#FFFFFF', 
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))' 
              }} 
            />
          </div>
          {!collapsed && (
            <span 
              className="text-lg font-bold hidden md:block tracking-tight"
              style={{ 
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Precificação
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0' : 'px-4'} py-3 rounded-xl transition-all duration-300 text-left group relative`}
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(0, 120, 255, 0.22) 0%, rgba(0, 200, 255, 0.12) 50%, rgba(0, 160, 255, 0.18) 100%)' 
                    : 'transparent',
                  color: '#FFFFFF',
                  border: isActive ? '1px solid rgba(0, 180, 255, 0.3)' : '1px solid transparent',
                  boxShadow: isActive 
                    ? '0 0 24px rgba(0, 160, 255, 0.12), 0 0 8px rgba(0, 200, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #00AAFF, #00D4FF)',
                      boxShadow: '0 0 8px rgba(0, 180, 255, 0.5)',
                    }}
                  />
                )}
                <Icon 
                  className="flex-shrink-0" 
                  style={{ 
                    width: '22px',
                    height: '22px',
                    color: '#FFFFFF',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(0, 180, 255, 0.4))' : 'none'
                  }} 
                />
                {!collapsed && (
                  <span className="hidden md:inline font-semibold text-[13px] uppercase tracking-wider text-white">
                    {tab.label}
                  </span>
                )}
                {/* Always show labels on mobile overlay */}
                {mobileOpen && collapsed && (
                  <span className="md:hidden font-semibold text-[13px] uppercase tracking-wider text-white ml-3">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Menu */}
        <div 
          className="p-3 border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-3 rounded-xl transition-all duration-300 focus:outline-none`}
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Avatar 
                  className="w-9 h-9 flex-shrink-0" 
                  style={{ 
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback 
                    style={{ 
                      background: 'linear-gradient(135deg, #0a1628, #0d1f3c)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-medium truncate w-full text-white">
                        {userName}
                      </span>
                      <span className="text-xs truncate w-full" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {userEmail}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 hidden md:block" style={{ color: 'rgba(255,255,255,0.55)' }} />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              side="top"
              sideOffset={8}
              className="w-64 p-0 rounded-xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
              style={{
                background: 'linear-gradient(180deg, rgba(8, 14, 28, 0.98), rgba(6, 10, 22, 0.98))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* User Info Section */}
              <div className="px-5 py-4 flex flex-col items-center text-center">
                <Avatar 
                  className="w-14 h-14 mb-3" 
                  style={{ 
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback 
                    style={{ 
                      background: 'linear-gradient(135deg, #0a1628, #0d1f3c)',
                      color: '#FFFFFF',
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-base font-medium text-white mb-0.5" style={{ fontSize: '16px' }}>
                  {userName}
                </h3>
                
                <p className="text-sm truncate max-w-full" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {userEmail}
                </p>
              </div>

              {/* Separator */}
              <DropdownMenuSeparator className="m-0" style={{ background: 'rgba(255, 255, 255, 0.08)' }} />

              {/* Logout Button */}
              <div className="p-3">
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 focus:outline-none"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  <LogOut className="w-4 h-4 text-white" />
                  <span className="font-medium text-sm text-white">Voltar ao login</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};
