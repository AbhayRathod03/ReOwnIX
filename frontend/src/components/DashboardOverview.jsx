// src/components/DashboardOverview.jsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Sample data – replace with real API data later
const sampleData = [
  { day: 'Mon', views: 120, revenue: 30 },
  { day: 'Tue', views: 200, revenue: 45 },
  { day: 'Wed', views: 150, revenue: 40 },
  { day: 'Thu', views: 300, revenue: 70 },
  { day: 'Fri', views: 250, revenue: 60 },
  { day: 'Sat', views: 180, revenue: 35 },
  { day: 'Sun', views: 220, revenue: 50 },
];

const DashboardOverview = () => (
  <Box sx={{ width: '100%' }}>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Weekly Views
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Weekly Revenue ($)
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
    {/* Additional recent activity sections can be added here */}
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity (Placeholder)
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This area will show recent messages, offers, auctions, and orders.
      </Typography>
    </Paper>
  </Box>
);

export default DashboardOverview;
