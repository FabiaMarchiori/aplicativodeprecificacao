import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductsTable } from '@/components/products/ProductsTable';
import { SuppliersTable } from '@/components/suppliers/SuppliersTable';
import { FixedCostsTable } from '@/components/costs/FixedCostsTable';
import { TaxesConfig } from '@/components/taxes/TaxesConfig';
import { PricingCalculator } from '@/components/pricing/PricingCalculator';
import { CompetitionAnalysis } from '@/components/competition/CompetitionAnalysis';
import { ReportsSection } from '@/components/reports/ReportsSection';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

type TabType = 'dashboard' | 'products' | 'suppliers' | 'fixed-costs' | 'taxes' | 'pricing' | 'competition' | 'reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { resetToDefaults } = useData();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    resetToDefaults();
    setResetDialogOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsTable />;
      case 'suppliers':
        return <SuppliersTable />;
      case 'fixed-costs':
        return <FixedCostsTable />;
      case 'taxes':
        return <TaxesConfig />;
      case 'pricing':
        return <PricingCalculator />;
      case 'competition':
        return <CompetitionAnalysis />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 ml-0 md:ml-[80px] lg:ml-[260px] pb-20 md:pb-8 px-4 md:px-6 lg:px-8 pt-16 md:pt-6 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
          
          {/* Reset Data Button - Fixed at bottom with Tooltip */}
          <div className="fixed bottom-4 md:bottom-6 right-3 md:right-6 z-40">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleResetClick}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-card border border-border shadow-lg hover:bg-secondary transition-all duration-200 text-xs md:text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Restaurar dados padrão</span>
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="left" 
                className="max-w-xs p-4"
                style={{
                  background: 'rgba(0, 0, 0, 0.95)',
                  border: '2px solid #FF6B6B',
                  boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF6B6B' }} />
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#FF6B6B' }}>Atenção!</p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: 1.5 }}>
                      Esta ação irá <strong>restaurar todos os dados</strong> para os valores padrão iniciais 
                      (produtos, fornecedores, custos, etc.).
                    </p>
                    <p className="mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                      As alterações que você fez serão perdidas.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </main>

        {/* Reset Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
          onConfirm={handleResetConfirm}
          title="Restaurar Dados Padrão"
          description="Tem certeza que deseja restaurar todos os dados para os valores padrão? Todas as suas alterações serão perdidas."
          itemName="todos os dados customizados"
        />
      </div>
    </TooltipProvider>
  );
};

export default Index;
