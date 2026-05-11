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
  
  try {
    const searchResult = await searchCity(this.city);

    this.lat = searchResult.latitude;
    this.lon = searchResult.longitude;

    this.errMsg = '';
    
    try {
      const day = getDateStr(this.day) // Format: YYYY-MM-DD
      
      const weatherResult = await getWeather(this.lat, this.lon, day);
      console.log(weatherResult)
      
    } catch (e) {
      this.errMsg = e.message;
    }
    
  } catch (error) {
    this.errMsg = error.message;
  }
}
