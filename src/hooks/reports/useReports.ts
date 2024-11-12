import { Coupon } from '@/types/coupon';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';



const API_URL = 'http://localhost:3001';

export function useReports() {
  return {

    couponUsage: (couponId: string) => 
      useQuery({
        queryKey: ['reports', 'usage', couponId],
        queryFn: () => fetch(`${API_URL}/coupon_usage?couponId=${couponId}`).then(res => res.json()),
        enabled: !!couponId,
      }),

    coupons: useSuspenseQuery({
      queryKey: ['coupons'],
      queryFn: () => fetch(`${API_URL}/coupons`).then(res => res.json()) as Promise<Coupon[]>,
    }),
   
  };
}