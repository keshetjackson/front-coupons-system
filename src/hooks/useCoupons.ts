import { couponService } from '@/services/coupons';
import { CouponInput } from '@/types/coupon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCoupons() {
  const queryClient = useQueryClient();

  return {
    // Queries
    coupons: useQuery({
      queryKey: ['coupons'],
      queryFn: couponService.getAll,
    }),

    // Mutations
    createCoupon: useMutation({
      mutationFn: couponService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),

    updateCoupon: useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<CouponInput> }) =>
        couponService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),

    deleteCoupon: useMutation({
      mutationFn: couponService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      },
    }),
  };
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupons', id],
    queryFn: () => couponService.getById(id),
    enabled: !!id,
  });
}