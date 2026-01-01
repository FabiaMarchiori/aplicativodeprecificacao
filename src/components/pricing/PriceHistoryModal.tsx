import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { PriceHistory, Product } from '@/data/mockData';

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  history: PriceHistory[];
}

export const PriceHistoryModal = ({ isOpen, onClose, product, history }: PriceHistoryModalProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const chartData = history.map(h => ({
    date: formatDate(h.date),
    sugerido: h.suggestedPrice,
    aplicado: h.appliedPrice,
    margem: h.margin
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl"
        style={{
          background: 'linear-gradient(145deg, #0a0a0c 0%, #111318 100%)',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 209, 255, 0.15)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(0, 209, 255, 0.1)',
                border: '1px solid rgba(0, 209, 255, 0.3)'
              }}
            >
              <Clock className="w-5 h-5" style={{ color: '#00D1FF' }} />
            </div>
            <div>
              <span style={{ color: '#F8FAFC' }}>Histórico de Preços</span>
              <p className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {product.name}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Chart */}
          <div 
            className="rounded-xl p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 209, 255, 0.2)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#00D1FF' }} />
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Evolução do Preço
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255, 255, 255, 0.5)" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.5)" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#0a0a0c',
                    border: '1px solid rgba(0, 209, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'sugerido' ? 'Preço Sugerido' : 'Preço Aplicado'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sugerido" 
                  stroke="#00D1FF" 
                  strokeWidth={2}
                  dot={{ fill: '#00D1FF', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="aplicado" 
                  stroke="#39FF14" 
                  strokeWidth={2}
                  dot={{ fill: '#39FF14', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#00D1FF' }} />
                <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Preço Sugerido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#39FF14' }} />
                <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Preço Aplicado</span>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div 
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(0, 209, 255, 0.2)'
            }}
          >
            <div 
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(0, 209, 255, 0.1)' }}
            >
              <Calendar className="w-4 h-4" style={{ color: '#00D1FF' }} />
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Histórico Detalhado
              </span>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Data</th>
                    <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Sugerido</th>
                    <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Aplicado</th>
                    <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Margem</th>
                    <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice().reverse().map((h, idx) => (
                    <tr 
                      key={h.id} 
                      className="transition-colors hover:bg-white/5"
                      style={{ borderBottom: idx < history.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                    >
                      <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {formatDate(h.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono" style={{ color: '#00D1FF' }}>
                        {formatCurrency(h.suggestedPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono" style={{ color: '#39FF14' }}>
                        {formatCurrency(h.appliedPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono" style={{ color: '#FFAC00' }}>
                        {h.margin.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {h.reason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
