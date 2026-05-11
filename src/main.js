import Alpine from 'alpinejs'
import { scan } from './weather.js'

Alpine.data('app', () => ({
  city: '',
  day: '',
  
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
}))
 
window.Alpine = Alpine
Alpine.start()

