import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CropAdvisory from './pages/CropAdvisory';
import MarketPrices from './pages/MarketPrices';
import ResourceTools from './pages/ResourceTools';

const theme = createTheme({
  palette: {
    primary: {
      main: '#219653',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crop-advisory" element={<CropAdvisory />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/resource-tools" element={<ResourceTools />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
