import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY';

const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      wind: response.data.wind.speed,
      location: response.data.name,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const getWeatherForecast = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    // Group by date and take one reading per day for the next 4 days
    const dailyForecasts = [];
    const dates = new Set();
    
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dates.has(date) && dates.size < 5) {
        dates.add(date);
        dailyForecasts.push({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        });
      }
    });
    
    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

export { getWeatherByCoords, getWeatherForecast };
