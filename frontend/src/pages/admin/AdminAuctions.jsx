import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', content: '', action: null });

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAuctions();
      setAuctions(data);
    } catch (err) {
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const openConfirm = (title, content, action) => {
    setDialogConfig({ title, content, action });
    setDialogOpen(true);
  };

  const handleAction = async () => {
    if (dialogConfig.action) {
      await dialogConfig.action();
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    const action = async () => {
      try {
        await adminApi.deleteAuction(id);
        toast.success('Auction deleted successfully');
        fetchAuctions();
      } catch (err) {
        toast.error('Failed to delete auction');
      }
    };

    openConfirm(
      'Delete Auction',
      'Are you sure you want to permanently delete this auction? Bids may be lost.',
      action
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'productTitle', 
      headerName: 'Product', 
      width: 250,
      valueGetter: (params, row) => row.product?.title || 'Unknown Product'
    },
    { 
      field: 'startingPrice', 
      headerName: 'Starting Price', 
      width: 130,
      valueFormatter: (params) => {
        if (params == null || params === '') return '';
        return `₹${params.toLocaleString('en-IN')}`;
      }
    },
    { 
      field: 'currentBid', 
      headerName: 'Current Bid', 
      width: 130,
      valueFormatter: (params) => {
        if (params == null || params === '') return 'No Bids';
        return `₹${params.toLocaleString('en-IN')}`;
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'ACTIVE' ? 'success' : params.value === 'COMPLETED' ? 'info' : 'default'} 
          size="small" 
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { 
      field: 'endTime', 
      headerName: 'Ends At', 
      width: 180,
      valueFormatter: (params) => {
        if (!params) return '';
        return new Date(params).toLocaleString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <IconButton 
            size="small" 
            component={Link}
            to={`/auctions/${params.row.id}`}
            target="_blank"
            color="primary"
            title="View Auction"
          >
            <ExternalLink size={18} />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Delete Auction"
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 3 }}>Auction Management</Typography>
      
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={auctions}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
          }}
          pageSizeOptions={[15, 25, 50]}
          disableRowSelectionOnClick
        />
      </Box>

      <ConfirmDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleAction}
        title={dialogConfig.title}
        content={dialogConfig.content}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminAuctions;
