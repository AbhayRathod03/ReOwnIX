import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SkeletonBox from './components/common/SkeletonBox';
import ProfileLayout from './layouts/ProfileLayout';
import GlobalWebSocket from './components/common/GlobalWebSocket';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const MyProducts = lazy(() => import('./pages/MyProducts'));
const MyBids = lazy(() => import('./pages/MyBids'));
const CreateProduct = lazy(() => import('./pages/CreateProduct'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

const Wishlist = lazy(() => import('./pages/Wishlist'));
const MyOffers = lazy(() => import('./pages/MyOffers'));
const ProductOffers = lazy(() => import('./pages/ProductOffers'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAuctions = lazy(() => import('./pages/admin/AdminAuctions'));

const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const AuctionList = lazy(() => import('./pages/AuctionList'));
const AuctionRoom = lazy(() => import('./pages/AuctionRoom'));
const MyAuctions = lazy(() => import('./pages/MyAuctions'));

// Premium Service Routes
const PremiumPlans = lazy(() => import('./pages/PremiumPlans'));
const Checkout = lazy(() => import('./pages/Checkout'));
const SubscriptionDashboard = lazy(() => import('./pages/SubscriptionDashboard'));
const BillingHistory = lazy(() => import('./pages/BillingHistory'));
const Settings = lazy(() => import('./pages/Settings'));

import { CustomThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <GlobalWebSocket />
      <CustomThemeProvider>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '8px' },
            }}
          />
          <Box component="main" sx={{ minHeight: '80vh', paddingBottom: '2rem' }}>
            <Suspense fallback={<Box sx={{ p: 4 }}><SkeletonBox height={400} /></Box>}>
              <Routes>
                <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
                <Route path="/products" element={<ErrorBoundary><Products /></ErrorBoundary>} />
                <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
                <Route path="/create-product" element={<ProtectedRoute><ErrorBoundary><CreateProduct /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/products/edit/:id" element={<ProtectedRoute><ErrorBoundary><CreateProduct /></ErrorBoundary></ProtectedRoute>} />

                <Route path="/products/:id" element={<ProtectedRoute><ErrorBoundary><ProductDetails /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ErrorBoundary><ChatPage /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/chat/:conversationId" element={<ProtectedRoute><ErrorBoundary><ChatPage /></ErrorBoundary></ProtectedRoute>} />
                
                {/* Auction Routes */}
                <Route path="/auctions" element={<ErrorBoundary><AuctionList /></ErrorBoundary>} />
                <Route path="/auctions/:id" element={<ErrorBoundary><AuctionRoom /></ErrorBoundary>} />

                {/* Premium Routes */}
                <Route path="/premium" element={<ErrorBoundary><PremiumPlans /></ErrorBoundary>} />
                <Route path="/checkout" element={<ProtectedRoute><ErrorBoundary><Checkout /></ErrorBoundary></ProtectedRoute>} />

                {/* Profile Routes wrapped in ProfileLayout */}
                <Route path="/profile" element={<ProtectedRoute><ErrorBoundary><ProfileLayout /></ErrorBoundary></ProtectedRoute>}>
                  <Route index element={<Profile />} />
                  {/* Canonical paths matched by AccountSidebar */}
                  <Route path="my-products" element={<MyProducts />} />
                  <Route path="my-products/offers/:productId" element={<ProductOffers />} />
                  <Route path="my-bids" element={<MyAuctions />} />
                  <Route path="my-offers" element={<MyOffers />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="orders" element={<Box sx={{ p: 4, textAlign: 'center' }}>Orders (Coming Soon)</Box>} />
                  <Route path="billing" element={<BillingHistory />} />
                  <Route path="subscription" element={<SubscriptionDashboard />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="/seller/:id" element={<ErrorBoundary><SellerProfile /></ErrorBoundary>} />
                {/* Admin Routes */}
                <Route path="/admin" element={<ErrorBoundary><AdminRoute><AdminLayout /></AdminRoute></ErrorBoundary>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="auctions" element={<AdminAuctions />} />
                  <Route path="*" element={<Box sx={{ p: 4, textAlign: 'center' }}>Admin Module Coming Soon</Box>} />
                </Route>

                <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Router>
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;