import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash2, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', content: '', action: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const handleToggleStatus = (id, currentStatus) => {
    const action = async () => {
      try {
        if (currentStatus === 'ACTIVE') {
          await adminApi.disableUser(id);
          toast.success('User disabled');
        } else {
          await adminApi.enableUser(id);
          toast.success('User enabled');
        }
        fetchUsers();
      } catch (err) {
        toast.error('Failed to update status');
      }
    };

    openConfirm(
      currentStatus === 'ACTIVE' ? 'Disable User' : 'Enable User',
      `Are you sure you want to ${currentStatus === 'ACTIVE' ? 'disable' : 'enable'} this user?`,
      action
    );
  };

  const handleDelete = (id) => {
    const action = async () => {
      try {
        await adminApi.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    };

    openConfirm(
      'Delete User',
      'Are you absolutely sure you want to permanently delete this user? This action cannot be undone.',
      action
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value?.replace('ROLE_', '')} 
          color={params.value === 'ROLE_ADMIN' ? 'secondary' : 'default'} 
          size="small" 
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'ACTIVE' ? 'success' : 'error'} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const isActive = params.row.status === 'ACTIVE';
        const isAdmin = params.row.role === 'ROLE_ADMIN';
        
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <IconButton 
              size="small" 
              color={isActive ? 'warning' : 'success'}
              disabled={isAdmin}
              onClick={() => handleToggleStatus(params.row.id, params.row.status)}
              title={isActive ? 'Disable User' : 'Enable User'}
            >
              {isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
            </IconButton>
            <IconButton 
              size="small" 
              color="error"
              disabled={isAdmin}
              onClick={() => handleDelete(params.row.id)}
              title="Delete User"
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 3 }}>User Management</Typography>
      
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={users}
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
        confirmText="Confirm"
        confirmColor="primary"
      />
    </Box>
  );
};

export default AdminUsers;
