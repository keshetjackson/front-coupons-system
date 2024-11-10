export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiryDate?: string;
    allowStacking: boolean;
    usageLimit?: number;
    currentUsage: number;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
  }
  
  export interface CouponInput {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiryDate?: string;
    allowStacking: boolean;
    usageLimit?: number;
    createdBy: string;
  }