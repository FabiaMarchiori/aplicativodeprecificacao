import { Maximize2 } from 'lucide-react';
import { ChartType } from '@/types/dashboard';

interface InteractiveChartProps {
  chartType: ChartType;
  title: string;
  children: React.ReactNode;
  onExpand: () => void;
}

export const InteractiveChart = ({ title, children, onExpand }: InteractiveChartProps) => {
  return (
    <div 
      className="chart-container group cursor-pointer relative transition-all duration-200"
      onClick={onExpand}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'hsl(225 14% 18%)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <button 
        className="absolute top-4 right-4 z-10 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{
          background: 'hsl(225 16% 12%)',
          border: '1px solid hsl(225 14% 18%)',
        }}
        onClick={(e) => { e.stopPropagation(); onExpand(); }}
      >
        <Maximize2 className="w-3.5 h-3.5" style={{ color: 'hsl(215 10% 55%)' }} />
      </button>

      <h3 className="text-foreground">{title}</h3>
      {children}
    </div>
  );
};
