import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductsTable } from '@/components/products/ProductsTable';
import { FinancialSettings } from '@/components/settings/FinancialSettings';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

type TabType = 'dashboard' | 'products' | 'financial-settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <ProductsTable />;
      case 'financial-settings': return <FinancialSettings />;
      default: return <Dashboard />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 pb-16 md:pb-8 px-5 md:px-8 lg:px-10 pt-16 md:pt-8 overflow-x-hidden transition-all duration-300"
          style={{ marginLeft: '0px' }}
        >
          {/* Sidebar Toggle — Desktop */}
          <div className="hidden md:block mb-5">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
              style={{
                background: 'hsl(225 16% 8%)',
                border: '1px solid hsl(225 14% 13%)',
                color: 'hsl(215 10% 50%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'hsl(225 14% 20%)';
                e.currentTarget.style.color = 'hsl(0 0% 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(225 14% 13%)';
                e.currentTarget.style.color = 'hsl(215 10% 50%)';
              }}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          <div className="max-w-[1440px] mx-auto w-full">
            {renderContent()}
          </div>
          
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          main {
            margin-left: ${sidebarCollapsed ? '72px' : '220px'} !important;
          }
        }
      `}</style>
    </TooltipProvider>
  );
};

export default Index;
