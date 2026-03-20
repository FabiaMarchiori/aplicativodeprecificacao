import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductsTable } from '@/components/products/ProductsTable';
import { FinancialSettings } from '@/components/settings/FinancialSettings';
import { RotateCcw, AlertTriangle, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

type TabType = 'dashboard' | 'products' | 'financial-settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { resetToDefaults } = useData();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleResetConfirm = () => {
    resetToDefaults();
    setResetDialogOpen(false);
  };

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
          
          {/* Reset Button */}
          <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setResetDialogOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200"
                  style={{
                    background: 'hsl(225 18% 7%)',
                    border: '1px solid hsl(225 14% 13%)',
                    color: 'hsl(215 10% 50%)',
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restaurar dados</span>
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="left" className="max-w-xs p-3"
                style={{
                  background: 'hsl(225 18% 7%)',
                  border: '1px solid hsl(345 70% 45% / 0.3)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(345 70% 55%)' }} />
                  <div>
                    <p className="font-medium text-sm mb-1 text-white">Atenção</p>
                    <p className="text-xs" style={{ color: 'hsl(215 10% 55%)' }}>
                      Restaura todos os dados para os valores padrão. Alterações serão perdidas.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </main>

        <DeleteConfirmDialog
          isOpen={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
          onConfirm={handleResetConfirm}
          title="Restaurar Dados Padrão"
          description="Tem certeza que deseja restaurar todos os dados para os valores padrão? Todas as suas alterações serão perdidas."
          itemName="todos os dados customizados"
        />
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
