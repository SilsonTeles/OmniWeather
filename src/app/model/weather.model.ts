export class Weather {
    description: string;
    icon: string;
    temperature: number;
    feelsLike: number;
    minTemperature: number;
    maxTemperature: number;
    pressure: number;
    humidity: number;
    cityName: string;
    lat: number;
    lon: number;
    wind: number;
  
    constructor(
      description: string,
      icon: string,
      temperature: number,
      feelsLike: number,
      minTemperature: number,
      maxTemperature: number,
      pressure: number,
      humidity: number,
      cityName: string,
      lat: number,
      lon: number,
      wind: number
    ) {
      this.description = description;
      this.icon = icon;
      this.temperature = temperature;
      this.feelsLike = feelsLike;
      this.minTemperature = minTemperature;
      this.maxTemperature = maxTemperature;
      this.pressure = pressure;
      this.humidity = humidity;
      this.cityName = cityName;
      this.lat = lat;
      this.lon = lon;
      this.wind = wind;
    }
  }
  