// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // clean blue
    },
    secondary: {
      main: '#F59E0B', // accent orange
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

export default theme;
