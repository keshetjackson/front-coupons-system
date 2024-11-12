export interface DashboardStats {
    activeCoupons: number;
    totalUsers: number;
    totalRevenue: number;
    avgDiscount: number;
  }
  
  export interface UsageTrend {
    date: string;
    orders: number;
    discount: number;
  }
  
  export interface TopCoupon {
    id: string;
    code: string;
    description: string;
    totalDiscount: number;
    totalUses: number;
  }