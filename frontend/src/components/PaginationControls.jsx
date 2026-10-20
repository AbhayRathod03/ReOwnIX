// src/components/PaginationControls.jsx
import React from 'react';
import { Box, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * PaginationControls
 * Props:
 *  - page: current page number (1-indexed)
 *  - totalPages: total number of pages
 *  - onPageChange: (event, newPage) => void
 *  - pageSize: current page size
 *  - onPageSizeChange: (event) => void
 *  - pageSizeOptions: array of numbers, e.g., [10,20,50]
 */
const PaginationControls = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange, pageSizeOptions = [10, 20, 50] }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
    <FormControl variant="standard" size="small">
      <InputLabel id="page-size-label">Page size</InputLabel>
      <Select labelId="page-size-label" value={pageSize} onChange={onPageSizeChange} label="Page size">
        {pageSizeOptions.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Pagination
      count={totalPages}
      page={page}
      onChange={onPageChange}
      color="primary"
      siblingCount={1}
      boundaryCount={1}
      shape="rounded"
    />
  </Box>
);

export default PaginationControls;
