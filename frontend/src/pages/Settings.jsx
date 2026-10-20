import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Divider, Alert
} from '@mui/material';
import { Lock, Bell } from 'lucide-react';
import userApi from '../services/userApi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const handlePwChange = (e) => {
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPwError('');
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Settings</Typography>

      {/* Change Password */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Lock size={20} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>Change Password</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
          <TextField
            label="Current Password"
            name="oldPassword"
            type="password"
            value={pwForm.oldPassword}
            onChange={handlePwChange}
            size="small"
            fullWidth
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            size="small"
            fullWidth
            helperText="Minimum 8 characters"
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={pwForm.confirmPassword}
            onChange={handlePwChange}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={pwLoading || !pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: 'flex-start', px: 3 }}
          >
            {pwLoading ? 'Saving...' : 'Update Password'}
          </Button>
        </Box>
      </Paper>

      {/* Notification Preferences */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Bell size={20} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>Notification Preferences</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Notification preferences are coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
