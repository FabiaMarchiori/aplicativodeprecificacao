import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixedCostsTable } from '@/components/costs/FixedCostsTable';
import { TaxesConfig } from '@/components/taxes/TaxesConfig';
import { Building2, Receipt } from 'lucide-react';

export const FinancialSettings = () => {
  const [activeTab, setActiveTab] = useState('fixed-costs');

  return (
    <div className="space-y-6">
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Configurações Financeiras
        </h2>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            marginTop: '4px',
          }}
        >
          Gerencie seus custos fixos e impostos em um só lugar
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid w-full max-w-md grid-cols-2 p-1 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <TabsTrigger
            value="fixed-costs"
            className="flex items-center gap-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
          >
            <Building2 className="w-4 h-4" />
            Custos Fixos
          </TabsTrigger>
          <TabsTrigger
            value="taxes"
            className="flex items-center gap-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
          >
            <Receipt className="w-4 h-4" />
            Impostos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fixed-costs" className="mt-6">
          <FixedCostsTable />
        </TabsContent>

        <TabsContent value="taxes" className="mt-6">
          <TaxesConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};
