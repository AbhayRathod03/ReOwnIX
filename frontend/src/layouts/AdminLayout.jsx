import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { xs: '100%', md: `calc(100% - 240px)` },
          ml: { md: '240px' }, // Fix overlap: add margin left equal to drawer width on desktop
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
