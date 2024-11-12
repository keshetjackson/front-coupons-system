import { withDelay } from "@/lib/reactQuery";
import { ApiResponse } from "@/types/api";
import { Coupon, CouponInput, CouponApplicationResult, ValidationResult } from "@/types/coupon";

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const couponService = {
  getAll: (): Promise<ApiResponse<Coupon[]>> => 
    withDelay(
      fetch(`${API_URL}/coupons`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch coupons');
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupons fetched successfully',
          success: true
        }))
    ),

  getById: (id: string): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch coupon with id ${id}`);
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon fetched successfully',
          success: true
        }))
    ),

  create: (data: CouponInput): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, createdAt : new Date()}),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to create coupon');
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon created successfully',
          success: true
        }))
    ),

  update: (id: string, data: Partial<CouponInput>): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error(`Failed to update coupon with id ${id}`);
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon updated successfully',
          success: true
        }))
    ),

  delete: (id: string): Promise<ApiResponse<null>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error(`Failed to delete coupon with id ${id}`);
          return res.json();
        })
        .then(() => ({
          data: null,
          success: true,
          message: 'Coupon deleted successfully'
        }))
    ),

  // New methods for coupon application
  validateCoupons: async (codes: string[], orderAmount: number = 100): Promise<ApiResponse<ValidationResult>> => 
    withDelay(
      // Changed to Promise.all to fetch each coupon individually to ensure we get all of them
      Promise.all(
        codes.map(code => 
          fetch(`${API_URL}/coupons?code=${code}&isActive=true`)
            .then(res => res.json())
            .then(coupons => coupons[0])
        )
      ).then(async (coupons: Coupon[]) => {
          // Filter out any undefined values (invalid codes)
          coupons = coupons.filter(Boolean);
  
          // Check if all coupons exist
          if (coupons.length !== codes.length) {
            return {
              data: {
                isValid: false,
                error: 'One or more invalid coupon codes'
              },
              success: false,
              message: 'Validation failed'
            };
          }
  
          // Check for expired coupons
          const expiredCoupon = coupons.find(
            coupon => coupon.expiryDate && new Date(coupon.expiryDate) < new Date()
          );
          if (expiredCoupon) {
            return {
              data: {
                isValid: false,
                error: `Coupon ${expiredCoupon.code} has expired`
              },
              success: false,
              message: 'Validation failed'
            };
          }
  
          // Check usage limits
          const overLimitCoupon = coupons.find(
            coupon => coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit
          );
          if (overLimitCoupon) {
            return {
              data: {
                isValid: false,
                error: `Coupon ${overLimitCoupon.code} has reached its usage limit`
              },
              success: false,
              message: 'Validation failed'
            };
          }
  
          // Only check stacking for non-stackable coupons
          const nonStackableCoupons = coupons.filter(coupon => !coupon.allowStacking);
          if (nonStackableCoupons.length > 0 && coupons.length > 1) {
            return {
              data: {
                isValid: false,
                error: `Coupon ${nonStackableCoupons[0].code} cannot be combined with other coupons`
              },
              success: false,
              message: 'Validation failed'
            };
          }
  
          // Calculate total discount
          let remainingAmount = orderAmount;
          let totalDiscount = 0;
  
          // Sort coupons: Apply percentage discounts first, then fixed amounts
          const sortedCoupons = [...coupons].sort((a, b) => {
            if (a.discountType !== b.discountType) {
              return a.discountType === 'percentage' ? -1 : 1;
            }
            return b.discountValue - a.discountValue;
          });
  
          // Apply each discount sequentially
          for (const coupon of sortedCoupons) {
            const discountAmount = coupon.discountType === 'percentage'
              ? (remainingAmount * coupon.discountValue) / 100
              : Math.min(coupon.discountValue, remainingAmount);
  
            totalDiscount += discountAmount;
            remainingAmount = Math.max(remainingAmount - discountAmount, 0);
          }
  
          // Ensure final amount doesn't go below 0
          const finalAmount = Math.max(orderAmount - totalDiscount, 0);
  
          return {
            data: {
              isValid: true,
              appliedCoupons: coupons,
              discountAmount: totalDiscount,
              finalAmount
            },
            success: true,
            message: 'Coupons validated successfully'
          };
        })
    ),

  applyCoupons: async (codes: string[], orderAmount: number = 100): Promise<ApiResponse<CouponApplicationResult>> => 
    withDelay(
      // First validate the coupons
      couponService.validateCoupons(codes, orderAmount)
        .then(async (validation) => {
          if (!validation.success || !validation.data.isValid) {
            throw new Error(validation.data.error || 'Validation failed');
          }

          const { appliedCoupons, discountAmount, finalAmount } = validation.data;

          // Record usage for each coupon
          await Promise.all(appliedCoupons!.map(coupon =>
            fetch(`${API_URL}/coupon_usage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                couponId: coupon.id,
                usedAt: new Date().toISOString(),
                orderAmount,
                discountAmount,
                finalAmount
              })
            })
          ));

          // Update usage counts
          await Promise.all(appliedCoupons!.map(coupon =>
            couponService.update(coupon.id, {
              currentUsage: (coupon.currentUsage || 0) + 1
            })
          ));

          return {
            data: {
              appliedCoupons: appliedCoupons!,
              discountAmount: discountAmount!,
              finalAmount: finalAmount!
            },
            success: true,
            message: 'Coupons applied successfully'
          };
        })
    ),
};