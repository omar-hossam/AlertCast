import { getDateStr } from './helpers.js'


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


function getWeatherAlert(weather_code, wind, temp_max, temp_min, precipitation_sum) {
  // Heatwave
  if (temp_max >= 42) {
    return {
      title: "Heatwave",
      severity: "HIGH"
    };
  }

  if (temp_max >= 40) {
    return {
      title: "Hot Weather",
      severity: "MEDIUM"
    };
  }

  // Storm (wind-based)
  if (wind >= 80) {
    return {
      title: "Extreme Storm",
      severity: "HIGH"
    };
  }

  if (wind >= 50) {
    return {
      title: "Storm",
      severity: "MEDIUM"
    };
  }

  // Thunderstorm
  if ([95, 96, 99].includes(weather_code)) {
    return {
      title: "Thunderstorm",
      severity: "HIGH"
    };
  }

  // Flood / Heavy rain
  if (precipitation_sum >= 40) {
    return {
      title: "Flood Risk",
      severity: "HIGH"
    };
  }

  if (precipitation_sum >= 25) {
    return {
      title: "Heavy Rain",
      severity: "MEDIUM"
    };
  }

  // Fog
  if ([45, 48].includes(weather_code)) {
    return {
      title: "Fog Alert",
      severity: "LOW"
    };
  }

  // Cold wave
  if (temp_min <= 0) {
    return {
      title: "Freezing Cold",
      severity: "HIGH"
    };
  }

  if (temp_min <= 5 && temp_max <= 12) {
    return {
      title: "Cold Wave",
      severity: "MEDIUM"
    };
  }

  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(weather_code)) {
    return {
      title: "Snow",
      severity: "MEDIUM"
    };
  }

  return {
    title: "Normal",
    severity: "LOW"
  };
}


export async function getWeather(lat, lon, day) {
  const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,weather_code&start_date=${day}&end_date=${day}&timezone=auto`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }
  
  const data = await response.json();
  
  console.log(data.results)
  
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
      const { title, severity } = getWeatherAlert(
        weatherResult.weather_code, 
        weatherResult.wind_speed_10m_max,
        weatherResult.temperature_2m_max, 
        weatherResult.temperature_2m_min, 
        weatherResult.precipitation_sum
      )
      
    } catch (e) {
      this.errMsg = e.message;
    }
    
  } catch (error) {
    this.errMsg = error.message;
  }
}
