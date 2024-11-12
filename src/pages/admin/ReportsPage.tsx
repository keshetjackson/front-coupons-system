import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReports } from '@/hooks/reports/useReports';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';
import { Coupon } from '@/types/coupon';
import { useExport } from '@/hooks/useExport';

export function ReportsPage() {
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { users } = useUsers();
  const { coupons } = useReports();
  const { exportCoupons } = useExport();
  
  const filteredCoupons = coupons.data?.filter((coupon: Coupon) => {
    const matchesUser = selectedUser === 'all' || coupon.createdBy === selectedUser;
    const matchesDate = !startDate || !endDate || (
      new Date(coupon.createdAt) >= new Date(startDate) &&
      new Date(coupon.createdAt) <= new Date(endDate)
    );
    const matchesSearch = !searchQuery 
      || coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
      || coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUser && matchesDate && matchesSearch;
  }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze coupon usage
          </p>
        </div>
        <Button onClick={() => exportCoupons.mutateAsync()}>
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="lg:grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="user-select">Creator</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.data?.map((user: User) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-center">Code</TableHead>
                    <TableHead className="text-center">Created By</TableHead>
                    <TableHead className="text-center">Created At</TableHead>
                    <TableHead className="text-center">Usage Count</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Value</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon: Coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="text-center font-medium">
                        {coupon.code}
                      </TableCell>
                      <TableCell className="text-center">
                        {users.data?.find((u: User) => u.id === coupon.createdBy)?.username ?? coupon.createdBy}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(coupon.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {coupon.currentUsage}
                      </TableCell>
                      <TableCell className="text-center capitalize">
                        {coupon.discountType}
                      </TableCell>
                      <TableCell className="text-center">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%` 
                          : `₪${coupon.discountValue}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}