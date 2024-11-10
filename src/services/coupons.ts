
import { withDelay } from "@/lib/reactQuery";
import { ApiResponse } from "@/types/api";
import { Coupon, CouponInput } from "@/types/coupon";

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

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Creates a new coupon.
   * @param data The coupon data.
   * @returns A promise that resolves to an ApiResponse object containing the created coupon.
   */
/******  4655fae5-9fc8-4d69-b9bd-cb598918fe95  *******/
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
};
