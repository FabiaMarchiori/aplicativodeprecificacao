import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
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

type TabType = 'dashboard' | 'products' | 'financial-settings';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Meus Produtos', icon: Package },
  { id: 'financial-settings', label: 'Config. Financeiras', icon: Building2 },
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

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[220px]';

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] flex md:hidden items-center justify-center w-10 h-10 rounded-lg transition-all duration-200"
        style={{
          background: 'hsl(225 18% 7%)',
          border: '1px solid hsl(225 14% 14%)',
        }}
      >
        {mobileOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 bottom-0 z-50 
          ${sidebarWidth} flex flex-col
          transition-all duration-300 ease-out
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0 w-[220px]' : '-translate-x-full'}
        `}
        style={{ 
          background: 'hsl(228 22% 5%)',
          borderRight: '1px solid hsl(225 14% 10%)',
        }}
      >
        {/* Logo */}
        <div 
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-5 border-b`}
          style={{ borderColor: 'hsl(225 14% 10%)' }}
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'hsl(var(--color-blue))',
              boxShadow: '0 2px 8px hsl(var(--color-blue) / 0.3)',
            }}
          >
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-[15px] font-semibold text-white hidden md:block tracking-tight">
              Precificação
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2.5 py-3 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} 
                  ${collapsed ? 'px-0' : 'px-3'} py-2.5 rounded-lg 
                  transition-all duration-200 text-left relative
                `}
                style={{
                  background: isActive ? 'hsl(var(--color-blue) / 0.1)' : 'transparent',
                  color: isActive ? 'hsl(0 0% 100%)' : 'hsl(215 10% 55%)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'hsl(225 16% 9%)';
                    e.currentTarget.style.color = 'hsl(0 0% 85%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'hsl(215 10% 55%)';
                  }
                }}
              >
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full"
                    style={{ background: 'hsl(var(--color-blue))' }}
                  />
                )}
                <Icon className="flex-shrink-0 w-[18px] h-[18px]" />
                {!collapsed && (
                  <span className="hidden md:inline text-[13px] font-medium">
                    {tab.label}
                  </span>
                )}
                {mobileOpen && collapsed && (
                  <span className="md:hidden text-[13px] font-medium ml-2.5">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="p-2.5 border-t" style={{ borderColor: 'hsl(225 14% 10%)' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} w-full px-2.5 py-2.5 rounded-lg transition-all duration-200 focus:outline-none hover:bg-white/[0.04]`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0" style={{ border: '1px solid hsl(225 14% 16%)' }}>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback style={{ background: 'hsl(225 16% 12%)', color: 'hsl(0 0% 100%)', fontWeight: 500, fontSize: '12px' }}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
                      <span className="text-[13px] font-medium truncate w-full text-white">{userName}</span>
                      <span className="text-[11px] truncate w-full" style={{ color: 'hsl(215 10% 45%)' }}>{userEmail}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 hidden md:block" style={{ color: 'hsl(215 10% 40%)' }} />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" side="top" sideOffset={8}
              className="w-56 p-0 rounded-lg overflow-hidden"
              style={{
                background: 'hsl(225 18% 7%)',
                border: '1px solid hsl(225 14% 14%)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div className="px-4 py-3 flex flex-col items-center text-center">
                <Avatar className="w-12 h-12 mb-2.5" style={{ border: '1px solid hsl(225 14% 16%)' }}>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback style={{ background: 'hsl(225 16% 12%)', color: 'hsl(0 0% 100%)', fontSize: '1rem', fontWeight: 500 }}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-sm font-medium text-white mb-0.5">{userName}</h3>
                <p className="text-xs truncate max-w-full" style={{ color: 'hsl(215 10% 45%)' }}>{userEmail}</p>
              </div>

              <DropdownMenuSeparator className="m-0" style={{ background: 'hsl(225 14% 12%)' }} />

              <div className="p-2">
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 focus:outline-none hover:bg-white/[0.04]"
                  style={{ color: 'hsl(215 10% 55%)' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};
