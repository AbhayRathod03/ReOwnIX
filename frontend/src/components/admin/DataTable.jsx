// src/components/admin/DataTable.jsx
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Reusable DataGrid wrapper with loading, error handling and optional motion effects.
 * Props:
 *   columns: array of column definitions for MUI DataGrid
 *   rows: array of row objects
 *   loading: boolean
 *   error: string|object
 *   page: number (zero‑based)
 *   pageSize: number
 *   rowCount: total rows (for server side pagination)
 *   onPageChange: (newPage) => void
 *   onPageSizeChange: (newSize) => void
 *   onSortModelChange: (model) => void
 *   onFilterModelChange: (model) => void
 */
const DataTable = ({
  columns,
  rows,
  loading,
  error,
  page,
  pageSize,
  rowCount,
  onPaginationModelChange,
  onSortModelChange,
  onFilterModelChange,
}) => {
  if (error) {
    return <Alert severity="error">Failed to load data.</Alert>;
  }

  return (
    <Box sx={{ height: 600, width: '100%' }} component={motion.div} whileHover={{ scale: 1.005 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={{ page, pageSize }}
        rowCount={rowCount}
        paginationMode="server"
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        sortingMode="server"
        onSortModelChange={onSortModelChange}
        filterMode="server"
        onFilterModelChange={onFilterModelChange}
        disableRowSelectionOnClick
        sx={{
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'),
          borderRadius: 2,
        }}
        slots={{
          loadingOverlay: () => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default DataTable;
