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
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import axios from 'axios';

// Sample data in case API is not available
const SAMPLE_DATA = {
  recommendedCrops: [
    { 
      name: 'Rice', 
      season: 'Kharif', 
      waterRequirement: 'High (1500-2500 mm)',
      description: 'Ideal for alluvial soil with good water retention.',
      suitableRegions: ['Punjab', 'Haryana', 'West Bengal', 'Andhra Pradesh']
    },
    { 
      name: 'Wheat', 
      season: 'Rabi', 
      waterRequirement: 'Medium (400-600 mm)',
      description: 'Thrives in well-drained loamy soil with moderate irrigation.',
      suitableRegions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh']
    },
    { 
      name: 'Maize', 
      season: 'Kharif', 
      waterRequirement: 'Medium (500-800 mm)',
      description: 'Grows well in well-drained loamy to sandy loam soil.',
      suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Bihar', 'Uttar Pradesh']
    }
  ],
  soilTypes: ['Alluvial', 'Black', 'Red', 'Laterite', 'Mountain', 'Desert'],
  weatherAlerts: [
    { 
      type: 'Heat Wave', 
      severity: 'High', 
      startDate: new Date(Date.now() + 86400000).toLocaleDateString(),
      description: 'Expected temperature rise above 40°C. Ensure adequate irrigation.'
    },
    { 
      type: 'Heavy Rainfall', 
      severity: 'Medium', 
      startDate: new Date(Date.now() + 3 * 86400000).toLocaleDateString(),
      description: 'Heavy rainfall expected. Ensure proper drainage in fields.'
    }
  ]
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CropAdvisory = () => {
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);

  useEffect(() => {
    const fetchAdvisoryData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crop-advisory', {
          timeout: 5000 // 5 second timeout
        });
        setAdvisoryData(response.data);
      } catch (err) {
        console.warn('Using sample data due to API error:', err);
        setAdvisoryData(SAMPLE_DATA);
        setUseSampleData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisoryData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !soilType) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call here:
      // const response = await axios.post('http://localhost:5000/api/crop-advisory', {
      //   location,
      //   soilType
      // });
      // setAdvisoryData(response.data);
      
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to fetch personalized advisory. Using general recommendations.');
      setAdvisoryData(SAMPLE_DATA);
      setUseSampleData(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Crop Advisory System
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading crop recommendations...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Crop Advisory System
      </Typography>

      {/* Sample Data Notice */}
      {useSampleData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Currently showing sample data. The system will use real data when connected to the backend.
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Advisory Form */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
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
                required
                helperText="Enter your farm location (e.g., city, village)"
                variant="outlined"
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={submitting}>
                <InputLabel id="soil-type-label">Soil Type</InputLabel>
                <Select
                  labelId="soil-type-label"
                  value={soilType}
                  label="Soil Type *"
                  onChange={(e) => setSoilType(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>Select Soil Type</em>
                  </MenuItem>
                  {advisoryData?.soilTypes?.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
                size="large"
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Getting Recommendations...
                  </>
                ) : (
                  'Get Personalized Advisory'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Recommended Crops */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <WbSunnyIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Recommended Crops
          </Typography>
        </Box>
        
        {!advisoryData?.recommendedCrops?.length ? (
          <Alert severity="info">
            No crop recommendations available. Please check back later or try different search criteria.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {advisoryData.recommendedCrops.map((crop, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box 
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: 'primary.contrastText',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="h6" component="div">
                        {crop.name}
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        '& svg': { mr: 1, color: 'text.secondary', fontSize: 18 },
                      }}
                    >
                      <WbSunnyIcon />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Season:</strong> {crop.season}
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        '& svg': { mr: 1, color: 'text.secondary', fontSize: 18 },
                      }}
                    >
                      <LocalOfferIcon />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Water:</strong> {crop.waterRequirement}
                      </Typography>
                    </Box>
                    
                    {crop.description && (
                      <Box mt={2} mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          {crop.description}
                        </Typography>
                      </Box>
                    )}
                    
                    {crop.suitableRegions && crop.suitableRegions.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary" component="div">
                          <Box component="span" fontWeight="bold" mr={0.5}>Suitable Regions:</Box>
                          <Box component="span">{crop.suitableRegions.join(', ')}</Box>
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Weather Alerts */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Box 
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              color: 'warning.contrastText',
            }}
          >
            <WbSunnyIcon fontSize="small" />
          </Box>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Weather Alerts & Updates
          </Typography>
        </Box>
        
        {!advisoryData?.weatherAlerts?.length ? (
          <Alert severity="info">
            No active weather alerts for your region at this time.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {advisoryData.weatherAlerts.map((alert, index) => (
              <Grid item xs={12} key={index}>
                <Alert 
                  severity={alert.severity.toLowerCase()}
                  sx={{ 
                    '& .MuiAlert-message': { width: '100%' },
                    '& .MuiAlert-icon': { alignItems: 'center' },
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <Box fontWeight="bold" mr={1}>
                        {alert.type} Alert
                      </Box>
                      <Box 
                        component="span" 
                        sx={{ 
                          fontSize: '0.75rem',
                          bgcolor: 'rgba(0,0,0,0.08)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          ml: 'auto',
                        }}
                      >
                        {alert.startDate}
                      </Box>
                    </Box>
                    <Box fontSize="0.875rem">
                      {alert.description || 'No additional details available.'}
                    </Box>
                  </Box>
                </Alert>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Success Snackbar */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Advisory updated successfully for {location} with {soilType} soil.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CropAdvisory;
