import Alpine from 'alpinejs'
import { scan } from './weather.js'

Alpine.data('app', () => ({
  city: '',
  day: '',
  lat: '',
  lon: '',
  
  errMsg: '',
  temp: '',
  resTitle: '',
  resBody: '',
  resImg: '',
  resImgAlt: '',
  temp: '',
  wind: '',
  
  isEarthQuake: false,
  quakeTitle: '',
  scan,
  
  async scanning(e) {
    return await scan.call(this, e)
  },
}))
 
window.Alpine = Alpine
Alpine.start()

