import Alpine from 'alpinejs'
import { scan } from './weather.js'
import weatherData from './weatherData.json';


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
}))
 
 
window.Alpine = Alpine
Alpine.start()
