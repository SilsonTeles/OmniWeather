import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Weather } from '../model/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast'
  private apiKey = '9791144154a741462da6be28fe5fe1cd';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&lang=pt_br&units=metric`)
      .pipe(
        map(response => new Weather(
          response.weather[0].description,
          response.weather[0].icon,
          response.main.temp,
          response.main.feels_like,
          response.main.temp_min,
          response.main.temp_max,
          response.main.pressure,
          response.main.humidity,
          response.name,
          response.coord.lat,
          response.coord.lon,
          response.wind.speed
        )),
        catchError(error => {
          return of(null); 
        })
      );
  }

  getWeatherForecast(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrlForecast}?lat=${lat}&lon=${lon}&cnt=7&units=metric&lang=pt_br&appid=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
