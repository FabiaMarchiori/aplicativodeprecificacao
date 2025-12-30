import { Maximize2 } from 'lucide-react';
import { ChartType } from '@/types/dashboard';

interface InteractiveChartProps {
  chartType: ChartType;
  title: string;
  children: React.ReactNode;
  onExpand: () => void;
}

export const InteractiveChart = ({ 
  title, 
  children, 
  onExpand 
}: InteractiveChartProps) => {
  return (
    <div 
      className="chart-container group cursor-pointer relative transition-all duration-300 hover:border-[hsl(var(--color-cyan))]"
      onClick={onExpand}
      style={{
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 209, 255, 0.4), 0 0 50px rgba(0, 209, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Expand Icon */}
      <button 
        className="absolute top-3 right-3 z-10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: 'rgba(0, 209, 255, 0.1)',
          border: '1px solid rgba(0, 209, 255, 0.3)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
      >
        <Maximize2 
          className="w-4 h-4 transition-all duration-300"
          style={{ 
            color: '#00D1FF',
            filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.8))'
          }}
        />
      </button>

      <h3 className="text-foreground">{title}</h3>
      {children}
    </div>
  );
};
