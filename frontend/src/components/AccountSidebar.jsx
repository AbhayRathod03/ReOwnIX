import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Typography } from '@mui/material';
import { User, Package, Heart, MessageSquare, ShoppingBag, LogOut, ShieldAlert, Gavel, Tag, CreditCard, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Reusable account sidebar used across all profile sub‑pages.
 * Width ~260‑280 px, sticky on desktop.
 * Active route highlighted with a solid blue left‑border pill style.
 */
const AccountSidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const baseMenuItems = [
    { text: 'Profile',        icon: <User size={18} />,         path: '/profile' },
    { text: 'My Products',   icon: <Package size={18} />,      path: '/profile/my-products' },
    { text: 'My Auctions',   icon: <Gavel size={18} />,        path: '/profile/my-bids' },
    { text: 'My Offers',     icon: <Tag size={18} />,          path: '/profile/my-offers' },
    { text: 'Wishlist',      icon: <Heart size={18} />,        path: '/profile/wishlist' },
    { text: 'Chats',         icon: <MessageSquare size={18} />, path: '/chat' },
    { text: 'Orders',        icon: <ShoppingBag size={18} />,  path: '/profile/orders' },
    { text: 'Billing',       icon: <CreditCard size={18} />,   path: '/profile/billing' },
    { text: 'Subscription',  icon: <Settings size={18} />,     path: '/profile/subscription' },
    { text: 'Settings',      icon: <Settings size={18} />,     path: '/profile/settings' },
  ];

  const menuItems = user?.role === 'ROLE_ADMIN'
    ? [{ text: 'Admin Dashboard', icon: <ShieldAlert size={18} />, path: '/admin' }, ...baseMenuItems]
    : baseMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/profile') return pathname === '/profile';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 260 },
        flexShrink: 0,
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: '#e5e7eb',
        borderRadius: 3,
        p: 2,
        position: { xs: 'relative', md: 'sticky' },
        top: { md: 80 },
        maxHeight: { md: 'calc(100vh - 100px)' },
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e5e7eb', borderRadius: 4 },
      }}
    >
      {/* User info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, px: 1 }}>
        <Avatar
          src={user?.profileImage}
          sx={{
            width: 72,
            height: 72,
            mb: 1.5,
            bgcolor: '#2563EB',
            fontSize: '1.75rem',
            fontWeight: 700,
          }}
        >
          {(!user?.profileImage && user?.firstName) ? user.firstName[0].toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, textAlign: 'center' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.25 }}>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Nav items */}
      <List sx={{ p: 0 }} disablePadding>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 1.5,
                py: 1,
                bgcolor: active ? '#eff6ff' : 'transparent',
                color: active ? '#2563EB' : '#374151',
                borderLeft: active ? '3px solid #2563EB' : '3px solid transparent',
                '&:hover': {
                  bgcolor: active ? '#eff6ff' : '#f9fafb',
                  color: active ? '#2563EB' : '#111827',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon sx={{ color: active ? '#2563EB' : '#6b7280', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 1.5 }} />

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            color: '#dc2626',
            borderLeft: '3px solid transparent',
            '&:hover': { bgcolor: '#fef2f2' },
            transition: 'all 0.15s ease',
          }}
        >
          <ListItemIcon sx={{ color: '#dc2626', minWidth: 36 }}>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default AccountSidebar;
