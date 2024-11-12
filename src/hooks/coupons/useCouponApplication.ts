import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { couponService } from '@/services/coupons';
import type { Coupon } from '@/types/coupon';

interface ValidationStatus {
  [code: string]: {
    isValid: boolean;
    message?: string;
  };
}

export function useCouponApplication(baseAmount: number) {
  const [currentDiscount, setCurrentDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(baseAmount);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});

  const { mutateAsync: validateAndApply, isPending: isLoading } = useMutation({
    mutationFn: async (codes: string[]) => {
      const result = await couponService.applyCoupons(codes, baseAmount);
      return result;
    },
    onSuccess: (result) => {
      if (!result.success) {
        setError(result.message);
        return;
      }

      // Update validation status for each coupon
      const newValidationStatus: ValidationStatus = {};
      result.data.appliedCoupons?.forEach((coupon: Coupon) => {
        newValidationStatus[coupon.code] = {
          isValid: true
        };
      });
      setValidationStatus(newValidationStatus);

      // Update amounts
      setCurrentDiscount(result.data.discountAmount);
      setFinalAmount(result.data.finalAmount);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      setValidationStatus({});
      setCurrentDiscount(0);
      setFinalAmount(baseAmount);
    }
  });

  const applyCoupons = async (codes: string[]) => {
    setError(null);
    await validateAndApply(codes);
  };

  const resetApplication = () => {
    setError(null);
    setValidationStatus({});
    setCurrentDiscount(0);
    setFinalAmount(baseAmount);
  };

  return {
    applyCoupons,
    currentDiscount,
    finalAmount,
    error,
    isLoading,
    validationStatus,
    resetApplication
  };
}