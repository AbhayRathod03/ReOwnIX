// src/pages/admin/charts/UsersChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
/**
 * Users added per month line chart.
 * Expects data shape: [{ month: 'Jan', count: 10 }, ...]
 */
const UsersChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#2563EB" />
    </LineChart>
  </ResponsiveContainer>
);

UsersChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ month: PropTypes.string, count: PropTypes.number })
  ).isRequired,
};

export default UsersChart;
