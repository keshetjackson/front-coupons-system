import { CouponInput } from "@/types/coupon";



interface CouponFormProps {
  initialData?: Partial<CouponInput>;
  onSubmit: (values: CouponInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function CouponForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}: CouponFormProps) {
  return (
   <form action="">coupon form</form>
  );
}
