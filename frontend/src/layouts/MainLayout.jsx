// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme/theme';

const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Outlet />
      <Footer />
    </ThemeProvider>
  );
};

export default MainLayout;
