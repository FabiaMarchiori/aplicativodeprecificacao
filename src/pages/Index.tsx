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
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen bg-background">
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pt-20 pb-8 px-4 lg:px-6 max-w-[1600px] mx-auto">
        {renderContent()}
        
        {/* Clear Data Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-lg hover:bg-secondary transition-all duration-200 text-sm text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpar dados e começar do zero</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
