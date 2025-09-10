import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';

const MarketPrices = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/market-prices');
        setMarketData(response.data);
      } catch (err) {
        setError('Failed to fetch market prices');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCrops = marketData?.crops?.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm)
  ) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Market Prices
      </Typography>

      {/* Search and Location Filter */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Crop"
              value={searchTerm}
              onChange={handleSearch}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Market Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              variant="outlined"
            >
              <option value="">All Locations</option>
              <option value="local">Local Market</option>
              <option value="wholesale">Wholesale Market</option>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Market Price Table */}
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Crop Name</TableCell>
                <TableCell align="right">Current Price (₹/kg)</TableCell>
                <TableCell align="right">Trend</TableCell>
                <TableCell align="right">Best Selling Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCrops.map((crop, index) => (
                <TableRow key={index}>
                  <TableCell>{crop.name}</TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color={crop.trend === 'up' ? 'success.main' : 
                      crop.trend === 'down' ? 'error.main' : 'text.primary'}>
                      {crop.currentPrice}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      color={crop.trend === 'up' ? 'success.main' : 
                        crop.trend === 'down' ? 'error.main' : 'text.secondary'}
                    >
                      {crop.trend === 'up' ? '↑' : crop.trend === 'down' ? '↓' : '→'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {crop.bestSellingTime || 'Anytime'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Price Trends Chart */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Price Trends
        </Typography>
        {/* TODO: Implement price trend chart */}
        <Box sx={{ height: 300, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            Price trends will be updated soon...
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MarketPrices;
