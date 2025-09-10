import React, { useState } from 'react';
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
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ResourceTools = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [waterCalc, setWaterCalc] = useState({
    crop: '',
    area: '',
    days: '',
    result: ''
  });
  const [fertilizerCalc, setFertilizerCalc] = useState({
    crop: '',
    area: '',
    result: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleWaterCalc = () => {
    // Simple water requirement calculation (example formula)
    const waterRequirement = (waterCalc.area * 1000) / (waterCalc.days * 10);
    setWaterCalc({ ...waterCalc, result: waterRequirement.toFixed(2) });
  };

  const handleFertilizerCalc = () => {
    // Simple fertilizer requirement calculation (example formula)
    const fertilizerRequirement = (fertilizerCalc.area * 100) / 1000;
    setFertilizerCalc({ ...fertilizerCalc, result: fertilizerRequirement.toFixed(2) });
  };

  const waterCropOptions = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'potato', label: 'Potato' }
  ];

  const fertilizerCropOptions = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'potato', label: 'Potato' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resource Optimization Tools
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Water Calculator" />
          <Tab label="Fertilizer Calculator" />
          <Tab label="Crop Rotation Planner" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Water Requirement Calculator
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Crop</InputLabel>
                  <Select
                    value={waterCalc.crop}
                    onChange={(e) => setWaterCalc({ ...waterCalc, crop: e.target.value })}
                  >
                    {waterCropOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Area (in acres)"
                  type="number"
                  value={waterCalc.area}
                  onChange={(e) => setWaterCalc({ ...waterCalc, area: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Days"
                  type="number"
                  value={waterCalc.days}
                  onChange={(e) => setWaterCalc({ ...waterCalc, days: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleWaterCalc}
                >
                  Calculate Water Requirement
                </Button>
              </Grid>
              {waterCalc.result && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Estimated Water Requirement: {waterCalc.result} liters
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fertilizer Calculator
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Crop</InputLabel>
                  <Select
                    value={fertilizerCalc.crop}
                    onChange={(e) => setFertilizerCalc({ ...fertilizerCalc, crop: e.target.value })}
                  >
                    {fertilizerCropOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Area (in acres)"
                  type="number"
                  value={fertilizerCalc.area}
                  onChange={(e) => setFertilizerCalc({ ...fertilizerCalc, area: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleFertilizerCalc}
                >
                  Calculate Fertilizer Requirement
                </Button>
              </Grid>
              {fertilizerCalc.result && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Estimated Fertilizer Requirement: {fertilizerCalc.result} kg
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Crop Rotation Planner
            </Typography>
            {/* TODO: Implement crop rotation planner */}
            <Alert severity="info">
              Coming soon - Plan your crop rotation for better soil health and yield
            </Alert>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResourceTools;
