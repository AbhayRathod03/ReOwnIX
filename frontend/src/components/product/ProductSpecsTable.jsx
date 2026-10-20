import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const ProductSpecsTable = ({ product }) => {
  if (!product) return null;

  const specs = [
    { label: 'Product ID', value: product.id },
    { label: 'Brand', value: product.brand || 'Unbranded' },
    { label: 'Category', value: product.category || 'General' },
    { label: 'Condition', value: product.condition || 'Used' },
    { label: 'Listing Type', value: product.listingType || 'FIXED PRICE' },
    { label: 'Quantity', value: product.quantity ?? 1 },
    { label: 'Status', value: product.status || 'AVAILABLE' },
    { label: 'Seller Name', value: product.owner?.name || product.owner?.firstName + ' ' + product.owner?.lastName || 'Unknown' },
    { label: 'Posted On', value: product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A' },
    { label: 'Updated On', value: product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A' },
  ];

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Product Details
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {specs.map((row, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, borderBottom: 'none', width: '30%', py: 1.5, color: 'text.secondary' }}>
                  {row.label}
                </TableCell>
                <TableCell sx={{ borderBottom: 'none', py: 1.5, fontWeight: 500 }}>
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProductSpecsTable;
