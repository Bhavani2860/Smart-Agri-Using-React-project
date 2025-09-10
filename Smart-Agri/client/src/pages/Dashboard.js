import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GrassIcon from '@mui/icons-material/Grass';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GrainIcon from '@mui/icons-material/Grain';
import OpacityIcon from '@mui/icons-material/Opacity';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { getWeatherByCoords, getWeatherForecast } from '../utils/weatherService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// QuickActionCard component
const QuickActionCard = ({ children, onClick, sx = {} }) => (
  <Box 
    onClick={onClick}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      borderRadius: 1,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
        borderColor: 'primary.main',
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        '& .MuiSvgIcon-root': {
          color: 'primary.main',
        }
      },
      '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        mb: 1,
        color: 'primary.main',
        transition: 'all 0.3s ease',
      },
      ...sx,
    }}
  >
    {children}
  </Box>
);

const Dashboard = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // First try to get geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                
                // Fetch current weather and forecast
                const [currentWeather, forecast] = await Promise.all([
                  getWeatherByCoords(latitude, longitude).catch(e => {
                    console.error('Weather API error:', e);
                    throw new Error('Weather service unavailable');
                  }),
                  getWeatherForecast(latitude, longitude).catch(() => [])
                ]);
                
                setWeatherData({
                  current: currentWeather,
                  forecast: forecast.slice(0, 4) // Next 4 days
                });
                
              } catch (err) {
                console.error('Error in weather data fetch:', err);
                setError(err.message || 'Failed to fetch weather data');
              }
            },
            (error) => {
              console.warn('Geolocation not available, using default location');
              // Default to New Delhi coordinates if geolocation is denied
              handleDefaultLocation();
            },
            { timeout: 5000 } // 5 second timeout for geolocation
          );
        } else {
          // If geolocation is not supported, use default location
          handleDefaultLocation();
        }
        
        // Always try to fetch market data
        try {
          const marketResponse = await axios.get('http://localhost:5000/api/market-prices');
          setMarketData(marketResponse.data);
        } catch (err) {
          console.warn('Using mock market data');
          // Set some mock data if API fails
          setMarketData({
            crops: [
              { name: 'Wheat', currentPrice: 24.50 },
              { name: 'Rice', currentPrice: 32.75 },
              { name: 'Corn', currentPrice: 18.30 },
              { name: 'Soybean', currentPrice: 42.10 },
              { name: 'Cotton', currentPrice: 65.25 }
            ]
          });
        }
        
      } catch (err) {
        console.error('Error in fetchDashboardData:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function for default location (New Delhi)
    const handleDefaultLocation = async () => {
      try {
        // Default to New Delhi coordinates
        const [currentWeather, forecast] = await Promise.all([
          getWeatherByCoords(28.6139, 77.2090).catch(() => null),
          getWeatherForecast(28.6139, 77.2090).catch(() => [])
        ]);
        
        if (currentWeather) {
          setWeatherData({
            current: { ...currentWeather, location: 'New Delhi, IN' },
            forecast: forecast.slice(0, 4)
          });
        } else {
          setError('Weather service unavailable. Using sample data.');
          setWeatherData({
            current: {
              temp: 28,
              humidity: 45,
              description: 'clear sky',
              icon: '01d',
              wind: 2.5,
              location: 'Sample Location',
              timestamp: new Date().toISOString()
            },
            forecast: Array(4).fill(0).map((_, i) => ({
              date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
              temp: 28 + Math.floor(Math.random() * 5),
              icon: '01d',
              description: 'clear sky'
            }))
          });
        }
      } catch (err) {
        console.error('Error in default location handler:', err);
      }
    };

    fetchDashboardData();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchDashboardData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const marketPriceData = {
    labels: marketData?.crops.map(crop => crop.name) || ['Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton'],
    datasets: [
      {
        label: 'Current Prices (₹/kg)',
        data: marketData?.crops.map(crop => crop.currentPrice) || [24.50, 32.75, 18.30, 42.10, 65.25],
        backgroundColor: 'rgba(33, 150, 83, 0.2)',
        borderColor: '#219653',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Last Month (₹/kg)',
        data: [22.80, 30.25, 17.50, 40.75, 62.50],
        borderColor: '#9e9e9e',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const upcomingTasks = [
    { id: 1, title: 'Irrigation Schedule', date: 'Tomorrow', priority: 'high', icon: <OpacityIcon /> },
    { id: 2, title: 'Fertilizer Application', date: 'Aug 5', priority: 'medium', icon: <GrainIcon /> },
    { id: 3, title: 'Soil Testing', date: 'Aug 10', priority: 'low', icon: <GrassIcon /> }
  ];

  const recentActivities = [
    { id: 1, title: 'New market prices updated', time: '2 hours ago', icon: <TrendingUpIcon /> },
    { id: 2, title: 'Weather alert: Rain expected', time: '5 hours ago', icon: <WbSunnyIcon /> },
    { id: 3, title: 'Crop advisory available', time: '1 day ago', icon: <GrassIcon /> }
  ];

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
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      background: theme.palette.mode === 'light' 
        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${theme.palette.background.default} 100%)`
        : theme.palette.background.default,
      minHeight: 'calc(100vh - 64px)', // Account for header height
      maxWidth: '1440px',
      mx: 'auto',
      width: '100%',
    }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
              mb: 1,
            }}>
              Farm Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '800px' }}>
              Welcome back! Here's what's happening on your farm today.
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Chip 
              icon={<NotificationsIcon />} 
              label="2 Alerts" 
              color="warning" 
              variant="outlined"
              onClick={() => {}}
              sx={{ cursor: 'pointer' }}
            />
            <Chip 
              icon={<CalendarTodayIcon />} 
              label="3 Tasks Due" 
              color="primary" 
              variant="outlined"
              onClick={() => {}}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Weather Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1,
            background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  {weatherData?.current?.icon && (
                    <Box 
                      component="img" 
                      src={`http://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`} 
                      alt={weatherData.current.description}
                      sx={{ width: 60, height: 60, ml: -2, mt: -2 }}
                    />
                  )}
                  <Box>
                    <Typography variant="h6" component="div">
                      {weatherData?.current?.location || 'Current Location'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {weatherData?.current ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h2" component="div" sx={{ fontWeight: 300, lineHeight: 1 }}>
                      {Math.round(weatherData.current.temp)}°
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 1, mt: 'auto' }}>
                      C
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                    {weatherData.current.description}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" mt={3} mb={2}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">Humidity</Typography>
                      <Typography>{weatherData.current.humidity}%</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">Wind</Typography>
                      <Typography>{weatherData.current.wind} m/s</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">Updated</Typography>
                      <Typography>{new Date(weatherData.current.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Typography>
                    </Box>
                  </Box>
                  
                  {/* Forecast for next few days */}
                  {weatherData.forecast && weatherData.forecast.length > 0 && (
                    <Box mt={3} pt={2} borderTop={1} borderColor="divider">
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        NEXT FEW DAYS
                      </Typography>
                      <Box display="flex" justifyContent="space-between">
                        {weatherData.forecast.map((day, index) => (
                          <Box key={index} textAlign="center">
                            <Typography variant="caption" display="block">{day.date}</Typography>
                            <Box 
                              component="img" 
                              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                              alt={day.description}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="body2">{Math.round(day.temp)}°</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box height={200} display="flex" alignItems="center" justifyContent="center">
                  {error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : (
                    <CircularProgress />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Market Prices Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Market Prices
                </Typography>
                <LocalOfferIcon color="primary" />
              </Box>
              <Box sx={{ height: '300px', mt: 'auto' }}>
                <Line 
                  data={marketPriceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: value => `₹${value}/kg`
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                Upcoming Tasks
              </Typography>
              <Box>
                {upcomingTasks.map((task) => (
                  <Box key={task.id} mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar sx={{ 
                        bgcolor: `${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}.light`, 
                        color: `${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}.contrastText`, 
                        width: 32, 
                        height: 32, 
                        mr: 1.5 
                      }}>
                        {task.icon}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="subtitle2">{task.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{task.date}</Typography>
                      </Box>
                      <Chip 
                        label={task.priority} 
                        size="small" 
                        color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                        sx={{ textTransform: 'capitalize', height: 20 }}
                      />
                    </Box>
                    {task.id < upcomingTasks.length && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activities
              </Typography>
              <Box>
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id} mb={index < recentActivities.length - 1 ? 2 : 0}>
                    <Box display="flex" alignItems="flex-start">
                      <Avatar sx={{ 
                        bgcolor: 'action.selected', 
                        color: 'primary.main', 
                        width: 32, 
                        height: 32, 
                        mr: 1.5,
                        mt: 0.5
                      }}>
                        {activity.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{activity.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                      </Box>
                    </Box>
                    {index < recentActivities.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} sx={{ mt: { xs: 2, sm: 3 } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3 },
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              background: theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard onClick={() => window.location.href = '/crop-advisory'}>
                  <GrassIcon />
                  <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 1 }}>Crop Advisory</Typography>
                  <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
                    Get personalized crop recommendations
                  </Typography>
                </QuickActionCard>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard onClick={() => window.location.href = '/market-prices'}>
                  <LocalOfferIcon />
                  <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 1 }}>Market Prices</Typography>
                  <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
                    Check latest market rates
                  </Typography>
                </QuickActionCard>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard onClick={() => window.location.href = '/resource-tools'}>
                  <OpacityIcon />
                  <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 1 }}>Resource Tools</Typography>
                  <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
                    Optimize water and fertilizer use
                  </Typography>
                </QuickActionCard>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
