// src/components/SidebarNav.jsx
import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Toolbar, Divider, useTheme, useMediaQuery } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
// src/components/SidebarNav.jsx
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 300; // approx 280‑320px as requested

const navItems = [
  { text: 'Profile', icon: <PersonIcon />, to: '/profile' },
  { text: 'My Products', icon: <StorefrontIcon />, to: '/profile?tab=products' },
  { text: 'My Auctions', icon: <GavelIcon />, to: '/profile?tab=auctions' },
  { text: 'My Offers', icon: <LocalOfferIcon />, to: '/profile?tab=offers' },
  { text: 'Wishlist', icon: <FavoriteIcon />, to: '/profile?tab=wishlist' },
  { text: 'Orders', icon: <ShoppingCartIcon />, to: '/profile?tab=orders' },
  { text: 'Chats', icon: <ChatIcon />, to: '/profile?tab=chats' },
  { text: 'Billing', icon: <CreditCardIcon />, to: '/profile?tab=billing' },
  { text: 'Subscription', icon: <SettingsIcon />, to: '/profile?tab=subscription' },
  { text: 'Settings', icon: <SettingsIcon />, to: '/profile?tab=settings' },
  { text: 'Logout', icon: <LogoutIcon />, to: '/logout' }
];

/**
 * Sidebar navigation component used in the seller dashboard.
 * It is sticky on desktop, collapsible on tablet, and a swipeable drawer on mobile.
 */
const SidebarNav = ({ activeItem, onSelect }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
            selected={location.pathname + location.search === item.to}
            onClick={() => {
              onSelect?.(item.text);
              if (!isDesktop) setMobileOpen(false);
            }}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': { color: theme.palette.primary.main }
              },
              '&:hover': { backgroundColor: theme.palette.action.hover }
            }}
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
      {/* Hamburger for tablets/mobile */}
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
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default SidebarNav;
