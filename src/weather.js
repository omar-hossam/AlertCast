import { getDateStr } from './helpers.js'
import { scanEarthQuake } from './earthquake.js'

export async function searchCity(cityName) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch city");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  return data.results[0];
}


// RULE ENGINE
function getWeatherTitle(weather_code, wind, temp_max, temp_min, precipitation_sum) {
  // Heatwave
  if (temp_max >= 42) return "Heatwave";

  if (temp_max >= 40) return "Hot Weather";

  // Storm (wind-based)
  if (wind >= 80) return "Extreme Storm";

  if (wind >= 50) return "Storm";

  // Thunderstorm
  if ([95, 96, 99].includes(weather_code)) return "Thunderstorm";

  // Flood / Rain
  if (precipitation_sum >= 40) return "Flood Risk";

  if (precipitation_sum >= 25) return "Heavy Rain";

  // Fog
  if ([45, 48].includes(weather_code)) return "Fog Alert";

  // Cold
  if (temp_min <= 0) return "Freezing Cold";

  if (temp_min <= 5 && temp_max <= 12) return "Cold Wave";

  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(weather_code)) return "Snow";

  return "Normal";
}


export async function getWeather(lat, lon, day) {
  const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,weather_code&start_date=${day}&end_date=${day}&timezone=auto`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }
  
  const data = await response.json();
  
  if (!data.daily || data.daily.length === 0) {
    throw new Error("Weather API not working");
  }
  
  return data.daily;
}


export async function scan(e) {
  e.preventDefault();
  
  if (!this.city) {
    this.errMsg = 'Please enter city name'
    this.$refs.search.focus()
    return;
  } 
  
  try {
    // Get City lat/lon
    const searchResult = await searchCity(this.city);

    this.lat = searchResult.latitude;
    this.lon = searchResult.longitude;

    this.errMsg = '';
    
    // Get Weather
    try {
      const day = getDateStr(this.day) // Format: YYYY-MM-DD
      const weatherResult = await getWeather(this.lat, this.lon, day);
      
      // Render the alert on screen
      const title = getWeatherTitle(
        weatherResult.weather_code, 
        weatherResult.wind_speed_10m_max,
        weatherResult.temperature_2m_max, 
        weatherResult.temperature_2m_min, 
        weatherResult.precipitation_sum
      )
      
      if (title === 'Normal') {
        this.resImg = 'src/images/smile.png';
        this.resImgAlt = 'Smiley face';
        this.resTitle = 'Normal Conditions';
        this.resBody = 'No significant weather or disaster risks detected in your area.';
        this.severity = 'LOW'
      } else {
        const weatherAlert = this.weatherData.find(item => item.title === title);
        
        this.resTitle = weatherAlert.title
        this.resBody = weatherAlert.body
        this.resImg = weatherAlert.imgSrc
        this.resImgAlt = weatherAlert.imgAlt
        this.severity = weatherAlert.severity
        this.weatherTips = weatherAlert.tips
      }
      
      this.tempMax = weatherResult.temperature_2m_max
      this.tempMin = weatherResult.temperature_2m_min
      this.wind = weatherResult.wind_speed_10m_max
      
      // Check if should scan earthquakes
      if (this.shouldScanEarthquake) {
        this.isEarthQuake = await scanEarthQuake(this.lat, this.lon, day)
      }
      
    } catch (e) {
      this.errMsg = e.message;
    }
    
  } catch (error) {
    this.errMsg = error.message;
  }
}
