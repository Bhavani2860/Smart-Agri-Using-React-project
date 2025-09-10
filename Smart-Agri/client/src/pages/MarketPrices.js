import React, { useState, useEffect } from 'react';
import { 
  Grid, 
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
            <FormControl fullWidth sx={{ minWidth: 140 }}>
              <InputLabel id="market-location-label" sx={{ 
                backgroundColor: 'background.paper',
                px: 1,
                ml: -0.5,
                '&.Mui-focused': {
                  color: 'primary.main',
                },
              }}>Market Location</InputLabel>
              <Select
                labelId="market-location-label"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Market Location"
                fullWidth
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    padding: '12.5px 14px',
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Locations</em>
                </MenuItem>
                <MenuItem value="local">Local Market</MenuItem>
                <MenuItem value="wholesale">Wholesale Market</MenuItem>
              </Select>
            </FormControl>
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
