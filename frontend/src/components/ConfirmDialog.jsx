// src/components/ConfirmDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ConfirmDialog = ({ open, title = 'Confirm', description, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title">
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body2">{description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="inherit">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
