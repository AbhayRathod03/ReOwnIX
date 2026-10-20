import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Box, Typography, IconButton, Avatar, Button, InputBase, Badge, useTheme } from '@mui/material';
import { Heart, MessageCircle as ChatIcon, Moon, Sun, Search as SearchIcon, List as ListIcon } from 'lucide-react';

import chatService from '../services/chatService';
import BellIcon from '@mui/icons-material/NotificationsNone';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import wishlistApi from '../services/wishlistApi';
import PremiumSearchBar from './home/PremiumSearchBar';

const Navbar = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Wishlist count effect
  React.useEffect(() => {
    if (user) {
      wishlistApi.get()
        .then((items) => setWishlistCount(items.length))
        .catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  // Chat unread count polling every 10s
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const fetchUnread = async () => {
      if (document.hidden) return; // Pause polling when tab is hidden
      try {
        const conversations = await chatService.listConversations();
        const total = (conversations || []).reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setUnreadCount(total);
      } catch (err) {
        console.error('Failed to fetch chat unread count', err);
        setUnreadCount(0);
      }
    };
    fetchUnread();
    
    // Listen to real-time events from GlobalWebSocket
    window.addEventListener('reownx-new-chat-message', fetchUnread);
    const interval = setInterval(fetchUnread, 120000); // Polling every 2 mins (reduced frequency)
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('reownx-new-chat-message', fetchUnread);
    };
  }, [user]);

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(12px)', 
      color: 'text.primary', 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        {/* LOGO */}
        <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              mr: 1
            }}
          >
            R
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
            ReOwnIX
          </Typography>
        </Box>

        {isAuthPage ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
            <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}>
              Back to Home
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 4, gap: 2 }}>

              <Button component={Link} to="/auctions" color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Live Auctions
              </Button>
            </Box>

            {/* Premium Search Bar in Navbar */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mx: { md: 2, lg: 4 } }}>
              <PremiumSearchBar />
            </Box>

            {/* ICONS & ACTIONS */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              {/* Action Icons */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
                
                {user && (
                  <>
                    <IconButton component={Link} to="/profile/wishlist" color="inherit">
                      <Badge badgeContent={wishlistCount} color="secondary">
                        <Heart size={20} />
                      </Badge>
                    </IconButton>
                    <IconButton component={Link} to="/chat" color="inherit">
                      <Badge badgeContent={unreadCount} color="secondary" invisible={unreadCount === 0}>
                        <ChatIcon size={20} />
                      </Badge>
                    </IconButton>
                  </>
                )}
              </Box>

              {/* User Profile */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {user.role === 'ROLE_ADMIN' && (
                    <Button component={Link} to="/admin" color="secondary" variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
                      Admin Dashboard
                    </Button>
                  )}
                  <IconButton component={Link} to="/profile" sx={{ p: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'white' }} src={user.profileImage}>
                      {(!user.profileImage && (user.firstName?.[0] || 'U'))}
                    </Avatar>
                  </IconButton>
                </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button component={Link} to="/premium" variant="text" color="secondary" sx={{ textTransform: 'none', fontWeight: 700, display: { xs: 'none', md: 'inline-flex' } }}>Premium</Button>
                    <Button component={Link} to="/login" variant="text" sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 600 }}>Log in</Button>
                    <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: 'text.primary', color: 'background.paper', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: 'text.secondary' } }}>Sign up</Button>
                  </Box>
                )}

              {/* Post Ad Button */}
              <Button 
                component={Link} 
                to="/create-product" 
                variant="contained" 
                color="primary"
                sx={{ ml: 2, px: 3, borderRadius: '24px', fontWeight: 700, textTransform: 'none', display: { xs: 'none', md: 'flex' } }}
              >
                Sell
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;