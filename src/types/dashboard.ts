export interface DashboardConfig {
  visibleKPIs: {
    revenue: boolean;
    margin: boolean;
    profit: boolean;
    mostProfitable: boolean;
    lowestMargin: boolean;
  };
  visibleCharts: {
    revenueEvolution: boolean;
    costComposition: boolean;
    marginByProduct: boolean;
    profitRanking: boolean;
  };
}

export const defaultDashboardConfig: DashboardConfig = {
  visibleKPIs: {
    revenue: true,
    margin: true,
    profit: true,
    mostProfitable: true,
    lowestMargin: true,
  },
  visibleCharts: {
    revenueEvolution: true,
    costComposition: true,
    marginByProduct: true,
    profitRanking: true,
  },
};

export type ChartType = 'revenue' | 'costs' | 'margin' | 'profit';

export interface ChartConfig {
  type: ChartType;
  title: string;
  data: any[];
}
