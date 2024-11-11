import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CouponInput } from "@/types/coupon";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormikSwitch } from "./inputs/switch";
import { FormikSelect } from "./inputs/select";

const CouponSchema = Yup.object().shape({
  code: Yup.string()
    .required("Required")
    .min(3, "Too Short!")
    .max(50, "Too Long!"),
  description: Yup.string()
    .required("Required")
    .min(5, "Too Short!")
    .max(200, "Too Long!"),
  discountType: Yup.string()
    .oneOf(["percentage", "fixed"], "Invalid discount type")
    .required("Required"),
  discountValue: Yup.number()
    .required("Required")
    .positive("Must be positive")
    .when("discountType", {
      is: "percentage",
      then: (schema) => schema.max(100, "Percentage cannot exceed 100%"),
    }),
  expiryDate: Yup.date().nullable(),
  allowStacking: Yup.boolean().required("Required"),
  usageLimit: Yup.number().positive("Must be positive").nullable(),
});

const defaultInitialValues: CouponInput = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  expiryDate: undefined,
  allowStacking: false,
  usageLimit: undefined,
  createdBy: "admin",
};

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Coupon Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Formik
          initialValues={{ ...defaultInitialValues, ...initialData }}
          validationSchema={CouponSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await onSubmit(values);
            } catch (error) {
              console.error("Form submission failed:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="code">
                    Coupon Code <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="code"
                    name="code"
                    placeholder="e.g., SUMMER2024"
                    className={cn(
                      "font-mono uppercase",
                      errors.code && touched.code ? "border-destructive" : ""
                    )}
                  />
                  {errors.code && touched.code && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <Info className="h-4 w-4" /> {errors.code}
                    </p>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="description"
                    name="description"
                    placeholder="Enter a clear description"
                    className={
                      errors.description && touched.description
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.description && touched.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <Info className="h-4 w-4" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="discountType">
                    Discount Type <span className="text-destructive">*</span>
                  </Label>
                  <FormikSelect
                    name="discountType"
                    placeholder="Select a type"
                    options={[
                      { value: "percentage", label: "Percentage (%)" },
                      { value: "fixed", label: "Fixed Amount (₪)" },
                    ]}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="discountValue">
                    Discount Value <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min="0"
                    placeholder="Enter discount value"
                    className={
                      errors.discountValue && touched.discountValue
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.discountValue && touched.discountValue && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <Info className="h-4 w-4" /> {errors.discountValue}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Field
                    as={Input}
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty for no expiration
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Field
                    as={Input}
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    min="0"
                    placeholder="No limit"
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty for unlimited uses
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="allowStacking">Allow Stacking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow combining with other coupons
                  </p>
                </div>
                <FormikSwitch id="allowStacking" name="allowStacking" />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : submitLabel}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
