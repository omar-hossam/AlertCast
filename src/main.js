import Alpine from 'alpinejs'
import { scan } from './weather.js'
import weatherData from './weatherData.json';


function getCurrentTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  });
  return time
}


Alpine.data('app', () => ({
  city: '',
  day: '',
  lat: '',
  lon: '',
  
  errMsg: '',
  resTitle: '',
  resBody: '',
  resImg: '',
  resImgAlt: '',
  tempMax: '',
  tempMin: '',
  wind: '',
  severity: '',
  weatherTips: [],
  
  shouldScanEarthquake: false,
  isEarthQuake: false,
  quakeTitle: '',
  
  weatherData,
  scan,
  
  async scanning(e) {
    return await scan.call(this, e)
  },
  
  notifiyTime: getCurrentTime()
}))
 
 
window.Alpine = Alpine
Alpine.start()
