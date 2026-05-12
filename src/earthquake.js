export async function scanEarthQuake(lat, lon, day) {
  const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=200&starttime=${day}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch earthquake details")
  }
  
  const data = await response.json()
  
  if (data.features.length === 0) {
    return false; // -> no nearby earthquakes
  }
  
  const strongQuakes = data.features.filter(
    quake => quake.properties.mag >= 4.5
  )

  if (strongQuakes.length > 0) {
    return true; // -> there is a nearby earthquake/s!
  }
}
