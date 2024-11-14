import { withDelay } from "@/lib/reactQuery";
import {  CouponUsage } from "@/types/report";
import {API_URL} from '../../config/apirRoute'

export const reportService = {
  getCouponUsage: async (couponId: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_usage?couponId=${couponId}`).then(res => res.json())
    ) as Promise<CouponUsage[]>,
}
