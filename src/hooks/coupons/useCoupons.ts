import { useQuery, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { couponService } from '@/services/coupons';
import type { CouponInput, Coupon } from '@/types/coupon';
import { queryClient } from '@/lib/reactQuery';

export function useCoupons() {

  return {
    // Queries
    coupons: useSuspenseQuery <Coupon[]>({
      queryKey: ['coupons'],
      queryFn: async () => {
        const response = await couponService.getAll();
        return response.data;
      },
    }),

    // Mutations
    createCoupon: useMutation({
      mutationFn: async (data: CouponInput) => {
        console.log('creating coupon', data);
        const response = await couponService.create({...data});
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),

    updateCoupon: useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<CouponInput> }) => {
        console.log('update coupon', data);
        const response = await couponService.update(id, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),

    deleteCoupon: useMutation({
      mutationFn: async (id: string) => {
        const response = await couponService.delete(id);
        return response.success;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),
  };
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupons', id],
    queryFn: async () => {
      const response = await couponService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}