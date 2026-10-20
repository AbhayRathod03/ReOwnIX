import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CircularProgress, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Download as DownloadIcon } from 'lucide-react';
import { invoiceService } from '../services/dotnet/invoiceService';
import toast from 'react-hot-toast';

const BillingHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await invoiceService.getAllInvoices();
      const data = res?.data || res || [];
      // Formatting data for DataGrid
      const formattedData = data.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        date: new Date(inv.invoiceDate).toLocaleDateString(),
        amount: inv.payment?.amount ? `₹${inv.payment.amount}` : 'N/A',
        status: inv.payment?.paymentStatus || 'Completed'
      }));
      setInvoices(formattedData);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      toast.error('Failed to load billing history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (invoiceId) => {
    // In a real app, this would fetch a PDF blob
    toast.success(`Downloading invoice #${invoiceId}`);
  };

  const columns = [
    { field: 'invoiceNumber', headerName: 'Invoice #', flex: 1, minWidth: 150 },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 120 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Receipt',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleDownload(params.row.invoiceNumber)}>
          <DownloadIcon size={20} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={4}>Billing History</Typography>
      
      <Card sx={{ borderRadius: 3, elevation: 0, border: '1px solid #E2E8F0', height: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={invoices}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
            }}
          />
        )}
      </Card>
    </Box>
  );
};

export default BillingHistory;
