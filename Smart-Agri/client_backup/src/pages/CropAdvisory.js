import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const CropAdvisory = () => {
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');

  useEffect(() => {
    const fetchAdvisoryData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crop-advisory');
        setAdvisoryData(response.data);
      } catch (err) {
        setError('Failed to fetch crop advisory data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisoryData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement location and soil type based advisory
      // For now, just show the default advisory
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch personalized advisory');
      setLoading(false);
    }
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crop Advisory System
      </Typography>

      {/* Advisory Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Get Personalized Advisory
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Soil Type"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="">Select Soil Type</option>
                {advisoryData?.soilTypes?.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Get Advisory
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Recommended Crops */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recommended Crops
        </Typography>
        <Grid container spacing={3}>
          {advisoryData?.recommendedCrops?.map((crop, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {crop.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Season: {crop.season}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Water Requirement: {crop.waterRequirement}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Weather Alerts */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Weather Alerts
        </Typography>
        <Grid container spacing={2}>
          {advisoryData?.weatherAlerts?.map((alert, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Alert severity={alert.severity.toLowerCase()}>
                {alert.type} alert starting from {alert.startDate}
              </Alert>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CropAdvisory;
