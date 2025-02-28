import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../../services/weather.service';
import { of, throwError, timeout } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Weather } from '../../model/weather.model';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;

  beforeEach(async () => {
    mockWeatherService = jasmine.createSpyObj('WeatherService', ['getWeather', 'getWeatherForecast']);
    
    await TestBed.configureTestingModule({
      imports: [WeatherComponent, CommonModule, FormsModule],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getWeather and update weather when city is searched', fakeAsync(() => {
    component.ngOnInit();
    const mockWeatherData: Weather = {
      description: 'Céu claro',
      icon: 'clear-sky-icon',
      temperature: 25,
      feelsLike: 23,
      minTemperature: 20,
      maxTemperature: 30,
      pressure: 1012,
      humidity: 50,
      cityName: 'Barueri',
      lat: 10,
      lon: 20,
      wind: 5
    };
    const mockForecastData = { list: [{ dt: 1, main: { temp: 22 }, weather: [{ description: 'Céu claro' }], wind: {speed: 1} }] };
  
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherData));
    mockWeatherService.getWeatherForecast.and.returnValue(of(mockForecastData));
  
    component.city = 'Barueri';
    component.onCityChange();
  
    tick(2000);
    fixture.detectChanges();
  
    expect(mockWeatherService.getWeather).toHaveBeenCalledWith('Barueri');
    expect(component.weather).toEqual(mockWeatherData);
    expect(component.listForecast).toEqual(mockForecastData.list);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should handle error when getWeather fails', fakeAsync(() => {
    component.ngOnInit();
    const errorMessage = 'City not found';
    mockWeatherService.getWeather.and.returnValue(throwError(() => new Error(errorMessage)));
    component.city = 'InvalidCity';
    component.onCityChange();
    tick(2000);
    fixture.detectChanges();

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith('InvalidCity');
    expect(component.weather).toBeNull();
    expect(component.error).toBe('Erro ao buscar dados do clima. Verifique se o nome da cidade está correto, e tente novamente!');
    expect(component.loading).toBeFalse();
  }));

  it('should handle forecast data update correctly', fakeAsync(() => {
    component.ngOnInit();
    const mockWeatherData = { lat: 10, lon: 20, name: 'Barueri' };
    const mockForecastData = { list: [{ dt: 1, main: { temp: 22 }, weather: [{ description: 'Céu claro' }], wind: {speed: 1} }] };
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherData));
    mockWeatherService.getWeatherForecast.and.returnValue(of(mockForecastData));
    component.city = 'Barueri';
    component.onCityChange();
    tick(2000);
    fixture.detectChanges();

    expect(component.listForecast.length).toBe(1);
    expect(component.listForecast[0]).toEqual(mockForecastData.list[0]);
  }));

  it('should handle empty city input', () => {
    component.city = '';
    component.onCityChange();

    expect(component.weather).toBeNull();
    expect(component.error).toBeNull();
    expect(component.loading).toBeFalse();
  });
});
