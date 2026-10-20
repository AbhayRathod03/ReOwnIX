import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, TextField,
  Button, Divider, CircularProgress, Alert, Skeleton
} from '@mui/material';
import { Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userApi from '../services/userApi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
        setForm({ firstName: data.firstName || '', lastName: data.lastName || '', phone: data.phone || '' });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setError('');
    if (profile) setForm({ firstName: profile.firstName || '', lastName: profile.lastName || '', phone: profile.phone || '' });
  };

  const handleSave = async () => {
    if (!form.firstName.trim()) { setError('First name is required.'); return; }
    setSaving(true);
    try {
      const updated = await userApi.updateProfile(form);
      setProfile(prev => ({ ...prev, ...updated }));
      updateUser({ firstName: form.firstName, lastName: form.lastName });
      toast.success('Profile updated!');
      setEditing(false);
      setError('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  if (loading) {
    return (
      <Box sx={{ py: 1 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <Skeleton variant="circular" width={88} height={88} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={180} height={32} />
              <Skeleton variant="text" width={240} height={24} />
              <Skeleton variant="text" width={140} height={24} />
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>My Profile</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <Avatar
            src={profile?.profileImage}
            sx={{ width: 88, height: 88, bgcolor: '#2563EB', fontSize: '2rem', fontWeight: 700, flexShrink: 0 }}
          >
            {initials}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 240 }}>
            {!editing ? (
              <>
                <Typography variant="h6" fontWeight={700}>
                  {profile?.firstName} {profile?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">{profile?.email}</Typography>
                {profile?.phone && <Typography variant="body2" color="text.secondary">📞 {profile.phone}</Typography>}
                {profile?.createdAt && (
                  <Typography variant="caption" color="text.disabled">
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit2 size={15} />}
                    onClick={handleEdit}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 380 }}>
                {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="First Name"
                    value={form.firstName}
                    onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                    size="small"
                    fullWidth
                  />
                </Box>
                <TextField
                  label="Phone"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  size="small"
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Save size={15} />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<X size={15} />}
                    onClick={handleCancel}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Account Info */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Account Information</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>Email</Typography>
            <Typography variant="body2" fontWeight={500}>{profile?.email || '—'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>Role</Typography>
            <Typography variant="body2" fontWeight={500}>{profile?.role?.replace('ROLE_', '') || 'USER'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>Member Since</Typography>
            <Typography variant="body2" fontWeight={500}>
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>Phone</Typography>
            <Typography variant="body2" fontWeight={500}>{profile?.phone || '—'}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;