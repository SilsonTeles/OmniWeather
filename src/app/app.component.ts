import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { WeatherComponent } from './components/weather/weather.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, WeatherComponent], 
  template: `<weather-app></weather-app>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
