import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.className = mode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563EB',
            contrastText: '#fff',
          },
          secondary: {
            main: mode === 'light' ? '#222222' : '#E2E8F0',
          },
          background: {
            default: mode === 'light' ? '#F7F7F7' : '#0F172A',
            paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
          },
          text: {
            primary: mode === 'light' ? '#222222' : '#F8FAFC',
            secondary: mode === 'light' ? '#717171' : '#94A3B8',
          },
          divider: mode === 'light' ? '#ebebeb' : '#334155',
        },
        shape: {
          borderRadius: 16,
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
          body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' ? '0 6px 16px rgba(0,0,0,0.06)' : '0 6px 16px rgba(0,0,0,0.3)',
                border: `1px solid ${mode === 'light' ? '#ebebeb' : '#334155'}`,
                backgroundImage: 'none', // Remove default MUI dark mode elevation overlay
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light' ? '0 12px 24px rgba(0,0,0,0.1)' : '0 12px 24px rgba(0,0,0,0.4)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 9999,
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
                backgroundImage: 'none',
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
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
