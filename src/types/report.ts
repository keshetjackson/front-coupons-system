export interface CouponUsage {
    id: string;
    couponId: string;
    usedAt: string;
    orderAmount: number;
    discountAmount: number;
    finalAmount: number;
  }