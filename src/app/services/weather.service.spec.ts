import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const apiKey = '9791144154a741462da6be28fe5fe1cd';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeather', () => {
    it('should return weather data when the API responds with data', () => {
      const mockWeatherData = {
        weather: [{ description: 'clear sky', icon: '01d' }],
        main: { temp: 25, feels_like: 23, temp_min: 20, temp_max: 28, pressure: 1015, humidity: 60 },
        name: 'London',
        coord: { lat: 51.5074, lon: -0.1278 },
        wind: { speed: 5 },
      };

      const city = 'London';

      service.getWeather(city).subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.description).toBe('clear sky');
        expect(data.temperature).toBe(25);
        expect(data.cityName).toBe('London');
        expect(data.wind).toBe(5);
      });

      const req = httpMock.expectOne(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherData);
    });

    it('should return null when the API responds with an error', () => {
      const city = 'London';

      service.getWeather(city).subscribe((data) => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
      );
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getWeatherForecast', () => {
    it('should return forecast data when the API responds with data', () => {
      const mockForecastData = {
        list: [
          {
            main: { temp: 25, pressure: 1015, humidity: 60 },
            weather: [{ description: 'clear sky' }],
            wind: { speed: 5 },
            dt_txt: '2025-02-01 15:00:00',
          },
        ],
      };

      const lat = 51.5074;
      const lon = -0.1278;

      service.getWeatherForecast(lat, lon).subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.list.length).toBeGreaterThan(0);
        expect(data.list[0].weather[0].description).toBe('clear sky');
      });

      const req = httpMock.expectOne(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&lang=pt_br&appid=${apiKey}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockForecastData);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
