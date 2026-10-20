// src/components/AdminSidebar.jsx
import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Toolbar, Divider, useTheme, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Gavel, LayoutList, Star, Menu } from 'lucide-react';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/admin' },
  { text: 'Users', icon: <Users size={20} />, to: '/admin/users' },
  { text: 'Products', icon: <ShoppingBag size={20} />, to: '/admin/products' },
  { text: 'Auctions', icon: <Gavel size={20} />, to: '/admin/auctions' },
  { text: 'Categories', icon: <LayoutList size={20} />, to: '/admin/categories' },
  { text: 'Reviews', icon: <Star size={20} />, to: '/admin/reviews' },
];

const AdminSidebar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.to}
            sx={{ '&.active': { backgroundColor: theme.palette.action.selected } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      {!isDesktop && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ ml: 1, mt: 1, position: 'fixed', zIndex: theme.zIndex.drawer + 1 }}
        >
          <Menu />
        </IconButton>
      )}
      {/* Drawer */}
      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop ? true : mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
