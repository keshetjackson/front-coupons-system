import { useState } from 'react';
import { Plus, X, Loader2, Check, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCouponApplication } from '@/hooks/coupons/useCouponApplication';
import { CouponEntry } from '@/types/coupon';

const BASE_ORDER_AMOUNT = 100;

const SAMPLE_COUPONS = [
  {
    code: 'WELCOME10',
    description: '10% off your order',
    type: 'Percentage discount',
    attribiute: 'Non-stackable'
  },
  {
    code: 'FIXED20',
    description: '₪20 off your order',
    type: 'Fixed amount discount',
    attribiute: 'Stackable'
  },
  {
    code: 'SUMMER30',
    description: '30% off your order',
    type: 'Percentage discount',
    attribiute: 'Stackable'
  },
  {
    code: 'SPECIAL50',
    description: '₪50 off any order',
    type: 'Fixed amount discount',
    attribiute: 'Expired'
  },
  {
    code: 'FLASH25',
    description: '25% off your order',
    type: 'Percentage discount',
    attribiute: 'Limited Use'
  }
];

export function CouponEntryPage() {
  const [coupons, setCoupons] = useState<CouponEntry[]>([{ code: '', isValid: false }]);
  const { 
    applyCoupons,
    currentDiscount,
    finalAmount,
    error,
    isLoading,
    validationStatus,
    resetApplication
  } = useCouponApplication(BASE_ORDER_AMOUNT);

  const handleAddCoupon = () => {
    if (coupons.length < 3) {
      setCoupons([...coupons, { code: '', isValid: false }]);
      resetApplication();
    }
  };

  const handleRemoveCoupon = (index: number) => {
    const newCoupons = coupons.filter((_, i) => i !== index);
    setCoupons(newCoupons);
    if (newCoupons.length === 0) {
      resetApplication();
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const newCoupons = [...coupons];
    newCoupons[index] = { code: value.toUpperCase(), isValid: false };
    setCoupons(newCoupons);
    resetApplication();
  };

  const handleApplyCoupons = async () => {
    const codes = coupons.map(c => c.code).filter(Boolean);
    if (codes.length === 0) return;
    await applyCoupons(codes);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Apply Coupons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {coupons.map((coupon, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter coupon code"
                  value={coupon.code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className={`pr-8 ${
                    validationStatus[coupon.code]?.isValid ? 'border-green-500' : ''
                  }`}
                />
                {validationStatus[coupon.code]?.isValid && (
                  <Check className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
                )}
              </div>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCoupon(index)}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {coupons.length < 3 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddCoupon}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Coupon
            </Button>
          )}

          <Button
            className="w-full"
            onClick={handleApplyCoupons}
            disabled={isLoading || coupons.every(c => !c.code)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Coupons'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Order Total:</span>
              <span>₪{BASE_ORDER_AMOUNT.toFixed(2)}</span>
            </div>
            
            {currentDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Total Discount:</span>
                <span>-₪{currentDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Final Amount:</span>
              <span>₪{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          <CardTitle>Available Test Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {SAMPLE_COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="p-3 rounded-lg border bg-muted/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-sm bg-background px-2 py-1 rounded">
                    {coupon.code}
                  </code>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    coupon.attribiute === 'Stackable' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {coupon.attribiute}
                  </span>
                </div>
                <p className="text-sm font-medium">{coupon.description}</p>
                <p className="text-xs text-muted-foreground">{coupon.type}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: You can combine up to 3 stackable coupons. Non-stackable coupons cannot be used with other coupons.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}