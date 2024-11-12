import { useState } from "react";
import { FileDown, Edit, Trash2, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCoupons } from "@/hooks/coupons/useCoupons";
import { Coupon } from "@/types/coupon";
import { CouponForm } from "@/components/forms/coupon";
import { Skeleton } from "@/components/ui/skeleton";
import { useExport } from "@/hooks/useExport";
import { useAuth } from "@/hooks/useAuth";

export function CouponsPage() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { currentUser } = useAuth();
  const { coupons, createCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const { exportCoupons } = useExport();

  const filteredCoupons = coupons.data?.filter(coupon => 
    coupon.code.toLowerCase().includes(search.toLowerCase()) ||
    coupon.description.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleExport = async () => {
    await exportCoupons.mutateAsync();
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4  lg:flex-row justify-between ">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your discount coupons
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport}>Export Coupons</Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>View and manage all your discount coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 py-2"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-center">Code</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-center">Value</TableHead>
                  <TableHead className="text-center">Usage</TableHead>
                  <TableHead className="text-center">Expires</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Stacking</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.isLoading ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={8} className="py-4">
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">{coupon.code}</TableCell>
                      <TableCell className="text-center capitalize">{coupon.discountType}</TableCell>
                      <TableCell className="text-center font-medium">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₪${coupon.discountValue}`}
                      </TableCell>
                      <TableCell className="text-center">
                        {coupon.usageLimit ? (
                          <span>
                            {coupon.currentUsage ?? 0}/{coupon.usageLimit}
                          </span>
                        ) : (
                          coupon.currentUsage
                        )}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          coupon.allowStacking ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {coupon.allowStacking ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(coupon)}
                            className="hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCoupon.mutate(coupon.id)}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <CouponForm
            onSubmit={async (values) => {
              await createCoupon.mutateAsync({...values, createdBy: currentUser?.id ? currentUser.id : ''});
              setIsCreateDialogOpen(false);
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
            submitLabel="Create Coupon"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedCoupon && (
            <CouponForm
              initialData={selectedCoupon}
              onSubmit={async (values) => {
                await updateCoupon.mutateAsync({
                  id: selectedCoupon.id,
                  data: values,
                });
                setIsEditDialogOpen(false);
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}