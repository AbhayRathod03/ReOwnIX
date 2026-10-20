import { createTheme } from '@mui/material/styles';

// Centralized MUI theme – all customizations stay in one place to keep the UI consistent.
// Apple + Airbnb inspiration: clean palette, generous spacing, subtle shadows, rounded corners.
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#222222', // Deep dark grey for secondary actions
    },
    background: {
      default: '#F7F7F7', // Crisp light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222222',
      secondary: '#717171',
    },
  },
  shape: {
    borderRadius: 16, // Slightly softer corners than default
  },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
    },
    h1: { fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#717171' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
          border: '1px solid #ebebeb',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Pill shape
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
          '&:hover': {
            opacity: 0.9,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: '24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          }
        }
      }
    }
  },
});

export default theme;