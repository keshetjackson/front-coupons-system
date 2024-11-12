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
    currentUsage?: number;  // Added this to CouponInput
    isActive: boolean;
    createdBy?: string;
  }

  export interface ValidationResult {
    isValid: boolean;
    error?: string;
    appliedCoupons?: Coupon[];
    discountAmount?: number;
    finalAmount?: number;
  }
  
  export interface CouponApplicationResult {
    appliedCoupons: Coupon[];
    discountAmount: number;
    finalAmount: number;
  }
  
  export interface CouponEntry {
    code: string;
    isValid: boolean;
  }
  
  export interface DiscountInfo {
    amount: number;
    final: number;
  }