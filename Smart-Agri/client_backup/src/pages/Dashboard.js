import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch weather data (mock location)
        const weatherResponse = await axios.get('http://localhost:5000/api/weather/28.6139/77.2090');
        setWeatherData(weatherResponse.data);

        // Fetch market prices
        const marketResponse = await axios.get('http://localhost:5000/api/market-prices');
        setMarketData(marketResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const marketPriceData = {
    labels: marketData?.crops.map(crop => crop.name) || [],
    datasets: [
      {
        label: 'Current Prices (₹/kg)',
        data: marketData?.crops.map(crop => crop.currentPrice) || [],
        backgroundColor: 'rgba(33, 150, 83, 0.2)',
        borderColor: '#219653',
        borderWidth: 2
      }
    ]
  };

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
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Weather Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Weather Conditions
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" color="primary">
                {weatherData?.temperature}°C
              </Typography>
              <Typography variant="body1">
                {weatherData?.weatherType}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Humidity: {weatherData?.humidity}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precipitation: {weatherData?.precipitation * 100}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Market Prices Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Market Prices
            </Typography>
            <Line data={marketPriceData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: value => `${value} ₹/kg`
                  }
                }
              }
            }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
                onClick={() => window.location.href = '/crop-advisory'}
              >
                <Typography variant="h6">Get Crop Advisory</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
                onClick={() => window.location.href = '/market-prices'}
              >
                <Typography variant="h6">Check Market Prices</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
                onClick={() => window.location.href = '/resource-tools'}
              >
                <Typography variant="h6">Resource Tools</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
