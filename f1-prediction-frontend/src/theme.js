// theme.js
import { createTheme } from '@mui/material/styles';
import '@fontsource/gidole';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f0f0f',
      paper: '#1c1c1c',
    },
    primary: {
      main: '#ff4655', // rojo F1
    },
    secondary: {
      main: '#ffffff', // blanco puro para contraste
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: 'gidole, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 1,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c1c1c',
        },
      },
    },
  },
});

export default theme;
