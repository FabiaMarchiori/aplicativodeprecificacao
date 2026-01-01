import { useState } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductsTable } from '@/components/products/ProductsTable';
import { SuppliersTable } from '@/components/suppliers/SuppliersTable';
import { FixedCostsTable } from '@/components/costs/FixedCostsTable';
import { TaxesConfig } from '@/components/taxes/TaxesConfig';
import { PricingCalculator } from '@/components/pricing/PricingCalculator';
import { CompetitionAnalysis } from '@/components/competition/CompetitionAnalysis';
import { ReportsSection } from '@/components/reports/ReportsSection';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TabType = 'dashboard' | 'products' | 'suppliers' | 'fixed-costs' | 'taxes' | 'pricing' | 'competition' | 'reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { toast } = useToast();

  const handleClearData = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A opção de limpar dados e começar do zero será implementada em breve.',
    });
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
      <div className="min-h-screen bg-background overflow-x-hidden">
        <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="pt-16 md:pt-18 lg:pt-24 pb-20 md:pb-8 px-3 md:px-4 lg:px-6 max-w-[1600px] mx-auto">
          {renderContent()}
          
          {/* Clear Data Button - Fixed at bottom with Tooltip */}
          <div className="fixed bottom-4 md:bottom-6 right-3 md:right-6 z-40">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-card border border-border shadow-lg hover:bg-secondary transition-all duration-200 text-xs md:text-sm text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpar dados e começar do zero</span>
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
                      Esta ação irá <strong>apagar permanentemente</strong> todos os dados cadastrados 
                      (produtos, fornecedores, custos, etc.) e restaurar o sistema para o estado inicial.
                    </p>
                    <p className="mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                      Use apenas se desejar recomeçar do zero.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
