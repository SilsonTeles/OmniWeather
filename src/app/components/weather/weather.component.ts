import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'weather-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  city: string = 'Barueri';
  weather: any;
  listForecast: any = [];
  error: string | null = null;
  loading: boolean = false;
  searchSubject = new Subject<string>();
  weatherService = inject(WeatherService);

  constructor() {}

  ngOnInit(): void {
    this.loading = true;
    this.searchSubject.pipe(
      debounceTime(2000),
      switchMap(city => this.weatherService.getWeather(city))
    ).subscribe(
      data => {
        if (data) {
          this.weather = data; 
          this.error = null;
          this.weatherService.getWeatherForecast(this.weather.lat, this.weather.lon).subscribe(res => {
            this.loading = false;
            if (res) {
              this.listForecast = res.list;
            } else {
              this.listForecast = [];
            }
          });
        } else {
          this.loading = false;
          this.weather = null;
          this.error = 'Erro ao buscar dados do clima. Verifique se o nome da cidade está correto, e tente novamente!';
        }
    },
    (err) => {
      this.loading = false;
      this.weather = null;
      this.error = 'Erro ao buscar dados do clima. Verifique se o nome da cidade está correto, e tente novamente!';
    });
    this.searchSubject.next(this.city);
  }

  onCityChange(): void {
    this.loading = true;
    if (this.city) {
      this.searchSubject.next(this.city);
    }
    else  {
      this.weather = null;
      this.error = null;
      this.loading = false;
    }
  }
}
