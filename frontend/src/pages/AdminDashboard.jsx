// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, Button, Alert } from '@mui/material';
import AdminSidebar from '../components/AdminSidebar';
import DataTable from '../components/admin/DataTable';
import adminApi from '../services/adminApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from '@mui/material/styles';

// Helper for metric cards
const MetricCard = ({ title, value }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Paper>
);

// Colors for charts
const chartColors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  // Pagination state (server‑side)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metrics state
  const [metrics, setMetrics] = useState({});

  // Column definitions per entity
  const columnDefs = {
    users: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
      { field: 'phone', headerName: 'Phone', width: 130 },
      { field: 'role', headerName: 'Role', width: 110 },
      { field: 'status', headerName: 'Status', width: 110 },
      { field: 'createdAt', headerName: 'Created Date', width: 150, valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString() },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: () => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined">Edit</Button>
            <Button size="small" variant="contained" color="error">Del</Button>
          </Box>
        ),
      },
    ],
    products: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'thumbnail', headerName: 'Thumbnail', width: 100, renderCell: (params) => <img src={params.row.thumbnail} alt="thumb" style={{ width: 60, height: 60, objectFit: 'cover' }} /> },
      { field: 'title', headerName: 'Title', flex: 1 },
      { field: 'category', headerName: 'Category', width: 130 },
      { field: 'brand', headerName: 'Brand', width: 130 },
      { field: 'condition', headerName: 'Condition', width: 110 },
      { field: 'listingType', headerName: 'Listing Type', width: 130 },
      { field: 'owner', headerName: 'Owner', flex: 1 },
      { field: 'price', headerName: 'Price', width: 110, valueFormatter: (params) => `$${params.value}` },
      { field: 'quantity', headerName: 'Qty', width: 80 },
      { field: 'status', headerName: 'Status', width: 110 },
      { field: 'createdAt', headerName: 'Created Date', width: 150, valueGetter: (p) => new Date(p.row.createdAt).toLocaleDateString() },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: () => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined">Edit</Button>
            <Button size="small" variant="contained" color="error">Del</Button>
          </Box>
        ),
      },
    ],
    auctions: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'product', headerName: 'Product', flex: 1 },
      { field: 'seller', headerName: 'Seller', flex: 1 },
      { field: 'startingPrice', headerName: 'Start Price', width: 110, valueFormatter: (p) => `$${p.value}` },
      { field: 'currentPrice', headerName: 'Current', width: 110, valueFormatter: (p) => `$${p.value}` },
      { field: 'status', headerName: 'Status', width: 110 },
      { field: 'startTime', headerName: 'Start', width: 150, valueGetter: (p) => new Date(p.row.startTime).toLocaleString() },
      { field: 'endTime', headerName: 'End', width: 150, valueGetter: (p) => new Date(p.row.endTime).toLocaleString() },
      { field: 'winner', headerName: 'Winner', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: () => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined">Edit</Button>
            <Button size="small" variant="contained" color="error">Del</Button>
          </Box>
        ),
      },
    ],
    categories: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 2 },
      { field: 'productCount', headerName: 'Products', width: 110 },
      { field: 'status', headerName: 'Status', width: 110 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: () => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined">Edit</Button>
            <Button size="small" variant="contained" color="error">Del</Button>
          </Box>
        ),
      },
    ],
    reviews: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'product', headerName: 'Product', flex: 1 },
      { field: 'reviewer', headerName: 'Reviewer', flex: 1 },
      { field: 'rating', headerName: 'Rating', width: 80 },
      { field: 'comment', headerName: 'Comment', flex: 2 },
      { field: 'date', headerName: 'Date', width: 150, valueGetter: (p) => new Date(p.row.date).toLocaleDateString() },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: () => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined">Edit</Button>
            <Button size="small" variant="contained" color="error">Del</Button>
          </Box>
        ),
      },
    ],
  };

  const entityMap = ['users', 'products', 'auctions', 'categories', 'reviews'];
  const currentEntity = entityMap[tab];

  // Load entity data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {
      page: page + 1, // backend likely 1‑based
      limit: pageSize,
      search,
    };
    const fetchFn = {
      users: adminApi.getUsers,
      products: adminApi.getProducts,
      auctions: adminApi.getAuctions,
      categories: adminApi.getCategories,
      reviews: adminApi.getReviews,
    }[currentEntity];
    fetchFn(params)
      .then((data) => {
        setRows(data.items || []);
        setRowCount(data.total || 0);
      })
      .catch((err) => {
        console.error('Load error', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [currentEntity, page, pageSize, search]);

  // Load metrics once
  useEffect(() => {
    setMetricsLoading(true);
    const types = ['totalUsers', 'totalProducts', 'activeAuctions', 'completedAuctions'];
    Promise.all(types.map((t) => adminApi.getMetrics(t)))
      .then((results) => {
        const map = {};
        types.forEach((t, i) => (map[t] = results[i]));
        setMetrics(map);
      })
      .catch((err) => setMetricsError(err))
      .finally(() => setMetricsLoading(false));
  }, []);

  // Chart data placeholders
  const [chartData, setChartData] = useState({
    usersByMonth: [],
    productsByCategory: [],
    productsByMonth: [],
    auctionStatus: [],
    auctionsByMonth: [],
  });

  useEffect(() => {
    // fetch all chart data
    const requests = [
      adminApi.getMetrics('usersByMonth'),
      adminApi.getMetrics('productsByCategory'),
      adminApi.getMetrics('productsByMonth'),
      adminApi.getMetrics('auctionStatus'),
      adminApi.getMetrics('auctionsByMonth'),
    ];
    Promise.all(requests)
      .then(([uMonth, pCategory, pMonth, aStatus, aMonth]) => {
        setChartData({
          usersByMonth: uMonth,
          productsByCategory: pCategory,
          productsByMonth: pMonth,
          auctionStatus: aStatus,
          auctionsByMonth: aMonth,
        });
      })
      .catch((e) => console.error('Chart data error', e));
  }, []);

  const handleTabChange = (e, newVal) => {
    setTab(newVal);
    setPage(0);
    setSearch('');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        {/* Metric cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Users" value={metrics.totalUsers ?? '-'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Products" value={metrics.totalProducts ?? '-'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Active Auctions" value={metrics.activeAuctions ?? '-'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Completed Auctions" value={metrics.completedAuctions ?? '-'} />
          </Grid>
        </Grid>

        {/* Tabs for entities */}
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Users" />
          <Tab label="Products" />
          <Tab label="Auctions" />
          <Tab label="Categories" />
          <Tab label="Reviews" />
        </Tabs>

        {/* Search bar */}
        <Box sx={{ my: 2 }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
        </Box>

        {/* Data Table */}
        {error && <Alert severity="error">Failed to load data.</Alert>}
        <DataTable
          columns={columnDefs[currentEntity]}
          rows={rows}
          loading={loading}
          error={error}
          page={page}
          pageSize={pageSize}
          rowCount={rowCount}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />

        {/* Charts section – displayed below table */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Users Added Per Month
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.usersByMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Products by Category
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={chartData.productsByCategory} dataKey="count" nameKey="category" outerRadius={80} label>
                      {chartData.productsByCategory.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Active vs Sold vs Auction Products
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={chartData.auctionStatus} dataKey="count" nameKey="status" innerRadius={60} outerRadius={80} label>
                      {chartData.auctionStatus.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Auctions Created Per Month
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.auctionsByMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={theme.palette.secondary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
