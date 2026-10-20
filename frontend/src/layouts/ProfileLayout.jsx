import React from 'react';
import { Box, Container } from '@mui/material';
import AccountSidebar from '../components/AccountSidebar';
import { Outlet } from 'react-router-dom';

/**
 * Layout for the profile/account area.
 * Sidebar is sticky at ~260 px; the Outlet fills the remaining width.
 */
const ProfileLayout = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 0, md: 4 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
        }}
      >
        {/* Sidebar */}
        <AccountSidebar />

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default ProfileLayout;
