import { withDelay } from "@/lib/reactQuery";
import {  CouponUsage } from "@/types/report";

const API_URL = import.meta.env.API_URL
export const reportService = {
  getCouponUsage: async (couponId: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_usage?couponId=${couponId}`).then(res => res.json())
    ) as Promise<CouponUsage[]>,
}
