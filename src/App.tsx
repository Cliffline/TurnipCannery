import './App.css'
import MainLayout from './layouts/MainLayout/MainLayout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Link, Typography } from '@mui/material';

// 创建主题
const theme = createTheme({
  palette: {
    mode: 'light', // 或 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 左上角超链接按钮 */}
      <Box 
        sx={{ 
          position: 'fixed',
          top: 12,
          left: 16,
          zIndex: 2000, // 确保在最上层
        }}
      >
        <Link 
          href="http:xxx" 
          target="_blank" 
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
            @TurnipSage
          </Typography>
        </Link>
      </Box>
      
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;