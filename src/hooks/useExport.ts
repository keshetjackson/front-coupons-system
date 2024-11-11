import { withDelay } from '@/lib/reactQuery';
import { Coupon } from '@/types/coupon';
import { useMutation } from '@tanstack/react-query';
import * as Excel from 'exceljs';

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

// Helper function to trigger file download
const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const exportService = {
  exportCoupons: async () => 
    withDelay(
      fetch(`${API_URL}/coupons`)
        .then(res => res.json())
        .then((coupons: Coupon[]) => {
          // Create a new Excel workbook and worksheet
          const workbook = new Excel.Workbook();
          const worksheet = workbook.addWorksheet('Coupons');

          // Define the columns for the worksheet
          worksheet.columns = [
            { header: 'Code', key: 'code', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Discount Type', key: 'discountType', width: 15 },
            { header: 'Discount Value', key: 'discountValue', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            // Add more columns as needed
          ];

          // Add all coupons data to the worksheet
          worksheet.addRows(coupons);
          
          // Generate the Excel file buffer
          return workbook.xlsx.writeBuffer();
        })
        .then((buffer: Excel.Buffer) => {
          // Create a blob from the buffer
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
          // Trigger the file download
          downloadFile(blob, 'all-coupons.xlsx');
        })
    ),
};

export function useExport() {
  return {
    exportCoupons: useMutation({
      mutationFn: exportService.exportCoupons,
    }),
  };
}