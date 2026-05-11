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


export async function scan(e) {
  e.preventDefault();
  
  try {
    const searchResult = await searchCity(this.city);

    this.lat = searchResult.latitude;
    this.lon = searchResult.longitude;

    this.errMsg = '';
    console.log(this.lat)
    console.log(this.lon)
    
  } catch (e) {
    this.errMsg = e.message;
  }
}
